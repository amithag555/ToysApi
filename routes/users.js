const express = require("express");
const router = express.Router();
const { generateToken, validateUserModel, validateLoginModel, UserModel } = require("../models/userModel.js");
const bcrypt = require("bcrypt");

router.get("/", (req, res) => {
  res.json({ msg: "Users work" });
});

//AddUser
router.post("/signUp", async (req, res) => {
  let validateRes = validateUserModel(req.body);

  if (validateRes.error) {
    return res.status(401).json({ err_msg: validateRes.error.message });
  }

  try {
    let newUser = new UserModel(req.body);
    newUser.password = await bcrypt.hash(newUser.password, 10);
    await newUser.save();

    newUser.password = "********";
    res.status(201).json(newUser);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ err_msg: "Email already exist" });
    }

    res.status(500).json(err.message);
  }
});

//Login
router.post("/login", async (req, res) => {
  let validateRes = validateLoginModel(req.body);

  if (validateRes.error) {
    return res.status(401).json({ err_msg: validateRes.error.message });
  }

  try {
    let foundUser = await UserModel.findOne({ email: req.body.email });

    if (!foundUser) {
      return res.status(404).json({ err_msg: "Incorrect username or password" });
    }

    let bcryptRes = await bcrypt.compare(req.body.password, foundUser.password);

    if (!bcryptRes) {
      return res.status(401).json({ err_msg: "Incorrect username or password" });
    }

    let token = generateToken(foundUser._id, foundUser.role);
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json(err.message);
  }
});

module.exports = router;
