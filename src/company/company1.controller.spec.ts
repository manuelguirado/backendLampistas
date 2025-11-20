import { registerCompany } from '../modules/companies/registerCompany';
import { registerDirections } from '../modules/directions/registerDirections';
import registerAdmin from '../modules/admin/registerAdmin';

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
  it('should create a contract with an user successfully', async () => {
    const request = supertest('http://localhost:3000/company/createContract');

    const directions = await registerDirections(
      '123 Test St, Test City, TS 12345',
      'Test City',
      'TS',
      '12345',
    );
    const admin = await registerAdmin(
      `admin-create-contract-${Date.now()}@test.com`,
      'adminPassword',
    );
    const company = await registerCompany(
      `company to assign code-${Date.now()}`,
      '1234567890',
      `company-create-contract-${Date.now()}@test.com`,
      'securePassword',
      admin.adminID,
      directions,
    );
    const user = await userRegister(
      'Test User',
      `user-create-contract-${Date.now()}@example.com`,
      'userPassword',
    );
    const companyLogin = await supertest(
      'http://localhost:3000/company/CompanyLogin',
    )
      .post('')
      .send({ email: company.email, password: 'securePassword' })
      .expect(201);
    const body = companyLogin.body as { token: string };
    const token: string = body.token;
    await request
      .post('')
      .send({
        companyID: company.companyID,
        contractType: 'contract',
        userID: user.userID,
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
  });
});
