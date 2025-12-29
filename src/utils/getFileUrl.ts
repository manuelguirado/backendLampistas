import { PrismaClient } from '../../generated/prisma';
import type { UserType } from '../utils/types/userType';
import { getUserID } from '../utils/getUserID';
const prisma = new PrismaClient();
export async function getFileUrl(
  ownerId: number,
  ownerType: UserType,

  incidentID?: number,
) {
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
      // No necesitas filtrar por ownerId porque ya tienes incidentID
    },
  });
  return { objectKey: files?.[0]?.objectKey, url: files?.[0]?.fileURL };
}
