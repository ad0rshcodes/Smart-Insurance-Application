import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home-container">
      <div className="content">
        <div className="text-container">
          <h1 className="main-heading">Welcome to CryptoInsure</h1>
          <p className="sub-text">
            Your one-stop solution for decentralized insurance products.
          </p>
        </div>
        <div className="navigation-links">
          <Link to="/signup" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
