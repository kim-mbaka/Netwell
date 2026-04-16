import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { handleApiError, handleSuccess } from '../utils/errorHandler';

// Helper function to get CSRF token from cookies
const getCsrfToken = () => {
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

// Configure axios to include CSRF token in POST requests
axios.interceptors.request.use(config => {
  if (['post', 'put', 'patch', 'delete'].includes(config.method)) {
    config.headers['X-CSRFToken'] = getCsrfToken();
  }
  return config;
});

export default function Reviews() {
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // First, fetch reviews to trigger CSRF token generation
    axios.get('/api/reviews/')
      .then(res => setReviews(res.data))
      .catch((err) => {
        setReviews([]);
        handleApiError(err, 'Failed to load reviews.');
      });
  }, []);

  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const paginatedReviews = reviews.slice(startIdx, endIdx);
  const totalPages = Math.ceil(reviews.length / itemsPerPage);


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
      <button 
        onClick={() => navigate(-1)}
        className="text-lime text-lg font-semibold mb-6 inline-block hover:text-green-400 transition"
      >
        ← Go back
      </button>
      <h2 className="text-3xl font-bold mb-8 text-white">Customer Reviews</h2>
      <p className="text-gray-200 text-lg mb-6">Connecting to a world of possiblities...</p>
      
      <form onSubmit={handleSubmit} className="mb-10 flex flex-col gap-4 bg-white rounded-xl shadow p-6">
        <textarea
          className="p-4 rounded border border-gray-300 text-navy min-h-[80px] resize-none"
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
        {paginatedReviews.map((review, i) => (
          <blockquote key={i} className="bg-white rounded-xl shadow p-6 border-l-4 border-lime text-navy">
            <div className="font-semibold mb-2">Anonymous User</div>
            <p className="text-gray-700">{review.text}</p>
          </blockquote>
        ))}
      </div>

      {reviews.length > itemsPerPage && (
        <div className="flex justify-center gap-4 items-center mt-10">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="bg-lime text-navy font-bold px-4 py-2 rounded hover:bg-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <span className="text-white font-semibold">Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="bg-lime text-navy font-bold px-4 py-2 rounded hover:bg-green-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </section>
  );
}
