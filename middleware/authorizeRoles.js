const appError = require("../utils/appError");
const httpStatusText = require("../utils/httpStatusText");

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log("authorizeRoles=>",req.user.role);
    
    if (!roles.includes(req.user.role)) {
      const error = appError.create("Access Denied", 403, httpStatusText.FAIL);
      return next(error);
    }
    next();
  };
};

module.exports = authorizeRoles;
