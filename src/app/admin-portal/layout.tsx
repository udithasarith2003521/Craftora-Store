import type { Metadata } from 'next';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const metadata: Metadata = {
  title: 'Craftora HQ | Security Level 5',
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = 'force-dynamic';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const secretPath = process.env.ADMIN_SECRET_PATH || 'craftora-hq-7f3k9x';
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';

  return (
    <div className="min-h-screen flex bg-background-deep text-text-primary">
      {/* Sidebar */}
      <AdminSidebar secretPath={secretPath} adminUsername={adminUsername} />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="max-w-6xl mx-auto p-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
