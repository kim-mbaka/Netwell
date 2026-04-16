import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-navy text-white py-8 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-center gap-8">
          {/* Logo & Copyright */}
          <div>
            <div className="text-lime text-2xl font-bold mb-2">Netwells Fiber</div>
            <div className="text-gray-300 text-sm">
              &copy; {new Date().getFullYear()} Netwells Fiber. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
