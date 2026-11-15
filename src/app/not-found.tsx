import Link from 'next/link';
import { AlertTriangle, Home, Layers } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-radial-spotlight">
      <div className="max-w-md w-full p-8 rounded-2xl glass-panel border border-border-glow shadow-neon-blue text-center relative overflow-hidden">
        {/* Ambient top highlight */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-accent to-transparent" />

        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-cyan-accent/10 border border-cyan-accent/30 flex items-center justify-center text-cyan-accent shadow-neon-cyan">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <span className="font-mono text-xs text-cyan-accent uppercase tracking-widest block mb-2">
          ERROR 404 • SYSTEM ANOMALY
        </span>

        <h1 className="font-heading text-3xl font-extrabold text-text-primary mb-3">
          ARTIFACT NOT FOUND
        </h1>

        <p className="text-sm text-text-secondary leading-relaxed mb-8">
          The requested coordinate or digital artifact does not exist in the Craftora matrix or has been de-indexed.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-xl bg-cyan-blue-gradient hover:bg-cyan-blue-gradient-hover text-white text-sm font-semibold uppercase tracking-wider shadow-neon-blue hover:shadow-neon-cyan transition-all"
        >
          <Home className="w-4 h-4" />
          <span>Return to Store Hub</span>
        </Link>
      </div>
    </div>
  );
}
