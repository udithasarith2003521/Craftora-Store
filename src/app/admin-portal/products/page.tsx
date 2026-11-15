'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Search,
  PlusCircle,
  Edit,
  Trash2,
  ExternalLink,
  Download,
  FileBox,
  Check,
  X,
  AlertTriangle,
  Loader2,
  Layers,
} from 'lucide-react';
import { formatBytes, formatDate } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImageUrl: string;
  fileSize: number;
  fileType: string;
  status: 'published' | 'draft';
  downloadCount: number;
  createdAt: string;
  category?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [deleteTarget, setDeleteTarget] = useState<ProductItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Secret admin path
  const [secretPath, setSecretPath] = useState('craftora-hq-7f3k9x');

  useEffect(() => {
    const current = window.location.pathname;
    const parts = current.split('/').filter(Boolean);
    if (parts.length > 0) {
      setSecretPath(parts[0]);
    }
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      } else {
        toast.error('Failed to load products');
      }
    } catch {
      toast.error('Network error loading products');
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (product: ProductItem) => {
    const newStatus = product.status === 'published' ? 'draft' : 'published';
    try {
      // Optimistic update
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, status: newStatus } : p))
      );

      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...product,
          status: newStatus,
          categoryId: product.category?.id || null,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      toast.success(`Product ${newStatus === 'published' ? 'published' : 'moved to drafts'}`);
    } catch (err: any) {
      // Rollback
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, status: product.status } : p))
      );
      toast.error(err.message || 'Status update failed');
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/products/${deleteTarget.id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      toast.success(`Deleted "${deleteTarget.title}" and purged storage`);
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err.message || 'Deletion error');
    } finally {
      setDeleting(false);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase()) ||
      (p.category?.name && p.category.name.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' ? true : p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-text-primary tracking-wide">
            MANAGE <span className="text-cyan-accent">ARTIFACTS</span>
          </h1>
          <p className="text-xs font-mono text-text-muted mt-1 uppercase tracking-wider">
            Catalog Inventory & Storage Control
          </p>
        </div>

        <Link
          href={`/${secretPath}/products/new`}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-blue-gradient hover:bg-cyan-blue-gradient-hover text-white text-xs font-mono font-bold uppercase tracking-wider shadow-neon-blue hover:shadow-neon-cyan transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Upload Product</span>
        </Link>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="w-full sm:w-80 relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, slug, category..."
            className="w-full px-4 py-2 pl-9 rounded-xl bg-background-surface border border-border-subtle focus:border-cyan-accent text-xs font-mono focus:outline-none text-text-primary placeholder:text-text-muted"
          />
          <Search className="w-3.5 h-3.5 text-text-muted absolute left-3 top-3" />
        </div>

        {/* Status filter chips */}
        <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-xs">
          <button
            type="button"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all ${
              statusFilter === 'all'
                ? 'bg-cyan-accent text-background-deep font-bold'
                : 'bg-background-surface text-text-secondary hover:text-text-primary'
            }`}
          >
            All ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('published')}
            className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all ${
              statusFilter === 'published'
                ? 'bg-emerald-500 text-background-deep font-bold'
                : 'bg-background-surface text-text-secondary hover:text-text-primary'
            }`}
          >
            Published ({products.filter((p) => p.status === 'published').length})
          </button>
          <button
            type="button"
            onClick={() => setStatusFilter('draft')}
            className={`px-3 py-1.5 rounded-lg uppercase tracking-wider transition-all ${
              statusFilter === 'draft'
                ? 'bg-amber-500 text-background-deep font-bold'
                : 'bg-background-surface text-text-secondary hover:text-text-primary'
            }`}
          >
            Drafts ({products.filter((p) => p.status === 'draft').length})
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl glass-panel border border-border-subtle overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-text-muted flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-cyan-accent" />
            <span className="font-mono text-xs">Retrieving inventory matrix...</span>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-text-muted font-mono text-xs">
            No artifacts found matching filter parameters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-border-subtle bg-background-surface/80 text-text-muted uppercase">
                  <th className="py-3.5 px-4 font-semibold">Visual</th>
                  <th className="py-3.5 px-4 font-semibold">Artifact / Slug</th>
                  <th className="py-3.5 px-4 font-semibold">Category</th>
                  <th className="py-3.5 px-4 font-semibold">File & Size</th>
                  <th className="py-3.5 px-4 font-semibold">Downloads</th>
                  <th className="py-3.5 px-4 font-semibold">Status</th>
                  <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/40 text-text-secondary">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-background-elevated/50 transition-colors">
                    {/* Visual */}
                    <td className="py-3 px-4">
                      <div className="relative w-12 h-8 rounded-lg overflow-hidden bg-background-deep border border-border-subtle">
                        {p.coverImageUrl ? (
                          <Image
                            src={p.coverImageUrl}
                            alt={p.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-text-muted">
                            <Layers className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Title & Slug */}
                    <td className="py-3 px-4 font-medium text-text-primary">
                      <div className="truncate max-w-[220px] font-semibold">{p.title}</div>
                      <div className="text-[10px] text-cyan-accent truncate max-w-[220px]">
                        /product/{p.slug}
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      {p.category ? (
                        <span className="px-2 py-0.5 rounded bg-primary/20 text-cyan-accent border border-primary/30 text-[10px]">
                          {p.category.name}
                        </span>
                      ) : (
                        <span className="text-text-muted text-[10px]">Unassigned</span>
                      )}
                    </td>

                    {/* File info */}
                    <td className="py-3 px-4">
                      <div className="uppercase text-text-primary font-semibold">
                        {p.fileType.split('/')[1] || p.fileType}
                      </div>
                      <div className="text-[10px] text-text-muted">{formatBytes(p.fileSize)}</div>
                    </td>

                    {/* Downloads */}
                    <td className="py-3 px-4">
                      <span className="flex items-center gap-1 text-text-primary font-bold">
                        <Download className="w-3.5 h-3.5 text-cyan-accent" />
                        {p.downloadCount}
                      </span>
                    </td>

                    {/* Status Toggle Button */}
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => toggleStatus(p)}
                        className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold uppercase transition-all flex items-center gap-1.5 ${
                          p.status === 'published'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30'
                        }`}
                        title="Click to toggle Published / Draft"
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            p.status === 'published' ? 'bg-emerald-400' : 'bg-amber-400'
                          }`}
                        />
                        <span>{p.status}</span>
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/product/${p.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-background-surface border border-border-subtle hover:border-cyan-accent text-text-secondary hover:text-cyan-accent"
                          title="View on Store"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>

                        <Link
                          href={`/${secretPath}/products/${p.id}/edit`}
                          className="p-1.5 rounded-lg bg-background-surface border border-border-subtle hover:border-cyan-accent text-text-secondary hover:text-cyan-accent"
                          title="Edit Product"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => setDeleteTarget(p)}
                          className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 hover:text-white"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="max-w-md w-full p-6 rounded-2xl glass-panel border border-rose-500/40 shadow-neon-blue">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="font-heading text-xl font-bold text-text-primary text-center">
              PERMANENT ARTIFACT DELETION
            </h3>
            <p className="mt-2 text-xs font-mono text-text-secondary text-center leading-relaxed">
              Are you sure you want to delete <span className="text-white font-bold">&quot;{deleteTarget.title}&quot;</span>?
              This will irreversibly remove the database entry and purge all associated digital files from Vercel Blob storage.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 rounded-xl bg-background-surface border border-border-subtle hover:border-text-secondary text-xs font-mono text-text-secondary hover:text-text-primary transition-all disabled:opacity-50"
              >
                Abort
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Purging...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
