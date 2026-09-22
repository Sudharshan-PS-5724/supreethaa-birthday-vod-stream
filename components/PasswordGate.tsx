'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, KeyRound, Shield, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function PasswordGate() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) {
      setError('Please enter the access password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        router.push('/library');
        router.refresh();
      } else {
        setError(data.error || 'Incorrect access password. Please try again.');
      }
    } catch (err) {
      console.error('Login submit error:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto p-6 md:p-8 rounded-2xl glass-panel-luxury border border-zinc-800">
      {/* Top Pink Accent Line */}
      <div className="absolute top-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-pink-400/60 to-transparent" />

      {/* Header */}
      <div className="flex flex-col items-center text-center mb-8">
        <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-pink-500/40 flex items-center justify-center mb-4 shadow-lg shadow-pink-500/10">
          <Shield className="w-6 h-6 text-pink-300" />
        </div>

        <span className="text-[11px] font-semibold uppercase tracking-widest text-pink-300 mb-2">
          Private Access
        </span>

        <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
          Supreethaa&apos;s Birthday Vault
        </h2>
        <p className="text-xs text-zinc-400 mt-1 font-normal">
          Enter your password to unlock video collection
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-3 rounded-lg bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Password Form */}
      <form onSubmit={handleSubmit} suppressHydrationWarning className="space-y-4">
        <div>
          <label className="block text-[11px] font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500 z-10">
              <KeyRound className="w-4 h-4" />
            </div>
            <input
              key={showPassword ? 'text-mode' : 'password-mode'}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              suppressHydrationWarning
              className={`w-full pl-9 pr-10 py-2.5 rounded-lg bg-black border border-zinc-800 text-sm focus:outline-none focus:border-pink-400/60 focus:ring-1 focus:ring-pink-400/30 transition-all ${
                showPassword ? 'text-pink-300 font-mono tracking-wider font-semibold' : 'text-zinc-100'
              }`}
              autoFocus
              required
            />
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.preventDefault();
                setShowPassword((prev) => !prev);
              }}
              suppressHydrationWarning
              tabIndex={-1}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-400 hover:text-pink-300 transition-colors z-20 cursor-pointer select-none"
              title={showPassword ? 'Password is visible' : 'Password is hidden'}
            >
              {showPassword ? (
                <Eye className="w-4 h-4 text-pink-300 pointer-events-none" />
              ) : (
                <EyeOff className="w-4 h-4 text-zinc-500 pointer-events-none" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          suppressHydrationWarning
          className="w-full py-2.5 px-4 rounded-lg font-bold text-xs uppercase tracking-wider text-black bg-pink-400 hover:bg-pink-300 shadow-lg shadow-pink-500/20 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <Lock className="w-3.5 h-3.5" />
              <span>Unlock Collection</span>
            </>
          )}
        </button>
      </form>

      {/* Footer Credentials Info */}
      <div className="mt-6 text-center text-[11px] text-zinc-500 border-t border-zinc-800/60 pt-4">
        Default Password: <code className="text-pink-300 font-mono font-bold tracking-wider uppercase">ASK MADAM</code>
      </div>
    </div>
  );
}
