const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const TOKEN_SECRET_KEY = "yash1234"

const User  = require("../models/userModel");

// Registering User
const registerUser = asyncHandler(async (req, res)=> {
    const {name, role, password} = req.body;
    if(!name || !role || !password){
        res.status(400);
        throw new Error("All fields are Mandatory");
    }

    //user exists
    const userExists = await User.findOne({name});
    if (userExists) {
        res.status(400);
        throw new Error("User Already Register");
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Registering user to db
    const user = await User.create({
        name, role, password: hashedPassword
    });

    // console.log(`User created ${user}`);
    res.status(200).json({message:"user registered", user});
});

//Login user
const loginUser = asyncHandler(async(req, res)=>{
    const {name, password} = req.body;
    if(!name || !password ){
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const user = await User.findOne({name});
    if(user && (await bcrypt.compare(password, user.password))){
        const token = jwt.sign({ user: { id: user._id, name: user.name, role: user.role } }, TOKEN_SECRET_KEY, {  expiresIn: "20m"});
        res.status(200).json({token, user});
    } else {
        res.status(401);
        throw new Error("Name or password is not valid");
    }
});

module.exports = {registerUser, loginUser, TOKEN_SECRET_KEY}