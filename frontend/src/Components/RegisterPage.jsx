import { React, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { register } from "../Redux/actions";

export default function RegisterPage(props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const isAuth = useSelector((state) => state.app.isAuth);
  const registerError = useSelector((state) => state.app.registerError);
  const register_message = useSelector((state) => state.app.register_message);
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(register({ user_name: name, email, password }));
  };
  return (
    <>
      <h1 style={{ textAlign: "center", color: "black", marginTop: 50 }}>
        Create New Account
      </h1>
      <form
        onSubmit={handleSubmit}
        style={{
          width: 400,
          margin: "auto",
          marginTop: 50,
          border: "1px solid lightgray",
          padding: 100,
        }}
      >
        <div className="form-group">
          <label for="exampleInputName1">User Name</label>
          <input
            type="text"
            className="form-control"
            id="exampleInputName1"
            placeholder="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            required
          />
        </div>
        <div className="form-group">
          <label for="exampleInputEmail1">Email</label>
          <input
            type="email"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            placeholder="Enter email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            required
          />
        </div>
        <div className="form-group">
          <label for="exampleInputPassword1">Password</label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
        <p>{registerError && register_message}</p>
        <p>{!registerError && register_message}</p>
        <small
          id="help"
          className="form-text text-muted"
          style={{ fontSize: 15, textDecoration: "none" }}
        >
          already registered?<Link to="/login">login </Link>
        </small>
      </form>
    </>
  );
}
