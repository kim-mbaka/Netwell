import React from 'react';

export default function PricingCard({ plan }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col hover:scale-105 transition-transform">
      <div className="text-navy text-xl font-bold mb-2">{plan.title}</div>
      <div className="text-lime text-2xl font-bold mb-4">{plan.speed}</div>
      <ul className="mb-4 list-disc list-inside text-navy">
        {plan.features.map((f, i) => <li key={i}>{f}</li>)}
      </ul>
      <button className="mt-auto bg-lime text-navy font-bold px-4 py-2 rounded hover:bg-green-400 transition">Select Plan</button>
    </div>
  );
}
