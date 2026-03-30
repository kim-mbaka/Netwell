import React from 'react';
import { Link } from 'react-router-dom';

export default function QuickLinks() {
  const links = [
    { label: 'Home', to: '/' },
    { label: 'Pricing', to: '/pricing' },
    { label: 'Blog', to: '/blog' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <section className="bg-gray-800 py-12 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Quick Links - Left */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {links.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-300 hover:text-lime transition font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media - Right */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Find us on social</h3>
            <div className="flex gap-6">
              <a
                href="#facebook"
                className="w-10 h-10 bg-lime rounded-full flex items-center justify-center text-navy hover:bg-green-400 transition font-bold"
                aria-label="Facebook"
              >
                f
              </a>
              <a
                href="#instagram"
                className="w-10 h-10 bg-lime rounded-full flex items-center justify-center text-navy hover:bg-green-400 transition font-bold"
                aria-label="Instagram"
              >
                IG
              </a>
              <a
                href="#twitter"
                className="w-10 h-10 bg-lime rounded-full flex items-center justify-center text-navy hover:bg-green-400 transition font-bold"
                aria-label="Twitter"
              >
                𝕏
              </a>
              <a
                href="#linkedin"
                className="w-10 h-10 bg-lime rounded-full flex items-center justify-center text-navy hover:bg-green-400 transition font-bold"
                aria-label="LinkedIn"
              >
                in
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
