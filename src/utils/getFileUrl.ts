import { PrismaClient } from '../../generated/prisma';
import type { UserType } from '../utils/types/userType';
import { getUserID } from '../utils/getUserID';
const prisma = new PrismaClient();
export async function getFileUrl(
  ownerId: number,
  ownerType: UserType,
  incidentID?: number,
  budgetID?: number,
) {
  const getId = await getUserID(ownerType, ownerId);
  if (!getId) {
    throw new Error('User not found');
  }
  const files = await prisma.file.findMany({
    where: {
      incidentID: incidentID,
      budgetID: budgetID,
    },
  });

  return files.map((file) => ({
    objectKey: file.objectKey,
    url: file.fileURL,
  }));
}
