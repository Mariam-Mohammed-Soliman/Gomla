const Admin = require("../models/admin-model");
const httpStatusText = require("../utils/httpStatusText");
const asyncHandler = require("express-async-handler");
const appError=require('../utils/appError');
const bcrypt = require('bcrypt');

const register=asyncHandler(async (req, res,next) => {
    const {adminName,email,phone,password}=req.body;

    const oldAdmin=await Admin.findOne({email: email});

    if (oldAdmin) {
        const error= appError.create("email is exist",400, httpStatusText.FAIL)
        return next(error);
    } else {
        const hashedPassword=await bcrypt.hash(password,10);

        const newAdmin= new Admin({
            adminName,
            email,
            phone,
            password:hashedPassword,
        });


        await newAdmin.save();
        res.json({
        status: httpStatusText.SUCCESS,
        data: { admin: newAdmin },
        });
    }
}) ;


const login=asyncHandler(async (req, res,next) => {
    const {email,password}=req.body;

    if(!email || !password) {
        const error= appError.create("email && password are required",400, httpStatusText.FAIL)
        return next(error);
    }
    
    const admin=await Admin.findOne({email: email});

    if(!admin) {
        const error= appError.create("user not found",400, httpStatusText.FAIL)
        return next(error);
    }
    const matchedPassword= await bcrypt.compare(password,admin.password)
    if(admin && matchedPassword) {
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