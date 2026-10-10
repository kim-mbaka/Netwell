import React from 'react';
import { Link } from 'react-router-dom';

// Shared split-panel shell for the staff login/register screens.
export default function AuthShell({ kicker, heading, brandTagline, brandSub, children }) {
  return (
    <div className="min-h-screen bg-brand-gradient flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl shadow-2xl grid md:grid-cols-2 bg-surface">
        {/* Brand panel (desktop) */}
        <div className="relative hidden md:flex flex-col justify-between bg-navy text-white p-8 lg:p-10">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <img src="/assets/logo.png" alt="Netwells" className="h-10 w-auto" />
          </Link>
          <div>
            <p className="text-lime text-[11px] font-bold uppercase tracking-[0.3em] mb-3">
              Field Reporting
            </p>
            <h2 className="text-4xl font-extrabold leading-[1.05]">{brandTagline}</h2>
            {brandSub && <p className="text-white/70 mt-4 leading-relaxed">{brandSub}</p>}
          </div>
          <p className="text-white/45 text-sm">Netwells Home Fibre · Staff portal</p>
        </div>

        {/* Form panel */}
        <div className="p-6 sm:p-8 lg:p-10">
          <Link to="/" className="md:hidden inline-flex items-center gap-2 mb-6 hover:opacity-80 transition">
            <img src="/assets/logo.png" alt="Netwells" className="h-9 w-auto" />
          </Link>
          <p className="text-lime text-[11px] font-bold uppercase tracking-[0.25em] mb-1">{kicker}</p>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink mb-6">{heading}</h1>
          {children}
        </div>
      </div>
    </div>
  );
}

export const inputClass =
  'w-full rounded-lg border border-line bg-surface text-ink px-3 py-2.5 outline-none ' +
  'placeholder:text-ink-soft/60 focus:border-lime focus:ring-2 focus:ring-lime/30 transition';

export const labelClass = 'block text-sm font-semibold text-ink-soft mb-1';
