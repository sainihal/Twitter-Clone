import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Redirect, Link } from "react-router-dom";
import { login } from "../Redux/actions";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isAuth = useSelector((state) => state.app.isAuth);
  const loginError = useSelector((state) => state.app.loginError);
  const login_message = useSelector((state) => state.app.login_message);
  const userData = useSelector((state) => state.app.userData);
  const user_id = userData && userData.user_id;
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password: password }));
  };

  if (isAuth) {
    return <Redirect to={`/mainPage/${user_id}`} />;
  }
  return (
    <>
      <h1 style={{ textAlign: "center", color: "black", marginTop: 50 }}>
        Login To Application
      </h1>
      <form
        onSubmit={handleSubmit}
        style={{
          width: 400,
          margin: "auto",
          marginTop: 100,
          border: "1px solid lightgray",
          padding: 100,
        }}
      >
        <div class="form-group">
          <label for="exampleInputEmail1">Email</label>
          <input
            type="email"
            class="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </div>
        <div class="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input
            type="password"
            class="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </div>
        <button type="submit" class="btn btn-primary">
          Submit
        </button>
        <p>{loginError && login_message}</p>
        <small
          id="help"
          class="form-text text-muted"
          style={{ fontSize: 15, textDecoration: "none" }}
        >
          not registered?<Link to="/register">Register </Link>
        </small>
      </form>
    </>
  );
}
