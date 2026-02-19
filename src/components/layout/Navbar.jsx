import React, { useState } from "react";
import { Menu, X, Zap } from "lucide-react";
import { useLocation, Link } from "react-router-dom";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isLoginPage = location.pathname === "/";

  const navItems = [
    { label: "Money Transfer", href: "/money-transfer" },
    { label: "Currency Exchange", href: "/exchange" },
    { label: "Contact Us", href: "/home" },
    { label: "Log In", href: "/" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-md px-6 lg:px-10 py-3 dark:bg-background-dark/90 dark:border-white/10 transition-all">
      <div className="flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 text-gray-900 dark:text-white">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Zap size={24} />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">
            MoneyGram
          </h2>
        </Link>

        {/* Hide Everything If Login Page */}
        {!isLoginPage && (
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
      {!isLoginPage && (
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
          </div>
        </div>
      )}
    </header>
  );
}
