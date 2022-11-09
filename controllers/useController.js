const User = require("../models/userModel");
const catchAsync = require("../utils/catchasync");
const AppError = require("../utils/appError");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};
exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.find({ active: false });
  res.status(200).json({
    status: 200,
    data: users,
  });
});
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 500,
    message: "Route not defined! Please try after sometime",
  });
};
//Update current user
exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError("This route is not for update password.", 400));
  }
  //filter out unwanted field which not include in update user
  const filterBody = filterObj(req.body, "name", "email");
  const updateUser = await User.findByIdAndUpdate(req.user.id, filterBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "success",
    data: {
      user: updateUser,
    },
  });
});
//Delete self account
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: "success",
    data: null,
  });
});
