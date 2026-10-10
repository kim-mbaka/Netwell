import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import AuthShell, { inputClass, labelClass } from '../AuthShell';
import { useAuth } from '../AuthContext';
import { apiError } from '../api';

export default function StaffLogin() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) {
    return <Navigate to="/staff/app" replace />;
  }

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(form.username.trim(), form.password);
      const dest = location.state?.from?.pathname || '/staff/app';
      navigate(dest, { replace: true });
    } catch (err) {
      setError(apiError(err, 'Invalid username or password.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      kicker="Netwells Field Team"
      heading="Sign in"
      brandTagline="Welcome back."
      brandSub="Log your jobs from the field — fast, from any phone."
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
            className={inputClass} placeholder="e.g. j.mensah" autoComplete="username" required />
        </div>
        <div>
          <label className={labelClass} htmlFor="password">Password</label>
          <input id="password" name="password" type="password" value={form.password}
            onChange={onChange} className={inputClass} autoComplete="current-password" required />
        </div>
        <button type="submit" disabled={submitting}
          className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-lime text-navy font-bold px-4 py-3 hover:bg-green-400 transition disabled:opacity-60">
          {submitting ? 'Signing in…' : <>Sign in <ArrowRightIcon className="h-4 w-4" /></>}
        </button>
      </form>

      <p className="text-ink-soft text-sm mt-6">
        New technician?{' '}
        <Link to="/staff/register" className="text-lime font-semibold hover:text-green-400">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
