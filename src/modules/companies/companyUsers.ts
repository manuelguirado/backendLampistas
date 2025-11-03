import { PrismaClient } from '../../../generated/prisma';

const prisma = new PrismaClient();

export async function companyUsers(companyID: number) {
  if (!companyID) {
    throw new Error('companyID is required');
  }
  const Company = await prisma.company.findUnique({
    where: { companyID },
  });

  if (!Company) {
    throw new Error('Company does not exist');
  }
  const users = await prisma.user.findMany({
    where: { companyID },
  });

  if (!users) {
    return [];
  }
  const mapUsers = users.map((user) => {
    return {
      userID: user.userID,
      email: user.email,
      name: user.name ?? '',
      companyID,
    };
  });
  return mapUsers;
}
