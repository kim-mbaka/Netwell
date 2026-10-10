import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';
import Advantages from '../components/Advantages';
import BlogModal from '../components/BlogModal';
import FAQ from '../components/FAQ';
import PlanCard from '../components/PlanCard';

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
            <Link
              to="/staff"
              className="border border-lime text-lime font-bold px-8 py-3 text-base sm:text-lg rounded-full bg-navy/60 backdrop-blur-sm hover:bg-lime hover:text-navy transition shadow-lg"
            >
              Staff Sign In
            </Link>
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
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-ink">Internet Packages</h2>
              <p className="text-ink-soft mt-2">Get the best value for your home.</p>
            </div>
            <Link
              to="/pricing"
              className="text-lime font-semibold whitespace-nowrap hover:text-green-400 transition"
            >
              View All Plans →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {plans.slice(0, 4).map((plan, i) => (
              <PlanCard key={plan.id} plan={plan} popular={i === 1} />
            ))}
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
