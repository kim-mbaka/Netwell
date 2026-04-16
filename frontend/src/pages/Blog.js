import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';
import BlogCardNew from '../components/BlogCardNew';
import BlogModal from '../components/BlogModal';

export default function Blog() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    axios.get('/api/blog/')
      .then(res => setPosts(res.data))
      .catch((err) => {
        setPosts([]);
        handleApiError(err, 'Failed to load blog posts.');
      });
  }, []);

  return (
    <section className="bg-gray-50 py-16 px-6 lg:px-12 min-h-screen">
      <div className="max-w-6xl mx-auto">
      <button 
        onClick={() => navigate(-1)}
        className="text-lime text-lg font-semibold mb-6 inline-block hover:text-green-400 transition"
      >
        ← Go back
      </button>
        <h2 className="text-4xl font-bold mb-12 text-navy text-center">
          Discover Even More
        </h2>

        {posts.length === 0 ? (
          <div className="text-center text-gray-600 py-12">
            <p>No blog posts available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <BlogCardNew
                key={post.id}
                post={post}
                onLearnMore={setSelectedPost}
              />
            ))}
          </div>
        )}
      </div>

      {/* Blog Modal */}
      <BlogModal
        post={selectedPost}
        isOpen={!!selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </section>
  );
}
