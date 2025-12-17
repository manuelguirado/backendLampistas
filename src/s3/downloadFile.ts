import jwt, { SignOptions } from 'jsonwebtoken';
import type { UserType } from '../utils/types/userType';
import { getUserID } from '../utils/getUserID';
import { ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import { userPermissions } from './permissions';
import { s3Config } from '../shared/s3Config';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });

const s3Client = new S3Client(s3Config);
export async function downloadFile(
  id: number,
  userType: UserType,
  folder: string,
  objectKey: string,
) {
  try {
    const [isValid, permissions] = await Promise.all([
      getUserID(userType, id),
      userPermissions(id, userType),
    ]);
    if (!isValid) {
      throw new Error('User not found');
    }
    if (!permissions) {
      throw new Error('User does not have permission to download files');
    }
    const params = {
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME as string,
      Prefix: `${folder}/${objectKey}`,
    };
    const command = new ListObjectsV2Command(params);
    const data = await s3Client.send(command);
    if (!data.Contents || data.Contents.length === 0) {
      throw new Error('File not found');
    }
    const file = data.Contents.find((item) => item.Key === objectKey);

    const payload = { id, userType, role: isValid.role };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return {
      file,
      token,
    };
  } catch (error) {
    throw new Error(`Error downloading file: ${error}`);
  }
}
