require('dotenv').config();
const express = require('express');
const mongoose=require('mongoose');
const httpStatusText = require("./utils/httpStatusText");

const cors=require('cors');

console.log("MONGO_URL is: ", process.env.MONGO_URL);
mongoose.connect(process.env.MONGO_URL).then(()=>{
    console.log("MONGO_URL is: ", process.env.MONGO_URL);
    console.log("Connect to DB successfully");
})
const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));



const courseRouter=require('./routes/course-route');
app.use('/api/courses',courseRouter);



const adminRouter=require('./routes/admin-route')
const userRouter=require('./routes/user-route');
const categoryRouter=require('./routes/category-route');
const orderRouter=require('./routes/order-route');

app.use('/api/admin',adminRouter);
app.use('/api/users',userRouter);
app.use('/api/categories',categoryRouter);
app.use('/api/order',orderRouter);

app.all('*',(req,res,next)=>{
    return res.status(404).json({
        status: httpStatusText.ERROR,
        message:"this resources is not available"
    })
});


app.use((err,req,res,next)=>{
    res.status(err.statusCode|| 500).json({
        status:err.statusText || httpStatusText.ERROR,
        message:err.message,
        code:err.statusCode || 500,
        data:null,
        stack:err.stack
     });
})


app.listen(process.env.PORT || 3000,() => {
    console.log("listening on port ",process.env.PORT);
  })