import React from "react";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerStyle = {
        backgroundColor: "#e5b80b",
        color: "#000000",
        padding: "10px",
        fontFamily: "sans-serif",
        width: "100%",
        boxSizing: "border-box",
        textAlign: "center",
        position: "fixed",
        bottom: 0,
        left: 0,
        zIndex: 1000
    };

    return (
        <footer style={footerStyle}>
                <p>CSE 499 Senior Project - Team 4 ©️{currentYear}</p>

        </footer>
    );
};

export default Footer;

