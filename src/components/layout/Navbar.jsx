import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container navbar-inner">

        {/* LOGO */}
        <h3 className="logo">MoneyGram</h3>

        {/* DESKTOP NAV */}
        <div className="nav-links">
          <a href="#">Money Transfer</a>
          <a href="#">Exchange Currency</a>
          <a href="#">Resources</a>
          <a href="#">Login</a>
          <button className="btn-primary small">Register</button>
        </div>

        {/* MOBILE HAMBURGER */}
        <div 
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="mobile-menu">
          <a href="#">Money Transfer</a>
          <a href="#">Exchange Currency</a>
          <a href="#">Resources</a>
          <a href="#">Login</a>
          <button className="btn-primary small">Register</button>
        </div>
      )}
    </nav>
  );
}
