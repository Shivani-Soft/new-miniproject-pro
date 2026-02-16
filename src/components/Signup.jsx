import React, { useState } from "react";
import "./signup.css";

function Signup({ changeTab }) {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    console.log("Signup Data:", formData);
  };

  return (
    <div className="signup-container">
      <form className="signup-box" onSubmit={handleSubmit}>
        <div className="heading">
          <img
            src="https://cdn-icons-png.flaticon.com/512/9635/9635511.png"
            alt="image not found"
            className="image"
          />
          <h2>Create Account</h2>
        </div>

        <input
          type="text"
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          onChange={handleChange}
          required
        />

        <button type="submit">Sign Up</button>

        <p className="link">
          Already have an account?{" "}
          <a
            href="#"
            onClick={() => {
              changeTab("Login");
            }}
          >
            Login
          </a>
        </p>
      </form>
    </div>
  );
}

export default Signup;
