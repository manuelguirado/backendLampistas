import jwt, { SignOptions } from 'jsonwebtoken';
import type { UserType } from '../utils/types/userType';
import { getUserID } from '../utils/getUserID';
import { HeadObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getFileUrl } from '../utils/getFileUrl';
import { userPermissions } from './permissions';
import { s3Config } from '../shared/s3Config';
import { generateDownloadSignedUrl } from './signedUrl';

import dotenv from 'dotenv';

dotenv.config();

const s3Client = new S3Client(s3Config);

export async function listFiles(
  id: number,
  userType: UserType,
  incidentID?: number,
) {
  try {
    const [User, permissions, Files] = await Promise.all([
      getUserID(userType, id),
      userPermissions(id, userType),
      getFileUrl(id, userType, incidentID),
    ]);
    console.log('Files from DB:', Files);

    if (!User) throw new Error('User not found');
    if (!permissions)
      throw new Error('User does not have permission to list files');
    if (!Files || Files.length === 0)
      throw new Error('No files found for this incident');

    // Extraer todos los objectKeys para filtrar
    const dbObjectKeys = Files.map((f) => f.objectKey).filter(Boolean);

    const bucketName = process.env.CLOUDFLARE_BUCKET_NAME as string;

    const validFiles: {
      bucketName: string;
      url: string;
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

        const fileData = Files.find((f) => f.objectKey === key);
        validFiles.push({
          bucketName: bucketName,
          url: fileData?.url || '',
          key,
          lastModified: headResponse.LastModified,
          size: headResponse.ContentLength,
        });
      } catch (error) {
        console.error(`File ${key} not found in S3:`, error);
      }
    }

    const secret = process.env.JWT_SECRET as string;

    // Generar signed URLs para cada archivo
    const signedFiles = await Promise.all(
      validFiles.map(async (file) => {
        const signOptions: SignOptions = {
          expiresIn: '15m',
          subject: JSON.stringify({
            bucketName: bucketName,
            key: file.key,
            userID: id,
            userType,
          }),
        };
        const token = jwt.sign({}, secret, signOptions);

        // Generar signed URL real para descarga
        const downloadSignedUrl = await generateDownloadSignedUrl(
          bucketName,
          file.key,
        );

        return {
          bucketName: bucketName,
          url: file.url,
          key: file.key,
          lastModified: file.lastModified,
          size: file.size,
          signedUrl: downloadSignedUrl,
          token,
        };
      }),
    );
    return signedFiles;
  } catch (error) {
    throw new Error(`Error listing files: ${error}`);
  }
}
