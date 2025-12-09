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
  it('should register machinery successfully', async () => {
    const request = supertest('http://localhost:3000/company/createMachinery');
    const user = await userRegister(
      'Test User',
      `user-for-machinery-${Date.now()}@test.com`,
      'userPassword',
    );

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
      `company to register machinery-${Date.now()}`,
      '1234567890',
      `company-${Date.now()}@test.com`,
      'securePassword',
      admin.adminID,
      directions,
    );

    // Move the following code inside the test block so 'company' is defined
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
        name: 'Excavator',
        description: 'Heavy duty excavator',
        maintanceDate: new Date(),
        lastInspectionDate: new Date(),
        InstalledAT: new Date(), // corregido el nombre del campo
        clientId: user.userID,
        brand: 'Caterpillar',
        model: 'CAT320',
        companyName: company.name,
        machineType: 'ExcavatorType',
        companyID: company.companyID,
        serialNumber: `SN12345${Date.now()}`,
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    expect(response.body).toBeDefined();
  });
});
