import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';
import Advantages from '../components/Advantages';
import BlogModal from '../components/BlogModal';
import FAQ from '../components/FAQ';

export default function Landing() {
  const [plans, setPlans] = useState([]);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const pricingRef = useRef(null);

  useEffect(() => {
    // Load plans
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

    // Load blog posts
    axios.get('/api/blog/')
      .then(res => setPosts(res.data.slice(0, 3)))
      .catch((err) => {
        setPosts([]);
        handleApiError(err, 'Failed to load blog posts.');
      });
  }, []);

  const handleViewPlans = () => {
    pricingRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="bg-page dark:bg-brand-gradient min-h-screen lg:min-h-[85vh] flex items-start lg:items-center px-6 sm:px-8 lg:px-16 py-8 lg:py-24 relative overflow-hidden">
        {/* Text Content - Left Side */}
        <div className="flex-1 z-20 max-w-2xl pt-8 lg:pt-0">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-ink mb-4 lg:mb-6 leading-tight">
            Fiber Internet Built for <span className="text-lime">Speed and Stability</span>
          </h1>
          <p className="text-lg sm:text-xl lg:text-2xl text-ink-soft mb-6 lg:mb-8 leading-relaxed">
            Connecting to a world of possiblities...
          </p>
          {/* CTA pair — layered above the hero image so they stay readable */}
          <div className="relative z-20 flex flex-wrap items-center gap-3 sm:gap-4">
            <button
              className="bg-lime text-navy font-bold px-8 py-3 text-base sm:text-lg rounded-full hover:bg-green-400 transition shadow-lg"
              onClick={handleViewPlans}
            >
              View Plans
            </button>
            <a
              href="/admin/"
              className="border border-lime text-lime font-bold px-8 py-3 text-base sm:text-lg rounded-full bg-navy/60 backdrop-blur-sm hover:bg-lime hover:text-navy transition shadow-lg"
            >
              Staff Sign In
            </a>
          </div>
        </div>

        {/* Floating Transparent Cutout Image - Right Side */}
        <img
          src="/assets/logo44.png"
          alt="Netwells Fiber"
          fetchpriority="high"
          decoding="async"
          className="absolute right-0 bottom-0 lg:bottom-auto lg:top-1/2 lg:transform lg:-translate-y-1/2 w-full sm:w-[450px] lg:w-[650px] h-auto object-contain drop-shadow-2xl -z-0 lg:z-10"
          style={{
            filter: 'drop-shadow(0 20px 25px rgba(0, 0, 0, 0.3))',
          }}
        />
      </section>

      {/* Pricing Section */}
      <section
        ref={pricingRef}
        className="bg-page py-20 px-8 lg:px-16"
      >
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl lg:text-5xl font-bold text-ink text-center mb-16">
            Choose Your <span className="text-lime">Plan</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.slice(0, 3).map(plan => (
              <div
                key={plan.id}
                className="bg-surface border border-line rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-shadow flex flex-col h-full"
              >
                <h3 className="text-ink text-2xl font-bold mb-2">{plan.title}</h3>
                <p className="text-lime text-3xl font-bold mb-1">{plan.speed}</p>
                {plan.price && (
                  <p className="text-ink text-lg font-semibold mb-6">
                    KES {Number(plan.price).toLocaleString()}<span className="text-sm font-normal text-ink-soft">/mo</span>
                  </p>
                )}
                <ul className="mb-8 flex-1 space-y-3">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-lime mr-3">✓</span>
                      <span className="text-ink-soft text-sm">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/contact" className="w-full bg-lime text-navy font-bold px-4 py-2 rounded-lg hover:bg-green-400 transition text-center">
                  Select Plan
                </Link>
              </div>
            ))}
          </div>
          
          {/* View More Plans Link */}
          <div className="text-center mt-12">
            <p className="text-ink-soft mb-4">Want to see all plans?</p>
            <a
              href="/pricing"
              className="inline-block text-lime font-bold text-lg hover:text-green-400 transition"
            >
              View All Plans →
            </a>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <Advantages />

      {/* FAQ Section */}
      <FAQ />

      {/* Blog Modal */}
      <BlogModal
        post={selectedPost}
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </>
  );
}
