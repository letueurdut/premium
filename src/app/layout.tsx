import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import './globals.css';

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400','500','600','700','800'], variable: '--font-playfair', display: 'swap' });
const dmSans   = DM_Sans({ subsets: ['latin'], weight: ['300','400','500','600','700'], variable: '--font-dm-sans', display: 'swap' });

export const metadata: Metadata = {
  title: { default: 'Dark Desires', template: '%s — Dark Desires' },
  description: 'Task management. Authority. Execution.',
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="fr" className={`dark ${playfair.variable} ${dmSans.variable}`} suppressHydrationWarning>
        <body className="min-h-screen bg-p-black text-p-text font-body antialiased">{children}</body>
      </html>
    </ClerkProvider>
  );
}