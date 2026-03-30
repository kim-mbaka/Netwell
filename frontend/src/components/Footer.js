import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-navy text-white py-8 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8 mb-6">
          {/* Logo & Copyright */}
          <div>
            <div className="text-lime text-2xl font-bold mb-2">Netwell Fiber</div>
            <div className="text-gray-300 text-sm">
              &copy; {new Date().getFullYear()} Netwell Fiber. All rights reserved.
            </div>
          </div>

          {/* Social Media */}
          <div className="flex gap-6 items-center">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lime hover:text-green-400 transition text-2xl"
              aria-label="Facebook"
            >
              f
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lime hover:text-green-400 transition text-2xl"
              aria-label="Instagram"
            >
              📷
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lime hover:text-green-400 transition text-2xl"
              aria-label="Twitter"
            >
              𝕏
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lime hover:text-green-400 transition text-2xl"
              aria-label="LinkedIn"
            >
              in
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
