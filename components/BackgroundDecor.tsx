import React from 'react';

export default function BackgroundDecor() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Top subtle light pink glow */}
      <div className="absolute -top-48 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-pink-500/15 via-rose-950/10 to-transparent rounded-full blur-3xl opacity-80" />
      {/* Bottom subtle ambient depth */}
      <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-gradient-to-t from-black via-pink-950/20 to-transparent rounded-full blur-3xl" />
    </div>
  );
}
