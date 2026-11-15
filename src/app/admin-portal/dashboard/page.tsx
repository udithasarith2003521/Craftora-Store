import { db } from '@/db';
import { products, categories } from '@/db/schema';
import { desc, sql } from 'drizzle-orm';
import Link from 'next/link';
import {
  Package,
  Download,
  HardDrive,
  FolderTree,
  PlusCircle,
  ExternalLink,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { formatBytes, formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const secretPath = process.env.ADMIN_SECRET_PATH || 'craftora-hq-7f3k9x';

  // Fetch overview statistics
  const allProducts = await db.select().from(products).orderBy(desc(products.createdAt));
  const allCategories = await db.select().from(categories);

  const totalProducts = allProducts.length;
  const publishedCount = allProducts.filter((p: any) => p.status === 'published').length;
  const draftCount = allProducts.filter((p: any) => p.status === 'draft').length;

  const totalDownloads = allProducts.reduce((acc: number, p: any) => acc + (p.downloadCount || 0), 0);
  const totalStorageBytes = allProducts.reduce((acc: number, p: any) => acc + Number(p.fileSize || 0), 0);

  const recentProducts = allProducts.slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-border-subtle">
        <div>
          <h1 className="font-heading text-3xl font-extrabold text-text-primary tracking-wide">
            HQ COMMAND <span className="text-cyan-accent">DASHBOARD</span>
          </h1>
          <p className="text-xs font-mono text-text-muted mt-1 uppercase tracking-wider">
            Operational Overview & Telemetry
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/${secretPath}/products/new`}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-blue-gradient hover:bg-cyan-blue-gradient-hover text-white text-xs font-mono font-bold uppercase tracking-wider shadow-neon-blue hover:shadow-neon-cyan transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Product</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Metric 1 */}
        <div className="p-6 rounded-2xl glass-panel border border-border-subtle relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-text-muted uppercase tracking-wider">
              Total Catalog
            </span>
            <div className="p-2 rounded-xl bg-primary/20 text-cyan-accent">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading text-3xl font-bold text-text-primary">
            {totalProducts}
          </div>
          <div className="mt-2 text-xs font-mono text-text-secondary flex items-center gap-2">
            <span className="text-emerald-400">{publishedCount} Live</span>
            <span>•</span>
            <span className="text-amber-400">{draftCount} Drafts</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="p-6 rounded-2xl glass-panel border border-border-subtle relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-text-muted uppercase tracking-wider">
              Total Downloads
            </span>
            <div className="p-2 rounded-xl bg-primary/20 text-cyan-accent">
              <Download className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading text-3xl font-bold text-cyan-accent">
            {totalDownloads.toLocaleString()}
          </div>
          <div className="mt-2 text-xs font-mono text-text-secondary">
            Cumulative across all products
          </div>
        </div>

        {/* Metric 3 */}
        <div className="p-6 rounded-2xl glass-panel border border-border-subtle relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-text-muted uppercase tracking-wider">
              Storage Deployed
            </span>
            <div className="p-2 rounded-xl bg-primary/20 text-cyan-accent">
              <HardDrive className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading text-3xl font-bold text-text-primary">
            {formatBytes(totalStorageBytes)}
          </div>
          <div className="mt-2 text-xs font-mono text-text-secondary">
            Vercel Blob Storage Active
          </div>
        </div>

        {/* Metric 4 */}
        <div className="p-6 rounded-2xl glass-panel border border-border-subtle relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-text-muted uppercase tracking-wider">
              Categories
            </span>
            <div className="p-2 rounded-xl bg-primary/20 text-cyan-accent">
              <FolderTree className="w-4 h-4" />
            </div>
          </div>
          <div className="font-heading text-3xl font-bold text-text-primary">
            {allCategories.length}
          </div>
          <div className="mt-2 text-xs font-mono text-text-secondary">
            Active taxonomy tags
          </div>
        </div>
      </div>

      {/* Recent Uploads Table */}
      <div className="rounded-2xl glass-panel border border-border-subtle p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-accent" />
            <h2 className="font-heading text-lg font-bold text-text-primary uppercase tracking-wider">
              Recent Artifact Deployments
            </h2>
          </div>

          <Link
            href={`/${secretPath}/products`}
            className="text-xs font-mono text-cyan-accent hover:underline flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentProducts.length === 0 ? (
          <div className="text-center py-10 text-text-muted font-mono text-xs">
            No products found in system. Click &quot;Add New Product&quot; to initialize store catalog.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-border-subtle text-text-muted uppercase">
                  <th className="pb-3 font-semibold">Artifact</th>
                  <th className="pb-3 font-semibold">Format & Size</th>
                  <th className="pb-3 font-semibold">Downloads</th>
                  <th className="pb-3 font-semibold">Status</th>
                  <th className="pb-3 font-semibold">Date</th>
                  <th className="pb-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle/40 text-text-secondary">
                {recentProducts.map((p: any) => (
                  <tr key={p.id} className="hover:bg-background-elevated/50 transition-colors">
                    <td className="py-3.5 font-medium text-text-primary">
                      <div className="truncate max-w-[200px]">{p.title}</div>
                      <div className="text-[10px] text-text-muted truncate max-w-[200px]">
                        /{p.slug}
                      </div>
                    </td>
                    <td className="py-3.5">
                      <span className="uppercase text-cyan-accent">{p.fileType.split('/')[1] || p.fileType}</span>
                      <span className="text-text-muted"> • {formatBytes(p.fileSize)}</span>
                    </td>
                    <td className="py-3.5 text-text-primary">{p.downloadCount}</td>
                    <td className="py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          p.status === 'published'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-text-muted">{formatDate(p.createdAt)}</td>
                    <td className="py-3.5 text-right">
                      <Link
                        href={`/${secretPath}/products/${p.id}/edit`}
                        className="px-2.5 py-1 rounded bg-background-surface border border-border-subtle hover:border-cyan-accent text-cyan-accent text-[11px]"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
