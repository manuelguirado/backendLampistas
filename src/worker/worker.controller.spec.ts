import supertest from 'supertest';
import { registerWorker } from '../modules/workers/registerWorker';
import { userRegister } from '../modules/users/userRegister';
import { registerCompany } from '../modules/companies/registerCompany';
import { registerDirections } from '../modules/directions/registerDirections';
import { createIncident } from '../modules/incidents/createIncident';
import registerAdmin from '../modules/admin/registerAdmin';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();
describe('WorkerController', () => {
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.machinery.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.incidents.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await prisma.machinery.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.incidents.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
  });
  it('should login a worker successfully', async () => {
    const request = supertest('http://localhost:3000/worker/workerLogin');
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
      `Test Company-${Date.now()}`,
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
    const request = supertest('http://localhost:3000/worker/assignedIncidents');
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
      `Test Company-${Date.now()}`,
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

    const workerExist = await prisma.worker.findUnique({
      where: { email: worker.email },
    });
    if (!workerExist) {
      throw new Error('Worker not found in the database');
    }
    const workerLoginRequest = supertest(
      'http://localhost:3000/worker/workerLogin',
    );
    const workerLogin = await workerLoginRequest
      .post('')
      .send({
        email: worker.email,
        password: 'workerPassword',
      })
      .expect(201);

    const body = workerLogin.body as { token: string; workerid: number };
    const token: string = body.token;
    const workerid: number = body.workerid;

    const response = await request
      .get(`?workerID=${workerid}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(response.body).toBeDefined();
  });
});
it('should edit status of incident assigned to worker', async () => {
  const request = supertest(
    'http://localhost:3000/worker/updateIncidentStatus',
  );
  const directions = await registerDirections(
    '123 Test St',
    'Test City',
    'TS',
    '12345',
  );
  const admin = await registerAdmin(
    `admin-update-incident-status-${Date.now()}@test.com`,
    'adminPassword',
  );
  const company = await registerCompany(
    `Test Company-${Date.now()}`,
    '1234567890',
    `company-update-incident-status-${Date.now()}@test.com`,
    'securePassword',
    admin.adminID,
    directions,
  );
  const worker = await registerWorker(
    `worker-update-incident-status-${Date.now()}@test.com`,
    'workerPassword',
    'Test Worker',
    company.companyID,
  );

  const workerLoginRequest = supertest(
    'http://localhost:3000/worker/workerLogin',
  );
  const workerLogin = await workerLoginRequest
    .post('')
    .send({
      email: worker.email,
      password: 'workerPassword',
    })
    .expect(201);
  const body = workerLogin.body as { token: string };
  const token: string = body.token;
  const user = await userRegister(
    'Test User',
    `user-update-incident-status-${Date.now()}@test.com`,
    'userPassword',
  );
  const incident = await createIncident(
    'Test Incident',
    'This is a test incident',
    user.userID,
    company.companyID,
  );
  const response = await request
    .patch('')
    .send({ incidentID: incident?.IncidentsID, status: 'IN_PROGRESS' })
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  expect(response.body).toBeDefined();
});
it('should show the shifts for a worker', async () => {
  const request = supertest('http://localhost:3000/worker/myShifts');
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
    `Test Company-${Date.now()}`,
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
  const workerLoginRequest = supertest(
    'http://localhost:3000/worker/workerLogin',
  );
  const workerLogin = await workerLoginRequest
    .post('')
    .send({
      email: worker.email,
      password: 'workerPassword',
    })
    .expect(201);
  const body = workerLogin.body as { token: string };
  const token: string = body.token;
  const workerID = worker.workerid;
  const response = await request
    .get(`?workerID=${workerID}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
  expect(response.body).toBeDefined();
});
