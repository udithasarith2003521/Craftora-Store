'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, Lock, User, KeyRound, Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || loading) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || 'Invalid credentials');
        toast.error(data.error || 'Authentication rejected');
        setLoading(false);
        return;
      }

      toast.success('Access granted. Initializing matrix...');
      // Read current location to stay within the secret path
      const currentPath = window.location.pathname;
      const secretPathPrefix = currentPath.substring(0, currentPath.lastIndexOf('/login')) || '';
      window.location.href = `${secretPathPrefix}/dashboard`;
    } catch {
      setErrorMessage('An unexpected network error occurred');
      toast.error('Network error during authentication');
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background-deep bg-cyber-grid">
      {/* Background glow spot */}
      <div className="absolute w-[500px] h-[500px] bg-primary/20 blur-[130px] rounded-full pointer-events-none" />

      <div className="relative w-full max-w-md p-8 rounded-2xl glass-panel border border-border-glow shadow-neon-blue backdrop-blur-2xl">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-gradient-to-br from-primary to-cyan-accent p-[1px] shadow-neon-cyan">
            <div className="w-full h-full bg-background-deep rounded-[11px] flex items-center justify-center">
              <ShieldAlert className="w-7 h-7 text-cyan-accent" />
            </div>
          </div>

          <h1 className="font-heading text-2xl font-bold tracking-wider text-text-primary">
            CRAFTORA <span className="text-cyan-accent">SECURITY</span>
          </h1>
          <p className="text-xs font-mono text-text-muted mt-1 uppercase tracking-widest">
            Level 5 Restricted Access Node
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3 text-rose-400 text-xs font-mono">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-text-secondary uppercase tracking-wider mb-2">
              Operator Identifier
            </label>
            <div className="relative">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
                placeholder="Enter admin username"
                className="w-full px-4 py-3 pl-10 rounded-xl bg-background-surface border border-border-subtle focus:border-cyan-accent focus:shadow-neon-cyan focus:outline-none text-text-primary text-sm font-sans transition-all disabled:opacity-50"
              />
              <User className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-text-secondary uppercase tracking-wider mb-2">
              Access Cipher (Password)
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 pl-10 rounded-xl bg-background-surface border border-border-subtle focus:border-cyan-accent focus:shadow-neon-cyan focus:outline-none text-text-primary text-sm font-sans transition-all disabled:opacity-50"
              />
              <KeyRound className="w-4 h-4 text-text-muted absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 py-3 px-4 rounded-xl bg-cyan-blue-gradient hover:bg-cyan-blue-gradient-hover text-white text-xs font-mono font-bold uppercase tracking-widest shadow-neon-blue hover:shadow-neon-cyan transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Decrypting Protocol...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span>Authenticate Session</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-4 border-t border-border-subtle text-center">
          <p className="text-[10px] font-mono text-text-muted">
            All unauthorized access attempts are logged with IP & timestamp.
            5 sequential failures will trigger a 15-minute perimeter lockdown.
          </p>
        </div>
      </div>
    </div>
  );
}
