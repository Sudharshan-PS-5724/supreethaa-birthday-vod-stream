'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Film, LogOut, Shield } from 'lucide-react';

interface HeaderProps {
  showLogout?: boolean;
}

export default function Header({ showLogout = true }: HeaderProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-zinc-800/40 px-4 lg:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Title / Brand */}
        <Link href="/library" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-lg bg-zinc-950 border border-pink-500/40 flex items-center justify-center group-hover:border-pink-400 transition-colors shadow-sm shadow-pink-500/10">
            <Film className="w-4 h-4 text-pink-300" />
          </div>
          <div>
            <h1 className="text-base md:text-lg font-bold text-zinc-100 tracking-tight group-hover:text-pink-300 transition-colors">
              Supreethaa&apos;s Birthday Vault
            </h1>
            <p className="text-[11px] text-zinc-400 font-normal">
              Private VOD Collection
            </p>
          </div>
        </Link>

        {/* Navigation & Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/library"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-all border border-zinc-800"
          >
            <Film className="w-3.5 h-3.5 text-pink-300" />
            Library
          </Link>

          {showLogout && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 border border-zinc-800 transition-all"
              title="Lock Vault"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Exit</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
