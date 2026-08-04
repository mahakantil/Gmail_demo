const express = require("express");
const mongoose = require("mongoose");
const dotenv = require('dotenv');
const path = require("path");
const hbs = require("hbs");
const cors = require('cors');
const https = require('https');
const Register = require("./Models/register"); 
const app = express();
const port = process.env.PORT || 2020;

dotenv.config();

require("./db/conn");

const static_path = path.join(__dirname, "./public");
const template_path = path.join(__dirname, "./hbs");
const partials_path = path.join(__dirname, "./hbs");

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


if (require('fs').existsSync(static_path)) {
    app.use(express.static(static_path));
}       
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async (req, res) => {
    try {
        console.log("--- 📋 Form Data Received in Terminal ---");
        console.log(req.body); 
        const registerEmp = new Register({
            fullName: req.body.fullName,
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });


        const registered = await registerEmp.save();
        console.log("--- 🎯 Data Successfully Saved to MongoDB ---");
        console.log(registered);
        
        res.status(201).render("index");

    } catch (error) {
        console.log("--- ❌ Error Saving Data to Database ---");                    
        console.error(error.message);
        res.status(400).send("Database Error: " + error.message);
    }
});

app.get('/list', async (req, res) => {
    try {
        const allUsers = await Register.find().sort({ _id: -1 });
        res.render("list", { list: allUsers });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});
// 1. GET: Sign Up पेज को दिखाने के लिए
app.get("/signup", (req, res) => {
    res.render("signup");
});

// 2. POST: Sign Up फॉर्म का डेटा डेटाबेस में सेव करने के लिए
app.post("/signup", async (req, res) => {
    try {
        console.log("--- 📝 New Sign Up Request Received ---");
        
        const newUser = new Register({
            fullName: req.body.fullName,
            username: req.body.username,
            email:    req.body.email,
            password: req.body.password
        });

        const savedUser = await newUser.save();
        console.log("🎯 User Registered Successfully:", savedUser);
        
        // रजिस्ट्रेशन के बाद सीधे यूजर को लिस्ट वाले पेज पर भेजें (Redirect)
        res.redirect("/list");

    } catch (error) {
        console.log("❌ Sign Up Error:", error.message);
        res.status(400).send("Registration Failed: " + error.message);
    }
});



// Home Page
app.get("/home", (req, res) => {
    res.render("home");
});

// Open Login Page
app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", async (req, res) => {
    try {
        const userEmail = req.body.email;
        const userPassword = req.body.password;

        // डेटाबेस में ईमेल चेक करें
        const user = await Register.findOne({ email: userEmail });

       if (user && user.password === userPassword) {
    console.log(`🎯 Login Successful! Welcome ${user.fullName}`);

    res.redirect("/home");
}
        else {
            res.status(400).send("Invalid Login Credentials! Incorrect Email or Password.");
        }
    } catch (error) {
        console.log("❌ Login Error:", error.message);
        res.status(500).send("Login Server Error: " + error.message);
    }
});


app.get('/list', async (req, res) => {
    try {
        const allUsers = await Register.find().sort({ _id: -1 });

        res.render("list", {
            list: allUsers
        });

    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
    });
app.get("/logout", (req, res) => {
    console.log("🔒 User Logged Out");

    res.render("logout");
});

app.listen(port, () => {
    console.log(`🚀 Server is running on port no ${port}`);
});