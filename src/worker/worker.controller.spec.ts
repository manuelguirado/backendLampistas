import supertest from 'supertest';
import { registerWorker } from '../modules/workers/registerWorker';
import { registerCompany } from '../modules/companies/registerCompany';
import { registerDirections } from '../modules/directions/registerDirections';
import registerAdmin from '../modules/admin/registerAdmin';
import { PrismaClient } from '../../generated/prisma';
const prisma = new PrismaClient();
describe('WorkerController', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });
  it('should login a worker successfully', async () => {
    const request = supertest(
      'http://localhost:3000/worker/worker/workerLogin',
    );
    const email = `worker-login-${Date.now()}@test.com`;
    const password = 'workerPassword';
    // First, create a worker directly in the database

    const directions = await registerDirections(
      '123 Test St',
      'Test City',
      'TS',
      '12345',
    );
    const admin = await registerAdmin(
      `admin-login-worker-${Date.now()}@test.com`,
      'adminPassword',
    );
    const company = await registerCompany(
      'Test Company',
      '1234567890',
      `company-login-worker-${Date.now()}@test.com`,
      'securePassword',
      admin.adminID,
      directions,
    );
    const worker = await registerWorker(
      email,
      password,
      'Test Worker',
      company.companyID,
    );
    const response = await request
      .post('')
      .send({ email: worker.email, password: 'workerPassword' })
      .expect(201);

    expect(response.body).toBeDefined();
  });
  it('should show the assigned incidents for a worker', async () => {
    const request = supertest(
      'http://localhost:3000/worker/worker/listAssignedIncidents',
    );
    const directions = await registerDirections(
      '123 Test St',
      'Test City',
      'TS',
      '12345',
    );
    const admin = await registerAdmin(
      `admin-assigned-incidents-${Date.now()}@test.com`,
      'adminPassword',
    );
    const company = await registerCompany(
      'Test Company',
      '1234567890',
      `company-assigned-incidents-${Date.now()}@test.com`,
      'securePassword',
      admin.adminID,
      directions,
    );
    const worker = await registerWorker(
      `worker-assigned-incidents-${Date.now()}@test.com`,
      'workerPassword',
      'Test Worker',
      company.companyID,
    );
    const response = await request
      .get('')
      .query({ workerID: worker.workerid })
      .expect(200);

    expect(response.body).toBeDefined();
  });
  it('should edit status of incident assigned to worker', async () => {
    const request = supertest(
      'http://localhost:3000/worker/worker/updateStatusIncident',
    );
    const response = await request
      .patch('')
      .send({ incidentID: 1, status: 'IN_PROGRESS' })
      .expect(200);

    expect(response.body).toBeDefined();
  });
  it('should show the shifts for a worker', async () => {
    const request = supertest('http://localhost:3000/worker/worker/myShifts');
    const directions = await registerDirections(
      '123 Test St',
      'Test City',
      'TS',
      '12345',
    );
    const admin = await registerAdmin(
      `admin-my-shifts-${Date.now()}@test.com`,
      'adminPassword',
    );
    const company = await registerCompany(
      'Test Company',
      '1234567890',
      `company-my-shifts-${Date.now()}@test.com`,
      'securePassword',
      admin.adminID,
      directions,
    );
    const worker = await registerWorker(
      `worker-my-shifts-${Date.now()}@test.com`,
      'workerPassword',
      'Test Worker',
      company.companyID,
    );
    const response = await request
      .get('')
      .query({ workerID: worker.workerid })
      .expect(200);

    expect(response.body).toBeDefined();
  });
});
