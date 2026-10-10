import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, TrashIcon, CameraIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import StaffHeader from '../StaffHeader';
import { inputClass, labelClass } from '../AuthShell';
import staffApi, { apiError } from '../api';

const WORK_TYPES = [
  ['new_installation', 'New Installation'],
  ['router_installation', 'Router Installation'],
  ['fiber_repair', 'Fiber Repair'],
  ['cable_replacement', 'Cable Replacement'],
  ['router_configuration', 'Router Configuration'],
  ['site_survey', 'Site Survey'],
  ['maintenance', 'Maintenance'],
  ['other', 'Other'],
];
const STATUSES = [
  ['completed', 'Completed'],
  ['pending', 'Pending'],
  ['follow_up', 'Follow-up Required'],
  ['customer_not_available', 'Customer Not Available'],
];
const PENDING_REASONS = [
  ['equipment_unavailable', 'Equipment unavailable'],
  ['customer_absent', 'Customer absent'],
  ['power_issue', 'Power issue'],
  ['network_issue', 'Network issue'],
  ['other', 'Other'],
];
const NEEDS_REASON = new Set(['pending', 'follow_up', 'customer_not_available']);

function Section({ n, title, children }) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
      <h2 className="text-ink font-bold mb-4 flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-lime text-navy text-xs font-extrabold">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

const today = () => new Date().toISOString().slice(0, 10);

export default function NewReport() {
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [materialsCatalog, setMaterialsCatalog] = useState([]);
  const [technicians, setTechnicians] = useState([]);

  const [form, setForm] = useState({
    date: today(),
    start_time: '',
    end_time: '',
    is_team: false,
    customer_name: '',
    customer_phone: '',
    customer_location: '',
    unit_number: '',
    work_type: '',
    work_performed: '',
    status: '',
    pending_reason: '',
    remarks: '',
  });
  const [team, setTeam] = useState([]); // user ids
  const [rows, setRows] = useState([]); // {material, quantity}
  const [photos, setPhotos] = useState([]); // File[]
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    staffApi.get('/materials/').then((r) => setMaterialsCatalog(r.data)).catch(() => {});
    staffApi.get('/technicians/').then((r) => setTechnicians(r.data)).catch(() => {});
  }, []);

  const set = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const toggleTeam = (id) =>
    setTeam((t) => (t.includes(id) ? t.filter((x) => x !== id) : [...t, id]));

  const addRow = () => setRows((r) => [...r, { material: '', quantity: 1 }]);
  const setRow = (i, key, val) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [key]: val } : row)));
  const removeRow = (i) => setRows((r) => r.filter((_, idx) => idx !== i));

  const onPickPhotos = (e) => {
    const picked = Array.from(e.target.files || []);
    setPhotos((p) => [...p, ...picked]);
    e.target.value = '';
  };
  const removePhoto = (i) => setPhotos((p) => p.filter((_, idx) => idx !== i));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const usedRows = rows.filter((r) => r.material);
    const ids = usedRows.map((r) => r.material);
    if (ids.length !== new Set(ids).size) {
      setError('Each material can only be added once.');
      return;
    }

    const payload = {
      date: form.date,
      start_time: form.start_time || null,
      end_time: form.end_time || null,
      is_team: form.is_team,
      team_members: form.is_team ? team : [],
      customer_name: form.customer_name,
      customer_phone: form.customer_phone,
      customer_location: form.customer_location,
      unit_number: form.unit_number,
      work_type: form.work_type,
      work_performed: form.work_performed,
      status: form.status,
      pending_reason: NEEDS_REASON.has(form.status) ? form.pending_reason || null : null,
      remarks: form.remarks,
      materials_used: usedRows.map((r) => ({
        material: Number(r.material),
        quantity: Number(r.quantity) || 1,
      })),
    };

    setSubmitting(true);
    try {
      const res = await staffApi.post('/reports/', payload);
      const reportId = res.data.id;
      // Upload any photos after the report exists.
      for (const file of photos) {
        const fd = new FormData();
        fd.append('image', file);
        try {
          await staffApi.post(`/reports/${reportId}/photos/`, fd);
        } catch (e) {
          /* a failed photo shouldn't lose the whole report */
        }
      }
      navigate('/staff/app/reports', { replace: true, state: { justSubmitted: true } });
    } catch (err) {
      setError(apiError(err, 'Could not submit the report. Check the fields and try again.'));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-gradient pb-28">
      <StaffHeader backTo="/staff/app" />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-6">
        <p className="text-lime text-[11px] font-bold uppercase tracking-[0.25em] mb-1">New report</p>
        <h1 className="text-white text-2xl sm:text-3xl font-extrabold mb-6">Daily job report</h1>

        {error && (
          <div className="mb-5 rounded-lg bg-red-500/15 border border-red-500/40 text-red-200 text-sm px-4 py-3">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          <Section n="1" title="Technician & time">
            <div className="grid sm:grid-cols-3 gap-3">
              <div>
                <label className={labelClass}>Date</label>
                <input type="date" name="date" value={form.date} onChange={set} className={inputClass} required />
              </div>
              <div>
                <label className={labelClass}>Start time</label>
                <input type="time" name="start_time" value={form.start_time} onChange={set} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>End time</label>
                <input type="time" name="end_time" value={form.end_time} onChange={set} className={inputClass} />
              </div>
            </div>
            <label className="mt-4 flex items-center gap-2 text-ink font-semibold">
              <input type="checkbox" name="is_team" checked={form.is_team} onChange={set} className="h-4 w-4 accent-lime" />
              This was a team job
            </label>
            {form.is_team && (
              <div className="mt-3">
                <label className={labelClass}>Team members</label>
                <div className="flex flex-wrap gap-2">
                  {technicians.map((t) => (
                    <button type="button" key={t.id} onClick={() => toggleTeam(t.id)}
                      className={`rounded-full border px-3 py-1.5 text-sm font-semibold transition ${
                        team.includes(t.id)
                          ? 'bg-lime text-navy border-lime'
                          : 'border-line text-ink-soft hover:border-lime'
                      }`}>
                      {t.name}
                    </button>
                  ))}
                  {technicians.length === 0 && <span className="text-ink-soft text-sm">No other technicians yet.</span>}
                </div>
              </div>
            )}
          </Section>

          <Section n="2" title="Customer">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className={labelClass}>Customer name</label>
                <input name="customer_name" value={form.customer_name} onChange={set} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Phone number</label>
                <input name="customer_phone" value={form.customer_phone} onChange={set} className={inputClass} inputMode="tel" />
              </div>
              <div>
                <label className={labelClass}>Apartment / location</label>
                <input name="customer_location" value={form.customer_location} onChange={set} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Unit number</label>
                <input name="unit_number" value={form.unit_number} onChange={set} className={inputClass} />
              </div>
            </div>
            <p className="text-ink-soft text-xs mt-2">Leave blank for site surveys or fibre repairs with no named customer.</p>
          </Section>

          <Section n="3" title="Type of work">
            <select name="work_type" value={form.work_type} onChange={set} className={inputClass} required>
              <option value="">Select work type…</option>
              {WORK_TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </Section>

          <Section n="4" title="Work performed">
            <textarea name="work_performed" value={form.work_performed} onChange={set} rows={4}
              className={inputClass} placeholder="Describe the work completed." />
          </Section>

          <Section n="5" title="Materials used">
            <div className="space-y-3">
              {rows.map((row, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <select value={row.material} onChange={(e) => setRow(i, 'material', e.target.value)}
                    className={`${inputClass} flex-1`}>
                    <option value="">Select material…</option>
                    {materialsCatalog.map((m) => (
                      <option key={m.id} value={m.id}>{m.name} ({m.unit})</option>
                    ))}
                  </select>
                  <input type="number" min="1" value={row.quantity}
                    onChange={(e) => setRow(i, 'quantity', e.target.value)}
                    className={`${inputClass} w-20`} inputMode="numeric" aria-label="Quantity" />
                  <button type="button" onClick={() => removeRow(i)}
                    className="shrink-0 rounded-lg border border-line p-2.5 text-ink-soft hover:text-red-500 hover:border-red-400 transition">
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addRow}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-lime text-lime font-semibold text-sm px-4 py-2 hover:bg-lime hover:text-navy transition">
              <PlusIcon className="h-4 w-4" /> Add material
            </button>
          </Section>

          <Section n="6" title="Job status">
            <select name="status" value={form.status} onChange={set} className={inputClass} required>
              <option value="">Select status…</option>
              {STATUSES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            {NEEDS_REASON.has(form.status) && (
              <div className="mt-3">
                <label className={labelClass}>Reason</label>
                <select name="pending_reason" value={form.pending_reason} onChange={set} className={inputClass} required>
                  <option value="">Select reason…</option>
                  {PENDING_REASONS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
              </div>
            )}
          </Section>

          <Section n="7" title="Proof of work (photos)">
            <input ref={fileRef} type="file" accept="image/*" capture="environment" multiple
              onChange={onPickPhotos} className="hidden" />
            <button type="button" onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1.5 rounded-full border border-lime text-lime font-semibold text-sm px-4 py-2 hover:bg-lime hover:text-navy transition">
              <CameraIcon className="h-4 w-4" /> Add photos
            </button>
            {photos.length > 0 && (
              <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                {photos.map((f, i) => (
                  <div key={i} className="relative">
                    <img src={URL.createObjectURL(f)} alt="" className="h-20 w-full object-cover rounded-lg border border-line" />
                    <button type="button" onClick={() => removePhoto(i)}
                      className="absolute -top-2 -right-2 rounded-full bg-navy text-white p-1 shadow">
                      <TrashIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Section n="8" title="Remarks">
            <textarea name="remarks" value={form.remarks} onChange={set} rows={3}
              className={inputClass} placeholder="Any additional notes." />
          </Section>
        </form>
      </main>

      {/* Sticky submit bar */}
      <div className="fixed bottom-0 inset-x-0 border-t border-white/10 bg-navy/90 backdrop-blur px-4 sm:px-6 py-3">
        <div className="max-w-2xl mx-auto">
          <button onClick={onSubmit} disabled={submitting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-lime text-navy font-bold px-4 py-3 hover:bg-green-400 transition disabled:opacity-60">
            <CheckCircleIcon className="h-5 w-5" />
            {submitting ? 'Submitting…' : 'Submit report'}
          </button>
        </div>
      </div>
    </div>
  );
}
