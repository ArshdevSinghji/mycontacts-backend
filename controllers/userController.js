const asyncHandler=require("express-async-handler");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken")
const User=require("../models/userModel");
const { Error } = require("mongoose");

//@desc Register a user
//@route POST /api/users/register
//@access public

const registerUser = asyncHandler(async (req,res)=>{
    const{username,password,email}=req.body;
    if(!username||!email||!password){
        res.status(400);
        throw new Error("All field are necessary");
    }
    const userAvailable=await User.findOne({email});
    if(userAvailable){
        res.status(400);
        throw new Error("user already registered");
    }
    //Hash Password
    const hashedPassword=await bcrypt.hash(password,10);
    console.log("Hashed Password: ",hashedPassword);
    const user=await User.create({
        username,
        email,
        password:hashedPassword,
    });
    console.log(`User created ${user}`)
    if(user){
        res.status(201).json({
            _id:user.id,
            email: user.email
        })
    }else{
        res.status(400);
        throw new Error("User data is not valid");
    }
    res.json({
        message:"Register the user"
    });
});

//@desc login user
//@route POST /api/users/login
//@access public

const loginUser = asyncHandler(async (req,res)=>{
    const {email,password}=req.body;
    if(!email||!password){
        res.status(400);
        throw new Error("All field are necessary");
    }
    const user=await User.findOne({email});
    //compare password with hashed password
    if(user && (await bcrypt.compare(password,user.password))){
        const accessToken=jwt.sign({
            //payload
            user:{
                username:user.username,
                email:user.email,
                id:user.id,
            },
        }, process.env.ACCESS_TOKEN_SECRET,
        {expiresIn:"15m"} //1 minute
    );
        res.status(200).json({
            accessToken
        });
    }else{
        res.status(401)
        throw new Error("email or password not valid")
    }
    res.json({
        message:"Login user"
    });
});

//@desc current user information
//@route POST /api/users/login
//@access private

const currentUser = asyncHandler(async (req,res)=>{
    res.json(req.user);
});


module.exports={registerUser,loginUser,currentUser}