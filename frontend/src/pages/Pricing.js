import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';

export default function Pricing() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  useEffect(() => {
    axios.get('/api/plans/')
      .then(res => {
        // Sort plans by speed (lowest to highest)
        const sortedPlans = res.data.sort((a, b) => {
          const speedA = parseInt(a.speed.match(/\d+/)?.[0] || 0);
          const speedB = parseInt(b.speed.match(/\d+/)?.[0] || 0);
          return speedA - speedB;
        });
        setPlans(sortedPlans);
      })
      .catch((err) => {
        setPlans([]);
        handleApiError(err, 'Failed to load plans.');
      });
  }, []);
  return (
    <section className="max-w-6xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="text-lime text-lg font-semibold mb-8 inline-block hover:text-green-400 transition"
      >
        ← Go back
      </button>
      <h2 className="text-3xl font-bold mb-8 text-white">Choose Your Plan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map(plan => (
          <div key={plan.id} className="bg-white rounded-xl shadow-lg p-6 flex flex-col hover:scale-105 transition-transform">
            <div className="text-navy text-xl font-bold mb-2">{plan.title}</div>
            <div className="text-lime text-2xl font-bold mb-1">{plan.speed}</div>
            {plan.price && (
              <div className="text-navy text-lg font-semibold mb-4">
                KES {Number(plan.price).toLocaleString()}<span className="text-sm font-normal text-gray-500">/mo</span>
              </div>
            )}
            <ul className="mb-4 list-disc list-inside text-navy">
              {plan.features.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
            <Link to="/contact" className="mt-auto inline-block w-full text-center bg-lime text-navy font-bold px-4 py-2 rounded hover:bg-green-400 transition">
              Select Plan
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
