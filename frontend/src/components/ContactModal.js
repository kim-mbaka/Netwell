import React from 'react';

export default function ContactModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-navy text-white p-8 rounded-lg shadow-2xl w-full max-w-md pointer-events-auto transform transition-all"
        >
          <h3 className="text-2xl font-bold mb-6 text-lime">Get in Touch</h3>

          <div className="space-y-6 mb-8">
            <div>
              <div className="text-sm font-semibold text-gray-300 mb-2">Email:</div>
              <a
                href="mailto:netwellstech@gmail.com"
                className="text-lg text-lime hover:text-green-400 transition font-semibold break-all"
              >
                netwellstech@gmail.com
              </a>
            </div>

            <div>
              <div className="text-sm font-semibold text-gray-300 mb-2">Phone:</div>
              <a
                href="tel:+254790835430"
                className="text-lg text-lime hover:text-green-400 transition font-semibold"
              >
                +254790835430
              </a>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-lime text-navy font-bold py-2 px-4 rounded hover:bg-green-400 transition"
          >
            Close
          </button>
        </div>
      </div>
    </>
  );
}
