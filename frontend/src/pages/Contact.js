import React, { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    // In production, send to backend or email service
    setSubmitted(true);
  };

  return (
    <section className="max-w-xl mx-auto px-4 py-12">
      <a href="/" className="lg:hidden text-lime text-lg font-semibold mb-6 inline-block hover:text-green-400 transition">← Back Home</a>
      <h2 className="text-3xl font-bold mb-8 text-white">Contact Us</h2>
      <div className="bg-white rounded-xl shadow p-6 text-navy mb-8">
        <div className="mb-2 font-semibold">Email:</div>
        <div className="mb-2">support@netwell.com</div>
        <div className="mb-2 font-semibold">Phone:</div>
        <div className="mb-2">(346) 385-1226</div>
        <div className="mb-2 font-semibold">Address:</div>
        <div>123 Fiber Lane, Houston, TX</div>
      </div>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-6 flex flex-col gap-4">
        <input
          className="p-3 rounded border border-navy"
          type="text"
          name="name"
          placeholder="Name (optional)"
          value={form.name}
          onChange={handleChange}
        />
        <input
          className="p-3 rounded border border-navy"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <textarea
          className="p-3 rounded border border-navy min-h-[80px]"
          name="message"
          placeholder="Message"
          value={form.message}
          onChange={handleChange}
          required
        />
        <button type="submit" className="bg-lime text-navy font-bold px-6 py-2 rounded hover:bg-green-400 transition">
          Send Message
        </button>
        {submitted && <div className="text-lime font-semibold mt-2">Thank you! We'll be in touch soon.</div>}
      </form>
    </section>
  );
}
