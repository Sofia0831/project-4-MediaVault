import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "../components/HeaderNav.css";

const HeaderNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="header">
      <div className="logo-container">
        <span className="logo-icon">
          <img className="logo-img" src="/logo.png" alt="MediaVault logo" />
        </span>
        <h1 className="logo-text">MediaVault</h1>
      </div>

      {isLoggedIn && (
        <>
          <button
            className={`hamburger ${isOpen ? "open" : ""}`}
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
          >
            <span className="line"></span>
            <span className="line"></span>
            <span className="line"></span>
          </button>

          <nav className={`nav-bar ${isOpen ? "show" : ""}`}>
            <button
              className="nav-button"
              onClick={() => handleNavigate("/dashboard")}
            >
              Home
            </button>
            <button
              className="nav-button"
              onClick={() => handleNavigate("/shelf")}
            >
              Shelf
            </button>
            <button className="nav-button">Profile</button>
            <button className="nav-button" onClick={handleLogout}>
              Logout
            </button>
          </nav>
        </>
      )}
    </header>
  );
};

export default HeaderNav;
