const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {type: String, required: true, unique: true},
    role: {type: String, enum: ["student", "professor", "warden"] },
    password: {type: String, required: true}, 
});

module.exports = mongoose.model("User", userSchema);