import { PrismaClient } from '../../generated/prisma';
import type { UserType } from '../utils/types/userType';
import { getUserID } from '../utils/getUserID';
const prisma = new PrismaClient();
export async function getFileUrl(
  ownerId: number,
  ownerType: UserType,
  incidentID?: number,
) {
  console.log(incidentID);
  console.log('Getting file URL for:', {
    ownerId,
    ownerType,
    incidentID,
  });
  const getId = await getUserID(ownerType, ownerId);
  if (!getId) {
    throw new Error('User not found');
  }
  const files = await prisma.file.findMany({
    where: {
      incidentID: incidentID,
    },
  });

  console.log(`Query: incidentID = ${incidentID}, found ${files.length} files`);

  // Debug: Ver TODOS los archivos para verificar si tienen incidentID
  const allFiles = await prisma.file.findMany();
  console.log(
    'ALL FILES IN DB:',
    allFiles.map((f) => ({
      id: f.id,
      objectKey: f.objectKey,
      incidentID: f.incidentID,
      ownerId: f.ownerId,
    })),
  );

  return files.map((file) => ({
    objectKey: file.objectKey,
    url: file.fileURL,
  }));
}
