import React, { useEffect, useRef } from 'react';

const renderInlineMarkdown = (text) => {
  const pattern = /(\*\*.*?\*\*|\*.*?\*|\[[^\]]+\]\([^\)]+\))/g;
  const children = [];
  let lastIndex = 0;
  let match;

  while ((match = pattern.exec(text)) !== null) {
    const raw = match[0];
    const before = text.slice(lastIndex, match.index);

    if (before) children.push(before);

    if (raw.startsWith('[')) {
      const labelMatch = raw.match(/^\[([^\]]+)\]\(([^\)]+)\)$/);
      if (labelMatch) {
        children.push(
          <a
            key={`${raw}-${match.index}`}
            href={labelMatch[2]}
            className="text-lime underline underline-offset-2"
            target="_blank"
            rel="noreferrer"
          >
            {labelMatch[1]}
          </a>
        );
      } else {
        children.push(raw);
      }
    } else if (raw.startsWith('**')) {
      children.push(
        <strong key={`${raw}-${match.index}`}>
          {raw.replace(/^\*\*|\*\*$/g, '')}
        </strong>
      );
    } else if (raw.startsWith('*')) {
      children.push(
        <em key={`${raw}-${match.index}`}>
          {raw.replace(/^\*|\*$/g, '')}
        </em>
      );
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
              ? 'mt-7 mb-3 text-xl sm:text-2xl font-bold text-ink leading-tight tracking-[-0.02em]'
              : 'mt-5 mb-2 text-lg sm:text-xl font-semibold text-ink leading-snug tracking-[-0.015em]'
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
          className={`mb-5 ml-5 sm:ml-6 space-y-2 text-[15px] sm:text-base text-ink-soft ${block.ordered ? 'list-decimal' : 'list-disc'}`}
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
      <p key={`paragraph-${index}`} className="mb-4 text-[15px] sm:text-base leading-7 sm:leading-8 text-ink-soft">
        {renderInlineMarkdown(block.content)}
      </p>
    );
  });
};

export default function BlogModal({ post, isOpen, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
      document.body.style.overflow = 'hidden';
    } else {
      dialogRef.current?.close();
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleEscape = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!post) return null;

  return (
    <dialog
      ref={dialogRef}
      onKeyDown={handleEscape}
      className="fixed inset-0 z-50 rounded-lg shadow-2xl max-w-3xl mx-auto backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <div className="bg-surface rounded-[26px] overflow-hidden flex flex-col max-h-[90vh] w-[min(92vw,760px)] shadow-[0_30px_70px_rgba(17,24,39,0.18)] border border-line">
        <div className="flex justify-between items-start gap-4 px-4 py-4 sm:px-6 sm:py-5 border-b border-line bg-surface-2">
          <div className="min-w-0 pr-2">
            <div className="mb-2 flex items-center gap-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] text-ink-soft">
              <span>Netwell Fiber</span>
              <span className="h-1 w-1 rounded-full bg-line" />
              <span>Insight</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-ink leading-[1.05] tracking-[-0.04em]">{post.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-xl text-ink-soft shadow-sm transition hover:text-ink hover:bg-surface-2"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto flex-1 flex flex-col bg-surface">
          <div className="px-4 py-4 sm:px-6 sm:py-6 flex-1">
            <div className="max-w-none">
              <div className="mb-7 rounded-[22px] border border-line bg-surface-2 p-4 sm:p-5">
                <p className="mb-2 text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.24em] text-ink-soft">Why it matters</p>
                <p className="font-serif text-base sm:text-xl leading-7 sm:leading-9 text-ink-soft">
                  {post.excerpt || 'Important guidance for your home internet setup.'}
                </p>
              </div>
              {renderBodyContent(post.body || post.excerpt || '')}
            </div>
          </div>
        </div>

        <div className="border-t border-line bg-surface-2 p-3 sm:p-4 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold text-ink shadow-sm transition hover:bg-surface-2"
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}
