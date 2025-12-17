import dotenv from 'dotenv';
import { S3Client } from '@aws-sdk/client-s3';

dotenv.config({ path: '../../../.env' });

export const s3Config = new S3Client({
  region: 'auto',
  endpoint: process.env.S3_API || 'https://s3.amazonaws.com',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});
