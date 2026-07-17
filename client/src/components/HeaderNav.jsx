import React from "react";
import "../components/HeaderNav.css"

const HeaderNav = () => {
    return (
        <header className="header">
            <div className="logo-container">
                <span className="logo-icon">📚</span>
                <h1 className="logo-text">MediaVault</h1>
            </div>

            <nav className="nav-bar">
                <button className="nav-button">Home</button>
                <button className="nav-button">Shelf</button>
                <button className="nav-button">Profile</button>
                <button className="nav-button">Logout</button>
            </nav>
        </header>
    );
};

export default HeaderNav;