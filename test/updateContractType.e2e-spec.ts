import { updateTypeContractType } from '../src/modules/companies/updateTypeContractType';
import registerAdmin from '../src/modules/admin/registerAdmin';
import { registerCompany } from '../src/modules/companies/registerCompany';
import { registerDirections } from '../src/modules/directions/registerDirections';
import { PrismaClient } from '../generated/prisma';
const prisma = new PrismaClient();
describe('update contract type', () => {
    beforeAll(async () => {
        await prisma.$connect();
        await prisma.user.deleteMany({});
        await prisma.adminsCompanies.deleteMany({});
        await prisma.company.deleteMany({});
        await prisma.admin.deleteMany({});
    });
    afterAll(async () => {
        await prisma.user.deleteMany({});
        await prisma.adminsCompanies.deleteMany({});
        await prisma.company.deleteMany({});
        await prisma.admin.deleteMany({});
        await prisma.$disconnect();
    });
    it('should update contract type', async () => {
        const admin = await registerAdmin(
            'admin@test.com',
            'password123',
        );
        const directions = await registerDirections(
            "123 main st",
            "new york",
            "metropolis",
            "123123",
          
        ); 
        const company = await registerCompany(
            'Company Test',
            "2523422",
            'company@test.com',
            'password123',
            admin.adminID,
             directions
        );
        const updatedCompany = await updateTypeContractType(
            company.id,
            'subscription',
        );
        expect(updatedCompany.contractType).toBe('subscription');
    });
}