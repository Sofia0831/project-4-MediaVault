import React from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

const LoginPage = ({ onLogin }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(); // to simulate login 
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <p className="auth-eyebrow">MediaVault</p>
        <h2>Welcome Back</h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="Enter your email" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" required />
          </div>

          <button type="submit" className="auth-submit-btn">
            Sign In
          </button>
        </form>

        <p className="auth-toggle-text">
          New to MediaVault?{" "}
          <Link to="/register" className="auth-toggle-btn">
            Register here
          </Link>
        </p>
      </div>
    </main>
  );
};

export default LoginPage;