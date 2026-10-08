import React from 'react';
import { Link } from 'react-router-dom';
import { CheckIcon } from '@heroicons/react/24/solid';

export default function PlanCard({ plan, popular = false }) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl p-6 transition-shadow ${
        popular
          ? 'bg-surface border-2 border-lime shadow-[0_0_34px_rgba(119,205,12,0.28)]'
          : 'bg-surface border border-line hover:border-lime/50 hover:shadow-xl'
      }`}
    >
      {popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-lime text-navy text-[11px] font-bold uppercase tracking-wide px-3 py-1 shadow">
          Most Popular
        </span>
      )}

      <h3 className="text-lime text-sm font-bold uppercase tracking-wide mb-3">{plan.title}</h3>

      <div className="text-ink text-3xl font-extrabold leading-none">{plan.speed}</div>

      {plan.price && (
        <div className="mt-3">
          <span className="text-ink text-xl font-bold">
            KES {Number(plan.price).toLocaleString()}
          </span>
          <span className="text-ink-soft text-sm"> /month</span>
        </div>
      )}

      <div className="border-t border-line my-5" />

      <ul className="space-y-2.5 mb-6 flex-1">
        {plan.features.map((f, i) => (
          <li key={i} className="flex items-start gap-2 text-ink-soft text-sm">
            <CheckIcon className="h-4 w-4 text-lime flex-shrink-0 mt-0.5" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <Link
        to="/contact"
        className={`mt-auto text-center rounded-full font-bold px-4 py-2.5 transition ${
          popular
            ? 'bg-lime text-navy hover:bg-green-400'
            : 'border border-lime text-lime hover:bg-lime hover:text-navy'
        }`}
      >
        Choose Plan
      </Link>
    </div>
  );
}
