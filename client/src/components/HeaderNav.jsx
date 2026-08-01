import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import mediaVaultLogo from "../assets/Logo_MV.png";
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
      <Link
        className="logo-link"
        to={isLoggedIn ? "/dashboard" : "/"}
        aria-label="MediaVault Home"
        onClick={() => setIsOpen(false)}
      >
        <img className="logo-img" src={mediaVaultLogo} alt="MediaVault Home" />
      </Link>

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
            <button className="nav-button" onClick={() => handleNavigate("/movies")}>Movies</button>
            <button className="nav-button" onClick={() => handleNavigate("/books")}>Books</button>
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
