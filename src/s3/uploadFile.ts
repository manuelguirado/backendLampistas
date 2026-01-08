import { s3Config } from '../shared/s3Config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import { randomUUID } from 'crypto';
import { validateFile } from '../utils/validateFile';
import { PrismaClient } from '../../generated/prisma';
import type { UserType } from '../utils/types/userType';
import dotenv from 'dotenv';
import { getUserID } from '../utils/getUserID';
import jwt, { SignOptions } from 'jsonwebtoken';
import { generateUploadSignedUrl } from '../s3/signedUrl';
import { userPermissions } from '../s3/permissions';
dotenv.config({ path: '../../../.env' });
const s3Client = new S3Client(s3Config);
const prisma = new PrismaClient();
export const upload = multer({ storage: multer.memoryStorage() });
async function searchBudget(budgetID: number, userType: UserType, id: number) {
  switch (userType) {
    case 'company':
      return prisma.budget.findFirst({
        where: {
          budgetID: budgetID,
          companyID: id,
        },
      });
    case 'user':
      return prisma.budget.findFirst({
        where: {
          budgetID: budgetID,
          userID: id,
        },
      });

    default:
      throw new Error('Invalid user type');
  }
}

async function searchIncident(
  incidentID: number,
  userType: UserType,
  id: number,
) {
  switch (userType) {
    case 'company':
      return prisma.incidents.findFirst({
        where: {
          IncidentsID: incidentID,
          companyID: id,
        },
      });
    case 'user':
      return prisma.incidents.findFirst({
        where: {
          IncidentsID: incidentID,
          userID: id,
        },
      });
    case 'worker':
      return prisma.incidents.findFirst({
        where: {
          IncidentsID: incidentID,
          workerID: id,
        },
      });
    default:
      throw new Error('Invalid user type');
  }
}
async function saveDataInDB(
  id: number,
  userType: UserType,
  fileURL: string,
  objectKey: string,
  uploadedAt: Date,
  incidentID?: number,
  budgetID?: number,
) {
  {
    //valiate user and incident in parallel
    const [user, incident, budget] = await Promise.all([
      getUserID(userType, id),
      incidentID
        ? searchIncident(incidentID, userType, id)
        : Promise.resolve(null),
      budgetID ? searchBudget(budgetID, userType, id) : Promise.resolve(null),
    ]);

    if (!incidentID && incident) {
      throw new Error(
        'Incident found but no incidentID provided for file association',
      );
    }

    if (budget && !budgetID) {
      throw new Error(
        'Budget found but no budgetID provided for file association',
      );
    }

    if (!user) throw new Error('User not found');
    switch (userType) {
      case 'company':
        await prisma.file.create({
          data: {
            companyID: id,
            fileURL,
            objectKey,
            ownerType: 'COMPANY',
            ownerId: id,
            uploadedAt: uploadedAt,
            incidentID, // ✅ Incluir incidentID
            budgetID, // ✅ Incluir budgetID
          },
        });

        break;
      case 'user':
        await prisma.file.create({
          data: {
            userID: id,
            fileURL,
            objectKey,
            ownerType: 'USER',
            ownerId: id,
            uploadedAt: uploadedAt,
            incidentID, // ✅ Incluir incidentID
            budgetID, // ✅ Incluir budgetID
          },
        });

        break;
      case 'worker':
        await prisma.file.create({
          data: {
            workerID: id,
            fileURL,
            objectKey,
            ownerType: 'WORKER',
            ownerId: id,
            incidentID, // ✅ Incluir incidentID
            budgetID, // ✅ Incluir budgetID
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
  file: Array<Express.Multer.File>,
  id: number,
  userType: UserType,
  incidentID?: number, // Nuevo parámetro opcional
  budgetID?: number, // Nuevo parámetro opcional
) {
  console.log('budgetid in uploadFile:', budgetID);
  if (!file) {
    throw new Error('File is required');
  }

  // Validar archivo y usuario en paralelo
  const [isValid, user, userPermission] = await Promise.all([
    validateFile(file[0].buffer, file[0].originalname),
    getUserID(userType, id),
    userPermissions(id, userType),
  ]);

  if (!isValid) throw new Error('Invalid file type');
  if (!user) throw new Error('User not found');
  if (!userPermission)
    throw new Error('User does not have permission to upload files');

  const params = {
    Bucket: process.env.CLOUDFLARE_BUCKET_NAME as string,
    Key: `${userType}/${randomUUID()}_${file[0].originalname}`,
    Body: file[0].buffer,
    ContentType: file[0].mimetype,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));

    const fileUrl = `https://${process.env.CLOUDFLARE_ACCOUNT_ID}.r2.cloudflarestorage.com/${process.env.CLOUDFLARE_BUCKET_NAME}/${params.Key}`;

    const uploadedAt = new Date();
    const generateURL = await generateUploadSignedUrl(
      process.env.CLOUDFLARE_BUCKET_NAME as string,
      fileUrl,
      file[0].mimetype,
    );
    await saveDataInDB(
      id,
      userType,
      generateURL,
      params.Key,
      uploadedAt,
      incidentID,
      budgetID,
    );

    const payload = { id, userType, role: user.role };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);
    return {
      fileURL: generateURL,
      objectKey: params.Key,
      uploadedAt,
      incidentID,
      budgetID,
      token,
    };
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new Error('Error uploading file');
  }
}
