import { contracts } from './../../../generated/prisma/index.d';
import { PrismaClient } from '../../../generated/prisma';
const prisma = new PrismaClient();
enum ContractType {
  contract = 'contract',
  freeChoice = 'freeChoice',
}
export async function updateTypeContractType(
  companyID: number,
  contractType: ContractType,
) {
  if (!companyID || !contractType) {
    throw new Error('companyID and contractType are required');
  }
  const company = await prisma.company.findUnique({
    where: { companyID },
  });
  if (
    contractType !== ContractType.contract &&
    contractType !== ContractType.freeChoice
  ) {
    throw new Error('Invalid contractType value');
  }
  if (!company) {
    throw new Error('Company does not exist');
  }
  const contract = await prisma.contracts.findUnique({
    where: { contracts.companyID },
  });
  const updatedCompany = await prisma.contracts.update({
    where: {  contract.id },
    data: { contractType: contractType },
  });
  return updatedCompany;
}
