import { s3Config } from '../shared/s3Config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import { validateFile } from '../utils/validateFile';
import { PrismaClient } from '../../generated/prisma';
import type { UserType } from '../utils/types/userType';
import dotenv from 'dotenv';
import { getUserID } from '../utils/getUserID';
import jwt, { SignOptions } from 'jsonwebtoken';
import { userPermissions } from '../s3/permissions';
dotenv.config({ path: '../../../.env' });
const s3Client = new S3Client(s3Config);
const prisma = new PrismaClient();
export const upload = multer({ storage: multer.memoryStorage() });
async function saveDataInDB(
  id: number,
  userType: UserType,
  fileURL: string,
  objectKey: string,
  uploadedAt: Date,
) {
  {
    const getId = await getUserID(userType, id);
    if (!getId) {
      throw new Error('User not found');
    }
    switch (userType) {
      case 'company':
        await prisma.companyFiles.create({
          data: {
            companyID: id,
            fileURL,
            objectKey,

            uploadedAt: uploadedAt,
          },
        });
        break;
      case 'user':
        await prisma.userFiles.create({
          data: {
            userID: id,
            fileURL,
            objectKey,
            uploadedAt: uploadedAt,
          },
        });
        break;
      case 'worker':
        await prisma.workerFiles.create({
          data: {
            workerID: id,
            fileURL,
            objectKey,
            uploadedAt: uploadedAt,
          },
        });
        break;
      default:
        throw new Error('Invalid user type');
    }
  }
}
export async function uploadFile(
  file: Express.Multer.File,
  folder: string,
  id: number,
  userType: UserType,
) {
  if (!file) {
    throw new Error('File is required');
  }

  // Validar archivo y usuario en paralelo
  const [isValid, user, userPermission] = await Promise.all([
    validateFile(file.buffer, file.originalname),
    getUserID(userType, id),
    userPermissions(id, userType),
  ]);

  if (!isValid) throw new Error('Invalid file type');
  if (!user) throw new Error('User not found');
  if (!userPermission)
    throw new Error('User does not have permission to upload files');
  const params = {
    Bucket: process.env.CLOUDFLARE_BUCKET_NAME as string,
    Key: `${folder}/${Date.now()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));

    const fileUrl = `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.CLOUDFLARE_BUCKET_NAME}/${params.Key}`;
    const uploadedAt = new Date();

    await saveDataInDB(id, userType, fileUrl, params.Key, uploadedAt);
    const payload = { id, userType, role: user.role };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return {
      fileURL: fileUrl,
      objectKey: params.Key,
      uploadedAt,
      token,
    };
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new Error('Error uploading file');
  }
}
