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
  price: {
    type:Number,
    require:true
  },

  description: {
    type:String,
    require:true
  },

  subSubCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubSubCategory',
    required: true
  }
});

module.exports = mongoose.model('Product', productSchema);
