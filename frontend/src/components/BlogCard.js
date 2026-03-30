import React from 'react';
import { Link } from 'react-router-dom';

export default function BlogCard({ post }) {
  return (
    <Link to={`/blog/${post.id}`} className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 transition-transform flex flex-col">
      {post.image && <img src={post.image} alt={post.title} className="h-48 w-full object-cover" />}
      <div className="p-6 flex-1 flex flex-col">
        <div className="text-navy text-xl font-bold mb-2">{post.title}</div>
        <div className="text-navy mb-4 flex-1">{post.excerpt}</div>
        <span className="text-lime font-semibold mt-auto">Read More &rarr;</span>
      </div>
    </Link>
  );
}
