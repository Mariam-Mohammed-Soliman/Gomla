const Category = require("../models/category-model");
const SubCategory = require("../models/subCategory-model");
const SubSubCategory = require("../models/subSubCategory-model");

const { validationResult, body } = require("express-validator");
const httpStatusText = require("../utils/httpStatusText");
const asyncHandler = require("express-async-handler");

const appError = require("../utils/appError");

// GET all subCategories
// const getAllSubSubCategories = asyncHandler(async (req, res, next) => {
//   const subCategories = await SubSubCategory.find({}, { __v: false }).populate('category');

//   // console.log("subCategories",subCategories);

//   res.status(200).json({
//     status: httpStatusText.SUCCESS,
//     data: {
//       subCategories:subCategories,
//     },
//   });
// });
// GET all subSubCategories by subCategoryId
const getAllSubSubCategoriesBySubCategoryId = asyncHandler(async (req, res, next) => {

    const {categoryId,subcategoryId} = req.params;
  const subSubCategories = await SubSubCategory.find({
    category: categoryId,
    subCategory:subcategoryId,
  }, { __v: false }).populate('category').populate('subCategory');

  // console.log("subCategories",subCategories);
  res.status(200).json({
    status: httpStatusText.SUCCESS,
    data: {
      subSubCategories:subSubCategories,
    },
  });
});

// GET subCategory by categoryId and subCategoryId
const getSubSubCategoryById = asyncHandler(async (req, res, next) => {

  const { categoryId, subcategoryId, subsubcategoryId } = req.params;

  // console.log("categoryId",categoryId,"subcategoryId",subcategoryId,"subsubcategoryId",subsubcategoryId);
  

const subSubCategory = await SubSubCategory.findOne({
  category: categoryId,
  subCategory:subcategoryId,
  _id:subsubcategoryId
});
  // console.log("subSubCategory",subSubCategory);


if(!subSubCategory){
          const error= appError.create("subCategory not found",404, httpStatusText.FAIL);
            return next(error);
        }else{
        res.status(200).json({
                status: httpStatusText.SUCCESS,
                data: {
                    subSubCategory: subSubCategory,
                },
            });
        }
        

});

// POST create category
const createSubSubCategory = asyncHandler(async (req, res, next) => {
  // console.log("body", { ...req.body });

  const {categoryId,subcategoryId} = req.params;

  // console.log("categoryId",categoryId,"subcategoryId",subcategoryId);

  const categoryExists = await Category.findById(categoryId);
  const subCategoryExists = await SubCategory.findById(subcategoryId);


  if (!categoryExists) {
  return next(appError.create("Category not found", 404, httpStatusText.FAIL));
}
if (!subCategoryExists) {
  return next(appError.create("SubCategory not found", 404, httpStatusText.FAIL));
}


  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  } else {
    const newSubSubCategory = new SubSubCategory({
        ...req.body,
        image: req.file ? req.file.path : "",
        category:categoryId,
        subCategory:subcategoryId
    });

    // console.log("newSubSubCategory",newSubSubCategory);
    // return;

    await newSubSubCategory.save();
    res.status(201).json({
      status: httpStatusText.SUCCESS,
      data: { subSubCategory: newSubSubCategory },
    });
  }
});

// PATCH update category
const updateSubSubCategory = asyncHandler(async (req, res, next) => {
      // console.log("body", { ...req.body });
    const { categoryId, subcategoryId, subsubcategoryId } = req.params;

  // console.log("categoryId",categoryId,"subcategoryId",subcategoryId,"subsubcategoryId",subsubcategoryId);
const categoryExists = await Category.findById(categoryId);
  const subCategoryExists = await SubCategory.findById(subcategoryId);


  if (!categoryExists) {
  return next(appError.create("Category not found", 404, httpStatusText.FAIL));
}
if (!subCategoryExists) {
  return next(appError.create("SubCategory not found", 404, httpStatusText.FAIL));
}


  const errors = validationResult(req);
  if (!errors.isEmpty()) {
  const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
  return next(error);
  }
  
const updatedSubSubCategory = await SubSubCategory.findOneAndUpdate(
      {
        category: categoryId,
        subCategory:subcategoryId,
        _id:subsubcategoryId
    },
        {$set:{...req.body}},
        {new:true}
);
  // console.log("updatedSubSubCategory",updatedSubSubCategory);


    if(!updatedSubSubCategory){
                const error= appError.create("subSubCategory not found for this Category",404, httpStatusText.FAIL);
                return next(error);
            }
            else{
            res.status(200).json({
                    status: httpStatusText.SUCCESS,
                    data: {
                        subSubCategory: updatedSubSubCategory ,
                    },
                });
    }

});

// DELETE category
const deleteSubSubCategory = asyncHandler(async (req, res, next) => {
  //  console.log("body", { ...req.body });
    const { categoryId, subcategoryId, subsubcategoryId } = req.params;

  // console.log("categoryId",categoryId,"subcategoryId",subcategoryId,"subsubcategoryId",subsubcategoryId);

const categoryExists = await Category.findById(categoryId);
const subCategoryExists = await SubCategory.findById(subcategoryId);


  if (!categoryExists) {
  return next(appError.create("Category not found", 404, httpStatusText.FAIL));
}
if (!subCategoryExists) {
  return next(appError.create("SubCategory not found", 404, httpStatusText.FAIL));
}


    const deletedSubSubCategory = await SubSubCategory.deleteOne({ 
      category: categoryId,
      subCategory:subcategoryId,
      _id:subsubcategoryId
     });

    // console.log("deletedSubSubCategory",deletedSubSubCategory);
    if (deletedSubSubCategory.deletedCount===0) {
        const error = appError.create("SubSubCategory not found", 404, httpStatusText.FAIL);
        return next(error);
    }else{
        res.status(200).json({
            status: httpStatusText.SUCCESS,
            message: "subSubCategory deleted successfully",
        });
    }
});

module.exports = {
    // getAllSubSubCategories,
    getAllSubSubCategoriesBySubCategoryId,
    getSubSubCategoryById,
    createSubSubCategory,
    updateSubSubCategory,
    deleteSubSubCategory,
};
