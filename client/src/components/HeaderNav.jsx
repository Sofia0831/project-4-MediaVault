import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import mediaVaultLogoSmall from "../assets/Logo_MV-138.webp";
import mediaVaultLogo from "../assets/Logo_MV.webp";
import "../components/HeaderNav.css";

const HeaderNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, logout } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  const navProps = (path) => ({
    className: `nav-button${location.pathname === path ? " active" : ""}`,
    "aria-current": location.pathname === path ? "page" : undefined,
  });

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
        <img
          className="logo-img"
          src={mediaVaultLogo}
          srcSet={`${mediaVaultLogoSmall} 138w, ${mediaVaultLogo} 276w`}
          sizes="(max-width: 800px) 200px, 276px"
          alt="MediaVault Home"
          width="276"
          height="100"
          loading="eager"
          fetchPriority="high"
        />
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
              {...navProps("/dashboard")}
              onClick={() => handleNavigate("/dashboard")}
            >
              Home
            </button>
            <button
              {...navProps("/shelf")}
              onClick={() => handleNavigate("/shelf")}
            >
              Shelf
            </button>
            <button {...navProps("/movies")} onClick={() => handleNavigate("/movies")}>Movies</button>
            <button {...navProps("/books")} onClick={() => handleNavigate("/books")}>Books</button>
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
