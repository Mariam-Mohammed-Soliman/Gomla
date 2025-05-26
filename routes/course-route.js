const express= require('express');
const router= express.Router();

const{body,validationResult}=require('express-validator');

const courseController=require('../controllers/courses-controller');

const bodyValidation=[
    body('title').notEmpty().withMessage("title is required").isLength({min:2}).withMessage("title at least 2 digits"),
    body('price').notEmpty().withMessage("price is required")
]

router.route("/")
    .get(courseController.getAllCourses)
    .post(bodyValidation,courseController.postCourse);

router.route("/:courseId")
    .get(courseController.getOneCourse)
    .patch(courseController.updateCourse)
    .delete(courseController.deleteCourse)


module.exports = router;