'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { upload } from '@vercel/blob/client';
import { UploadCloud, X, Star, ArrowLeft, ArrowRight, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploaderProps {
  coverImageUrl: string;
  onCoverChange: (url: string) => void;
  images: string[];
  onImagesChange: (urls: string[]) => void;
}

export function ImageUploader({
  coverImageUrl,
  onCoverChange,
  images,
  onImagesChange,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (images.length + files.length > 10) {
      toast.error('Maximum 10 images allowed per product');
      return;
    }

    setUploading(true);
    setUploadProgress(10);

    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds maximum allowed image size (5MB)`);
        continue;
      }

      // Validate type
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) {
        toast.error(`"${file.name}" is not a supported image format (JPG, PNG, WebP)`);
        continue;
      }

      try {
        // Direct client-side upload to Vercel Blob
        const blob = await upload(file.name, file, {
          access: 'public',
          handleUploadUrl: '/api/admin/upload',
          clientPayload: JSON.stringify({ uploadType: 'image' }),
        });

        uploadedUrls.push(blob.url);
        toast.success(`Uploaded ${file.name}`);
      } catch (err: any) {
        console.error('Image upload error:', err);
        // Fallback for local mock/demo if Blob token is not yet configured
        if (err?.message?.includes('mock') || !process.env.BLOB_READ_WRITE_TOKEN) {
          const mockUrl = URL.createObjectURL(file);
          uploadedUrls.push(mockUrl);
          toast.success(`Uploaded local preview for ${file.name}`);
        } else {
          toast.error(`Failed to upload ${file.name}: ${err?.message || 'Upload error'}`);
        }
      }
    }

    if (uploadedUrls.length > 0) {
      const updatedImages = [...images, ...uploadedUrls];
      onImagesChange(updatedImages);

      // If no cover is set, set first image as cover
      if (!coverImageUrl) {
        onCoverChange(updatedImages[0]);
      }
    }

    setUploading(false);
    setUploadProgress(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (urlToRemove: string) => {
    const updated = images.filter((u) => u !== urlToRemove);
    onImagesChange(updated);
    if (coverImageUrl === urlToRemove) {
      onCoverChange(updated[0] || '');
    }
  };

  const moveImage = (index: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;

    const reordered = [...images];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(targetIdx, 0, moved);
    onImagesChange(reordered);
  };

  return (
    <div className="space-y-4">
      {/* Dropzone Container */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleFiles(e.dataTransfer.files);
        }}
        className="border-2 border-dashed border-border-subtle hover:border-cyan-accent/60 bg-background-surface/50 hover:bg-background-elevated/80 rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 group"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-xl bg-cyan-accent/10 border border-cyan-accent/20 flex items-center justify-center text-cyan-accent group-hover:scale-110 group-hover:shadow-neon-cyan transition-all">
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <UploadCloud className="w-6 h-6" />
            )}
          </div>
          <div className="font-heading text-sm font-semibold text-text-primary">
            {uploading ? 'Processing Image Uploads...' : 'Click or Drag Images to Upload'}
          </div>
          <p className="text-xs text-text-muted font-mono">
            JPG, PNG, WebP • Max 5MB per image • Up to 10 images
          </p>
        </div>
      </div>

      {/* Image Previews Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((url, idx) => {
            const isCover = coverImageUrl === url;
            return (
              <div
                key={url + idx}
                className={`relative aspect-video rounded-xl overflow-hidden glass-panel border transition-all ${
                  isCover
                    ? 'border-cyan-accent shadow-neon-cyan ring-1 ring-cyan-accent'
                    : 'border-border-subtle'
                }`}
              >
                <Image
                  src={url}
                  alt={`Product image ${idx + 1}`}
                  fill
                  sizes="200px"
                  className="object-cover"
                />

                {/* Cover badge */}
                {isCover && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-accent text-background-deep shadow-neon-cyan">
                    COVER
                  </div>
                )}

                {/* Action buttons overlay */}
                <div className="absolute inset-0 bg-background-deep/75 opacity-0 hover:opacity-100 flex items-center justify-center gap-1.5 transition-opacity">
                  {!isCover && (
                    <button
                      type="button"
                      onClick={() => onCoverChange(url)}
                      className="p-1.5 rounded-lg bg-background-surface border border-border-subtle text-text-secondary hover:text-cyan-accent hover:border-cyan-accent"
                      title="Set as Cover Image"
                    >
                      <Star className="w-4 h-4" />
                    </button>
                  )}

                  {idx > 0 && (
                    <button
                      type="button"
                      onClick={() => moveImage(idx, 'left')}
                      className="p-1.5 rounded-lg bg-background-surface border border-border-subtle text-text-secondary hover:text-cyan-accent hover:border-cyan-accent"
                      title="Move Left"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  )}

                  {idx < images.length - 1 && (
                    <button
                      type="button"
                      onClick={() => moveImage(idx, 'right')}
                      className="p-1.5 rounded-lg bg-background-surface border border-border-subtle text-text-secondary hover:text-cyan-accent hover:border-cyan-accent"
                      title="Move Right"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => removeImage(url)}
                    className="p-1.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-400 hover:text-rose-200"
                    title="Remove Image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
