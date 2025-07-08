const Message = require("../models/messages-model");
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");


const sendMessage = asyncHandler(async (req, res, next) => {
  const { title, content } = req.body;
  const image = req.file ? req.file.path : "";

  console.log(title,content,image);

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, httpStatusText.FAIL);
    return next(error);
  }else{
    const newMessage = new Message({ title, content, image });
    console.log("newMessage",newMessage);

    await newMessage.save();
  
    res.status(201).json({
      status: "success",
      data: { message: newMessage },
    });
  }

});

const getAllMessagesForUser = asyncHandler(async (req, res, next) => {
  const messages = await Message.find().sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    data: { messages },
  });
});

module.exports = {
  sendMessage,
  getAllMessagesForUser,
};
