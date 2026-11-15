import type { Metadata } from 'next';
import { Rajdhani, Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Craftora Store | Futuristic Digital Assets & Software',
    template: '%s | Craftora Store',
  },
  description: 'Download premier digital tools, UI templates, 3D assets, scripts, and software for next-generation creators and developers.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Craftora Store | Futuristic Digital Assets & Software',
    description: 'Download premier digital tools, UI templates, 3D assets, scripts, and software.',
    siteName: 'Craftora Store',
    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${rajdhani.variable} ${inter.variable} dark`}>
      <body className="min-h-screen bg-background text-text-primary antialiased bg-cyber-grid selection:bg-cyan-accent selection:text-background">
        {/* Ambient radial glows */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-primary/20 blur-[140px] rounded-full animate-pulse-slow" />
          <div className="absolute top-1/3 -right-40 w-[600px] h-[400px] bg-cyan-accent/10 blur-[130px] rounded-full" />
          <div className="absolute bottom-10 -left-40 w-[600px] h-[400px] bg-primary-light/10 blur-[130px] rounded-full" />
        </div>

        <div className="relative z-10 flex min-h-screen flex-col">
          {children}
        </div>

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#030b1f',
              border: '1px solid rgba(34, 211, 238, 0.3)',
              color: '#f1f5f9',
              boxShadow: '0 0 20px rgba(37, 99, 235, 0.3)',
            },
          }}
        />
      </body>
    </html>
  );
}
