import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import BackgroundDecor from '@/components/BackgroundDecor';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Supreethaa's Birthday Memories | Private VOD Vault",
  description: 'Exclusive, password-protected responsive Video-on-Demand platform featuring interactive visual filters, zoom controls, and Cloudflare storage integration.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jakarta.variable}`}>
      <body
        suppressHydrationWarning
        className="relative bg-[#050508] text-zinc-100 font-sans min-h-screen antialiased selection:bg-pink-400 selection:text-black"
      >
        <BackgroundDecor />
        <div className="relative z-10 min-h-screen flex flex-col">{children}</div>
      </body>
    </html>
  );
}
