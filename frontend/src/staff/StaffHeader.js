import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { useAuth } from './AuthContext';

export default function StaffHeader({ backTo }) {
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 sm:px-8 py-4 border-b border-white/10 bg-brand-gradient">
      {backTo ? (
        <Link to={backTo} className="inline-flex items-center gap-1.5 text-white/90 hover:text-lime transition font-semibold text-sm">
          <ArrowLeftIcon className="h-4 w-4" /> Back
        </Link>
      ) : (
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <img src="/assets/logo.png" alt="Netwells" className="h-9 w-auto" />
        </Link>
      )}
      <div className="flex items-center gap-3">
        <div className="text-right leading-tight hidden sm:block">
          <div className="text-white font-semibold text-sm">{user?.username}</div>
          <div className="text-lime text-xs font-bold uppercase tracking-wide">{user?.role}</div>
        </div>
        <button onClick={logout}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/25 text-white text-sm font-semibold px-4 py-2 hover:bg-white/10 transition">
          <ArrowRightOnRectangleIcon className="h-4 w-4" /> Log out
        </button>
      </div>
    </header>
  );
}
