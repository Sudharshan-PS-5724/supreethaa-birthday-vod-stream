import { S3Client } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load .env.local if present
dotenv.config({ path: '.env.local' });

const endpoint = process.env.R2_ENDPOINT || process.env.NEXT_PUBLIC_R2_ENDPOINT;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucketName = process.env.R2_BUCKET_NAME || 'sup-birthday-videos';

if (!endpoint || !accessKeyId || !secretAccessKey) {
  console.error('\n❌ Missing Cloudflare R2 Credentials!');
  console.error('Please make sure the following variables are set in your .env.local file:');
  console.error('  - R2_ENDPOINT (e.g., https://<account_id>.r2.cloudflarestorage.com)');
  console.error('  - R2_ACCESS_KEY_ID');
  console.error('  - R2_SECRET_ACCESS_KEY');
  console.error('  - R2_BUCKET_NAME (optional, defaults to sup-birthday-videos)\n');
  process.exit(1);
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: endpoint.startsWith('http') ? endpoint : `https://${endpoint}`,
  credentials: { accessKeyId, secretAccessKey },
});

const videos = [
  'Entry and Cake Cutting Introduction.MOV',
  'Sudharshan - Sup Game Introduction.MOV',
  "Supreethaa's Birthday Game.MOV",
];

const videosDir = path.join(process.cwd(), 'Videos');

async function uploadFiles() {
  console.log(`\n🚀 Starting R2 Terminal Upload to Bucket: "${bucketName}"...`);
  console.log(`Endpoint: ${endpoint}\n`);

  for (let i = 0; i < videos.length; i++) {
    const filename = videos[i];
    const filePath = path.join(videosDir, filename);

    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ Warning: Local file not found: ${filePath}, skipping...`);
      continue;
    }

    const stats = fs.statSync(filePath);
    const totalSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`\n[${i + 1}/${videos.length}] Uploading "${filename}" (${totalSizeMB} MB)...`);

    const fileStream = fs.createReadStream(filePath);

    const parallelUploads3 = new Upload({
      client: s3,
      params: {
        Bucket: bucketName,
        Key: filename,
        Body: fileStream,
        ContentType: filename.endsWith('.mp4') ? 'video/mp4' : 'video/quicktime',
      },
      queueSize: 4,
      partSize: 10 * 1024 * 1024, // 10MB chunks
      leavePartsOnError: false,
    });

    let lastProgress = 0;
    parallelUploads3.on('httpUploadProgress', (progress) => {
      const percentage = Math.round((progress.loaded / progress.total) * 100);
      if (percentage >= lastProgress + 5 || percentage === 100) {
        const loadedMB = (progress.loaded / (1024 * 1024)).toFixed(1);
        console.log(`  └─ Progress: ${percentage}% (${loadedMB} / ${totalSizeMB} MB)`);
        lastProgress = percentage;
      }
    });

    try {
      await parallelUploads3.done();
      console.log(`  ✅ Successfully uploaded "${filename}"`);
    } catch (err) {
      console.error(`  ❌ Failed to upload "${filename}":`, err.message);
    }
  }

  console.log('\n🎉 All video uploads complete!\n');
}

uploadFiles();
