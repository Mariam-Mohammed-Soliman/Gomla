const mongoose=require('mongoose');

const validator = require('validator');

const User=new mongoose.Schema({
    userName:{
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
    },
  image: {
    type: String,
    required: true
  },
  location: {
    latitude: {
      type: Number,
      required: false
    },
    longitude: {
      type: Number,
      required: false
    }
  },
  active:{
    type:Boolean,
    default:"false"
  },
    role: {
  type: String,
  default: "user",
}

})

module.exports=mongoose.model('User',User);