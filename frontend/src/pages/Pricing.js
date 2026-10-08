import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';
import PlanCard from '../components/PlanCard';

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
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <button
        onClick={() => navigate(-1)}
        className="text-lime text-lg font-semibold mb-8 inline-block hover:text-green-400 transition"
      >
        ← Go back
      </button>
      <div className="mb-10">
        <h2 className="text-3xl lg:text-4xl font-bold text-ink">Internet Packages</h2>
        <p className="text-ink-soft mt-2">Get the best value for your home.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {plans.map((plan, i) => (
          <PlanCard key={plan.id} plan={plan} popular={i === 1} />
        ))}
      </div>
    </section>
  );
}
