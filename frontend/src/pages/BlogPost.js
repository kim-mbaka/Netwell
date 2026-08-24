import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';

export default function BlogPost() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios.get(`/api/blog/${slug}/`)
      .then(res => setPost(res.data))
      .catch((err) => {
        setPost(null);
        handleApiError(err, 'Failed to load blog post.');
      });
  }, [slug]);

  useEffect(() => {
    if (!post) return;

    const pageUrl = `https://netwells.co.ke/blog/${post.slug || slug}`;
    const metaDescription = post.meta_description || post.excerpt || 'Netwell Fiber blog article.';
    const pageTitle = post.meta_title || post.title;

    document.title = pageTitle;

    const setMeta = (selector, attributes) => {
      let tag = document.querySelector(selector);
      if (!tag) {
        tag = document.createElement('meta');
        Object.entries(attributes).forEach(([key, value]) => {
          if (key !== 'tagName') tag.setAttribute(key, value);
        });
        document.head.appendChild(tag);
      }
      Object.entries(attributes).forEach(([key, value]) => {
        if (key !== 'tagName') tag.setAttribute(key, value);
      });
      return tag;
    };

    setMeta('meta[name="description"]', {
      name: 'description',
      content: metaDescription,
    });

    setMeta('meta[property="og:title"]', {
      property: 'og:title',
      content: pageTitle,
    });

    setMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: metaDescription,
    });

    setMeta('meta[property="og:type"]', {
      property: 'og:type',
      content: 'article',
    });

    setMeta('meta[property="og:url"]', {
      property: 'og:url',
      content: pageUrl,
    });

    setMeta('meta[name="twitter:title"]', {
      name: 'twitter:title',
      content: pageTitle,
    });

    setMeta('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: metaDescription,
    });

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', pageUrl);

    const ogImage = document.querySelector('meta[property="og:image"]') || document.createElement('meta');
    ogImage.setAttribute('property', 'og:image');
    ogImage.setAttribute('content', '/apple-touch-icon.png');
    if (!document.querySelector('meta[property="og:image"]')) {
      document.head.appendChild(ogImage);
    }
  }, [post, slug]);

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
      <div className="text-navy text-lg mb-8 whitespace-pre-line">{post.body}</div>
    </section>
  );
}
