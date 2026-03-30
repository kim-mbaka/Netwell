import React from 'react';

export default function ReviewCard({ review }) {
  return (
    <blockquote className="bg-white rounded-xl shadow p-6 border-l-4 border-lime italic text-navy">
      <div className="font-semibold mb-2">Anonymous User</div>
      <p>{review.text}</p>
    </blockquote>
  );
}
