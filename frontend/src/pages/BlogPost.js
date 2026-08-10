import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';

export default function BlogPost() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  useEffect(() => {
    axios.get(`/api/blog/${id}/`)
      .then(res => setPost(res.data))
      .catch((err) => {
        setPost(null);
        handleApiError(err, 'Failed to load blog post.');
      });
  }, [id]);
  if (!post) return <div className="text-center text-white py-20">Loading...</div>;
  return (
    <section className="max-w-3xl mx-auto px-4 py-12">
      <button 
        onClick={() => navigate(-1)}
        className="text-lime text-lg font-semibold mb-8 inline-block hover:text-green-400 transition"
      >
        ← Go back
      </button>
      <h2 className="text-3xl font-bold mb-4 text-navy">{post.title}</h2>
      {post.image_filename && <img src={`/images/blog/${post.image_filename}`} alt={post.title} className="w-full h-64 object-cover rounded mb-6" />}
      <div className="text-navy text-lg mb-8 whitespace-pre-line">{post.body}</div>
    </section>
  );
}
