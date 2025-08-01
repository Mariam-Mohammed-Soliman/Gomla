const Category = require("./../models/category-model");

const SubCategory = require("./../models/subCategory-model");
// const SubSubCategory = require("./../models/subSubCategory-model");
// const Product = require("./../models/product-model");

const { validationResult, body } = require("express-validator");
const httpStatusText = require("./../utils/httpStatusText");
const asyncHandler = require("express-async-handler");

const appError = require("./../utils/appError");

// GET all subCategories
const getAllSubCategories = asyncHandler(async (req, res, next) => {
  const subCategories = await SubCategory.find({}, { __v: false }).populate('category');

  // console.log("subCategories",subCategories);

  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      subCategories:subCategories,
    },
  });
});
// GET all categories by CategoryId
const getAllSubCategoriesByCategoryId = asyncHandler(async (req, res, next) => {

    const {categoryId} = req.params;
  const subCategories = await SubCategory.find({category: categoryId}, { __v: false }).populate('category');

  // console.log("subCategories",subCategories);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      subCategories:subCategories,
    },
  });
});

// GET category by categoryId and subcategoryId
const getSubCategoryById = asyncHandler(async (req, res, next) => {

  const { categoryId, subcategoryId } = req.params;
  // console.log("categoryId",categoryId,"subcategoryId",subcategoryId);
  
const subCategory = await SubCategory.findOne({
  category: categoryId,
  _id:subcategoryId
});
  // console.log("subCategory",subCategory);
if(!subCategory){
          const error= appError.create("subCategory not found",404, httpStatusText.FAIL);
            return next(error);
        }else{
        res.status(200).json({
                status: httpStatusText.SUCCESS,
                data: {
                    subCategory: subCategory,
                },
            });
        }
        
});

// POST create category
const createSubCategory = asyncHandler(async (req, res, next) => {
  // console.log("body", { ...req.body });

  const {categoryId} = req.params;

  const categoryExists = await Category.findById(categoryId);

  if (!categoryExists) {
    const error = appError.create("Category not found", 404, httpStatusText.FAIL);
    return next(error);
  }

  const errors = validationResult(req);

    //check if image exists
  if (!req.file) {
    const error = appError.create("Image is required", 400, httpStatusText.FAIL);
    return next(error);
  }


  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  } else {
    const newSubCategory = new SubCategory({
        ...req.body,
        image: req.file ? req.file.path : "",
        category:categoryId
    });

    // console.log("newSubCategory",newSubCategory);
    // return;

    await newSubCategory.save();
    res.status(201).json({
      status: httpStatusText.SUCCESS,
      data: { subCategory: newSubCategory },
    });
  }
});

// PATCH update category
const updateSubCategory = asyncHandler(async (req, res, next) => {
      // console.log("body", { ...req.body });
    const { categoryId, subcategoryId } = req.params;

  // console.log("categoryId",categoryId,"subcategoryId",subcategoryId);

const categoryExists = await Category.findById(categoryId);
if (!categoryExists) return next(appError.create("Category not found", 404, httpStatusText.FAIL));


  const errors = validationResult(req);
  if (!errors.isEmpty()) {
  const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
  return next(error);
  }
  
   //check if image exists
       console.log("image",req.file);
       
    if (!req.file) {
      const error = appError.create("Image is required", 400, httpStatusText.FAIL);
      return next(error);
    }
const updatedSubCategory = await SubCategory.findOneAndUpdate(
      {category: categoryId,
      _id:subcategoryId},
        {$set:{
          ...req.body,
          image: req.file ? req.file.path : "",

        }},
        {new:true}
);
  // console.log("updatedSubCategory",updatedSubCategory);


    if(!updatedSubCategory){
                const error= appError.create("subCategory not found for this Category",404, httpStatusText.FAIL);
                return next(error);
            }
            else{
            res.status(200).json({
                    status: httpStatusText.SUCCESS,
                    data: {
                        subCategory: updatedSubCategory,
                    },
                });
    }

});

// DELETE category
const deleteSubCategory = asyncHandler(async (req, res, next) => {
  //  console.log("body", { ...req.body });
    const { categoryId, subcategoryId } = req.params;
  // console.log("categoryId",categoryId,"subcategoryId",subcategoryId);

const categoryExists = await Category.findById(categoryId);
if (!categoryExists) return next(appError.create("Category not found", 404, httpStatusText.FAIL));

    const deletedSubCategory = await SubCategory.deleteOne({ 
      category: categoryId,
      _id:subcategoryId
     });

    // console.log("deletedSubCategory",deletedSubCategory);
    if (deletedSubCategory.deletedCount===0) {
        const error = appError.create("SubCategory not found", 404, httpStatusText.FAIL);
        return next(error);
    }else{
        res.status(200).json({
            status: httpStatusText.SUCCESS,
            message: "SubCategory deleted successfully",
        });
    }
});

module.exports = {
    getAllSubCategories,
    getAllSubCategoriesByCategoryId,
    getSubCategoryById,
    createSubCategory,
    updateSubCategory,
    deleteSubCategory,
};
