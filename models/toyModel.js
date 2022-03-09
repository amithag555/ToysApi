const mongoose = require("mongoose");
const joi = require("joi");

let toySchema = new mongoose.Schema({
  name: String,
  info: String,
  price: Number,
  category: String,
  imgUrl: String,
  userId: String,
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
});

exports.ToyModel = mongoose.model("toys", toySchema);

exports.validateToyModel = (_newToy) => {
  let joiSchema = joi.object({
    name: joi.string().min(2).max(100).required(),
    info: joi.string().min(2).required(),
    price: joi.number().required(),
    category: joi.string().min(2).required(),
    imgUrl: joi.string().min(2).allow(null, ""),
  });

  return joiSchema.validate(_newToy);
};
