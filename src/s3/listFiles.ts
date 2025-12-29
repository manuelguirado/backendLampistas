import jwt, { SignOptions } from 'jsonwebtoken';
import type { UserType } from '../utils/types/userType';
import { getUserID } from '../utils/getUserID';
import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import { getFileUrl } from '../utils/getFileUrl';
import { userPermissions } from './permissions';
import { s3Config } from '../shared/s3Config';

import dotenv from 'dotenv';

dotenv.config({ path: '../../../.env' });

const s3Client = new S3Client(s3Config);

export async function listFiles(
  id: number,
  userType: UserType,
  incidentID?: number,
) {
  try {
    const [User, permissions, File] = await Promise.all([
      getUserID(userType, id),
      userPermissions(id, userType),
      getFileUrl(id, userType, incidentID),
    ]);
    if (!User) throw new Error('User not found');
    if (!permissions)
      throw new Error('User does not have permission to list files');
    if (!File) throw new Error('No files found for this incident');
    console.log('File info:', File);
    console.log('🔍 Debugging:', {
      userType,
      id,
      prefix: `/lampistas/${userType}/${File.url}/`,
    });

    const params = {
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME as string,
      Prefix: `lampistas/${userType}/`, // Sin / al inicio
    };
    console.log('Listing files with params:', params);
    const command = new ListObjectsV2Command(params);
    const data = await s3Client.send(command);
    console.log('S3 ListObjectsV2Command data:', data);
    const files =
      data.Contents?.map((item) => ({
        key: item.Key,
        lastModified: item.LastModified,
        size: item.Size,
      })) || [];

    const secret = process.env.JWT_SECRET as string;
    const signedFiles = files.map((file) => {
      const signOptions: SignOptions = {
        expiresIn: '15m',
        subject: JSON.stringify({
          key: File.url,
          userID: id,
          userType: userType,
        }),
      };
      const token = jwt.sign({}, secret, signOptions);
      return {
        ...file,
        signedUrl: `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${File.url}`,
        token,
      };
    });
    return signedFiles;
  } catch (error) {
    throw new Error(`Error listing files: ${error}`);
  }
}
