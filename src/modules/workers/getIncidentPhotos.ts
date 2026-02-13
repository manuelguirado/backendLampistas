import { PrismaClient } from '../../../generated/prisma';
import jwt, { SignOptions } from 'jsonwebtoken';
import { listFiles } from '../../s3/listFiles';
const prisma = new PrismaClient();

export async function getIncidentPhotos(incidentID: number) {
  console.log('Fetching photos for incidentID:', incidentID); // Agrega este log para verificar el valor recibido
  const incident = await prisma.incidents.findUnique({
    where: { IncidentsID: incidentID },
    select: {
      userID: true,
    },
  });
  if (!incident) {
    throw new Error('Incident not found');
  }
  const files = await prisma.file.findMany({
    where: { incidentID },
    select: {
      fileURL: true,
      userID: true,
    },
  });
  console.log('Fetched files:', files); // Agrega este log para verificar los archivos obtenidos
  const token = process.env.JWT_SECRET;
  const options: SignOptions = {
    expiresIn: '1h',
  };
  const file = await listFiles(incident.userID ?? 0, 'user', incidentID);
  console.log('Files from listFiles:', file); // Agrega este log para verificar los archivos obtenidos de listFiles

  const payload = {
    incidentID,
    files: files.map((f) => f.fileURL),
  };
  const jwtToken = jwt.sign(payload, token!, options);
  return { files: file, token: jwtToken };
}
