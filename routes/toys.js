const express = require("express");
const router = express.Router();
const { ToyModel, validateToyModel } = require("../models/toyModel.js");
const { userAuth } = require("../middlewares/userAuth.js");

//GetAllToys
router.get("/", async (req, res) => {
  let page = req.query.page || 1;

  try {
    let toysList = await ToyModel.find({})
      .limit(10)
      .skip((page - 1) * 10);

    res.json(toysList);
  } catch (err) {
    res.status(500).json({ err_msg: "Something wrong happened, try again later..." });
  }
});

//GetBySearch
router.get("/search", async (req, res) => {
  let page = req.query.page || 1;
  let searchWord = req.query.s;

  let regexSearchWord = new RegExp(searchWord, "i");

  try {
    let toysList = await ToyModel.find({ $or: [{ name: regexSearchWord }, { info: regexSearchWord }] })
      .limit(10)
      .skip((page - 1) * 10);

    res.json(toysList);
  } catch (err) {
    res.status(500).json({ err_msg: "Something wrong happened, try again later..." });
  }
});

//GetByCatName
router.get("/cat/:catName", async (req, res) => {
  let page = req.query.page || 1;
  let categoryName = req.params.catName;

  try {
    let toysList = await ToyModel.find({ category: categoryName })
      .limit(10)
      .skip((page - 1) * 10);

    res.json(toysList);
  } catch (err) {
    res.status(500).json({ err_msg: "Something wrong happened, try again later..." });
  }
});

//GetByPriceRange
router.get("/prices", async (req, res) => {
  let page = req.query.page || 1;
  let minPrice = req.query.min;
  let maxPrice = req.query.max;

  try {
    let toysList = await ToyModel.find({ $and: [{ price: { $lte: maxPrice } }, { price: { $gte: minPrice } }] })
      .limit(10)
      .skip((page - 1) * 10);

    res.json(toysList);
  } catch (err) {
    res.status(500).json({ err_msg: "Something wrong happened, try again later..." });
  }
});

//AddToy
router.post("/", userAuth, async (req, res) => {
  let validateRes = validateToyModel(req.body);

  if (validateRes.error) {
    return res.status(401).json({ error: validateRes.error.message });
  }

  try {
    let newToy = new ToyModel(req.body);
    newToy.userId = req.decodedToken._id;
    await newToy.save();

    res.status(201).json(newToy);
  } catch (err) {
    res.status(500).json({ err_msg: "Something wrong happened, try again later..." });
  }
});

//EditToyById
router.put("/:id", userAuth, async (req, res) => {
  let validateRes = validateToyModel(req.body);

  if (validateRes.error) {
    return res.status(401).json({ error: validateRes.error.message });
  }

  try {
    let toyId = req.params.id;

    let updateRes = await ToyModel.updateOne({ _id: toyId, userId: req.decodedToken._id }, req.body);
    res.json(updateRes);
  } catch (err) {
    res.status(500).json({ err_msg: "Something wrong happened, try again later..." });
  }
});

//DeleteToyById
router.delete("/:id", userAuth, async (req, res) => {
  try {
    let toyId = req.params.id;

    let updateRes = await ToyModel.deleteOne({ _id: toyId, userId: req.decodedToken._id });
    res.json(updateRes);
  } catch (err) {
    res.status(500).json({ err_msg: "Something wrong happened, try again later..." });
  }
});

module.exports = router;
