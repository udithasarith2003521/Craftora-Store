'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { FileUploader } from '@/components/admin/FileUploader';
import { slugify } from '@/lib/utils';
import { Save, Loader2, ArrowLeft, Plus, Sparkles, Tag, FolderPlus } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
}

interface ProductFormProps {
  initialData?: {
    id?: string;
    title: string;
    slug: string;
    description: string;
    categoryId?: string | null;
    tags?: string[] | null;
    version?: string | null;
    fileUrl: string;
    fileName: string;
    fileSize: number;
    fileType: string;
    coverImageUrl: string;
    images?: { id?: string; url: string; sortOrder?: number }[] | string[];
    status: 'published' | 'draft';
  };
  mode: 'create' | 'edit';
  secretPath: string;
}

export function ProductForm({ initialData, mode, secretPath }: ProductFormProps) {
  const router = useRouter();

  // Form states
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [isSlugManual, setIsSlugManual] = useState(Boolean(initialData?.slug));
  const [description, setDescription] = useState(initialData?.description || '');
  const [categoryId, setCategoryId] = useState<string>(initialData?.categoryId || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [version, setVersion] = useState(initialData?.version || '');
  const [status, setStatus] = useState<'published' | 'draft'>(initialData?.status || 'published');

  // File states
  const [fileUrl, setFileUrl] = useState(initialData?.fileUrl || '');
  const [fileName, setFileName] = useState(initialData?.fileName || '');
  const [fileSize, setFileSize] = useState(initialData?.fileSize || 0);
  const [fileType, setFileType] = useState(initialData?.fileType || '');

  // Image states
  const [coverImageUrl, setCoverImageUrl] = useState(initialData?.coverImageUrl || '');
  const [images, setImages] = useState<string[]>(() => {
    if (!initialData?.images) return [];
    return initialData.images.map((img) => (typeof img === 'string' ? img : img.url));
  });

  // Category state
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [newCategoryModalOpen, setNewCategoryModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);

  // Submit state
  const [submitting, setSubmitting] = useState(false);

  const fetchCategories = useCallback(async () => {
    setLoadingCategories(true);
    try {
      const res = await fetch('/api/admin/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
        if (!categoryId && data.length > 0 && mode === 'create') {
          setCategoryId(data[0].id);
        }
      }
    } catch {
      toast.error('Could not load categories');
    } finally {
      setLoadingCategories(false);
    }
  }, [categoryId, mode]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugManual) {
      setSlug(slugify(val));
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = tagInput.trim().replace(/^,+|,+$/g, '');
      if (trimmed && !tags.includes(trimmed)) {
        setTags([...tags, trimmed]);
        setTagInput('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim() || creatingCategory) return;

    setCreatingCategory(true);
    try {
      const res = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCatName.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create category');
      }

      toast.success(`Category "${data.name}" created`);
      setCategories([...categories, data]);
      setCategoryId(data.id);
      setNewCatName('');
      setNewCategoryModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Error creating category');
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validations
    if (!title.trim()) {
      toast.error('Product title is required');
      return;
    }
    if (!slug.trim()) {
      toast.error('Product slug is required');
      return;
    }
    if (!description.trim()) {
      toast.error('Product description is required');
      return;
    }
    if (!coverImageUrl) {
      toast.error('A cover image is required');
      return;
    }
    if (!fileUrl) {
      toast.error('Please upload a digital product file');
      return;
    }

    setSubmitting(true);

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      description: description.trim(),
      categoryId: categoryId || null,
      tags,
      version: version.trim() || null,
      fileUrl,
      fileName,
      fileSize,
      fileType,
      coverImageUrl,
      images,
      status,
    };

    try {
      const endpoint =
        mode === 'create'
          ? '/api/admin/products'
          : `/api/admin/products/${initialData?.id}`;

      const res = await fetch(endpoint, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save product');
      }

      toast.success(
        mode === 'create'
          ? 'Product published successfully!'
          : 'Product updated successfully!'
      );

      router.push(`/${secretPath}/products`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || 'Error saving product');
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Top action header */}
      <div className="flex items-center justify-between pb-6 border-b border-border-subtle">
        <div className="flex items-center gap-3">
          <Link
            href={`/${secretPath}/products`}
            className="p-2 rounded-xl bg-background-surface border border-border-subtle hover:border-cyan-accent text-text-secondary hover:text-cyan-accent transition-all"
            title="Back to products"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-heading text-2xl font-bold text-text-primary">
              {mode === 'create' ? 'INITIALIZE NEW ARTIFACT' : 'MODIFY ARTIFACT'}
            </h1>
            <p className="text-xs font-mono text-text-muted">
              {mode === 'create' ? 'Deploy digital assets to CDN' : `Editing: ${title}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Status selector */}
          <div className="flex items-center p-1 rounded-xl bg-background-surface border border-border-subtle text-xs font-mono">
            <button
              type="button"
              onClick={() => setStatus('published')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                status === 'published'
                  ? 'bg-emerald-500 text-background-deep font-bold'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Published
            </button>
            <button
              type="button"
              onClick={() => setStatus('draft')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                status === 'draft'
                  ? 'bg-amber-500 text-background-deep font-bold'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              Draft
            </button>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-blue-gradient hover:bg-cyan-blue-gradient-hover text-white text-xs font-mono font-bold uppercase tracking-wider shadow-neon-blue hover:shadow-neon-cyan transition-all disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Committing...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{mode === 'create' ? 'Publish Artifact' : 'Save Changes'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Core metadata (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Details */}
          <div className="p-6 rounded-2xl glass-panel border border-border-subtle space-y-5">
            <h2 className="font-heading text-base font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-accent" />
              <span>Identity & Specification</span>
            </h2>

            <div>
              <label className="block text-xs font-mono text-text-secondary uppercase mb-2">
                Artifact Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g. Cyberpunk UI HUD Vector Kit"
                required
                className="w-full px-4 py-3 rounded-xl bg-background-surface border border-border-subtle focus:border-cyan-accent focus:outline-none text-text-primary text-sm font-sans"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-text-secondary uppercase mb-2 flex items-center justify-between">
                  <span>URL Slug *</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSlugManual(false);
                      setSlug(slugify(title));
                    }}
                    className="text-[10px] text-cyan-accent hover:underline font-mono"
                  >
                    Auto-Generate
                  </button>
                </label>
                <div className="flex items-center rounded-xl bg-background-surface border border-border-subtle focus-within:border-cyan-accent px-3">
                  <span className="text-xs font-mono text-text-muted">/product/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => {
                      setIsSlugManual(true);
                      setSlug(slugify(e.target.value));
                    }}
                    placeholder="cyberpunk-ui-hud-vector-kit"
                    required
                    className="w-full py-3 px-1 bg-transparent focus:outline-none text-text-primary text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-text-secondary uppercase mb-2">
                  Version (Optional)
                </label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="e.g. 2.4.0"
                  className="w-full px-4 py-3 rounded-xl bg-background-surface border border-border-subtle focus:border-cyan-accent focus:outline-none text-text-primary text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-text-secondary uppercase mb-2">
                Description & Technical Details *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                required
                placeholder="Comprehensive overview of assets, resolutions, system compatibility, included licenses..."
                className="w-full px-4 py-3 rounded-xl bg-background-surface border border-border-subtle focus:border-cyan-accent focus:outline-none text-text-primary text-sm font-sans leading-relaxed"
              />
            </div>
          </div>

          {/* Visual Gallery */}
          <div className="p-6 rounded-2xl glass-panel border border-border-subtle space-y-4">
            <h2 className="font-heading text-base font-bold text-text-primary uppercase tracking-wider">
              Visual Asset Gallery (Max 10 Images)
            </h2>
            <ImageUploader
              coverImageUrl={coverImageUrl}
              onCoverChange={setCoverImageUrl}
              images={images}
              onImagesChange={setImages}
            />
          </div>

          {/* Digital File Package */}
          <div className="p-6 rounded-2xl glass-panel border border-border-subtle space-y-4">
            <h2 className="font-heading text-base font-bold text-text-primary uppercase tracking-wider">
              Digital Download Package (Direct CDN Blob)
            </h2>
            <FileUploader
              fileUrl={fileUrl}
              fileName={fileName}
              fileSize={fileSize}
              fileType={fileType}
              onFileUploaded={(data) => {
                setFileUrl(data.fileUrl);
                setFileName(data.fileName);
                setFileSize(data.fileSize);
                setFileType(data.fileType);
              }}
              onFileCleared={() => {
                setFileUrl('');
                setFileName('');
                setFileSize(0);
                setFileType('');
              }}
            />
          </div>
        </div>

        {/* Right Column: Taxonomy & Metadata (1 col) */}
        <div className="space-y-6">
          {/* Category selection */}
          <div className="p-6 rounded-2xl glass-panel border border-border-subtle space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-heading text-sm font-bold text-text-primary uppercase tracking-wider">
                Category Taxonomy
              </h2>
              <button
                type="button"
                onClick={() => setNewCategoryModalOpen(true)}
                className="text-xs font-mono text-cyan-accent hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>New</span>
              </button>
            </div>

            {loadingCategories ? (
              <div className="text-xs font-mono text-text-muted">Loading categories...</div>
            ) : (
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-background-surface border border-border-subtle focus:border-cyan-accent focus:outline-none text-text-primary text-xs font-mono"
              >
                <option value="">Uncategorized</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Tags */}
          <div className="p-6 rounded-2xl glass-panel border border-border-subtle space-y-4">
            <h2 className="font-heading text-sm font-bold text-text-primary uppercase tracking-wider flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-cyan-accent" />
              <span>Keyword Tags</span>
            </h2>

            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type tag and press Enter..."
              className="w-full px-4 py-2.5 rounded-xl bg-background-surface border border-border-subtle focus:border-cyan-accent focus:outline-none text-text-primary text-xs font-mono"
            />

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-background-elevated border border-border-subtle text-[11px] font-mono text-cyan-accent"
                  >
                    <span>{t}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      className="text-text-muted hover:text-rose-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Category Modal */}
      {newCategoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-sm w-full p-6 rounded-2xl glass-panel border border-border-glow shadow-neon-blue">
            <h3 className="font-heading text-base font-bold text-text-primary uppercase mb-4 flex items-center gap-2">
              <FolderPlus className="w-4 h-4 text-cyan-accent" />
              <span>Create Category</span>
            </h3>

            <input
              type="text"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              placeholder="e.g. 3D Holograms"
              className="w-full px-4 py-2.5 rounded-xl bg-background-surface border border-border-subtle focus:border-cyan-accent focus:outline-none text-text-primary text-xs font-mono mb-4"
            />

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setNewCategoryModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-background-surface border border-border-subtle text-xs font-mono text-text-secondary hover:text-text-primary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateCategory}
                disabled={creatingCategory || !newCatName.trim()}
                className="px-4 py-2 rounded-xl bg-cyan-blue-gradient text-white text-xs font-mono font-bold uppercase tracking-wider disabled:opacity-50"
              >
                {creatingCategory ? 'Saving...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
