const express= require('express');
const router= express.Router();

const{body,validationResult}=require('express-validator');

const userController=require('../controllers/users-controller');

router.route("/")
    .get(userController.getAllUsers)
router.route("/register")
    .post(userController.register)
router.route("/login")
    .post(userController.login)


module.exports = router;