import React from 'react';
import { Link, NavLink } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact Us' },
];

export default function Navbar() {
  return (
    <header className="w-full sticky top-0 z-40">
      {/* Logo and links on a single line — no hamburger */}
      <nav className="bg-navy px-3 sm:px-6 py-2.5 flex flex-nowrap items-center justify-between gap-x-2">
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

        {/* Nav links - single line, right-aligned */}
        <ul className="flex flex-nowrap items-center gap-x-3 sm:gap-x-6 lg:gap-x-8 text-xs sm:text-sm lg:text-base">
          {navLinks.map(link => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `whitespace-nowrap ${
                    isActive
                      ? 'text-lime font-bold'
                      : 'text-white hover:text-lime transition'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
