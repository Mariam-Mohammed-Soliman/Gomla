const Category = require("../models/category-model");
const SubCategory = require("../models/subCategory-model");
const SubSubCategory = require("../models/subSubCategory-model");
const Product=require("../models/product-model");

const { validationResult, body } = require("express-validator");
const httpStatusText = require("../utils/httpStatusText");
const asyncHandler = require("express-async-handler");

const appError = require("../utils/appError");

// GET all products by subSubCategoryId
const getAllProductsBySubCategoryId = asyncHandler(async (req, res, next) => {

    const {categoryId,subcategoryId,subsubcategoryId} = req.params;
  const products = await Product.find({
    category: categoryId,
    subCategory:subcategoryId,
    subSubCategory:subsubcategoryId
  }, { __v: false }).populate('category').populate('subCategory').populate('subSubCategory');

  // console.log("products",products);

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      products:products,
    },
  });
});

// GET product by categoryId and subCategoryId and sub-subcategory
const getProductById = asyncHandler(async (req, res, next) => {

  const { categoryId, subcategoryId, subsubcategoryId,productId } = req.params;

  // console.log("categoryId",categoryId,"subcategoryId",subcategoryId,"subsubcategoryId",subsubcategoryId,"productId",productId);
  

const product = await Product.findOne({
  category: categoryId,
  subCategory:subcategoryId,
  subSubCategory:subsubcategoryId,
  _id:productId
});
  // console.log("product",product);

if(!product){
          const error= appError.create("product not found",404, httpStatusText.FAIL);
            return next(error);
        }else{
        res.status(200).json({
                status: httpStatusText.SUCCESS,
                data: {
                    product: product,
                },
            });
        }
        
});

// POST create category
const createProduct = asyncHandler(async (req, res, next) => {
  // console.log("body", { ...req.body });

  const {categoryId,subcategoryId,subsubcategoryId} = req.params;

  // console.log("categoryId",categoryId,"subcategoryId",subcategoryId,"subsubcategoryId",subsubcategoryId);

  const categoryExists = await Category.findById(categoryId);
  const subCategoryExists = await SubCategory.findById(subcategoryId);
  const subSubCategoryExists = await SubSubCategory.findById(subsubcategoryId);


  if (!categoryExists) {
  return next(appError.create("Category not found", 404, httpStatusText.FAIL));
}
if (!subCategoryExists) {
  return next(appError.create("SubCategory not found", 404, httpStatusText.FAIL));
}
if (!subSubCategoryExists) {
  return next(appError.create("SubSubCategory not found", 404, httpStatusText.FAIL));
}


  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  } else {
    const newProduct = new Product({
        ...req.body,
        image: req.file ? req.file.path : "",
        category:categoryId,
        subCategory:subcategoryId,
        subSubCategory:subsubcategoryId
    });

    // console.log("newProduct",newProduct);
    // return;

    await newProduct.save();
    res.status(201).json({
      status: httpStatusText.SUCCESS,
      data: { product: newProduct },
    });
  }
});

// PATCH update category
const updateProduct = asyncHandler(async (req, res, next) => {
      // console.log("body", { ...req.body });
    const {categoryId,subcategoryId,subsubcategoryId,productId} = req.params;

  // console.log("categoryId",categoryId,"subcategoryId",subcategoryId,"subsubcategoryId",subsubcategoryId,"productId",productId);

  const categoryExists = await Category.findById(categoryId);
  const subCategoryExists = await SubCategory.findById(subcategoryId);
  const subSubCategoryExists = await SubSubCategory.findById(subsubcategoryId);


  if (!categoryExists) {
  return next(appError.create("Category not found", 404, httpStatusText.FAIL));
}
if (!subCategoryExists) {
  return next(appError.create("SubCategory not found", 404, httpStatusText.FAIL));
}
if (!subSubCategoryExists) {
  return next(appError.create("SubSubCategory not found", 404, httpStatusText.FAIL));
}



  const errors = validationResult(req);
  if (!errors.isEmpty()) {
  const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
  return next(error);
  }
  
const updatedProduct = await Product.findOneAndUpdate(
      {
        category: categoryId,
        subCategory:subcategoryId,
        subSubCategory:subsubcategoryId,
        _id:productId
    },
        {$set:{...req.body}},
        {new:true}
);
  // console.log("updatedProduct",updatedProduct);


    if(!updatedProduct){
                const error= appError.create("Product not found for the specified category, subcategory, and subsubcategory",404, httpStatusText.FAIL);
                return next(error);
            }
            else{
            res.status(200).json({
                    status: httpStatusText.SUCCESS,
                    data: {
                        product: updatedProduct ,
                    },
                });
    }

});

// DELETE category
const deleteProduct = asyncHandler(async (req, res, next) => {
  //  console.log("body", { ...req.body });
    const {categoryId,subcategoryId,subsubcategoryId,productId} = req.params;

  // console.log("categoryId",categoryId,"subcategoryId",subcategoryId,"subsubcategoryId",subsubcategoryId,"productId",productId);

  const categoryExists = await Category.findById(categoryId);
  const subCategoryExists = await SubCategory.findById(subcategoryId);
  const subSubCategoryExists = await SubSubCategory.findById(subsubcategoryId);


  if (!categoryExists) {
  return next(appError.create("Category not found", 404, httpStatusText.FAIL));
}
if (!subCategoryExists) {
  return next(appError.create("SubCategory not found", 404, httpStatusText.FAIL));
}
if (!subSubCategoryExists) {
  return next(appError.create("SubSubCategory not found", 404, httpStatusText.FAIL));
}


    const deletedProduct = await Product.deleteOne({ 
      category: categoryId,
      subCategory:subcategoryId,
      subSubCategory:subsubcategoryId,
      _id:productId
     });

    // console.log("deletedProduct",deletedProduct);
    if (deletedProduct.deletedCount===0) {
        const error = appError.create("Product not found for the specified category, subcategory, and subsubcategory", 404, httpStatusText.FAIL);
        return next(error);
    }else{
        res.status(200).json({
            status: httpStatusText.SUCCESS,
            message: "product deleted successfully",
        });
    }
});

module.exports = {
    // getAllSubSubCategories,
    getAllProductsBySubCategoryId,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
