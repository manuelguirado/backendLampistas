import jwt, { SignOptions } from 'jsonwebtoken';
import type { UserType } from '../utils/types/userType';
import { getUserID } from '../utils/getUserID';
import {
  HeadObjectCommand,
  ListObjectsV2Command,
  S3Client,
} from '@aws-sdk/client-s3';
import { getFileUrl } from '../utils/getFileUrl';
import { userPermissions } from './permissions';
import { s3Config } from '../shared/s3Config';

import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const s3Client = new S3Client(s3Config);

export async function listFiles(
  id: number,
  userType: UserType,
  incidentID?: number,
) {
  console.log('Listing files for:', { id, userType, incidentID });
  try {
    const [User, permissions, Files] = await Promise.all([
      getUserID(userType, id),
      userPermissions(id, userType),
      getFileUrl(id, userType, incidentID),
    ]);
    if (!User) throw new Error('User not found');
    if (!permissions)
      throw new Error('User does not have permission to list files');
    if (!Files || Files.length === 0)
      throw new Error('No files found for this incident');
    console.log(`Found ${Files.length} files in database`);
    console.log('file urls from DB:', Files);
    // Extraer todos los objectKeys para filtrar
    const dbObjectKeys = Files.map((f) => f.objectKey).filter(Boolean);
    console.log('DB object keys to match:', dbObjectKeys);

    const bucketName = process.env.CLOUDFLARE_BUCKET_NAME as string;
    console.log(`Checking ${dbObjectKeys.length} files with HeadObject`);

    const validFiles: {
      key: string;
      lastModified: Date | undefined;
      size: number | undefined;
    }[] = [];
    for (const key of dbObjectKeys) {
      try {
        const headResponse = await s3Client.send(
          new HeadObjectCommand({
            Bucket: bucketName,
            Key: key,
          }),
        );
        console.log(`HeadObject response for ${key}:`, headResponse);
        validFiles.push({
          key,
          lastModified: headResponse.LastModified,
          size: headResponse.ContentLength,
        });
        console.log(`File ${key} exists in S3`);
      } catch (error) {
        console.log(`File ${key} not found in S3:`, error);
      }
    }

    console.log(`Found ${validFiles.length} valid files in S3`);

    const secret = process.env.JWT_SECRET as string;
    const signedFiles = validFiles.map((file) => {
      const signOptions: SignOptions = {
        expiresIn: '15m',
        subject: JSON.stringify({
          key: file.key,
          userID: id,
          userType,
        }),
      };
      const token = jwt.sign({}, secret, signOptions);
      return {
        key: file.key,
        lastModified: file.lastModified,
        size: file.size,
        signedUrl: `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${file.key}`,
        token,
      };
    });
    return signedFiles;
  } catch (error) {
    throw new Error(`Error listing files: ${error}`);
  }
}
