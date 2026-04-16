import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import NetwellsLogo from './NetwellsLogo';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/reviews', label: 'Reviews' },
  { to: '/blog', label: 'Blog' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="w-full sticky top-0 z-40">
      <div className="bg-gradient-to-r from-lime via-lime to-yellow-300 text-navy text-center py-3 px-4 text-base font-bold shadow-lg tracking-wide">
        <span className="inline-block animate-pulse mr-2"></span>
        Fiber's Here – Get Connected Today + Save Big
      </div>
      <nav className="bg-navy px-6 py-4 flex items-center justify-between lg:justify-center lg:gap-12">
        {/* Logo - Left */}
        <Link to="/" className="flex-shrink-0 hover:opacity-80 transition">
          <NetwellsLogo size="medium" variant="full" theme="dark" imageSrc="/assets/logo.png" />
        </Link>

        {/* Mobile Me nu Button */}
        <button
          className="lg:hidden text-white text-2xl flex flex-col gap-1"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
          <span className="block w-6 h-0.5 bg-white"></span>
        </button>

        {/* Desktop Nav - Center */}
        <ul className="hidden lg:flex gap-8 items-center flex-1 justify-center">
          {navLinks.map(link => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  isActive
                    ? 'text-lime font-bold'
                    : 'text-white hover:text-lime transition'
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Contact Us - Right (Desktop Only) */}
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `hidden lg:block ${
              isActive
                ? 'text-lime font-bold'
                : 'text-white hover:text-lime transition'
            }`
          }
        >
          Contact Us
        </NavLink>
      </nav>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="lg:hidden bg-navy border-t border-navy/20 px-6 py-4 flex flex-col gap-3">
          {navLinks.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block py-2 ${
                  isActive
                    ? 'text-lime font-bold'
                    : 'text-white hover:text-lime transition'
                }`
              }
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `block py-2 ${
                isActive
                  ? 'text-lime font-bold'
                  : 'text-white hover:text-lime transition'
              }`
            }
            onClick={() => setMenuOpen(false)}
          >
            Contact Us
          </NavLink>
        </div>
      )}
    </header>
  );
}
