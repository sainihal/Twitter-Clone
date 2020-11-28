import React, { useEffect, useState } from "react";
import { Link, Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Redux/actions";
import axios from "axios";
import Tweet from "./Tweet";
import FollowBox from "./FollowBox";

export default function Profile(props) {
  const isAuth = useSelector((state) => state.app.isAuth);
  const accessToken = useSelector((state) => state.app.accessToken);
  const [profileTweets, setProfileTweets] = useState([]);
  const userData = useSelector((state) => state.app.userData);
  const [message, setMessage] = useState("");
  const [usersToBeFollowed, setUsersToBeFollowed] = useState([]);
  const dispatch = useDispatch();

  useEffect(async () => {
    updateProfileTweets();
    updateUsersToBeFollowed();
  }, []);

  const handleAddTweet = async () => {
    await axios
      .post(
        `http://localhost:6005/api/tweet/addTweet`,
        { message: message },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          alert("Tweet Added Successfully");
          updateProfileTweets();
        } else {
          console.log("could not add the tweet");
        }
      })
      .catch((err) => {
        console.log("could not add the tweet successfully");
      });
  };
  const updateProfileTweets = async () => {
    await axios
      .get("http://localhost:6005/api/tweet/getProfileTweets", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        setProfileTweets([...res.data.data]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const updateUsersToBeFollowed = async () => {
    await axios
      .get("http://localhost:6005/api/profile/toBeFollowed", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((res) => {
        setUsersToBeFollowed(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const handleFollowUser = async (id) => {
    await axios
      .post(
        `http://localhost:6005/api/profile/addFollowing`,
        { following_id: id },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((res) => {
        if (res.status == 200) {
          alert("Followed Successfully");
          updateProfileTweets();
          updateUsersToBeFollowed();
        } else {
          console.log("could not follow the user");
        }
      })
      .catch((err) => {
        console.log("could not follow the user successfully");
      });
  };
  if (!isAuth) {
    <Redirect to={`/login`} />;
  }
  return (
    <>
      <h1>Profile</h1>
      <div style={{ display: "flex" }}>
        <div
          style={{
            width: "25%",
            border: "1px solid lightgray",
            height: "90vh",
            position: "fixed",
          }}
        >
          <Link to={`/mainPage/${userData.user_id}`}>
            {" "}
            <div className="nav" style={{ fontSize: 28, fontWeight: "bolder" }}>
              Home Page
            </div>
          </Link>
          <Link to={`/profilePage/${userData.user_id}`}>
            {" "}
            <div className="nav" style={{ fontSize: 28, fontWeight: "bolder" }}>
              Profile Page
            </div>
          </Link>
          <div
            className="nav"
            style={{ fontSize: 28, fontWeight: "bolder", cursor: "pointer" }}
            data-toggle="modal"
            data-target="#exampleModal2"
          >
            Add Tweet
          </div>
          <div
            className="nav"
            style={{ fontSize: 28, fontWeight: "bolder", cursor: "pointer" }}
            onClick={() => {
              dispatch(logout());
              props.history.push("/login");
            }}
          >
            Logout
          </div>
        </div>
        <div
          style={{
            width: "50%",
            border: "1px solid lightgray",
            height: "90vh",
            marginLeft: "25%",
          }}
        >
          {profileTweets &&
            profileTweets.map((ele) => (
              <Tweet {...ele} updateTweets={updateProfileTweets} />
            ))}
        </div>
        <div style={{ width: "25%", border: "1px solid lightgray" }}>
          <h3
            style={{
              color: "rgb(0, 172, 238)",
              marginTop: 15,
              fontWeight: "bold",
            }}
          >
            Users To Follow
          </h3>
          <div
            style={{
              width: "80%",
              height: "500px",
              margin: "auto",
              overflowY: "auto",
            }}
          >
            {usersToBeFollowed &&
              usersToBeFollowed.map((ele) => (
                <div>
                  <FollowBox {...ele} followUser={handleFollowUser} />
                </div>
              ))}
          </div>
        </div>
      </div>
      <div
        class="modal fade"
        id="exampleModal2"
        tabindex="-1"
        role="dialog"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">
                Add Tweet Message
              </h5>
              <button
                type="button"
                class="close"
                data-dismiss="modal"
                aria-label="Close"
              >
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <textarea
                class="form-control"
                aria-label="With textarea"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              ></textarea>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                class="btn btn-primary"
                onClick={handleAddTweet}
                data-dismiss="modal"
              >
                Save changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
