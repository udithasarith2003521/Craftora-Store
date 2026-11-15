'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Maximize2, X, ChevronLeft, ChevronRight, Layers } from 'lucide-react';
import { formatImageUrl } from '@/lib/utils';

interface GalleryLightboxProps {
  coverImage: string;
  images: { id: string; url: string; sortOrder: number }[];
  title: string;
}

export function GalleryLightbox({ coverImage, images, title }: GalleryLightboxProps) {
  // Clean valid image URLs (filter out broken/local blob: URLs and deduplicate)
  const validCover =
    coverImage && !coverImage.startsWith('blob:') ? formatImageUrl(coverImage) : null;
  const validImages = images
    .map((img) => formatImageUrl(img.url))
    .filter((url) => url && !url.startsWith('blob:'));

  const allImages = Array.from(
    new Set([
      ...(validCover ? [validCover] : []),
      ...validImages,
    ])
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev + 1) % allImages.length);
      }
      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, allImages.length]);

  return (
    <div className="space-y-4">
      {/* Primary Preview */}
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden glass-panel border border-border-subtle group bg-background-elevated">
        {allImages[activeIndex] ? (
          <Image
            src={allImages[activeIndex]}
            alt={`${title} preview ${activeIndex + 1}`}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted">
            <Layers className="w-16 h-16 stroke-[1]" />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />

        {/* Expand button */}
        <button
          onClick={() => setLightboxOpen(true)}
          type="button"
          className="absolute top-4 right-4 p-2.5 rounded-xl bg-background-deep/80 text-cyan-accent hover:text-white border border-cyan-accent/30 hover:border-cyan-accent backdrop-blur-md transition-all shadow-neon-blue"
          title="Open Fullscreen Lightbox"
          aria-label="Open Fullscreen Lightbox"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Image index counter */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 left-4 px-3 py-1 rounded-lg bg-background-deep/80 text-text-primary text-xs font-mono border border-border-subtle backdrop-blur-md">
            {activeIndex + 1} / {allImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails list */}
      {allImages.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
          {allImages.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveIndex(idx)}
              type="button"
              className={`relative aspect-video rounded-xl overflow-hidden border transition-all ${
                activeIndex === idx
                  ? 'border-cyan-accent shadow-neon-cyan ring-1 ring-cyan-accent'
                  : 'border-border-subtle hover:border-primary-light opacity-60 hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`${title} thumbnail ${idx + 1}`}
                fill
                sizes="120px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            type="button"
            className="absolute top-6 right-6 p-3 rounded-full bg-background-surface text-text-primary hover:text-cyan-accent border border-border-subtle transition-all"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {allImages.length > 1 && (
            <>
              <button
                onClick={() =>
                  setActiveIndex((prev) => (prev - 1 + allImages.length) % allImages.length)
                }
                type="button"
                className="absolute left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background-surface/80 text-cyan-accent hover:text-white border border-border-subtle hover:border-cyan-accent transition-all"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={() =>
                  setActiveIndex((prev) => (prev + 1) % allImages.length)
                }
                type="button"
                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-background-surface/80 text-cyan-accent hover:text-white border border-border-subtle hover:border-cyan-accent transition-all"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center">
            <Image
              src={allImages[activeIndex]}
              alt={`${title} fullscreen`}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
