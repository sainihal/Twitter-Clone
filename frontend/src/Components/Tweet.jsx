import Axios from "axios";
import React from "react";
import axios from "axios";
import { useSelector } from "react-redux";

export default function Tweet(props) {
  const { _id, user_id, tweet_id, message, created, user_name } = props;
  const likesCount = props.likes.length;
  const retweetsCount = props.retweets.length;
  const repliesCount = props.replies.length;
  const accessToken = useSelector((state) => state.app.accessToken);
  async function handleClick(e) {
    alert("deleting " + tweet_id);
    e.preventDefault();
    await axios
      .delete(`http://localhost:6005/api/tweet/deleteTweet/${_id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((res) => {
        if (res.status == 200) {
          props.updateTweets();
        } else {
          console.log("error  in delete", res);
        }
      })
      .catch((err) => {
        alert(err.response.data.message);
      });
  }

  return (
    <>
      <div
        style={{
          border: "1px solid lightgray",
          display: "flex",
          alignItems: "center",
          margin: "5px",
        }}
      >
        <img
          src="https://abs.twimg.com/sticky/default_profile_images/default_profile_bigger.png"
          style={{ borderRadius: "40px", margin: 15 }}
          alt="userprofile pic"
        />
        <div>
          <div style={{ textAlign: "left" }}>
            <div
              style={{
                position: "relative",
                left: "580px",
                color: "gray",
                cursor: "pointer",
              }}
              onClick={handleClick}
            >
              <span style={{ fontSize: "18px" }}> x</span>
            </div>
            <span style={{ marginRight: 5, fontWeight: "bold" }}>
              {user_name}
            </span>
            <span style={{ marginRight: 5, color: "gray" }}>{user_id}</span>
            <span style={{ marginRight: 5, color: "gray" }}>.</span>
            <span style={{ marginRight: 5, color: "gray" }}>{created}</span>
            <div style={{ padding: 5 }}>{message}</div>
          </div>
          <div
            style={{
              width: "500px",
              display: "flex",
              justifyContent: "space-between",
              margin: "10px",
            }}
          >
            <span style={{ display: "flex", alignItems: "center" }}>
              <i
                class="far fa-comment"
                style={{ color: "gray", fontSize: 18 }}
              ></i>
              <span style={{ marginLeft: "5px", color: "gray" }}>
                {repliesCount}
              </span>
            </span>
            <span style={{ display: "flex", alignItems: "center" }}>
              <i
                class="fa fa-retweet"
                style={{ color: "gray", fontSize: 18 }}
              ></i>
              <span style={{ marginLeft: "5px", color: "gray" }}>
                {retweetsCount}
              </span>
            </span>
            <span style={{ display: "flex", alignItems: "center" }}>
              <i
                class="far fa-heart"
                style={{ color: "gray", fontSize: 18 }}
              ></i>
              <span style={{ marginLeft: "5px", color: "gray" }}>
                {likesCount}
              </span>
            </span>
            <span style={{ display: "flex", alignItems: "center" }}>
              <i
                class="fas fa-share"
                style={{ color: "gray", fontSize: 18 }}
              ></i>
              <span style={{ marginLeft: "5px", color: "gray" }}>count</span>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
