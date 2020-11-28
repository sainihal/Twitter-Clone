const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");
require("dotenv").config();
const User = require("../models/User");
const { v4: uuidV4 } = require("uuid");

const router = express.Router();

router.post("/register", async (req, res, next) => {
  const { error } = registerValidation(req.body);
  if (error) {
    res.status(400).json({ error: true, message: error.details[0].message });
    return;
  }
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) {
    return res
      .status(400)
      .json({ error: true, message: "Email already exists in database" });
  }
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(
      req.body.password,
      await bcrypt.genSalt(10)
    );
  } catch (err) {
    res.status(500).json({
      error: true,
      message: "something went wrong, try again after some time",
    });
    return;
  }

  const user_data = new User({
    user_id: req.body.user_name.slice(0, 4) + uuidV4().slice(0, 5),
    user_name: req.body.user_name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const savedUser = await user_data.save();
    const user_id = savedUser.user_id;
    const user_name = savedUser.user_name;
    const user = {
      user_id,
    };
    const accessToken = jwt.sign(user, process.env.SECRET_KEY_TO_ACCESS);
    return res.status(200).json({
      error: false,
      data: { userData: savedUser, accessToken: accessToken },
      message: "Register Successful",
    });
  } catch (err) {
    res.status(400).json({ error: true, message: err });
  }
});

router.post("/login", async (req, res, next) => {
  const { error } = loginValidation(req.body);
  if (error) {
    return res
      .status(400)
      .json({ error: true, message: error.details[0].message });
  }
  const userData = await User.findOne({ email: req.body.email });
  if (!userData) {
    return res.status(400).json({ error: true, message: "Email not exists" });
  }
  let validPass;
  try {
    validPass = await bcrypt.compare(req.body.password, userData.password);
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "Something went wrong, try again after some time",
    });
  }
  if (!validPass) {
    return res.status(400).json({ error: true, message: "incorrect password" });
  } else {
    const user_id = userData.user_id;
    const user_name = userData.user_name;
    const user = {
      user_id,
      user_name,
    };
    const accessToken = jwt.sign(user, process.env.SECRET_KEY_TO_ACCESS);
    return res.status(200).json({
      error: false,
      data: { accessToken, userData },
      message: "Login Successful",
    });
  }
});

module.exports = router;
