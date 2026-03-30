import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';

export default function About() {
  const [about, setAbout] = useState('');
  useEffect(() => {
    axios.get('/api/about/')
      .then(res => setAbout(res.data.content))
      .catch((err) => {
        setAbout('');
        handleApiError(err, 'Failed to load about page.');
      });
  }, []);
  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <a href="/" className="lg:hidden text-lime text-lg font-semibold mb-6 inline-block hover:text-green-400 transition">← Back Home</a>
      <h2 className="text-3xl font-bold mb-8 text-white">About Us</h2>
      <div className="bg-white rounded-xl shadow p-6 text-navy text-lg whitespace-pre-line">
        {about}
      </div>
    </section>
  );
}
