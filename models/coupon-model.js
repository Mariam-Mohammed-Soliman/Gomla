const mongoose= require('mongoose');

const couponSchema = new mongoose.Schema({
   couponCode: {
    type: String,
    required: true,
    unique: true,
  },
  discountType: {
    type: String,
    enum: ['discount', 'cashback'],
    required: true,
    default: 'discount',
  },
  discountValue: {
    type: Number, 
    default: 0,
  },
  isCashbackActive: {
    type: Boolean,
    default: false,
  },
  minUsage: {
    type: Number,
    default: 0,
  },
  maxUsage: {
    type: Number,
    default: 1,
  },

  isActive: {
    type: Boolean,
    default: true,
  }
  });

  module.exports  = mongoose.model('Coupon', couponSchema);