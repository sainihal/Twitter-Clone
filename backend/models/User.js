const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  user_id: {
    type: String,
    unique: true,
  },
  user_name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  joined: {
    type: Date,
    default: Date.now,
  },
  followers: {
    type: Array,
  },
  following: {
    type: Array,
  },
  tweets: {
    type: Array,
  },
  email: {
    type: String,
    unique: true,
  },
});

module.exports = mongoose.model("User", userSchema);
