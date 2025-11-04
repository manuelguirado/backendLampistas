import { registerCompany } from '../modules/companies/registerCompany';
import { registerDirections } from '../modules/directions/registerDirections';
import registerAdmin from '../modules/admin/registerAdmin';
import { registerWorker } from '../modules/workers/registerWorker';
import { PrismaClient } from '../../generated/prisma';
import supertest from 'supertest';
const prisma = new PrismaClient();
describe('CompanyController', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
  it('should login a company successfully', async () => {
    const request = supertest(
      'http://localhost:3000/company/company/companyLogin',
    );
    const name = 'Test Company';
    const phone = '1234567890';
    const email = `company-login-${Date.now()}@test.com`;
    const address = '123 Test St, Test City, TS 12345';
    const password = 'securePassword';
    const directions = await registerDirections(
      address,
      'Test City',
      'TS',
      '12345',
    );
    const admin = await registerAdmin(
      `admin-login-${Date.now()}@test.com`,
      'adminPassword',
    );
    const Company = await registerCompany(
      name,
      phone,
      email,
      password,
      admin.adminID,
      directions,
    );
    const response = await request
      .post('')
      .send({ email: Company.email, password: 'securePassword' })
      .expect(201);

    expect(response.body).toBeDefined();
  });
  it('should register a worker successfully', async () => {
    const request = supertest(
      'http://localhost:3000/company/company/registerWorker',
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
      'Test Company',
      '1234567890',
      `company-${Date.now()}@test.com`,
      'securePassword',
      admin.adminID,
      directions,
    );
    const response = await request
      .post('')
      .send({
        email: `worker-${Date.now()}@example.com`,
        password: 'workerPassword',
        name: 'Test Worker',
        companyID: company.companyID,
      })
      .expect(201);

    expect(response.body).toBeDefined();
  });
  it('should register a worker successfully', async () => {
    const request = supertest(
      'http://localhost:3000/company/company/registerWorker',
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
      'Test Company',
      '1234567890',
      `company-${Date.now()}@test.com`,
      'securePassword',
      admin.adminID,
      directions,
    );
    const response = await request
      .post('')
      .send({
        email: `worker-${Date.now()}@example.com`,
        password: 'workerPassword',
        name: 'Test Worker',
        companyID: company.companyID,
      })
      .expect(201);

    expect(response.body).toBeDefined();
  });
  it('should edit a worker successfully', async () => {
    const request = supertest(
      'http://localhost:3000/company/company/editWorker',
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
      'Test Company',
      '1234567890',
      `company-${Date.now()}@test.com`,
      'securePassword',
      admin.adminID,
      directions,
    );
    const worker = await registerWorker(
      `worker-${Date.now()}@example.com`,
      'workerPassword',
      'Test Worker',
      company.companyID,
    );
    const response = await request
      .patch('')
      .send({
        workerID: worker.workerid,
        data: { name: 'Updated Worker Name' },
      })
      .expect(200);

    expect(response.body).toBeDefined();
  });
  it('should register machinery successfully', async () => {
    const request = supertest(
      'http://localhost:3000/company/company/createMachinery',
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
      'Test Company',
      '1234567890',
      `company-${Date.now()}@test.com`,
      'securePassword',
      admin.adminID,
      directions,
    );
    const response = await request
      .post('')
      .send({
        name: 'Excavator',
        description: 'Heavy duty excavator',
        maintanceDate: new Date(),
        lastInspectionDate: new Date(),
        installedAt: new Date(),
        clientId: 1,
        companyName: company.name,
        machineType: 'ExcavatorType',
        companyID: company.companyID,
      })
      .expect(201);

    expect(response.body).toBeDefined();
  });
  it('should list workers for a company', async () => {
    const request = supertest('http://localhost:3000/company/listWorker');
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
      'Test Company',
      '1234567890',
      `company-${Date.now()}@test.com`,
      'securePassword',
      admin.adminID,
      directions,
    );
    const worker1 = await registerWorker(
      `worker1-${Date.now()}@example.com`,
      'workerPassword1',
      'Worker One',
      company.companyID,
    );
    const worker2 = await registerWorker(
      `worker2-${Date.now()}@example.com`,
      'workerPassword2',
      'Worker Two',
      company.companyID,
    );
    expect(worker1).toBeDefined();
    expect(worker2).toBeDefined();
    const response = await request
      .post('')
      .send({ companyID: company.companyID })
      .expect(201);
    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body)).toBe(true);
  });
  it('should delete a worker successfully', async () => {
    const request = supertest(
      'http://localhost:3000/company/company/deleteWorker',
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
      'Test Company',
      '1234567890',
      `company-${Date.now()}@test.com`,
      'securePassword',
      admin.adminID,
      directions,
    );
    const worker = await registerWorker(
      `worker-to-delete-${Date.now()}@example.com`,
      'workerPassword',
      'Worker To Delete',
      company.companyID,
    );
    const response = await request
      .delete('')
      .send({ workerID: worker.workerid })
      .expect(200);

    expect(response.body).toBeDefined();
  });
  it('should create a budget successfully', async () => {
    const request = supertest(
      'http://localhost:3000/company/company/createBudget',
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
      'Test Company',
      '1234567890',
      `company-${Date.now()}@test.com`,
      'securePassword',
      admin.adminID,
      directions,
    );
    const response = await request
      .post('')
      .send({
        companyID: company.companyID,
        title: 'Test Budget',
        amount: 10000,
        description: 'This is a test budget',
      })
      .expect(201);

    expect(response.body).toBeDefined();
  });
  it('should return empty list if company has no workers', async () => {
    const request = supertest('http://localhost:3000/company/listWorker');
    const directions = await registerDirections(
      '456 Empty St, NoWorker City, NW 67890',
      'NoWorker City',
      'NW',
      '67890',
    );
    const admin = await registerAdmin(
      `admin-noworker-${Date.now()}@test.com`,
      'adminPassword',
    );
    const company = await registerCompany(
      'No Worker Company',
      '0987654321',
      `noworker-company-${Date.now()}@test.com`,
      'securePassword',
      admin.adminID,
      directions,
    );
    const response = await request
      .post('')
      .send({ companyID: company.companyID })
      .expect(201);
    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body)).toBe(true);
  });
  it('should assign an incident to a worker successfully', async () => {
    const request = supertest(
      'http://localhost:3000/company/company/assignIncident',
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
      'Test Company',
      '1234567890',
      `company-${Date.now()}@test.com`,
      'securePassword',
      admin.adminID,
      directions,
    );
    const worker = await registerWorker(
      `worker-${Date.now()}@example.com`,
      'workerPassword',
      'Test Worker',
      company.companyID,
    );
    const response = await request
      .post('')
      .send({ incidentID: 1, workerID: worker.workerid })
      .expect(200);

    expect(response.body).toBeDefined();
  });
  it('should assign a shift to a worker successfully', async () => {
    const request = supertest(
      'http://localhost:3000/company/company/assignShiftWorker',
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
      'Test Company',
      '1234567890',
      `company-${Date.now()}@test.com`,
      'securePassword',
      admin.adminID,
      directions,
    );
    const worker = await registerWorker(
      `worker-${Date.now()}@example.com`,
      'workerPassword',
      'Test Worker',
      company.companyID,
    );
    const response = await request
      .post('')
      .send({
        workerID: worker.workerid,
        shiftSchedule: new Date(),
        shiftType: 'Morning',
      })
      .expect(200);

    expect(response.body).toBeDefined();
  });
});
