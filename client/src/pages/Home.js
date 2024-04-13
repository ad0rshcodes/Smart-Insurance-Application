import React from "react";
import { Link } from "react-router-dom";
import "../styles/Home.css";

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to Smart Insurance Platform</h1>
      <p>Your one-stop solution for decentralized insurance products.</p>
      <div className="navigation-links">
        <Link to="/signup">Sign Up</Link>
      </div>
    </div>
  );
}

export default Home;
