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
]
const subCategoryBodyValidation=[
    body('name').notEmpty().withMessage("name is required").isLength({min:2}).withMessage("name at least 2 digits"),
]
// const subSubCategoryBodyValidation=[
//     body('name').notEmpty().withMessage("name is required").isLength({min:2}).withMessage("name at least 2 digits"),
// ]
const productBodyValidation=[
    body('name').notEmpty().withMessage("name is required").isLength({min:2}).withMessage("name at least 2 digits"),
    body('price').notEmpty().withMessage("price is required"),
    body('quantity').notEmpty().withMessage("quantity is required"),
]

    //categories
router.route("/")
    .get(categoryController.getAllCategories)
    .post(upload.single("image"),categoryBodyValidation,categoryController.createCategory);

// router.route("/subcategories")
//         .get(subCategoryController.getAllSubCategories);
        
// router.route("/subcategories/subsubcategories")
//         .get(subSubCategoryController.getAllSubSubCategories);

router.route("/:categoryId")
    .get(categoryController.getCategoryById)
    .patch(upload.single("image"),categoryController.updateCategory)
    .delete(categoryController.deleteCategory);


    //subCategories
router.route("/:categoryId/subcategories")
    .get(subCategoryController.getAllSubCategoriesByCategoryId)
    .post(upload.single("image"),subCategoryBodyValidation,subCategoryController.createSubCategory);

router.route("/:categoryId/subcategories/:subcategoryId")
    .get(subCategoryController.getSubCategoryById)
    .patch(upload.single("image"),subCategoryController.updateSubCategory)
    .delete(subCategoryController.deleteSubCategory);


    //subSubCategories
// router.route("/:categoryId/subcategories/:subcategoryId/subsubcategories")
//     .get(subSubCategoryController.getAllSubSubCategoriesBySubCategoryId)
//     .post(upload.single("image"),subSubCategoryBodyValidation,subSubCategoryController.createSubSubCategory);

// router.route("/:categoryId/subcategories/:subcategoryId/subsubcategories/:subsubcategoryId")
//     .get(subSubCategoryController.getSubSubCategoryById)
//     .patch(subSubCategoryController.updateSubSubCategory)
//     .delete(subSubCategoryController.deleteSubSubCategory);


    //product    /subsubcategories/:subsubcategoryId
router.route("/:categoryId/subcategories/:subcategoryId/products")
    .get(productController.getAllProductsBySubCategoryId)
    .post(upload.single("image"),productBodyValidation,productController.createProduct);

router.route("/:categoryId/subcategories/:subcategoryId/products/:productId")
    .get(productController.getProductById)
    .patch(upload.single("image"),productController.updateProduct)
    .delete(productController.deleteProduct);


module.exports = router;