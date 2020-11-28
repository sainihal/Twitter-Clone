import React from "react";

export default function FollowBox(props) {
  return (
    <>
      <div
        style={{
          height: 50,
          width: 250,
          margin: "auto",
          marginBottom: "25px",
          borderRadius: "25px",
          backgroundColor: "rgb(0, 172, 238)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
        onClick={() => {
          props.followUser(props.user_id);
        }}
      >
        <span>{props.user_name}</span>
      </div>
    </>
  );
}
