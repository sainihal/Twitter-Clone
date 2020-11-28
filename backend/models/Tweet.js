const mongoose = require("mongoose");

const tweetSchema = new mongoose.Schema({
  tweet_id: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
  user_name: {
    type: String,
    required: true,
  },
  replies: {
    type: Array,
  },
  likes: {
    type: Array,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  message: {
    type: String,
    maxlength: 280,
    minlength: 1,
  },
  retweets: {
    type: Array,
  },
});

module.exports = mongoose.model("Tweet", tweetSchema);
