const appError = require("../utils/appError");
const httpStatusText=require("../utils/httpStatusText")
const jwt=require("jsonwebtoken")

const verifyToken=(req,res,next)=>{
    const authHeader=req.headers['Authorization'] || req.headers['authorization'];

    if(!authHeader){
        const error=appError.create("token is required",401,httpStatusText.ERROR);
        return next(error);
    }
    const token =authHeader.split(' ')[1];

    // console.log("token=",token);
    
    try{

        const decoded= jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.user=decoded;
        next();

    }catch(err){
         const error=appError.create("invalid token",401,httpStatusText.ERROR);
        return next(error);
    }


}

module.exports=verifyToken;