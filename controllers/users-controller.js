const User = require("./../models/user-model");
const { validationResult } = require("express-validator");
const httpStatusText = require("./../utils/httpStatusText");
const asyncHandler = require("express-async-handler");
const appError=require('./../utils/appError');
const bcrypt = require('bcrypt');
const jwt=require('jsonwebtoken');
const {generateJWT}  = require("../utils/generateJWT");


const getAllUsers=asyncHandler(async (req, res,next) => {
    const query = req.query;
    // console.log("query",query);

    
    
    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip=(page-1)*limit;
    
    const users = await User.find({},{"__v":false,"password":false}).limit(limit).skip(skip);
    res.json({
        status: httpStatusText.SUCCESS,
        data: {
        users: users,
        },
    });
}) ;

const register=asyncHandler(async (req, res,next) => {
    // console.log(req.body);
    const {firstName,lastName,email,password}=req.body;

    const errors = validationResult(req);

    const oldUser=await User.findOne({email: email});

    if (oldUser) {
        const error= appError.create("email is exist",400, httpStatusText.FAIL)
        return next(error);
    } else {
        const hashedPassword=await bcrypt.hash(password,10);

        const newUser = new User({
            firstName,
            lastName,
            email,
            password:hashedPassword
        });

        //generate JWT token
        const token= await generateJWT({email:newUser.email,id:newUser._id})
        console.log("token===",token);
        newUser.token=token;


        await newUser.save();
        res.json({
        status: httpStatusText.SUCCESS,
        data: { user: newUser },
        });
    }
}) ;


const login=asyncHandler(async (req, res,next) => {
        console.log("login",req.body);


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
        //generate JWT token
        const token= await generateJWT({email:user.email,id:user._id});
        return res.json({
            status: httpStatusText.SUCCESS,
            data: {
            token
            },
        });
    }
    else{
        const error= appError.create("Invalid email or password",401, httpStatusText.FAIL)
        return next(error);
    }



}) ;

module.exports ={
    getAllUsers,
    register,
    login
}