import { NextRequest, NextResponse } from 'next/server';
import { isAuthenticated } from '@/lib/auth';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  // Check auth
  const authed = await isAuthenticated();
  if (!authed) {
    return new NextResponse('Unauthorized access', { status: 401 });
  }

  const searchParams = request.nextUrl.searchParams;
  const fileName = searchParams.get('file');

  if (!fileName) {
    return new NextResponse('File parameter missing', { status: 400 });
  }

  // Prevent path traversal attacks
  const safeFileName = path.basename(fileName);
  const filePath = path.join(process.cwd(), 'Videos', safeFileName);

  if (!fs.existsSync(filePath)) {
    return new NextResponse('Video file not found', { status: 404 });
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = request.headers.get('range');

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    
    const fileStream = fs.createReadStream(filePath, { start, end });
    const headers = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize.toString(),
      'Content-Type': 'video/quicktime',
    };

    // @ts-expect-error Next Response typing for ReadableStream
    return new NextResponse(fileStream, {
      status: 206,
      headers,
    });
  } else {
    const headers = {
      'Content-Length': fileSize.toString(),
      'Content-Type': 'video/quicktime',
      'Accept-Ranges': 'bytes',
    };

    const fileStream = fs.createReadStream(filePath);
    // @ts-expect-error Next Response typing for ReadableStream
    return new NextResponse(fileStream, {
      status: 200,
      headers,
    });
  }
}
