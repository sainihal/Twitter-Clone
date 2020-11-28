const express = require("express");
require("dotenv").config();
const authenticateToken = require("../middlewares/jwtAuthentication");
const User = require("../models/User");

const router = express.Router();

router.get("/toBeFollowed", authenticateToken, async (req, res) => {
  try {
    const { user_id } = req.user;
    const userData = await User.findOne({ user_id: user_id });
    const userFollowing = userData.following;
    const totalUsers = await User.find({}, { user_id: 1, user_name: 1 });
    const obj = {};
    obj[user_id] = 1;
    userFollowing.map((ele) => {
      obj[ele] = 1;
    });
    const canBeFollowed = totalUsers.filter((ele) => obj[ele.user_id] !== 1);
    res.status(200).json({ error: false, data: canBeFollowed });
  } catch (err) {
    return res.status(400).json({
      error: false,
      message: "some thing went wrong please try again",
    });
  }
});

router.post("/addFollowing", authenticateToken, async (req, res) => {
  const { user_id } = req.user;
  const { following_id } = req.body;
  try {
    const user = await User.findOne({ user_id: user_id });
    user.following = [...user.following, following_id];
    const updatedUser = await user.save();
    const followingUser = await User.findOne({ user_id: following_id });
    followingUser.followers = [...followingUser.followers, user_id];
    await followingUser.save();
    res.status(200).json({
      error: false,
      message: "Followed Successfully",
      data: updatedUser,
    });
  } catch (err) {
    res.status(400).json({ error: true, message: err });
  }
});
router.get("/getFollowing", authenticateToken, async (req, res) => {
  const { user_id } = req.user;
  const following = await User.aggregate([
    { $match: { user_id: user_id } },
    {
      $lookup: {
        from: "users",
        localField: "following",
        foreignField: "user_id",
        as: "following",
      },
    },
  ]);
  res.status(200).json({ error: false, data: following, message: "following" });
});

//needs to be modifiedm with aggregates, pagination
router.get("/getFollowers", authenticateToken, async (req, res) => {
  const { user_id } = req.user;
  const followers = await User.aggregate([
    { $match: { user_id: user_id } },
    {
      $lookup: {
        from: "users",
        localField: "followers",
        foreignField: "user_id",
        as: "followers",
      },
    },
  ]);
  res.status(200).json({ error: false, data: followers, message: "followers" });
});

module.exports = router;
