import { registerCompany } from '../modules/companies/registerCompany';
import { registerDirections } from '../modules/directions/registerDirections';
import registerAdmin from '../modules/admin/registerAdmin';
import { createIncident } from '../modules/incidents/createIncident';
import { PrismaClient } from '../../generated/prisma';
import { userRegister } from '../modules/users/userRegister';
import supertest from 'supertest';

const prisma = new PrismaClient();
describe('CompanyController', () => {
  jest.setTimeout(30000);
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.contracts.deleteMany({});
    await prisma.shiftSchedule.deleteMany({});
    await prisma.budget.deleteMany({});
    await prisma.machinery.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.incidents.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
  });

  afterAll(async () => {
    await prisma.contracts.deleteMany({});
    await prisma.shiftSchedule.deleteMany({});
    await prisma.budget.deleteMany({});
    await prisma.machinery.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.incidents.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.$disconnect();
  });
  it('should create a budget successfully', async () => {
    const request = supertest('http://localhost:3000/company/CreateBudget');
    const directions = await registerDirections(
      '123 Test St, Test City, TS 12345',
      'Test City',
      'TS',
      '12345',
    );
    const admin = await registerAdmin(
      `admin-${Date.now()}@test.com`,
      'adminPassword',
    );
    const company = await registerCompany(
      `company with budget-${Date.now()}`,
      '1234567890',
      `company-${Date.now()}@test.com`,
      'securePassword',
      admin.adminID,
      directions,
    );

    const user = await userRegister(
      `user-${Date.now()}@example.com`,
      'userPassword',
      'Test User',
    );
    const incident = await createIncident(
      'Incident Title',
      'Incident Description',
      user.userID,
      company.companyID,
      'OPEN',
      'HIGH',
    );
    const companyLogin = await supertest(
      'http://localhost:3000/company/CompanyLogin',
    )
      .post('')
      .send({ email: company.email, password: 'securePassword' })
      .expect(201);
    const body = companyLogin.body as { token: string };
    const token: string = body.token;

    const response = await request
      .post('')
      .send({
        companyID: company.companyID,
        totalAmount: 10000,
        description: 'This is a test budget',
        incidentID: incident?.IncidentsID || 0,
        userID: user.userID,
        items: [
          { itemName: 'Item 1', quantity: 2, price: 100 },
          { itemName: 'Item 2', quantity: 3, price: 200 },
        ],
        subtotal: 800,
        tax: 160,
        budgetNumber: `BUDGET-${Date.now()}`,
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    expect(response.body).toBeDefined();
  });
});
