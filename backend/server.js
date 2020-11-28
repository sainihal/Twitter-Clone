const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const app = express();
app.use(express.json());
app.use(cors());
dotenv.config();

mongoose.connect(
  process.env.ATLAS_URI,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },
  () => {
    console.log("The database is up and running");
  }
);

const authRoute = require("./routes/auth");
const tweetRoute = require("./routes/tweet");
const profileRoute = require("./routes/user");

app.use("/api/user", authRoute);
app.use("/api/tweet", tweetRoute);
app.use("/api/profile", profileRoute);

app.listen(process.env.PORT || 6005, () => {
  console.log(`The server is running on port ${process.env.PORT || "6005"}`);
});
