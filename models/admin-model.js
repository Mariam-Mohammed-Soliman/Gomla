const mongoose=require('mongoose');

const validator = require('validator');

const Admin=new mongoose.Schema({
    adminName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:[validator.isEmail,'must be a valid email']
    },
    phone:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    }
})

module.exports=mongoose.model('Admin',Admin);