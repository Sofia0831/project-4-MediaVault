import React from "react";
import "../App.css";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <main className="landing-page">
      <section className="hero-card" aria-labelledby="page-title">
        <p className="eyebrow">MediaVault</p>
        <h1 id="page-title">Hello World</h1>
        <p className="intro">
          Welcome to MediaVault, a simple place to organize and manage your
          media collection.
        </p>
        
        <button className="action-btn" onClick={() => navigate("/login")}>
          Get Started
        </button>
      </section>
    </main>
  );
};

export default LandingPage;