const User = require("./../models/user-model");
const { validationResult } = require("express-validator");
const httpStatusText = require("./../utils/httpStatusText");
const asyncHandler = require("express-async-handler");
const appError=require('./../utils/appError');

const bcrypt = require('bcrypt');

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
        await newUser.save();
        res.json({
        status: httpStatusText.SUCCESS,
        data: { user: newUser },
        });
    }
}) ;


const login=asyncHandler(async (req, res,next) => {
        // console.log("login",req.body);


    const {email,password}=req.body;

    const user=await User.findOne({email: email});

    if(!user) {
        const error= appError.create("user not found",400, httpStatusText.FAIL)
        return next(error);
    }
    if(!user && !password) {
        const error= appError.create("email && password are required",400, httpStatusText.FAIL)
        return next(error);
    }

    const matchedPassword= await bcrypt.compare(password,user.password)
    if(user && matchedPassword) {
        return res.json({
            status: httpStatusText.SUCCESS,
            data: {
            users: "login success",
            },
        });
    }
    else{
        const error= appError.create("something wrong",500, httpStatusText.ERROR)
        return next(error);
    }



}) ;

module.exports ={
    getAllUsers,
    register,
    login
}