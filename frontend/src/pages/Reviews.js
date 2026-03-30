import React, { useEffect, useState } from 'react';

import axios from 'axios';
import { handleApiError, handleSuccess } from '../utils/errorHandler';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);


  useEffect(() => {
    axios.get('/api/reviews/')
      .then(res => setReviews(res.data))
      .catch((err) => {
        setReviews([]);
        handleApiError(err, 'Failed to load reviews.');
      });
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await axios.post('/api/reviews/', { text: comment });
      setComment('');
      handleSuccess('Review submitted!');
      const res = await axios.get('/api/reviews/');
      setReviews(res.data);
    } catch (err) {
      handleApiError(err, 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <a href="/" className="lg:hidden text-lime text-lg font-semibold mb-6 inline-block hover:text-green-400 transition">← Back Home</a>
      <h2 className="text-3xl font-bold mb-8 text-white">Customer Reviews</h2>
      <form onSubmit={handleSubmit} className="mb-10 flex flex-col gap-4">
        <textarea
          className="p-4 rounded border border-navy text-navy min-h-[80px]"
          placeholder="Leave your review (anonymous)"
          value={comment}
          onChange={e => setComment(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-lime text-navy font-bold px-6 py-2 rounded hover:bg-green-400 transition self-end"
          disabled={submitting}
        >
          {submitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
      <div className="flex flex-col gap-6">
        {reviews.map((review, i) => (
          <blockquote key={i} className="bg-white rounded-xl shadow p-6 border-l-4 border-lime italic text-navy">
            <div className="font-semibold mb-2">Anonymous User</div>
            <p>{review.text}</p>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
