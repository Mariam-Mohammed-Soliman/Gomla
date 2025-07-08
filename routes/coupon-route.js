const express= require('express');
const router= express.Router();

const{body,validationResult}=require('express-validator');

const couponController=require('../controllers/coupon-controller');
const verifyToken  = require('../middleware/verifyToken');
const authorizeRoles = require('../middleware/authorizeRoles');

const couponValidation = [
  body("couponCode")
    .notEmpty().withMessage("Coupon code is required").isString().withMessage("Coupon code must be a string"),

  body("discountType")
    .notEmpty().withMessage("Discount type is required").isIn(["discount", "cashback"]).withMessage("Discount type must be 'discount' or 'cashback'"),

  body("discountValue")
    .isNumeric().withMessage("Discount value must be a number"),

  body("isCashbackActive")
    .isBoolean().withMessage("isCashbackActive must be a boolean"),

  body("minUsage")
    .isInt({ min: 0 }).withMessage("minUsage must be a non-negative integer"),

  body("maxUsage")
    .isInt({ min: 1 }).withMessage("maxUsage must be at least 1"),

  body("isActive")
    .isBoolean().withMessage("isActive must be a boolean"),
];


    //Coupons
router.route("/")
    .get(verifyToken,authorizeRoles("admin"),couponController.getAllCoupons)
    .post(verifyToken,authorizeRoles("admin"),couponValidation,couponController.createCoupon)


module.exports = router;