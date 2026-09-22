import { isAuthenticated } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Header from '@/components/Header';
import VideoCard from '@/components/VideoCard';
import { BIRTHDAY_VIDEOS } from '@/lib/videos';
import { Film, HardDrive, Shield } from 'lucide-react';

export default async function LibraryPage() {
  const authed = await isAuthenticated();

  if (!authed) {
    redirect('/');
  }

  const r2Base = process.env.NEXT_PUBLIC_R2_BASE_URL;
  const isR2Configured = r2Base && r2Base.length > 0 && !r2Base.includes('demo-r2-url');

  return (
    <div className="flex-grow flex flex-col min-h-screen">
      <Header showLogout={true} />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 lg:px-8 py-8 md:py-10">
        {/* Library Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 pb-6 border-b border-zinc-800/80">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Video Library
            </h1>
          </div>

          {/* Storage Backend Badge */}
          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-lg glass-panel border border-zinc-800 text-xs font-medium flex items-center gap-2">
              <HardDrive className="w-4 h-4 text-pink-300" />
              <div>
                <span className="text-zinc-500 block text-[10px] uppercase font-semibold">Storage</span>
                <span className="text-zinc-200">
                  {isR2Configured ? 'Cloudflare R2' : 'Local Video Files'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BIRTHDAY_VIDEOS.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </main>
    </div>
  );
}
