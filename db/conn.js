const mongoose = require("mongoose");
require("dotenv").config();

// process.env ka use karke .env file se URL dynamically read hoga
const DB = process.env.DATABASE_URL;

mongoose.connect(DB)
  .then(() => {
    console.log("Database Connect Successfully via Path Variable! 🎉");
  })
  .catch((error) => {
    console.log("Database Connection Error: ", error.message);
  });