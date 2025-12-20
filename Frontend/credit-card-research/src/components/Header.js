import React from "react";
import "../styles/Header.css";

const Header = () => {
  return (
<header className="navbar">
  <div className="logo">
    <span className="logo-primary">Cred</span><span className="logo-secondary">Go</span>
  </div>
  <nav className="nav-links">
    <a href="/">Home</a>
    <a href="/reviews">Reviews</a>
    <a href="/about">About</a>
  </nav>
</header>

  );
};

export default Header;
