import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();
  return (
    <section className="bg-navy min-h-[60vh] flex flex-col lg:flex-row items-center justify-between px-6 py-16 lg:py-24 relative">
      <div className="flex-1 z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Welcome to <span className="text-lime">Netwell</span> Fiber
        </h1>
        <p className="text-lg md:text-xl mb-8 leading-normal">
          Experience lightning-fast speeds and dependable connectivity.
        </p>
        <button
          className="bg-lime text-navy font-bold px-8 py-3 rounded shadow-lg hover:bg-green-400 transition text-lg"
          onClick={() => navigate('/pricing')}
        >
          View Plans
        </button>
      </div>
      <div className="flex-1 flex justify-center items-center relative mt-10 lg:mt-0">
        {/* Placeholder for hero image, replace with actual image */}
        <div className="w-64 h-80 bg-white rounded-xl shadow-lg overflow-hidden flex items-end justify-center relative">
          <img
            src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=facearea&w=400&h=500&q=80"
            alt="Person using Wi-Fi"
            className="object-cover h-full w-full absolute bottom-0 left-0 right-0 top-0"
            style={{ mixBlendMode: 'multiply' }}
          />
        </div>
      </div>
    </section>
  );
}
