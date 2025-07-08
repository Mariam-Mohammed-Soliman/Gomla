const express = require("express");
const router = express.Router();

const{body,validationResult}=require('express-validator');

const upload = require("../middleware/uploadImg"); // middleware for image upload
const verifyToken = require("../middleware/verifyToken");
const authorizeRoles = require("../middleware/authorizeRoles");

const {
  sendMessage,
  getAllMessagesForUser,
} = require("../controllers/messages-controller");

const broadcastValidation = [
  body("title")
    .notEmpty().withMessage("Title is required").isString().withMessage("Title must be a string"),

  body("content")
    .notEmpty().withMessage("Content is required").isString().withMessage("Content must be a string"),

  // body("image")
  //   .isString().withMessage("Image path must be a string"),
];

router
.post("/broadcast",verifyToken,authorizeRoles("admin"),upload.single("image"),broadcastValidation,sendMessage);

router
.get("/broadcast",verifyToken,authorizeRoles("user"),getAllMessagesForUser);

module.exports = router;
