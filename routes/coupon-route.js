const express= require('express');
const router= express.Router();


const orderController=require('../controllers/order-controller');
const verifyToken  = require('../middleware/verifyToken');
const authorizeRoles = require('../middleware/authorizeRoles');


    //categories
router.route("/")
    .get(verifyToken,authorizeRoles("admin"),orderController.getAllOrders)
    .post(verifyToken,orderController.createOrder);

router.route("/:orderId")
    .patch(verifyToken,authorizeRoles("admin"),orderController.updateOrder)
    .delete(verifyToken,authorizeRoles("admin"),orderController.updateOrder)


module.exports = router;