const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");
const hbs = require("hbs");
const cors = require("cors");
const fs = require("fs");

dotenv.config();

// Ensure DB connection is loaded
require("./db/conn");
const Register = require("./models/register");

const app = express();
const port = process.env.PORT || 2020;

// Path setups
const static_path = path.join(__dirname, "./public");
const template_path = path.join(__dirname, "./hbs");
const partials_path = path.join(__dirname, "./hbs");
// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

if (fs.existsSync(static_path)) {
  app.use(express.static(static_path));
}

// View engine setup
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partials_path);

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  try {
    const registerEmp = new Register({
      fullName: req.body.fullName,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    await registerEmp.save();
    res.status(201).render("index");
  } catch (error) {
    console.error("Database Error:", error.message);
    res.status(400).send("Database Error: " + error.message);
  }
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.post("/signup", async (req, res) => {
  try {
    const newUser = new Register({
      fullName: req.body.fullName,
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });

    await newUser.save();
    res.redirect("/list");
  } catch (error) {
    console.error("Sign Up Error:", error.message);
    res.status(400).send("Registration Failed: " + error.message);
  }
});

app.get("/home", (req, res) => {
  res.render("home");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  try {
    const userEmail = req.body.email;
    const userPassword = req.body.password;

    const user = await Register.findOne({ email: userEmail });

    if (user && user.password === userPassword) {
      res.redirect("/home");
    } else {
      res.status(400).send("Invalid Login Credentials! Incorrect Email or Password.");
    }
  } catch (error) {
    console.error("Login Error:", error.message);
    res.status(500).send("Login Server Error: " + error.message);
  }
});

app.get("/list", async (req, res) => {
  try {
    const allUsers = await Register.find().sort({ _id: -1 });
    res.render("list", { list: allUsers });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

app.get("/logout", (req, res) => {
  res.render("logout");
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});