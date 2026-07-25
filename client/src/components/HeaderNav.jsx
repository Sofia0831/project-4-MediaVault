import React, {useState} from "react";
import "../components/HeaderNav.css";
import { useNavigate } from "react-router-dom";

const HeaderNav = ({isLoggedIn}) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const navigate = useNavigate();

    return (
        <header className="header">
            <div className="logo-container">
                <span className="logo-icon">📚</span>
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

                <nav className={`nav-bar ${isOpen ? "show": ""}`}>
                    <button className="nav-button" onClick={() => navigate("/dashboard")}>Home</button>
                    <button className="nav-button" onClick={() => navigate("/shelf")}>Shelf</button>
                    <button className="nav-button">Profile</button>
                    <button className="nav-button">Logout</button>
                </nav>
            </>
            )}
        </header>
    );
};

export default HeaderNav;