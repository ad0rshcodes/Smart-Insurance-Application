import React from "react";
import { Link } from "react-router-dom";
import "../styles/SignUp.css";

function SignUp() {
  return (
    <div className="signup-container">
      <div className="content">
        <h1 className="signup-title">Sign Up</h1>
        <form className="signup-form">
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="Full Name"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              className="form-input"
              placeholder="Email Address"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-input"
              placeholder="Password"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="XRP Wallet Address"
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-input"
              placeholder="XRP Wallet Secret Key"
              required
            />
          </div>
          <Link to="/catalog">
            <button className="signup-btn" type="submit">
              Sign Up
            </button>
          </Link>
        </form>
        <p className="login-link">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default SignUp;
