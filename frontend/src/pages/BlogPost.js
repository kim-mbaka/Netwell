import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import axios from 'axios';
import { handleApiError } from '../utils/errorHandler';

const renderInlineMarkdown = (text) => {
  const pattern = /(\*\*.*?\*\*|\*.*?\*|\[[^\]]+\]\([^\)]+\))/g;
  const children = [];
  let lastIndex = 0;

  let match;
  while ((match = pattern.exec(text)) !== null) {
    const raw = match[0];
    const before = text.slice(lastIndex, match.index);
    if (before) {
      children.push(before);
    }

    if (raw.startsWith('[[') || raw.startsWith('[')) {
      const labelMatch = raw.match(/^\[([^\]]+)\]\(([^\)]+)\)$/);
      if (labelMatch) {
        children.push(
          <a key={`${raw}-${match.index}`} href={labelMatch[2]} className="text-lime underline underline-offset-2" target="_blank" rel="noreferrer">
            {labelMatch[1]}
          </a>
        );
      } else {
        children.push(raw);
      }
    } else if (raw.startsWith('**')) {
      children.push(<strong key={`${raw}-${match.index}`}>{raw.replace(/^\*\*|\*\*$/g, '')}</strong>);
    } else if (raw.startsWith('*')) {
      children.push(<em key={`${raw}-${match.index}`}>{raw.replace(/^\*|\*$/g, '')}</em>);
    } else {
      children.push(raw);
    }

    lastIndex = match.index + raw.length;
  }

  if (lastIndex < text.length) {
    children.push(text.slice(lastIndex));
  }

  return children;
};

const renderBodyContent = (body) => {
  const lines = body.split(/\n/).map((line) => line.trim()).filter(Boolean);
  const blocks = [];
  let paragraphLines = [];
  let listItems = [];
  let orderedList = false;

  const flushParagraph = () => {
    if (!paragraphLines.length) return;
    blocks.push({ type: 'paragraph', content: paragraphLines.join(' ') });
    paragraphLines = [];
  };

  const flushList = () => {
    if (!listItems.length) return;
    blocks.push({ type: 'list', ordered: orderedList, items: listItems });
    listItems = [];
    orderedList = false;
  };

  const isMarkupHeading = (line) => /^#{1,3}\s+/.test(line);
  const isBulletLine = (line) => /^[-*•]\s+/.test(line);
  const isNumberedLine = (line) => /^\d+\.\s+/.test(line);

  const isPlainHeading = (line, nextLine) => {
    const text = line.trim();
    if (!text || text.length > 80 || isMarkupHeading(line) || isBulletLine(line) || isNumberedLine(line)) {
      return false;
    }

    const words = text.split(/\s+/).filter(Boolean).length;
    if (words > 8) return false;
    if (!nextLine) return true;
    if (isBulletLine(nextLine) || isNumberedLine(nextLine)) return true;
    return !/[.!?]$/.test(text);
  };

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    const nextLine = lines[i + 1] || '';

    if (isMarkupHeading(line)) {
      flushParagraph();
      flushList();
      const level = line.match(/^#+/)?.[0].length || 2;
      blocks.push({
        type: 'heading',
        content: line.replace(/^#{1,3}\s+/, ''),
        level,
      });
      continue;
    }

    if (isPlainHeading(line, nextLine)) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'heading', content: line, level: 3 });
      continue;
    }

    if (isBulletLine(line)) {
      flushParagraph();
      listItems.push(line.replace(/^[-*•]\s+/, ''));
      orderedList = false;
      continue;
    }

    if (isNumberedLine(line)) {
      flushParagraph();
      listItems.push(line.replace(/^\d+\.\s+/, ''));
      orderedList = true;
      continue;
    }

    if (listItems.length && !isBulletLine(line) && !isNumberedLine(line)) {
      flushList();
    }

    paragraphLines.push(line);
  }

  flushList();
  flushParagraph();

  return blocks.map((block, index) => {
    if (block.type === 'heading') {
      const HeadingTag = block.level === 2 ? 'h2' : 'h3';
      return (
        <HeadingTag
          key={`heading-${index}`}
          className={
            block.level === 2
              ? 'mt-7 mb-3 text-xl sm:text-2xl md:text-3xl font-bold text-navy leading-tight tracking-[-0.02em]'
              : 'mt-5 mb-2 text-lg sm:text-xl md:text-2xl font-semibold text-navy leading-snug tracking-[-0.015em]'
          }
        >
          {renderInlineMarkdown(block.content)}
        </HeadingTag>
      );
    }

    if (block.type === 'list') {
      const ListTag = block.ordered ? 'ol' : 'ul';
      return (
        <ListTag
          key={`list-${index}`}
          className={`mb-5 ml-5 sm:ml-6 space-y-2 text-base sm:text-lg text-navy/85 ${block.ordered ? 'list-decimal' : 'list-disc'}`}
        >
          {block.items.map((item, itemIndex) => (
            <li key={`${block.type}-${index}-${itemIndex}`} className="leading-7 sm:leading-8 pl-1 marker:text-lime">
              {renderInlineMarkdown(item)}
            </li>
          ))}
        </ListTag>
      );
    }

    return (
      <p key={`paragraph-${index}`} className="mb-4 text-base sm:text-lg leading-7 sm:leading-8 text-navy/85">
        {renderInlineMarkdown(block.content)}
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

      <article className="rounded-[28px] bg-white p-4 sm:p-6 md:p-10 shadow-[0_25px_60px_rgba(15,23,42,0.12)] border border-slate-200/80">
        <div className="mb-6 sm:mb-8 border-l-4 border-lime pl-4">
          <div className="mb-3 flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.26em] text-slate-500">
            <span>Netwell Fiber</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span>Insight</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl md:text-5xl font-bold text-navy leading-[0.95] tracking-[-0.04em]">{post.title}</h1>
        </div>

        {post.excerpt && (
          <div className="mb-8 sm:mb-10 rounded-[22px] border border-slate-200 bg-[linear-gradient(135deg,#f8fafc_0%,#f7f8f3_100%)] p-4 sm:p-5">
            <p className="mb-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">Why it matters</p>
            <p className="font-serif text-base sm:text-xl leading-7 sm:leading-9 text-navy/80">
              {post.excerpt}
            </p>
          </div>
        )}

        <div className="prose prose-slate prose-lg max-w-none text-navy prose-headings:font-serif prose-headings:font-bold prose-headings:tracking-[-0.02em] prose-h2:mt-10 prose-h2:mb-3 prose-h3:mt-8 prose-h3:mb-2 prose-p:my-5 prose-p:text-[15px] prose-p:sm:text-[17px] prose-p:leading-8 prose-p:sm:leading-9 prose-li:my-2 prose-ul:my-5 prose-ol:my-5 prose-a:text-lime prose-a:no-underline hover:prose-a:underline">
          {renderBodyContent(post.body)}
        </div>
      </article>
    </section>
  );
}
