import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Contact() {
  const navigate = useNavigate();

  return (
    <section className="max-w-2xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="text-lime text-lg font-semibold mb-6 inline-block hover:text-green-400 transition"
      >
        ← Go back
      </button>
      <h2 className="text-4xl font-bold mb-4 text-white">Contact Us</h2>
      <p className="text-gray-200 text-lg mb-12">Get in touch with Netwells Fiber for any inquiries or support.</p>
      
      <div className="bg-white rounded-xl shadow-lg p-8 text-navy space-y-8">
        <div>
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Email</div>
          <a 
            href="mailto:netwellstech@gmail.com"
            className="text-2xl font-bold text-lime hover:text-green-400 transition break-all"
          >
            netwellstech@gmail.com
          </a>
        </div>
        
        <div>
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">Phone</div>
          <a 
            href="tel:+254790835430"
            className="text-2xl font-bold text-lime hover:text-green-400 transition"
          >
            +254790835430
          </a>
        </div>
      </div>
    </section>
  );
}
