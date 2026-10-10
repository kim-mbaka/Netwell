import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import AuthShell, { inputClass, labelClass } from '../AuthShell';
import { useAuth } from '../AuthContext';
import { apiError } from '../api';

const EMPTY = {
  username: '',
  email: '',
  first_name: '',
  last_name: '',
  password: '',
  password2: '',
  invite_code: '',
};

export default function StaffRegister() {
  const { register, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) {
    return <Navigate to="/staff/app" replace />;
  }

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.password2) {
      setError('Passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      await register({ ...form, username: form.username.trim(), invite_code: form.invite_code.trim() });
      navigate('/staff/app', { replace: true });
    } catch (err) {
      setError(apiError(err, 'Could not create your account.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      kicker="Join the field team"
      heading="Create account"
      brandTagline="Start the good work."
      brandSub="Got an invitation code from the office? Set up your account to start filing daily job reports."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <div className="rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm px-3 py-2">
            {error}
          </div>
        )}
        <div>
          <label className={labelClass} htmlFor="username">Username</label>
          <input id="username" name="username" value={form.username} onChange={onChange}
            className={inputClass} autoComplete="username" required />
        </div>
        <div>
          <label className={labelClass} htmlFor="email">Email (optional)</label>
          <input id="email" name="email" type="email" value={form.email} onChange={onChange}
            className={inputClass} autoComplete="email" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass} htmlFor="first_name">First name</label>
            <input id="first_name" name="first_name" value={form.first_name} onChange={onChange}
              className={inputClass} autoComplete="given-name" />
          </div>
          <div>
            <label className={labelClass} htmlFor="last_name">Last name</label>
            <input id="last_name" name="last_name" value={form.last_name} onChange={onChange}
              className={inputClass} autoComplete="family-name" />
          </div>
        </div>
        <div>
          <label className={labelClass} htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={form.password} onChange={onChange}
            className={inputClass} placeholder="Use 8+ characters" autoComplete="new-password" required />
        </div>
        <div>
          <label className={labelClass} htmlFor="password2">Confirm password</label>
          <input id="password2" name="password2" type="password" value={form.password2} onChange={onChange}
            className={inputClass} autoComplete="new-password" required />
        </div>
        <div>
          <label className={labelClass} htmlFor="invite_code">Invitation code</label>
          <input id="invite_code" name="invite_code" value={form.invite_code} onChange={onChange}
            className={`${inputClass} tracking-widest uppercase`} placeholder="ABCD-2345" required />
        </div>
        <button type="submit" disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-lime text-navy font-bold px-4 py-3 hover:bg-green-400 transition disabled:opacity-60">
          {submitting ? 'Creating account…' : <>Create account <ArrowRightIcon className="h-4 w-4" /></>}
        </button>
      </form>

      <p className="text-ink-soft text-sm mt-6">
        Already have an account?{' '}
        <Link to="/staff" className="text-lime font-semibold hover:text-green-400">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
