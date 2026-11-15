'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ExternalLink,
  LogOut,
  Layers,
} from 'lucide-react';
import { toast } from 'sonner';

interface AdminSidebarProps {
  secretPath: string;
  adminUsername: string;
}

export function AdminSidebar({ secretPath, adminUsername }: AdminSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      href: `/${secretPath}/dashboard`,
    },
    {
      label: 'Products',
      icon: Package,
      href: `/${secretPath}/products`,
    },
    {
      label: 'Add Product',
      icon: PlusCircle,
      href: `/${secretPath}/products/new`,
    },
  ];

  const handleLogout = async () => {
    try {
      const res = await fetch('/api/admin/logout', { method: 'POST' });
      if (res.ok) {
        toast.success('Admin session terminated');
        window.location.href = `/${secretPath}/login`;
      }
    } catch {
      toast.error('Failed to log out');
    }
  };

  return (
    <aside className="w-64 border-r border-border-subtle bg-background-deep/95 backdrop-blur-xl flex flex-col justify-between h-screen sticky top-0">
      <div>
        {/* Brand header */}
        <div className="h-16 px-6 border-b border-border-subtle flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-cyan-accent p-[1px] shadow-neon-blue">
            <div className="w-full h-full bg-background-deep rounded-[7px] flex items-center justify-center">
              <Layers className="w-4 h-4 text-cyan-accent" />
            </div>
          </div>
          <div>
            <div className="font-heading font-bold text-sm tracking-wider text-text-primary">
              CRAFTORA <span className="text-cyan-accent">HQ</span>
            </div>
            <div className="text-[10px] font-mono text-cyan-accent uppercase tracking-widest flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              ADMIN MATRIX
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="p-4 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-mono font-medium uppercase tracking-wider transition-all ${
                  isActive
                    ? 'bg-cyan-blue-gradient text-white shadow-neon-blue'
                    : 'text-text-secondary hover:text-cyan-accent hover:bg-background-elevated'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer controls */}
      <div className="p-4 border-t border-border-subtle space-y-3">
        <div className="px-3.5 py-2 rounded-xl bg-background-surface/80 border border-border-subtle flex items-center justify-between text-xs font-mono">
          <span className="text-text-muted">Operator:</span>
          <span className="text-cyan-accent font-semibold">{adminUsername}</span>
        </div>

        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-mono text-text-secondary hover:text-cyan-accent hover:bg-background-elevated transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Public Store</span>
          </span>
          <span className="text-[10px] text-text-muted">↗</span>
        </Link>

        <button
          onClick={handleLogout}
          type="button"
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-mono uppercase tracking-wider text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span>Terminate Session</span>
        </button>
      </div>
    </aside>
  );
}
