import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

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
      <nav className="bg-navy px-6 py-2.5 flex items-center justify-between">
        {/* Logo - Left */}
        <Link to="/" className="flex-shrink-0 hover:opacity-80 transition">
          <img
            src="/assets/logo.png"
            alt="Netwells Home Fibre"
            width="139"
            height="120"
            decoding="async"
            className="h-9 sm:h-10 lg:h-11 w-auto"
          />
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

        {/* Desktop Nav - Right */}
        <ul className="hidden lg:flex gap-8 items-center">
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
          <li>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                isActive
                  ? 'text-lime font-bold'
                  : 'text-white hover:text-lime transition'
              }
            >
              Contact Us
            </NavLink>
          </li>
          <li>
            <a
              href="/admin/"
              className="rounded-full border border-lime text-lime px-4 py-1.5 font-semibold hover:bg-lime hover:text-navy transition"
            >
              Staff Sign In
            </a>
          </li>
        </ul>
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
          <a
            href="/admin/"
            className="mt-2 inline-block w-max rounded-full border border-lime text-lime px-4 py-1.5 font-semibold hover:bg-lime hover:text-navy transition"
            onClick={() => setMenuOpen(false)}
          >
            Staff Sign In
          </a>
        </div>
      )}
    </header>
  );
}
