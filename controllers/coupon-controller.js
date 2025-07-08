const Coupon = require("../models/coupon-model");
const { validationResult } = require("express-validator");

const httpStatusText = require("../utils/httpStatusText");
const asyncHandler = require("express-async-handler");

const appError = require("../utils/appError");

// GET all categories
const getAllCoupons = asyncHandler(async (req, res, next) => {
  const coupons = await Coupon.find({}, { __v: false });
  res.json({
    status: httpStatusText.SUCCESS,
    data: {
      coupons:coupons,
    },
  });
});

// POST create Coupon
const createCoupon = asyncHandler(async (req, res, next) => {
  // const  coupon = {...req.body};
  const {
    couponCode,
    discountType,
    discountValue,
    isCashbackActive,
    minUsage,
    maxUsage,
    isActive,
  } = req.body;
  console.log("couponCode", couponCode);
  const userId = req.user.id;

  
  console.log("userId",userId);
  

    // Check if coupon code already exists
  const existingCoupon = await Coupon.findOne({couponCode});
  // console.log("existingCoupon",existingCoupon);
  if (existingCoupon) {
    return next(appError.create("Coupon code already exists", 400, httpStatusText.FAIL));
  }


  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  } else {
    const newCoupon = new Coupon({
        user: userId,
        couponCode,
        discountType,
        discountValue,
        isCashbackActive,
        minUsage,
        maxUsage,
        isActive,
    });

    console.log("newCoupon",newCoupon);

    await newCoupon.save();
    res.status(201).json({
      status: httpStatusText.SUCCESS,
      data: { coupon: newCoupon },
    });
  }
});


module.exports = {
    getAllCoupons,
    createCoupon,
};
