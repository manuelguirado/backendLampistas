import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import { uploadFile } from '../../s3/uploadFile';
import dotenv from 'dotenv';
dotenv.config({ path: '../../../.env' });
const prisma = new PrismaClient();

export async function createIncident(
  title: string,
  description: string,
  location: string,
  userID: number,
  companyID: number,
  priority?: string,
  urgency?: boolean,
  files?: Express.Multer.File[], // Cambiado a archivos reales de Multer
) {
  if (!title || !description || !companyID) {
    throw new Error('Title, description, companyID, and workerID are required');
  }

  const foundCompany = await prisma.company.findUnique({
    where: { companyID: companyID },
  });
  if (!foundCompany) {
    throw new Error('Company not found');
  }

  const user = await prisma.user.findUnique({
    where: { userID: userID }, // ✅ userID en lugar de id
  });
  if (!user) {
    throw new Error('User not found');
  }
  const incident = await prisma.$transaction(async (tx) => {
    // Crear incidencia
    const newIncident = await tx.incidents.create({
      data: {
        title,
        description,
        location,
        userID,
        companyID,
        priority: priority || (urgency ? 'HIGH' : 'MEDIUM'),
        urgency: urgency || false,
      },
    });

    // Si hay archivos, subirlos y asociarlos a la incidencia
    if (files && files.length > 0) {
      // Subir archivos a S3 y crear registros en BD con incidentID
      const uploadedFiles = await uploadFile(
        files,
        userID,
        'user',
        newIncident.IncidentsID,
      );
    }

    return newIncident;
  });

  try {
    const payload = {
      incidentID: incident.IncidentsID,
      companyID: companyID,
      role: foundCompany.role,
    };
    const secret = process.env.JWT_SECRET as string;
    const options: SignOptions = { expiresIn: '1h' };
    const token = jwt.sign(payload, secret, options);

    return { token, ...incident };
  } catch (error) {
    console.error('Error generating JWT token:', error);
  }
}
