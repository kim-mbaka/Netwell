import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';

export default function Pricing() {
  const [plans, setPlans] = useState([]);
  useEffect(() => {
    axios.get('/api/plans/')
      .then(res => setPlans(res.data))
      .catch((err) => {
        setPlans([]);
        handleApiError(err, 'Failed to load plans.');
      });
  }, []);
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <a href="/" className="lg:hidden text-lime text-lg font-semibold mb-8 inline-block hover:text-green-400 transition">← Back Home</a>
      <h2 className="text-3xl font-bold mb-8 text-white">Choose Your Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan.id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col hover:scale-105 transition-transform">
            <div className="text-navy text-xl font-bold mb-2">{plan.title}</div>
            <div className="text-lime text-2xl font-bold mb-4">{plan.speed}</div>
            <ul className="mb-4 list-disc list-inside text-navy">
              {plan.features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
            <button className="mt-auto bg-lime text-navy font-bold px-4 py-2 rounded hover:bg-green-400 transition">Select Plan</button>
          </div>
        ))}
      </div>
    </section>
  );
}
