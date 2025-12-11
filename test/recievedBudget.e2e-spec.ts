import { recievedBudgets } from '../src/modules/users/recievedBudgets';
import { userRegister } from '../src/modules/users/userRegister';
import { registerCompany } from '../src/modules/companies/registerCompany';
import registerAdmin from '../src/modules/admin/registerAdmin';
import { createBudget } from '../src/modules/budgets/createbudget';
import { createIncident } from '../src/modules/incidents/createIncident';
import { PrismaClient } from '../generated/prisma';
const prisma = new PrismaClient();

describe('Recieved Budgets E2E', () => {
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.contracts.deleteMany();
    await prisma.budget.deleteMany();
    await prisma.incidents.deleteMany();
    await prisma.directions.deleteMany();
    await prisma.user.deleteMany();
    await prisma.adminsCompanies.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.company.deleteMany();
  });
  afterAll(async () => {
    await prisma.contracts.deleteMany();
    await prisma.budget.deleteMany();
    await prisma.incidents.deleteMany();
    await prisma.directions.deleteMany();
    await prisma.user.deleteMany();
    await prisma.adminsCompanies.deleteMany();
    await prisma.admin.deleteMany();
    await prisma.company.deleteMany();
    await prisma.$disconnect();
  });
  it('should retrieve budgets received by a user', async () => {
    const admin = await registerAdmin(
      `admin-test-${Date.now()}@gmail.com`,
      'securePassword',
    );
    const company = await registerCompany(
      `Test Company ${Date.now()}`,
      '1234567890',
      `testcompany${Date.now()}@gmail.com`,
      'securePassword',
      admin.adminID,
      {
        address: '123 Test St',
        city: 'Testville',
        state: 'TS',
        zipCode: '12345',
      },
    );

    const user = await userRegister(
      'Test User',
      `testuser${Date.now()}@gmail.com`,
      'securePassword',
    );
    const incident = await createIncident(
      'Test Incident',
      'This is a test incident',
      user.userID,
      company.companyID,
    );
   
    const budget1 = await createBudget(
      incident?.IncidentsID || 0,
      1000,
      'First budget description',
      user.userID,
      company.companyID,
    );

    const budget2 = await createBudget(
      incident?.IncidentsID || 0,
      2000,
      'Second budget description',
      user.userID,
      company.companyID,
    );
    const budgets = await recievedBudgets(user.userID);
    expect(budgets).toBeDefined();
    expect(budget1).toBeDefined();
    expect(budget2).toBeDefined();
  });
});
