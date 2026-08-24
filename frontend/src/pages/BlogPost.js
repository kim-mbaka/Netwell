import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';

const isLikelyHeading = (line) => {
  const cleaned = line.replace(/^[*-•]\s*/, '').replace(/^\d+\.\s*/, '').trim();
  if (!cleaned || cleaned.length > 80) return false;
  if (cleaned.includes(':') && cleaned.split(' ').length <= 12) return true;
  return !/[.!?]$/.test(cleaned) && cleaned.split(/\s+/).length <= 12;
};

const renderBodyContent = (body) => {
  const lines = body.split(/\n+/).map((line) => line.trim()).filter(Boolean);
  const blocks = [];
  let paragraphLines = [];
  let listItems = [];
  let orderedList = false;

  const flushParagraph = () => {
    if (!paragraphLines.length) return;
    blocks.push({
      type: 'paragraph',
      content: paragraphLines.join(' '),
    });
    paragraphLines = [];
  };

  const flushList = () => {
    if (!listItems.length) return;
    blocks.push({
      type: 'list',
      ordered: orderedList,
      items: listItems,
    });
    listItems = [];
    orderedList = false;
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (/^\d+\.\s+/.test(trimmed)) {
      flushParagraph();
      listItems.push(trimmed.replace(/^\d+\.\s+/, ''));
      orderedList = true;
      return;
    }

    if (/^[-*•]\s+/.test(trimmed)) {
      flushParagraph();
      listItems.push(trimmed.replace(/^[-*•]\s+/, ''));
      orderedList = false;
      return;
    }

    if (isLikelyHeading(trimmed)) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'heading', content: trimmed });
      return;
    }

    if (listItems.length && !/^[-*•]\s+|^\d+\.\s+/.test(trimmed)) {
      flushList();
    }

    paragraphLines.push(trimmed);
  });

  flushList();
  flushParagraph();

  return blocks.map((block, index) => {
    if (block.type === 'heading') {
      return (
        <h3 key={`heading-${index}`} className="mt-8 mb-3 text-2xl font-bold text-navy leading-tight">
          {block.content}
        </h3>
      );
    }

    if (block.type === 'list') {
      const ListTag = block.ordered ? 'ol' : 'ul';
      return (
        <ListTag key={`list-${index}`} className={`mb-6 ml-6 space-y-2 text-lg text-navy ${block.ordered ? 'list-decimal' : 'list-disc'}`}>
          {block.items.map((item, itemIndex) => (
            <li key={`${block.type}-${index}-${itemIndex}`} className="leading-relaxed">
              {item}
            </li>
          ))}
        </ListTag>
      );
    }

    return (
      <p key={`paragraph-${index}`} className="mb-5 text-lg leading-8 text-navy">
        {block.content}
      </p>
    );
  });
};

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
    <section className="max-w-4xl mx-auto px-4 py-12 md:py-16">
      <button 
        onClick={() => navigate(-1)}
        className="text-lime text-lg font-semibold mb-8 inline-block hover:text-green-400 transition"
      >
        ← Go back
      </button>

      <article className="rounded-3xl bg-white p-6 md:p-10 shadow-2xl shadow-navy/20">
        <div className="mb-8 border-l-4 border-lime pl-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-navy/70">Netwell Fiber</p>
          <h1 className="mt-2 text-3xl md:text-5xl font-bold text-navy leading-tight">{post.title}</h1>
        </div>

        {post.excerpt && (
          <p className="mb-8 rounded-2xl bg-slate-50 p-4 text-lg font-medium leading-8 text-navy/80 border border-slate-200">
            {post.excerpt}
          </p>
        )}

        <div className="prose prose-lg max-w-none text-navy">
          {renderBodyContent(post.body)}
        </div>
      </article>
    </section>
  );
}
