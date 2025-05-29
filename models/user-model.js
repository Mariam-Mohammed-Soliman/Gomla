const mongoose=require('mongoose');

const validator = require('validator');

const User=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:[validator.isEmail,'must be a valid email']
    },

    password:{
        type:String,
        required:true,
    },
    token:{
        type:String
    }
})

module.exports=mongoose.model('User',User);