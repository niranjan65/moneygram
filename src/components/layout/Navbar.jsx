import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import mhlogo from "../../assets/mhlogo.png"; // adjust path if needed

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const session = JSON.parse(localStorage.getItem("erpnext_session"));
  const isLoggedIn = session && session.sessionActive;

  const isLoginPage = location.pathname === "/";

  const handleLogout = () => {
    localStorage.removeItem("erpnext_session");
    window.location.href = "/";
  };

  const navItems = [
    { label: "Money Transfer", href: "/money-transfer" },
    { label: "Currency Exchange", href: "/exchange" },
    { label: "Contact Us", href: "/contact-us" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md px-6 lg:px-10 py-3 dark:bg-background-dark/90 dark:border-white/10 transition-all">
      <div className="flex items-center justify-between">

        {/* Logo */}
        <Link
          to={isLoggedIn ? "/home" : "/"}
          className="flex items-center gap-3"
        >
          <img
            src={mhlogo}
            alt="MH Logo"
            className="h-10 w-auto object-contain"
          />
          {/* <h2 className="text-xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            MoneyGram
          </h2> */}
        </Link>

        {/* Hide nav on login page */}
        {!isLoginPage && isLoggedIn && (
          <>
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  className="text-gray-700 dark:text-gray-200 text-sm font-semibold hover:text-primary transition-colors"
                >
                  {item.label}
                </Link>
              ))}

              <button
                onClick={handleLogout}
                className="text-sm font-semibold text-red-500 hover:text-red-600 transition"
              >
                Logout
              </button>
            </div>

            {/* Mobile Toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-gray-800 dark:text-white"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </>
        )}
      </div>

      {/* Mobile Dropdown */}
      {!isLoginPage && isLoggedIn && (
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            menuOpen ? "max-h-96 mt-4 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="space-y-4 bg-white dark:bg-background-dark px-4 py-4 rounded-xl shadow-lg">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setMenuOpen(false)}
                className="block text-gray-700 dark:text-gray-200 text-sm font-semibold hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}

            <button
              onClick={handleLogout}
              className="block text-red-500 font-semibold text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
