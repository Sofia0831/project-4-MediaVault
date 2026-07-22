import React, { useState } from "react";
import "./Auth.css"; 

const AuthPage = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(); // to simulate successful authentication
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <p className="auth-eyebrow">MediaVault</p>
        <h2>{isRegistering ? "Create Account" : "Welcome Back"}</h2>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {isRegistering && (
            <div className="form-group">
              <label>Username</label>
              <input type="text" placeholder="Choose a username" required />
            </div>
          )}
          
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="Enter your email" required />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter your password" required />
          </div>

          <button type="submit" className="auth-submit-btn">
            {isRegistering ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <p className="auth-toggle-text">
          {isRegistering ? "Already have an account? " : "New to MediaVault? "}
          <button 
            type="button" 
            className="auth-toggle-btn" 
            onClick={() => setIsRegistering(!isRegistering)}
          >
            {isRegistering ? "Sign In" : "Register here"}
          </button>
        </p>
      </div>
    </main>
  );
};

export default AuthPage;