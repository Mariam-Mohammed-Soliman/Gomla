const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  quantity:{
    type:Number,
    required:true
  },
  price: {
    type:Number,
    required:true
  },
  description: {
    type:String,
    required:false
  },
  availability:{
    type:Boolean,
    required:false
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
// const productSchema = new mongoose.Schema({
//   name: {
//     type: String,
//     required: true
//   },
//   mainName: {
//     type: String,
//     required: true
//   },
//   image: {
//     type: String,
//     required: true
//   },
//   mostOrder:{
//     type:Boolean,
//     required:true
//   },
//   offer:{
//     type:Boolean,
//     required:true
//   },
//   oldPrice:{
//     type:Number,
//     required:true
//   },
//   quantity:{
//     type:Number,
//     required:true
//   },
//   ratingCount:{
//     type:Number,
//     required:true
//   },
//   ratingValue:{
//     type:Number,
//     required:true
//   },
//   requiredQuantityToOrder:{
//     type:Number,
//     required:true
//   },
//   showMainPridsce:{
//     type:Boolean,
//     required:true
//   },
//   price: {
//     type:Number,
//     required:true
//   },
//   description: {
//     type:String,
//     required:true
//   },
//   availability:{
//     type:Boolean,
//     required:true
//   },
//   category:{
//         type:mongoose.Schema.Types.ObjectId,
//         ref:'Category',
//         require:true
//   },
//   subCategory:{
//       type:mongoose.Schema.Types.ObjectId,
//       ref:'SubCategory',
//       require:true
//   },
// subSubCategory: {
//   type: mongoose.Schema.Types.ObjectId,
//   ref: 'SubSubCategory',
//   required: true
// }
// });

module.exports = mongoose.model('Product', productSchema);
