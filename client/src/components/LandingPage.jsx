import React from "react";
import "../App.css";

const LandingPage = ({ onLogin }) => {
  return (
    <main className="landing-page">
      <section className="hero-card" aria-labelledby="page-title">
        <p className="eyebrow">MediaVault</p>
        <h1 id="page-title">Hello World</h1>
        <p className="intro">
          Welcome to MediaVault, a simple place to organize and manage your
          media collection.
        </p>
        
        <button className="action-btn" onClick={onLogin}>
          Sign In
        </button>
      </section>
    </main>
  );
};

export default LandingPage;