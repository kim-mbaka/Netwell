import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { DocumentPlusIcon, PhotoIcon, CubeIcon } from '@heroicons/react/24/outline';
import StaffHeader from '../StaffHeader';
import staffApi, { apiError } from '../api';

const WORK_LABELS = {
  new_installation: 'New Installation',
  router_installation: 'Router Installation',
  fiber_repair: 'Fiber Repair',
  cable_replacement: 'Cable Replacement',
  router_configuration: 'Router Configuration',
  site_survey: 'Site Survey',
  maintenance: 'Maintenance',
  other: 'Other',
};
const STATUS_LABELS = {
  completed: 'Completed',
  pending: 'Pending',
  follow_up: 'Follow-up Required',
  customer_not_available: 'Customer Not Available',
};
const STATUS_STYLE = {
  completed: 'bg-lime/15 text-lime',
  pending: 'bg-amber-400/15 text-amber-400',
  follow_up: 'bg-sky-400/15 text-sky-400',
  customer_not_available: 'bg-red-400/15 text-red-400',
};

export default function MyReports() {
  const location = useLocation();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showToast, setShowToast] = useState(!!location.state?.justSubmitted);

  useEffect(() => {
    staffApi
      .get('/reports/')
      .then((r) => setReports(r.data.results || r.data))
      .catch((err) => setError(apiError(err)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 3000);
    return () => clearTimeout(t);
  }, [showToast]);

  return (
    <div className="min-h-screen bg-brand-gradient">
      <StaffHeader backTo="/staff/app" />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        {showToast && (
          <div className="mb-5 rounded-lg bg-lime/15 border border-lime/40 text-lime text-sm px-4 py-3">
            Report submitted. Nice work!
          </div>
        )}

        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="text-white text-2xl sm:text-3xl font-extrabold">My reports</h1>
          <Link to="/staff/app/report/new"
            className="inline-flex items-center gap-1.5 rounded-full bg-lime text-navy font-bold text-sm px-4 py-2 hover:bg-green-400 transition">
            <DocumentPlusIcon className="h-4 w-4" /> New report
          </Link>
        </div>

        {error && <p className="text-red-300 text-sm mb-4">{error}</p>}

        {loading ? (
          <p className="text-white/70">Loading…</p>
        ) : reports.length === 0 ? (
          <div className="rounded-2xl border border-line bg-surface p-8 text-center">
            <p className="text-ink font-semibold mb-1">No reports yet</p>
            <p className="text-ink-soft text-sm mb-4">File your first job report to see it here.</p>
            <Link to="/staff/app/report/new"
              className="inline-flex items-center gap-1.5 rounded-full bg-lime text-navy font-bold text-sm px-4 py-2 hover:bg-green-400 transition">
              <DocumentPlusIcon className="h-4 w-4" /> New report
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {reports.map((r) => (
              <li key={r.id} className="rounded-2xl border border-line bg-surface p-4 sm:p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-ink font-bold truncate">
                      {r.customer_name || WORK_LABELS[r.work_type] || 'Job'}
                    </div>
                    <div className="text-ink-soft text-sm">
                      {r.date} · {WORK_LABELS[r.work_type] || r.work_type}
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLE[r.status] || 'bg-ink-soft/15 text-ink-soft'}`}>
                    {STATUS_LABELS[r.status] || r.status}
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-4 text-ink-soft text-xs">
                  <span className="inline-flex items-center gap-1"><CubeIcon className="h-4 w-4" /> {(r.materials_used || []).length} materials</span>
                  <span className="inline-flex items-center gap-1"><PhotoIcon className="h-4 w-4" /> {(r.photos || []).length} photos</span>
                  {r.reviewed_by_username && <span className="text-lime font-semibold">Reviewed</span>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
