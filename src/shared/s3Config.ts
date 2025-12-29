import dotenv from 'dotenv';

dotenv.config({ path: '../../../.env' });

export const s3Config = {
  region: 'auto',
  endpoint: process.env.S3_API || 'https://s3.amazonaws.com',
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.CLOUDFLARE_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true, // Required for Cloudflare R2
};
