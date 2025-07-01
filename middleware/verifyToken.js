const appError = require("../utils/appError");
const httpStatusText=require("../utils/httpStatusText")
const jwt=require("jsonwebtoken")

const verifyToken=(req,res,next)=>{
    const authHeader= req.headers['authorization'] || req.headers['Authorization'];

    // console.log("authHeader",authHeader);
    

    if(!authHeader){
        const error=appError.create("token is required",401,httpStatusText.ERROR);
        return next(error);
    }
    const token =authHeader.split(' ')[1];

    // console.log("token=",token);
    
    try{

        const decoded= jwt.verify(token,process.env.JWT_SECRET_KEY);

        // console.log("decoded",decoded);
        
        req.user=decoded;
        next();

    }catch(err){
         const error=appError.create("invalid token",401,httpStatusText.ERROR);
        return next(error);
    }


}

module.exports=verifyToken;