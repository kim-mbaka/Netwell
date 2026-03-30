import React from 'react';

const DEFAULT_BLOG_IMAGE = 'https://images.unsplash.com/photo-1516321318423-f06f70504504?auto=format&fit=crop&w=800&h=500&q=80';

export default function BlogCard({ post, onLearnMore }) {
  // Truncate excerpt to 3 lines (roughly 150 chars)
  const truncatedExcerpt = post.excerpt?.substring(0, 150) + (post.excerpt?.length > 150 ? '...' : '');

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col h-full">
      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-navy text-xl font-bold mb-3 line-clamp-2">{post.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
          {truncatedExcerpt}
        </p>
        <button
          onClick={() => onLearnMore(post)}
          className="bg-lime text-navy font-bold px-4 py-2 rounded hover:bg-green-400 transition self-start mt-auto"
        >
          Learn More →
        </button>
      </div>
    </div>
  );
}
