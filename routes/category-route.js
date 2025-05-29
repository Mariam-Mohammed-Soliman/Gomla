const express= require('express');
const router= express.Router();

const{body,validationResult}=require('express-validator');

const categoryController=require('../controllers/category-controller');

const subCategoryController=require('../controllers/subCategory-controller')

const categoryBodyValidation=[
    body('name').notEmpty().withMessage("name is required").isLength({min:2}).withMessage("name at least 2 digits"),
    body('image').notEmpty().withMessage("image is required")
]
const subCategoryBodyValidation=[
    body('name').notEmpty().withMessage("name is required").isLength({min:2}).withMessage("name at least 2 digits"),
    body('image').notEmpty().withMessage("image is required")
]

    //categories
router.route("/")
    .get(categoryController.getAllCategories)
    .post(categoryBodyValidation,categoryController.createCategory);

    router.route("/subcategories")
        .get(subCategoryController.getAllSubCategories);

router.route("/:categoryId")
    .get(categoryController.getCategoryById)
    .patch(categoryController.updateCategory)
    .delete(categoryController.deleteCategory);


    //subCategories
router.route("/:categoryId/subcategories")
    .get(subCategoryController.getAllSubCategoriesByCategoryId)
    .post(subCategoryBodyValidation,subCategoryController.createSubCategory);

router.route("/:categoryId/subcategories/:subCategoryId")
    .get(subCategoryController.getSubCategoryById)
    .patch(subCategoryController.updateSubCategory)
    .delete(subCategoryController.deleteSubCategory);


    //subSubCategories
router.route("/:categoryId/subcategories/:subcategoryId/subsubcategories")
    .get()
    .post();

router.route("/:categoryId/subcategories/:subcategoryId/subsubcategories/:subsubcategoryId")
    .get()
    .patch()
    .delete();

    //product
router.route("/:categoryId/subcategories/:subcategoryId/subsubcategories/:subsubcategoryId/products")
    .get()
    .post();

router.route("/:categoryId/subcategories/:subcategoryId/subsubcategories/:subsubcategoryId/products/:productId")
    .get()
    .patch()
    .delete();


module.exports = router;