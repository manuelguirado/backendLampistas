import jwt, { SignOptions } from 'jsonwebtoken';
import type { UserType } from '../utils/types/userType';
import { getUserID } from '../utils/getUserID';
import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getFileUrl } from '../utils/getFileUrl';
import { userPermissions } from './permissions';
import { PrismaClient } from '../../generated/prisma';

import { s3Config } from '../shared/s3Config';

import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });

const s3Client = new S3Client(s3Config);
const prisma = new PrismaClient();

export async function downloadFile(
  id: number,
  userType: UserType,
  budgetID?: number,
  incidentID?: number,
) {
  try {
    const [User, permissions] = await Promise.all([
      getUserID(userType, id),
      userPermissions(id, userType),
    ]);

    if (!User) {
      throw new Error('User not found');
    }
    if (!permissions) {
      throw new Error('User does not have permission to download files');
    }

    let fileURL;

    if (budgetID) {
      // Buscar archivo específico del presupuesto
      const budgetFile = await prisma.file.findFirst({
        where: {
          budgetID: budgetID,
        },
      });

      if (!budgetFile) {
        throw new Error('Budget file not found');
      }

      fileURL = [
        {
          objectKey: budgetFile.objectKey,
          url: budgetFile.fileURL,
        },
      ];
    } else {
      // Para otros casos (incidentes), usar la función original
      fileURL = await getFileUrl(id, userType, incidentID);
    }

    if (!fileURL || fileURL.length === 0) {
      throw new Error('File URL not found in database');
    }

    const params = {
      Bucket: process.env.CLOUDFLARE_BUCKET_NAME as string,
      Key: fileURL[0].objectKey,
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
