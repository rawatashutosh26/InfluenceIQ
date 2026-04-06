import { Bebas_Neue, DM_Sans } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const display = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
});

const body = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
});

export const metadata = {
  title: 'InfluenceIQ — AI Startup Validator',
  description: 'Validate your startup idea with AI-powered insights',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="font-body antialiased min-h-screen bg-amber-50 text-zinc-900">
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-amber-200 bg-amber-50/90 backdrop-blur-md">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <Link href="/" className="font-display text-2xl tracking-wider text-zinc-900">
              INFLUENCE<span className="text-orange-600">IQ</span>
            </Link>
            <div className="flex gap-6 items-center">
              <Link href="/" className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors">
                Submit Idea
              </Link>
              <Link
                href="/dashboard"
                className="text-sm rounded-md bg-orange-600 text-amber-50 px-4 py-2 hover:bg-orange-700 transition-colors"
              >
                Dashboard →
              </Link>
            </div>
          </div>
        </nav>
        <main className="pt-16">{children}</main>
        <footer className="border-t border-amber-200 bg-amber-50">
          <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row gap-2 md:items-center md:justify-between">
            <p className="text-xs text-zinc-600">InfluenceIQ — startup idea intelligence</p>
            <p className="text-xs text-zinc-500">Create, evaluate, export, and iterate quickly.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}