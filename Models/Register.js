const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true 
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});
// This line compiles the model AND exports it all at once
module.exports = mongoose.model("Register", registerSchema);