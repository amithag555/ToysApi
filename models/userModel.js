const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const joi = require("joi");

let userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    default: "user",
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
});

exports.UserModel = mongoose.model("users", userSchema);

exports.validateUserModel = (_newUser) => {
  let joiSchema = joi.object({
    name: joi.string().min(2).max(20).required(),
    email: joi.string().min(2).email().required(),
    password: joi.string().min(2).required(),
    role: joi.string().min(2).allow(null, ""),
  });

  return joiSchema.validate(_newUser);
};

exports.validateLoginModel = (_loginModel) => {
  let joiSchema = joi.object({
    email: joi.string().min(2).email().required(),
    password: joi.string().min(2).required(),
  });

  return joiSchema.validate(_loginModel);
};

exports.generateToken = (_userId, _userRole) => {
  let token = jwt.sign({ _id: _userId, role: _userRole }, "toysShop", { expiresIn: "60mins" });
  return token;
};
