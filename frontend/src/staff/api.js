import axios from 'axios';

// Token storage keys (kept distinct from anything the public site uses).
const ACCESS_KEY = 'nw_staff_access';
const REFRESH_KEY = 'nw_staff_refresh';

export const tokenStore = {
  get access() {
    return localStorage.getItem(ACCESS_KEY);
  },
  get refresh() {
    return localStorage.getItem(REFRESH_KEY);
  },
  set({ access, refresh }) {
    if (access) localStorage.setItem(ACCESS_KEY, access);
    if (refresh) localStorage.setItem(REFRESH_KEY, refresh);
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
  },
};

// Dedicated instance for the staff reporting API so it never interferes with
// the public marketing axios calls.
const staffApi = axios.create({ baseURL: '/api' });

staffApi.interceptors.request.use((config) => {
  const token = tokenStore.access;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing = null;

staffApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;
    const refresh = tokenStore.refresh;

    // Try a single silent refresh on a 401 (but never for the auth calls
    // themselves, to avoid loops).
    const isAuthCall = original?.url?.includes('/auth/token');
    if (status === 401 && refresh && !original._retried && !isAuthCall) {
      original._retried = true;
      try {
        refreshing =
          refreshing ||
          axios.post('/api/auth/token/refresh/', { refresh }).then((r) => r.data);
        const data = await refreshing;
        refreshing = null;
        tokenStore.set({ access: data.access, refresh: data.refresh });
        original.headers.Authorization = `Bearer ${data.access}`;
        return staffApi(original);
      } catch (e) {
        refreshing = null;
        tokenStore.clear();
      }
    }
    return Promise.reject(error);
  }
);

// Pull the first human-readable message out of a DRF error response.
export function apiError(error, fallback = 'Something went wrong. Please try again.') {
  const data = error?.response?.data;
  if (!data) return error?.message || fallback;
  if (typeof data === 'string') return data;
  if (data.detail) return data.detail;
  const firstKey = Object.keys(data)[0];
  if (firstKey) {
    const val = data[firstKey];
    const msg = Array.isArray(val) ? val[0] : val;
    return firstKey === 'non_field_errors' ? msg : `${msg}`;
  }
  return fallback;
}

export default staffApi;
