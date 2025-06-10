const express= require('express');
const router= express.Router();

const{body,validationResult}=require('express-validator');

const categoryController=require('../controllers/category-controller');

const subCategoryController=require('../controllers/subCategory-controller');
const subSubCategoryController=require('../controllers/sub-subCategory-controller');

const productController=require("../controllers/products-controller");
const upload = require('../middleware/uploadImg');

const categoryBodyValidation=[
    body('name').notEmpty().withMessage("name is required").isLength({min:2}).withMessage("name at least 2 digits"),
    body('image').notEmpty().withMessage("image is required")
]
const subCategoryBodyValidation=[
    body('name').notEmpty().withMessage("name is required").isLength({min:2}).withMessage("name at least 2 digits"),
    body('image').notEmpty().withMessage("image is required")
]
const subSubCategoryBodyValidation=[
    body('name').notEmpty().withMessage("name is required").isLength({min:2}).withMessage("name at least 2 digits"),
    body('image').notEmpty().withMessage("image is required")
]

    //categories
router.route("/")
    .get(categoryController.getAllCategories)
    .post(categoryBodyValidation,upload.single("image"),categoryController.createCategory);

// router.route("/subcategories")
//         .get(subCategoryController.getAllSubCategories);
        
// router.route("/subcategories/subsubcategories")
//         .get(subSubCategoryController.getAllSubSubCategories);

router.route("/:categoryId")
    .get(categoryController.getCategoryById)
    .patch(categoryController.updateCategory)
    .delete(categoryController.deleteCategory);


    //subCategories
router.route("/:categoryId/subcategories")
    .get(subCategoryController.getAllSubCategoriesByCategoryId)
    .post(subCategoryBodyValidation,upload.single("image"),subCategoryController.createSubCategory);

router.route("/:categoryId/subcategories/:subcategoryId")
    .get(subCategoryController.getSubCategoryById)
    .patch(subCategoryController.updateSubCategory)
    .delete(subCategoryController.deleteSubCategory);


    //subSubCategories
router.route("/:categoryId/subcategories/:subcategoryId/subsubcategories")
    .get(subSubCategoryController.getAllSubSubCategoriesBySubCategoryId)
    .post(subSubCategoryBodyValidation,upload.single("image"),subSubCategoryController.createSubSubCategory);

router.route("/:categoryId/subcategories/:subcategoryId/subsubcategories/:subsubcategoryId")
    .get(subSubCategoryController.getSubSubCategoryById)
    .patch(subSubCategoryController.updateSubSubCategory)
    .delete(subSubCategoryController.deleteSubSubCategory);


    //product
router.route("/:categoryId/subcategories/:subcategoryId/subsubcategories/:subsubcategoryId/products")
    .get(productController.getAllProductsBySubCategoryId)
    .post(upload.single("image"),productController.createProduct);

router.route("/:categoryId/subcategories/:subcategoryId/subsubcategories/:subsubcategoryId/products/:productId")
    .get(productController.getProductById)
    .patch(productController.updateProduct)
    .delete(productController.deleteProduct);


module.exports = router;