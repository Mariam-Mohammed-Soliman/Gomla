const User = require("./../models/user-model");
const httpStatusText = require("./../utils/httpStatusText");
const asyncHandler = require("express-async-handler");
const appError=require('./../utils/appError');
const bcrypt = require('bcrypt');


const register=asyncHandler(async (req, res,next) => {
    // console.log(req.body);
    const {userName,email,phone,password, latitude, longitude}=req.body;

    const oldUser=await User.findOne({email: email});

    if (oldUser) {
        const error= appError.create("email is exist",400, httpStatusText.FAIL)
        return next(error);
    } else {
        const hashedPassword=await bcrypt.hash(password,10);

        const newUser = new User({
            userName,
            email,
            phone,
            password:hashedPassword,
            image: req.file ? req.file.path : "",
            location: {
                latitude,
                longitude
            }
        });

        await newUser.save();
        res.json({
        status: httpStatusText.SUCCESS,
        data: {
            user: newUser
        },
        });
    }
}) ;


const login=asyncHandler(async (req, res,next) => {
        // console.log("login",req.body);

    const {email,password}=req.body;

    if(!email || !password) {
        const error= appError.create("email && password are required",400, httpStatusText.FAIL)
        return next(error);
    }
    
    const user=await User.findOne({email: email});

    if(!user) {
        const error= appError.create("user not found",400, httpStatusText.FAIL)
        return next(error);
    }
    const matchedPassword= await bcrypt.compare(password,user.password)
    if(user && matchedPassword) {
        
        return res.json({
            status: httpStatusText.SUCCESS,
            
        });
    }
    else{
        const error= appError.create("Invalid email or password",401, httpStatusText.FAIL)
        return next(error);
    }
}) ;

module.exports ={
    register,
    login
}