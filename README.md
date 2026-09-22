# Supreethaa's Birthday Memories - Secure Responsive VOD Platform

A private, high-performance Video-on-Demand (VOD) web application built with **Next.js 15**, **React 19**, **TypeScript**, and **Tailwind CSS**, designed for streaming pre-recorded birthday event videos with real-time visual filters, custom zoom & pan controls, and Cloudflare R2 object storage integration.

---

## 🌟 Key Features

1. **Password Protection**:
   - Server-side HttpOnly JWT session cookies (`/api/auth/login`, `/api/auth/logout`, `/api/auth/check`).
   - Default guest password: `supbirthday2026` (configurable via `.env.local` or Vercel Environment Variables).

2. **Custom HTML5 Video Player**:
   - **Progressive HTTP Streaming**: Supports byte-range requests for instant playback without downloading full files.
   - **9 Real-Time Client-Side Visual Filters**: Original, Cinematic Warm, Vintage Dream, Retro 90s, Classic B&W Noir, Cyber Neon, Warm Party Glow, Vibrant Celebration, Soft Focus Glow.
   - **Interactive Zoom & Pan**: Zoom scale from 100% to 300% with click-and-drag panning.
   - **Display Aspect Fit Modes**: Toggle between **Fit (Native 16:9)**, **Fill (Seamlessly eliminates side black bars)**, and **Stretch**.
   - **Full Playback Controls**: Play/Pause, Timeline Seek with buffer visualization, Volume & Mute, Playback Speed (0.5x to 2.0x), Picture-in-Picture, Fullscreen, and Keyboard shortcuts.
   - **Resume Playback**: Remembers timestamps in `localStorage`.

3. **Cloudflare R2 Storage Integration**:
   - Zero bandwidth egress costs.
   - Compatible with Cloudflare R2 public bucket URLs and custom domains.

---

## 📹 Video Analysis Summary

| Video Title | Source File Name | Duration | Size | Resolution | Codec |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Part 1: Grand Entry & Cake Cutting** | `Entry and Cake Cutting Introduction.MOV` | 5m 14s | 346 MB | 1920x1080 (16:9) | HEVC (H.265) / AAC |
| **Part 2: Sudharshan - Game Intro** | `Sudharshan - Sup Game Introduction.MOV` | 1m 42s | 114 MB | 1920x1080 (16:9) | HEVC (H.265) / AAC |
| **Part 3: Supreethaa's Birthday Game** | `Supreethaa's Birthday Game.MOV` | 1h 43m 53s | 5.99 GB | 1920x1080 (16:9) | HEVC (H.265) / AAC |

---

## ☁️ Cloudflare R2 Upload & Setup Guide

### Step 1: Create R2 Bucket
1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. Select **R2** in the sidebar -> Click **Create bucket**.
3. Name your bucket (e.g., `sup-birthday-videos`).

### Step 2: Configure CORS Policy
In Bucket Settings -> **CORS Policy**, paste:
```json
[
  {
    "AllowedOrigins": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedHeaders": ["*"],
    "ExposeHeaders": ["Content-Range", "Content-Length", "Accept-Ranges"]
  }
]
```

### Step 3: Enable Public Access or Connect Custom Domain
1. In Bucket Settings -> **Public Access**, click **Connect Custom Domain** (e.g. `videos.yourdomain.com`) or enable the **R2.dev Public Bucket URL**.
2. Copy the public base URL (e.g. `https://pub-xxxxxxxxxxxxxx.r2.dev`).

### Step 4: Upload Video Files
Upload the 3 videos into your R2 bucket root:
- `Entry and Cake Cutting Introduction.MOV` (or `.mp4`)
- `Sudharshan - Sup Game Introduction.MOV` (or `.mp4`)
- `Supreethaa's Birthday Game.MOV` (or `.mp4`)

### Step 5: Configure Environment Variables
Create `.env.local` or add in Vercel settings:
```env
APP_PASSWORD=supbirthday2026
SESSION_SECRET=your-random-32-character-secret-key
NEXT_PUBLIC_R2_BASE_URL=https://pub-xxxxxxxxxxxxxx.r2.dev
```

---

## 🎬 Optional FFmpeg H.264 Conversion (For Universal Compatibility)

Apple devices capture video in H.265/HEVC. Converting to standard H.264 MP4 with `+faststart` places the video index at the beginning of the file, allowing instant progressive playback across all browsers (including Firefox and older Androids):

```bash
# Convert Video 1
ffmpeg -i "Entry and Cake Cutting Introduction.MOV" -c:v libx264 -preset medium -crf 22 -c:a aac -b:a 192k -movflags +faststart "entry-and-cake-cutting.mp4"

# Convert Video 2
ffmpeg -i "Sudharshan - Sup Game Introduction.MOV" -c:v libx264 -preset medium -crf 22 -c:a aac -b:a 192k -movflags +faststart "sudharshan-game-intro.mp4"

# Convert Video 3 (6 GB -> ~2.2 GB)
ffmpeg -i "Supreethaa's Birthday Game.MOV" -c:v libx264 -preset medium -crf 22 -c:a aac -b:a 192k -movflags +faststart "supreethaa-birthday-game.mp4"
```

---

## 🚀 Local Development & Deployment

### Run Locally
```bash
# 1. Install dependencies
npm install

# 2. Run dev server
npm run dev

# 3. Open browser at http://localhost:3000
```

### Deploy to Vercel
1. Push repository to GitHub.
2. Import project into Vercel.
3. Add Environment Variables:
   - `APP_PASSWORD`
   - `SESSION_SECRET`
   - `NEXT_PUBLIC_R2_BASE_URL`
4. Click **Deploy**.
