import { registerCompany } from '../modules/companies/registerCompany';
import { registerDirections } from '../modules/directions/registerDirections';
import registerAdmin from '../modules/admin/registerAdmin';
import { registerWorker } from '../modules/workers/registerWorker';
import { PrismaClient } from '../../generated/prisma';
import { userRegister } from '../modules/users/userRegister';
import supertest from 'supertest';
import { createIncident } from '../modules/incidents/createIncident';

const prisma = new PrismaClient();
describe('CompanyController', () => {
  jest.setTimeout(40000);
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.contracts.deleteMany({});
    await prisma.shiftSchedule.deleteMany({});
    await prisma.budget.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.machinery.deleteMany({});
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
  it('should login a company successfully', async () => {
    const request = supertest('http://localhost:3000/company/CompanyLogin');
    const name = `Test Company-${Date.now()}`;
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
      .send({ email: Company.email, password: password })
      .expect(201);
    expect(response.body).toBeDefined();
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
it('should assign code a worker successfully', async () => {
  const request = supertest('http://localhost:3000/company/assignCode');
  const directions = await registerDirections(
    '123 Test St, Test City, TS 12345',
    'Test City',
    'TS',
    '12345',
  );
  const admin = await registerAdmin(
    `admin-assign-code-${Date.now()}@test.com`,
    'adminPassword',
  );
  const company = await registerCompany(
    `company to assign code-${Date.now()}`,
    '1234567890',
    `company-assign-code-${Date.now()}@test.com`,
    'securePassword',
    admin.adminID,
    directions,
  );
  const worker = await registerWorker(
    `worker-assign-code-${Date.now()}@example.com`,
    'workerPassword',
    'Test Worker',
    company.companyID,
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
      workerid: worker.workerid,
    })
    .set('Authorization', `Bearer ${token}`)
    .expect(201);
  expect(response.body).toBeDefined();
});
it('should assign code a user successfully', async () => {
  const request = supertest('http://localhost:3000/company/assignCode');
  const directions = await registerDirections(
    '123 Test St, Test City, TS 12345',
    'Test City',
    'TS',
    '12345',
  );
  const admin = await registerAdmin(
    `admin-assign-code-user-${Date.now()}@test.com`,
    'adminPassword',
  );
  const company = await registerCompany(
    `company to assign code user-${Date.now()}`,
    '1234567890',
    `company-assign-code-user-${Date.now()}@test.com`,
    'securePassword',
    admin.adminID,
    directions,
  );
  const user = await userRegister(
    'Test User',
    `user-assign-code-${Date.now()}@example.com`,
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
  const response = await request
    .post('')
    .send({
      companyID: company.companyID,
      userID: user.userID,
    })
    .set('Authorization', `Bearer ${token}`)
    .expect(201);
  expect(response.body).toBeDefined();
});
it('should validate a code successfully', async () => {
  const request = supertest('http://localhost:3000/company/validateCode');
  const directions = await registerDirections(
    '123 Test St, Test City, TS 12345',
    'Test City',
    'TS',
    '12345',
  );
  const admin = await registerAdmin(
    `admin-validate-code-${Date.now()}@test.com`,
    'adminPassword',
  );
  const company = await registerCompany(
    `company to validate code-${Date.now()}`,
    '1234567890',
    `company-validate-code-${Date.now()}@test.com`,
    'securePassword',
    admin.adminID,
    directions,
  );
  const companyLogin = await supertest(
    'http://localhost:3000/company/CompanyLogin',
  )
    .post('')
    .send({ email: company.email, password: 'securePassword' })
    .expect(201);
  const body = companyLogin.body as { token: string };
  const token: string = body.token;

  // First, assign a code to the company
  const assignCodeResponse = await supertest(
    `http://localhost:3000/admin/assignCode/${company.companyID}`,
  )
    .post('')
    .send({
      companyID: company.companyID,
    })
    .set('Authorization', `Bearer ${token}`)
    .expect(201);
  const bodyAssign = assignCodeResponse.body as { code: string };
  const assignedCode = bodyAssign.code;
  const response = await request
    .post('')
    .send({
      userType: 'company',
      id: company.companyID,
      code: assignedCode,
    })
    .set('Authorization', `Bearer ${token}`)
    .expect(201);
  expect(response.body).toBeDefined();
});
it('should register a worker successfully', async () => {
  const request = supertest('http://localhost:3000/company/RegisterWorker');
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
    `company to register worker-${Date.now()}`,
    '1234567890',
    `company-${Date.now()}@test.com`,
    'securePassword',
    admin.adminID,
    directions,
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
      email: `worker-${Date.now()}@example.com`,
      password: 'workerPassword',
      name: 'Test Worker',
      companyID: company.companyID,
    })
    .set('Authorization', `Bearer ${token}`)
    .expect(201);

  expect(token).toBeDefined();
  expect(response.body).toBeDefined();
});

it('should edit a worker successfully', async () => {
  const request = supertest('http://localhost:3000/company/editWorker');
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
    `company to edit worker-${Date.now()}`,
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
  const companyLogin = await supertest(
    'http://localhost:3000/company/CompanyLogin',
  )
    .post('')
    .send({ email: company.email, password: 'securePassword' })
    .expect(201);
  const body = companyLogin.body as { token: string };
  const token: string = body.token;
  const response = await request
    .patch('')
    .send({
      workerID: worker.workerid,
      data: { name: 'Updated Worker Name' },
    })
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
  expect(response.body).toBeDefined();
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
      companyName: company.name,
      machineType: 'ExcavatorType',
      companyID: company.companyID,
      serialNumber: `SN12345${Date.now()}`,
    })
    .set('Authorization', `Bearer ${token}`)
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
    `company with workers to list-${Date.now()}`,
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
  const companyLogin = await supertest(
    'http://localhost:3000/company/CompanyLogin',
  )
    .post('')
    .send({ email: company.email, password: 'securePassword' })
    .expect(201);
  const body = companyLogin.body as { token: string };
  const token: string = body.token;
  expect(worker1).toBeDefined();
  expect(worker2).toBeDefined();
  const response = await request
    .post('')
    .send({ companyID: company.companyID })
    .set('Authorization', `Bearer ${token}`)
    .expect(201);
  expect(response.body).toBeDefined();
});
it('should delete a worker successfully', async () => {
  const request = supertest('http://localhost:3000/company/deleteWorker');
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
    `company to delete worker-${Date.now()}`,
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
  const companyLogin = await supertest(
    'http://localhost:3000/company/CompanyLogin',
  )
    .post('')
    .send({ email: company.email, password: 'securePassword' })
    .expect(201);
  const body = companyLogin.body as { token: string };
  const token: string = body.token;
  const response = await request
    .delete('')
    .send({ workerID: worker.workerid })
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
  expect(response.body).toBeDefined();
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
  const worker = await registerWorker(
    `worker-${Date.now()}@example.com`,
    'workerPassword',
    'Test Worker',
    company.companyID,
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
      amount: 10000,
      description: 'This is a test budget',
      incidentID: incident?.IncidentsID || 0,
      userID: user.userID,
      workerID: worker.workerid,
    })
    .set('Authorization', `Bearer ${token}`)
    .expect(201);
  expect(response.body).toBeDefined();
});

it('should assign an incident to a worker successfully', async () => {
  const request = supertest('http://localhost:3000/company/assignIncident');
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
    `company to assign incident-${Date.now()}`,
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
  const user = await userRegister(
    `Test User-${Date.now()}`,
    `user-${Date.now()}@test.com`,
    'userPassword',
  );
  const incident = await createIncident(
    'Incident Title',
    'Incident Description',
    user.userID,
    company.companyID,
    'OPEN',
    'HIGH',
  );
  const loginCompany = await supertest(
    'http://localhost:3000/company/CompanyLogin',
  )
    .post('')
    .send({ email: company.email, password: 'securePassword' })
    .expect(201);
  const body = loginCompany.body as { token: string };
  const token: string = body.token;
  const response = await request
    .post('')
    .send({
      incidentID: incident?.IncidentsID || 0,
      workerID: worker.workerid,
    })
    .set('Authorization', `Bearer ${token}`)
    .expect(201);

  expect(response.body).toBeDefined();
});
it('should assign a shift to a worker successfully', async () => {
  const request = supertest('http://localhost:3000/company/assignShiftWorker');
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
    `company to assign shift-${Date.now()}`,
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

  const loginResponse = await supertest(
    'http://localhost:3000/company/CompanyLogin',
  )
    .post('')
    .send({
      email: company.email,
      password: 'securePassword',
    })
    .expect(201);
  const body = loginResponse.body as { token: string };
  const token: string = body.token;
  const response = await request
    .post('')
    .send({
      workerID: worker.workerid,
      shiftSchedule: new Date(),
      shiftType: 'Morning',
    })
    .set('Authorization', `Bearer ${token}`)
    .expect(201);

  expect(response.body).toBeDefined();
});
