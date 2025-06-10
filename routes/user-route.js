const express= require('express');
const router= express.Router();

const userController=require('../controllers/users-controller');
const upload = require('../middleware/uploadImg');



router.route("/register")
    .post(upload.single("image"),userController.register)
router.route("/login")
    .post(userController.login)


module.exports = router;