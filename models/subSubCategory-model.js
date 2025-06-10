const mongoose= require('mongoose');
const categoryModel = require('./category-model');

const subSubCategorySchema = new mongoose.Schema({
    name: {
        type:String,
        required: true
    },
    image:{
        type:String,
        required: true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        require:true
    },
    subCategory:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'SubCategory',
        require:true
    }

  });

  module.exports  = mongoose.model('SubSubCategory', subSubCategorySchema);