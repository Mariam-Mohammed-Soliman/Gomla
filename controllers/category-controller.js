const Category = require("./../models/category-model");

const { validationResult } = require("express-validator");
const httpStatusText = require("./../utils/httpStatusText");
const asyncHandler = require("express-async-handler");

const appError = require("./../utils/appError");

// GET all categories
const getAllCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({}, { __v: false });
  res.json({
    status: httpStatusText.SUCCESS,
    data: {
      categories:categories,
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
const createCategory = asyncHandler(async (req, res, next) => {
  console.log("body", { ...req.body });
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
    const newCategory = new Category({
      ...req.body,
      image: req.file ? req.file.path : "",
    });

    await newCategory.save();
    res.json({
      status: httpStatusText.SUCCESS,
      data: { category: newCategory },
    });
  }
});

// PATCH update category
const updateCategory = asyncHandler(async (req, res, next) => {
    //   console.log("body", { ...req.body });

        const categoryId = req.params.categoryId;
    //   console.log("categoryId",categoryId);

    let updatedCategory = await Category.findByIdAndUpdate(
    categoryId,
        {$set:{...req.body}},
        {new:true}
    );
    //   console.log("updatedCategory",updatedCategory);

    if(!updatedCategory){
                const error= appError.create("category not found",404, httpStatusText.FAIL);
                return next(error);
            }
            else{
            res.json({
                    status: httpStatusText.SUCCESS,
                    data: {
                        category: updatedCategory,
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
    getAllCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
};
