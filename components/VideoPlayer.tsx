'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { VideoItem, VisualFilter, AspectRatioFit } from '@/types/video';
import { getFilterById } from '@/lib/filters';
import { downloadVideoFile } from '@/lib/videos';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  FastForward,
  Rewind,
  AlertTriangle,
  PictureInPicture2,
  Download,
} from 'lucide-react';

interface VideoPlayerProps {
  video: VideoItem;
  streamUrl: string;
  filter: VisualFilter;
  zoomLevel: number;
  aspectFit: AspectRatioFit;
}

export default function VideoPlayer({
  video,
  streamUrl,
  filter,
  zoomLevel,
  aspectFit,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);

  // Playback States
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(video.durationSeconds);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Resume State
  const [resumePrompt, setResumePrompt] = useState<number | null>(null);

  // Pan / Dragging state when zoomed
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });

  // Load Saved Time
  useEffect(() => {
    try {
      const stored = localStorage.getItem(`sup_video_progress_${video.id}`);
      if (stored) {
        const time = parseFloat(stored);
        if (time > 10 && time < video.durationSeconds - 15) {
          setResumePrompt(time);
        }
      }
    } catch (e) {
      console.error('Error loading stored timestamp', e);
    }
  }, [video.id, video.durationSeconds]);

  // Save Progress periodically
  useEffect(() => {
    if (currentTime > 5) {
      try {
        localStorage.setItem(`sup_video_progress_${video.id}`, currentTime.toString());
      } catch (e) {
        console.error('Error saving progress', e);
      }
    }
  }, [currentTime, video.id]);

  // Video event handlers
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      if (videoRef.current.duration && !isNaN(videoRef.current.duration)) {
        setDuration(videoRef.current.duration);
      }
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      setIsBuffering(false);
      setHasError(false);
    }
  };

  const handleWaiting = () => setIsBuffering(true);
  const handlePlaying = () => {
    setIsBuffering(false);
    setIsPlaying(true);
  };
  const handlePause = () => setIsPlaying(false);

  const handleError = () => {
    setIsBuffering(false);
    setHasError(true);
    setErrorMessage(
      'The video stream could not be loaded. Please verify your Cloudflare R2 storage link or local file configuration.'
    );
  };

  // Toggle Play / Pause
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch((err) => {
        console.error('Autoplay error:', err);
      });
    }
  };

  // Seek
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  // Skip Seconds
  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      const newTime = Math.min(Math.max(0, videoRef.current.currentTime + seconds), duration);
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  // Volume
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.volume = volume || 1;
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  // Speed
  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  // Fullscreen
  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => console.error(err));
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => console.error(err));
    }
  };

  // Picture in Picture
  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else if (document.pictureInPictureEnabled) {
        await videoRef.current.requestPictureInPicture();
      }
    } catch (err) {
      console.error('PiP Error:', err);
    }
  };

  // Resume Handler
  const handleResumeChoice = (resume: boolean) => {
    if (resume && resumePrompt && videoRef.current) {
      videoRef.current.currentTime = resumePrompt;
      setCurrentTime(resumePrompt);
      videoRef.current.play().catch(() => {});
    }
    setResumePrompt(null);
  };

  // Keyboard Shortcuts
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'KeyF') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.code === 'KeyM') {
        e.preventDefault();
        toggleMute();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        skipTime(10);
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        skipTime(-10);
      }
    },
    [isPlaying, isMuted, duration]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Dragging logic for Zoomed video
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - panPosition.x, y: e.clientY - panPosition.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    const maxOffset = (zoomLevel - 1) * 200;
    const newX = Math.min(maxOffset, Math.max(-maxOffset, e.clientX - dragStartRef.current.x));
    const newY = Math.min(maxOffset, Math.max(-maxOffset, e.clientY - dragStartRef.current.y));
    setPanPosition({ x: newX, y: newY });
  };

  const handleMouseUp = () => setIsDragging(false);

  useEffect(() => {
    if (zoomLevel === 1) {
      setPanPosition({ x: 0, y: 0 });
    }
  }, [zoomLevel]);

  const objectFitStyle = aspectFit === 'cover' ? 'cover' : aspectFit === 'fill' ? 'fill' : 'contain';
  const filterDef = getFilterById(filter);

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = Math.floor(secs % 60);
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={playerContainerRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className="relative w-full rounded-xl overflow-hidden glass-panel border border-zinc-800/60 shadow-2xl bg-black flex flex-col group/player"
    >
      {/* Resume playback banner */}
      {resumePrompt && (
        <div className="absolute top-4 left-4 right-4 z-40 p-3 rounded-lg bg-zinc-950/95 border border-pink-400/50 backdrop-blur-md text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
          <div className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full bg-pink-400" />
            <span>
              Resume playback from <strong className="text-pink-300 font-mono">{formatTime(resumePrompt)}</strong>?
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleResumeChoice(true)}
              className="px-3 py-1 rounded bg-pink-400 text-black font-bold text-xs hover:bg-pink-300 transition-colors"
            >
              Resume
            </button>
            <button
              onClick={() => handleResumeChoice(false)}
              className="px-3 py-1 rounded bg-zinc-800 text-zinc-300 text-xs font-medium hover:bg-zinc-700 transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      )}

      {/* Main Viewport */}
      <div
        onMouseDown={handleMouseDown}
        className={`relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden ${
          zoomLevel > 1 ? 'cursor-grab active:cursor-grabbing' : ''
        }`}
      >
        {/* Buffering Indicator */}
        {isBuffering && !hasError && (
          <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 border-2 border-pink-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-xs font-medium text-pink-300 tracking-wider">
                Buffering...
              </span>
            </div>
          </div>
        )}

        {/* Error Display */}
        {hasError && (
          <div className="absolute inset-0 z-30 bg-zinc-950 p-6 flex flex-col items-center justify-center text-center">
            <AlertTriangle className="w-10 h-10 text-rose-500 mb-3" />
            <h3 className="text-sm font-bold text-white mb-2">Stream Error</h3>
            <p className="text-xs text-zinc-400 max-w-md mb-4">{errorMessage}</p>
            <button
              onClick={() => {
                setHasError(false);
                setIsBuffering(true);
                if (videoRef.current) {
                  videoRef.current.load();
                }
              }}
              className="px-3.5 py-1.5 rounded-md bg-zinc-900 border border-zinc-700 text-xs font-semibold text-white hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retry
            </button>
          </div>
        )}

        {/* Video Element */}
        <video
          ref={videoRef}
          src={streamUrl}
          preload="auto"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onWaiting={() => {
            // Smooth buffering indicator delay
            setTimeout(() => {
              if (videoRef.current && videoRef.current.readyState < 3) {
                setIsBuffering(true);
              }
            }, 300);
          }}
          onCanPlay={() => setIsBuffering(false)}
          onPlaying={handlePlaying}
          onPause={handlePause}
          onError={handleError}
          onClick={togglePlay}
          playsInline
          className={`w-full h-full transition-transform duration-75 ${filterDef.cssClass}`}
          style={{
            objectFit: objectFitStyle,
            filter: filterDef.filterStyle,
            transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
          }}
        />

        {/* Play Overlay */}
        {!isPlaying && !isBuffering && !hasError && (
          <button
            onClick={togglePlay}
            className="absolute z-20 w-16 h-16 rounded-full bg-pink-400 text-black hover:bg-pink-300 hover:scale-105 transition-all duration-200 flex items-center justify-center pl-1 shadow-2xl shadow-pink-500/30"
          >
            <Play className="w-7 h-7 fill-black" />
          </button>
        )}
      </div>

      {/* Control Bar */}
      <div className="p-3 bg-zinc-950 border-t border-zinc-800/80 flex flex-col gap-2.5 z-20">
        {/* Seek Bar */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-medium text-pink-300 min-w-[45px]">
            {formatTime(currentTime)}
          </span>
          <div className="relative flex-grow flex items-center">
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 rounded-lg cursor-pointer accent-pink-400"
            />
          </div>
          <span className="text-xs font-mono font-medium text-zinc-500 min-w-[45px] text-right">
            {formatTime(duration)}
          </span>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          {/* Left Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-pink-300 hover:text-pink-200 transition-colors"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-pink-300" />}
            </button>

            <button
              onClick={() => skipTime(-10)}
              className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
              title="Rewind 10s"
            >
              <Rewind className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => skipTime(10)}
              className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
              title="Fast Forward 10s"
            >
              <FastForward className="w-3.5 h-3.5" />
            </button>

            {/* Volume */}
            <div className="flex items-center gap-1.5 ml-1">
              <button
                onClick={toggleMute}
                className="p-1 text-zinc-400 hover:text-zinc-200 transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4 text-zinc-400" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 accent-pink-400 hidden sm:inline-block"
              />
            </div>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2">
            {/* Speed Selector */}
            <div className="flex items-center gap-1 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
              <span className="text-[10px] text-zinc-500 font-semibold uppercase">Speed:</span>
              <select
                value={playbackSpeed}
                onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                className="bg-transparent text-xs font-mono font-medium text-pink-300 focus:outline-none cursor-pointer"
              >
                <option value={0.5} className="bg-zinc-900 text-white">0.5x</option>
                <option value={0.75} className="bg-zinc-900 text-white">0.75x</option>
                <option value={1} className="bg-zinc-900 text-white">1.0x</option>
                <option value={1.25} className="bg-zinc-900 text-white">1.25x</option>
                <option value={1.5} className="bg-zinc-900 text-white">1.5x</option>
                <option value={2} className="bg-zinc-900 text-white">2.0x</option>
              </select>
            </div>

            {/* Download */}
            <button
              onClick={() => downloadVideoFile(streamUrl, video.filename)}
              className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-pink-300 transition-colors"
              title="Download Video File"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            {/* PiP */}
            <button
              onClick={togglePiP}
              className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors hidden sm:flex"
              title="Picture in Picture"
            >
              <PictureInPicture2 className="w-3.5 h-3.5" />
            </button>

            {/* Fullscreen */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-md bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-pink-300 transition-colors"
              title="Toggle Fullscreen"
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
