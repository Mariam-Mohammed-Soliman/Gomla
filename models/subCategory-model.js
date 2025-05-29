const mongoose= require('mongoose');
const categoryModel = require('./category-model');

const subCategorySchema = new mongoose.Schema({
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
    }

  });

  module.exports  = mongoose.model('SubCategory', subCategorySchema);