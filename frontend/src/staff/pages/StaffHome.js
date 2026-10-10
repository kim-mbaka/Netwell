import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRightOnRectangleIcon,
  ClipboardDocumentIcon,
  PlusIcon,
  TicketIcon,
  DocumentPlusIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline';
import staffApi, { apiError } from '../api';
import { useAuth } from '../AuthContext';

function InvitePanel() {
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');

  const load = () => {
    staffApi
      .get('/auth/invite-codes/')
      .then((res) => setCodes(res.data))
      .catch((err) => setError(apiError(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const generate = async () => {
    setGenerating(true);
    setError('');
    try {
      await staffApi.post('/auth/invite-codes/', { role: 'technician' });
      load();
    } catch (err) {
      setError(apiError(err));
    } finally {
      setGenerating(false);
    }
  };

  const copy = (code) => {
    navigator.clipboard?.writeText(code);
    setCopied(code);
    setTimeout(() => setCopied(''), 1500);
  };

  return (
    <div className="rounded-2xl border border-line bg-surface p-6">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-2">
          <TicketIcon className="h-5 w-5 text-lime" />
          <h2 className="text-ink font-bold text-lg">Invite a technician</h2>
        </div>
        <button onClick={generate} disabled={generating}
          className="inline-flex items-center gap-1.5 rounded-full bg-lime text-navy font-bold text-sm px-4 py-2 hover:bg-green-400 transition disabled:opacity-60">
          <PlusIcon className="h-4 w-4" /> {generating ? 'Generating…' : 'Generate code'}
        </button>
      </div>
      <p className="text-ink-soft text-sm mb-4">
        Share a single-use code with a new technician — they enter it when creating their account.
      </p>
      {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
      {loading ? (
        <p className="text-ink-soft text-sm">Loading codes…</p>
      ) : codes.length === 0 ? (
        <p className="text-ink-soft text-sm">No codes yet — generate one above.</p>
      ) : (
        <ul className="divide-y divide-line">
          {codes.map((c) => (
            <li key={c.code} className="flex items-center justify-between py-2.5">
              <span className={`font-mono tracking-widest font-bold ${c.used_by ? 'text-ink-soft line-through' : 'text-ink'}`}>
                {c.code}
              </span>
              {c.used_by ? (
                <span className="text-xs font-semibold text-ink-soft">used</span>
              ) : (
                <button onClick={() => copy(c.code)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-lime hover:text-green-400">
                  <ClipboardDocumentIcon className="h-4 w-4" />
                  {copied === c.code ? 'Copied!' : 'Copy'}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ActionCard({ icon: Icon, title, desc, soon, to }) {
  const inner = (
    <>
      <Icon className="h-7 w-7 text-lime mb-3" />
      <h3 className="text-ink font-bold text-lg">{title}</h3>
      <p className="text-ink-soft text-sm mt-1 flex-1">{desc}</p>
      {soon && (
        <span className="mt-4 inline-block w-max rounded-full bg-lime/15 text-lime text-xs font-bold px-3 py-1">
          Coming soon
        </span>
      )}
    </>
  );
  const base = 'rounded-2xl border border-line bg-surface p-6 flex flex-col';
  if (to) {
    return (
      <Link to={to} className={`${base} hover:border-lime/60 hover:shadow-xl transition`}>
        {inner}
      </Link>
    );
  }
  return <div className={base}>{inner}</div>;
}

export default function StaffHome() {
  const { user, isOffice, logout } = useAuth();

  return (
    <div className="min-h-screen bg-brand-gradient">
      <header className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-white/10">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
          <img src="/assets/logo.png" alt="Netwells" className="h-9 w-auto" />
        </Link>
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

      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-8">
        <p className="text-lime text-[11px] font-bold uppercase tracking-[0.25em] mb-1">
          {isOffice ? 'Office' : 'Technician'} workspace
        </p>
        <h1 className="text-white text-3xl font-extrabold mb-8">
          {isOffice ? 'Supervisor dashboard' : `Welcome, ${user?.first_name || user?.username}`}
        </h1>

        {isOffice ? (
          <div className="grid gap-5 md:grid-cols-2">
            <InvitePanel />
            <ActionCard icon={ChartBarIcon} title="Daily dashboard"
              desc="Jobs completed vs pending, installs, repairs, materials used and per-technician performance."
              soon />
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2">
            <ActionCard icon={DocumentPlusIcon} title="New job report" to="/staff/app/report/new"
              desc="File a report for each job you visit — customer, work done, materials, status and photos." />
            <ActionCard icon={ChartBarIcon} title="My reports" to="/staff/app/reports"
              desc="See every report you've submitted and its review status." />
          </div>
        )}
      </main>
    </div>
  );
}
