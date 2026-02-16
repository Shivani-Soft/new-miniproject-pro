import React, { useState } from "react";
import "./Login.css";

function Login({ changeTab }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Login Successful!");
  };

  return (
    <div className="login-container">
      <form className="login-box" onSubmit={handleSubmit}>
        <h2>Login</h2>
        <img
          src="https://cdn-icons-png.freepik.com/512/4661/4661334.png"
          alt="image not found"
          className="login_image"
        />
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>

        <p className="signup-text">
          Don't have an account?{" "}
          <a
            href="#"
            onClick={() => {
              changeTab("Signup");
            }}
          >
            Sign up
          </a>
        </p>
      </form>
    </div>
  );
}

export default Login;
