const express = require("express");
require("dotenv").config();
const { v4: uuidV4 } = require("uuid");
const authenticateToken = require("../middlewares/jwtAuthentication");
const Tweet = require("../models/Tweet");
const User = require("../models/User");

const router = express.Router();

router.post("/addTweet", authenticateToken, async (req, res) => {
  const { user_id, user_name } = req.user;
  const { message } = req.body;
  try {
    const new_tweet = new Tweet({
      user_id: user_id,
      user_name: user_name,
      tweet_id: uuidV4(),
      message: message,
    });
    const user = await User.findOne({ user_id: user_id });
    const saved_tweet = await new_tweet.save();
    user.tweets = [saved_tweet.tweet_id, ...user.tweets];
    await user.save();
    res.status(200).json({
      error: false,
      message: "Tweeted Successfully",
      data: saved_tweet,
    });
  } catch (err) {
    res.status(400).json({ error: true, message: err });
  }
});

router.delete("/deleteTweet/:id", authenticateToken, async (req, res) => {
  const { user_id } = req.user;
  const id = req.params.id;
  const tweet_to_delete = await Tweet.findOne({ _id: id });
  console.log(" in delete ", tweet_to_delete);
  if (tweet_to_delete.user_id !== user_id) {
    return res
      .status(400)
      .json({ error: true, message: "Cannot delete other users tweets" });
  }
  await Tweet.findByIdAndDelete({ _id: id })
    .then((response) => {
      return res
        .status(200)
        .json({ error: false, message: "tweet deleted successfully" });
    })
    .catch((err) => {
      console.log(err);
    });
});

//needs to be modifiedm with aggregates, pagination
router.get("/getHomeTweets", authenticateToken, async (req, res) => {
  const { user_id } = req.user;
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  try {
    const homeTweets = await User.aggregate([
      { $match: { user_id: user_id } },
      {
        $lookup: {
          from: "tweets",
          localField: "following",
          foreignField: "user_id",
          as: "homeTweets",
        },
      },
    ]);
    return res.status(200).json({ error: false, data: homeTweets });
  } catch (err) {
    res.status(400).json({ error: true, message: err });
  }
  // // , { '$facet'    : {
  //     metadata: [ { $count: "total" }, { $addFields: { page: page } } ],
  //     data: [ { $skip: 1 }, { $limit: 5 } ]
  // } }
});
//needs to be modified with aggregates,pagination
router.get("/getProfileTweets", authenticateToken, async (req, res) => {
  const { user_id } = req.user;
  try {
    const profile_tweets = await Tweet.find({ user_id: user_id });
    return res.status(200).json({ error: false, data: profile_tweets });
  } catch (err) {
    return res.status(400).json({
      error: true,
      message: "error in getting profile tweets please try again",
    });
  }
});
//needs to be modified with aggregates
router.get("/getTweet/:id", authenticateToken, async (req, res) => {
  const { user_id } = req.user;
  const tweet_id = req.params.id;
  try {
    // const tweet = await Tweet.findOne({ tweet_id});
    const profile_tweets = await Tweet.aggregate([
      { $match: { tweet_id: tweet_id } },
      {
        $lookup: {
          from: "tweets",
          localField: "replies",
          foreignField: "tweet_id",
          as: "replies",
        },
      },
      { $limit: 2 },
    ]);
    return res.status(200).json({ error: false, data: profile_tweets });
  } catch (err) {
    return res.status(400).json({ error: true, message: err });
  }
});

router.post("/replyToTweet/:id", authenticateToken, async (req, res) => {
  const { user_id, user_name } = req.user;
  const tweet_id = req.params.id;
  const { message } = req.body;
  try {
    const old_tweet = await Tweet.findOne({ tweet_id });
    const new_tweet = new Tweet({
      user_id,
      user_name,
      tweet_id: uuidV4(),
      message,
    });
    const saved_tweet = await new_tweet.save();
    old_tweet.replies = [...old_tweet.replies, saved_tweet.tweet_id];
    const updated_old_tweet = await old_tweet.save();
    return res.status(200).json({ error: false, data: updated_old_tweet });
  } catch (err) {
    return res.status(400).json({ error: true, message: err });
  }
});

module.exports = router;
