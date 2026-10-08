import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

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
      <nav className="bg-white dark:bg-brand-gradient border-b border-navy/10 dark:border-white/10 px-3 sm:px-6 py-2.5 flex items-center gap-x-2 sm:gap-x-3">
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

        {/* Nav links - centered on all breakpoints */}
        <ul className="flex flex-1 flex-nowrap items-center justify-center gap-x-3 sm:gap-x-5 lg:gap-x-8 text-xs sm:text-sm lg:text-base">
          {navLinks.map(link => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `whitespace-nowrap ${
                    isActive
                      ? 'text-lime font-bold'
                      : 'text-navy dark:text-white hover:text-lime transition'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right: theme toggle (all sizes) + Get Started (desktop only) */}
        <div className="flex flex-shrink-0 items-center gap-x-2 sm:gap-x-3">
          <ThemeToggle />
          <Link
            to="/contact"
            className="hidden lg:inline-flex items-center rounded-full bg-lime text-navy font-bold px-5 py-2 hover:bg-green-400 transition shadow-sm"
          >
            Get Started
          </Link>
        </div>
      </nav>
    </header>
  );
}
