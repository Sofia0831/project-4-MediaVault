import React from "react";
import { Link } from "react-router-dom";
import "./Auth.css";

const RegisterPage = ({ onRegister }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onRegister(); // to simulate register immediately
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <p className="auth-eyebrow">MediaVault</p>
        <h2>Create Account</h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input type="text" placeholder="Choose a username" required />
          </div>
          
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="Enter your email" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" required />
          </div>

          <button type="submit" className="auth-submit-btn">
            Sign Up
          </button>
        </form>

        <p className="auth-toggle-text">
          Already have an account?{" "}
          <Link to="/login" className="auth-toggle-btn">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
};

export default RegisterPage;