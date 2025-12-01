import { listIncidents } from '../src/modules/companies/listIncidents';
import registerAdmin from '../src/modules/admin/registerAdmin';
import { userRegister } from '../src/modules/users/userRegister';
import { registerCompany } from '../src/modules/companies/registerCompany';
import { createIncident } from '../src/modules/incidents/createIncident';
import { PrismaClient } from '../generated/prisma';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
const prisma = new PrismaClient();

describe('listIncidents E2E', () => {
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.contracts.deleteMany();
    await prisma.budget.deleteMany();
    await prisma.machinery.deleteMany();
    await prisma.shiftSchedule.deleteMany();
    await prisma.worker.deleteMany();
    await prisma.directions.deleteMany();
    await prisma.incidents.deleteMany();
    await prisma.adminsCompanies.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.company.deleteMany();
  });
  afterAll(async () => {
    await prisma.contracts.deleteMany();
    await prisma.machinery.deleteMany();
    await prisma.budget.deleteMany();
    await prisma.shiftSchedule.deleteMany();
    await prisma.worker.deleteMany();
    await prisma.directions.deleteMany();
    await prisma.incidents.deleteMany();
    await prisma.adminsCompanies.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.company.deleteMany();
    await prisma.$disconnect();
  });
  it('should list incidents for a company', async () => {
    const admin = await registerAdmin(
      'admin-test-${Date.now()}@lampistas.com',
      'securepassword',
    );
    const companyDirections = {
      address: '123 Test St',
      city: 'Testville',
      state: 'TS',
      zipCode: '12345',
    };
    const company = await registerCompany(
      'Test Company',
      '123-456-7890',
      `test-company-${Date.now()}@lampistas.com`,
      'securepassword',
      admin.adminID,
      companyDirections,
    );
    const user = await userRegister(
      'Test User',
      `test-user-${Date.now()}@lampistas.com`,
      'userpassword',
      company.companyID,
    );
    const incident = await createIncident(
      'Test Incident',
      'This is a test incident description.',
      user.userID,
      company.companyID,
    );
    expect(incident).toBeDefined();
    const listIncidentsResult = await listIncidents(company.companyID, 5, 0);
    expect(listIncidentsResult).toHaveProperty('token');
    expect(listIncidentsResult).toHaveProperty('incidents');
  });
});
