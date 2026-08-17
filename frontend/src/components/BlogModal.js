import React, { useEffect, useRef } from 'react';

const DEFAULT_BLOG_IMAGE = 'https://images.unsplash.com/photo-1516321318423-f06f70504504?auto=format&fit=crop&w=800&h=500&q=80';

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
      className="fixed inset-0 z-50 rounded-lg shadow-2xl max-w-2xl mx-auto backdrop:bg-black/50 backdrop:backdrop-blur-sm"
    >
      <div className="bg-white rounded-lg overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Close Button */}
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-navy">{post.title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 flex flex-col">
          {/* Featured Image: uploaded image → legacy bundled filename → default */}
          <img
            src={post.image || (post.image_filename ? `/images/blog/${post.image_filename}` : DEFAULT_BLOG_IMAGE)}
            alt={post.title}
            loading="lazy"
            decoding="async"
            className={`w-full h-64 object-cover ${post.image || post.image_filename ? '' : 'opacity-70'}`}
          />

          {/* Content */}
          <div className="p-6 flex-1">
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {post.body || post.excerpt}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-lime text-navy font-bold px-6 py-2 rounded hover:bg-green-400 transition"
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}
