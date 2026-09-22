import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import PasswordGate from '@/components/PasswordGate';

export default async function LandingPage() {
  const authed = await isAuthenticated();

  if (authed) {
    redirect('/library');
  }

  return (
    <main className="flex-grow flex flex-col items-center justify-center p-4 md:p-8 min-h-screen">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        {/* Landing Hero */}
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold uppercase tracking-widest bg-pink-500/15 text-pink-300 border border-pink-400/30 mb-4 shadow-sm shadow-pink-500/10">
            Private VOD Vault
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-3">
            Supreethaa&apos;s Birthday Vault
          </h1>
          <p className="text-sm md:text-base text-zinc-400 max-w-lg mx-auto font-normal leading-relaxed italic">
            You can&apos;t see me crying
          </p>
        </div>

        {/* Password Gate Card */}
        <PasswordGate />
      </div>
    </main>
  );
}
