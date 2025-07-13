const express= require('express');
const router= express.Router();

const{body,validationResult}=require('express-validator');

const userController=require('../controllers/users-controller');
const  verifyToken  = require('../middleware/verifyToken');
const authorizeRoles = require('../middleware/authorizeRoles');
const upload = require('../middleware/uploadImg');


// router.route("/")
//     .get(verifyToken,userController.getAllUsers)
router.route("/register")
    .post(upload.single("image"),userController.register)
router.route("/login")
    .post(userController.login)

module.exports = router;