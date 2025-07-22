const Admin = require("../models/admin-model");
const User = require("./../models/user-model");
const { validationResult } = require("express-validator");
const httpStatusText = require("../utils/httpStatusText");
const asyncHandler = require("express-async-handler");
const appError=require('../utils/appError');
const bcrypt = require('bcrypt');

const {generateJWT}  = require("../utils/generateJWT");


const getAllUsers=asyncHandler(async (req, res,next) => {
   
    // console.log("req.user====>",req.user);

    const users = await User.find({},{"__v":false,"password":false});
    res.json({
        status: httpStatusText.SUCCESS,
        data: {
        users: users,
        },
    });
}) ;


const updateUserActivation=asyncHandler(async (req, res,next) => {
      console.log("body", { ...req.body });
          console.log("req.user====>",req.user);


      const {active}=req.body;

            const userId = req.params.userId;
          console.log("userId",userId);
    
        let updatedUser = await User.findByIdAndUpdate(
            userId,
            {$set:{active}},
            {new:true}
        );
          console.log("updatedUser",updatedUser);
    
        if(!updatedUser){
                    const error= appError.create("user not found",404, httpStatusText.FAIL);
                    return next(error);
                }
                else{
                res.json({
                        status: httpStatusText.SUCCESS,
                        data: {
                            user: updatedUser,
                        },
                    });
        }
}) ;

const updateUserBalance=asyncHandler(async (req, res,next) => {
      console.log("body", { ...req.body });

      const {balance}=req.body;

            const userId = req.params.userId;
          console.log("userId",userId);
    
        let updatedUser = await User.findByIdAndUpdate(
            userId,
            {$set:{balance}},
            {new:true}
        );
          console.log("updatedUser",updatedUser);
    
        if(!updatedUser){
                    const error= appError.create("user not found",404, httpStatusText.FAIL);
                    return next(error);
                }
                else{
                res.json({
                        status: httpStatusText.SUCCESS,
                        data: {
                            user: updatedUser,
                        },
                    });
        }
}) ;

const deleteUser = asyncHandler(async (req, res, next) => {
    const userId = req.params.userId;
    const deletedUser = await User.deleteOne({ _id: userId });

    console.log("deletedUser",deletedUser);
    if (deletedUser.deletedCount===0) {
        const error = appError.create("category not found", 404, httpStatusText.FAIL);
        return next(error);
    }else{
        res.json({
            status: httpStatusText.SUCCESS,
            message: "user deleted successfully",

        });
    }
});

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

    // console.log(email);
    

    if(!email || !password) {
        const error= appError.create("email && password are required",400, httpStatusText.FAIL)
        return next(error);
    }
    
    const admin=await Admin.findOne({email: email});
    console.log("admin object = ", admin);


    if(!admin) {
        const error= appError.create("user not found",400, httpStatusText.FAIL)
        return next(error);
    }
    const matchedPassword= await bcrypt.compare(password,admin.password)
    if(admin && matchedPassword) {
        //generate JWT token
        const token= await generateJWT({email:admin.email,id:admin._id,role:admin.role});
        console.log("admin before token", admin); // لازم يكون فيه role
console.log("token payload", { email: admin.email, id: admin._id, role: admin.role });

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
    updateUserActivation,
    updateUserBalance,
    deleteUser,
    register,
    login
}