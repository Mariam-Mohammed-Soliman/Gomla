const Order = require("../models/order-model");
const Product = require("../models/product-model");
const { validationResult } = require("express-validator");

const httpStatusText = require("../utils/httpStatusText");
const asyncHandler = require("express-async-handler");

const appError = require("../utils/appError");

// GET all categories
const getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({}, { __v: false });
  res.json({
    status: httpStatusText.SUCCESS,
    data: {
      orders:orders,
    },
  });
});

// GET category by ID
const getCategoryById = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.categoryId;
//   console.log(categoryId);

const category = await Category.findById(categoryId);
//   console.log(category);


if(!category){
            const error= appError.create("category not found",404, httpStatusText.FAIL);
            return next(error);
        }
        else{
        res.json({
                status: httpStatusText.SUCCESS,
                data: {
                    category: category,
                },
            });
        }
        

});

// POST create category
const createOrder = asyncHandler(async (req, res, next) => {
  const { products } = req.body;
  console.log("products", products);
  const userId = req.user.id;

  console.log("userId",userId);
  
  if (!products || !Array.isArray(products) || products.length === 0) {
    return res.status(400).json({
      status: httpStatusText.FAIL,
      message: "Products are required in the order.",
    });
  }

  let totalPrice = 0;
  const detailedProducts = [];

  for (const item of products) {
    // console.log("item",item);
    
    const productFromDB = await Product.findById(item.product);
    // console.log("product from loop=>",productFromDB);
    
    if (!productFromDB) {
      return res.status(404).json({
        status: httpStatusText.FAIL,
        message: `Product with id ${item.product} not found.`,
      });
    }

    const productTotal = productFromDB.price * item.quantity;
    totalPrice += productTotal;

    detailedProducts.push({
      product: productFromDB._id,
      quantity: item.quantity,
    });
  }

    // console.log("totalPrice",totalPrice);
    

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  } else {
    const newOrder = new Order({
        user: userId,
        products: detailedProducts,
        totalPrice,
    });

    // console.log("newOrder",newOrder);

    await newOrder.save();
    res.status(201).json({
      status: httpStatusText.SUCCESS,
      data: { order: newOrder },
    });
  }
});

// PATCH update order
const updateOrder = asyncHandler(async (req, res, next) => {
      // console.log("body", { ...req.body });

        const orderId = req.params.orderId;
      // console.log("orderId",orderId);

    let updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {$set:{...req.body}},
        {new:true}
    );
      // console.log("updatedOrder",updatedOrder);

    if(!updatedOrder){
                const error= appError.create("order not found",404, httpStatusText.FAIL);
                return next(error);
            }
            else{
            res.json({
                    status: httpStatusText.SUCCESS,
                    data: {
                        order: updatedOrder,
                    },
                });
    }

});

// DELETE category
const deleteCategory = asyncHandler(async (req, res, next) => {
    const categoryId = req.params.categoryId;
    const deletedCategory = await Category.deleteOne({ _id: categoryId });

    // console.log("deletedCategory",deletedCategory);
    if (deletedCategory.deletedCount===0) {
        const error = appError.create("category not found", 404, httpStatusText.FAIL);
        return next(error);
    }else{
        res.json({
            status: httpStatusText.SUCCESS,
            message: "SubCategory deleted successfully",

        });
    }
});

module.exports = {
    getAllOrders,
    getCategoryById,
    createOrder,
    updateOrder,
    deleteCategory,
};
