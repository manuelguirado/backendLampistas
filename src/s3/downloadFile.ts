import jwt, { SignOptions } from 'jsonwebtoken';
import type { UserType } from '../utils/types/userType';
import { getUserID } from '../utils/getUserID';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getFileUrl } from '../utils/getFileUrl';
import { userPermissions } from './permissions';

import { s3Config } from '../shared/s3Config';

import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });

const s3Client = new S3Client(s3Config);

export async function downloadFile(
  id: number,
  userType: UserType,

  incidentID?: number,
) {
  try {
    const [User, permissions, fileURL] = await Promise.all([
      getUserID(userType, id),
      userPermissions(id, userType),
      getFileUrl(id, userType, incidentID),
    ]);
    if (!User) {
      throw new Error('User not found');
    }
    if (!permissions) {
      throw new Error('User does not have permission to download files');
    }
    if (!fileURL) {
      throw new Error('File URL not found in database');
    }
    const params = {
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME as string,
      Key: fileURL.objectKey,
    };

    const command = new GetObjectCommand(params);
    const data = await s3Client.send(command);

    const payload = { id, userType, role: User.role };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return {
      data,
      token,
    };
  } catch (error) {
    throw new Error(`Error downloading file: ${error}`);
  }
}
