const express= require('express');
const router= express.Router();

const adminController=require('../controllers/admin-controller');

const  verifyToken  = require('../middleware/verifyToken');
const authorizeRoles = require('../middleware/authorizeRoles');

router.route("/allUsers")
    .get(verifyToken,adminController.getAllUsers)
router.route("/user/:userId/activate")
.patch(verifyToken,adminController.updateUserActivation)
router.route("/user/:userId/balance")
    .patch(verifyToken,adminController.updateUserBalance)
router.route("/user/:userId/delete")
    .delete(verifyToken,adminController.deleteUser)
router.route("/register")
    .post(adminController.register)
router.route("/login")
    .post(adminController.login)

module.exports = router;