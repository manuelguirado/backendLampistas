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
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.user.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.incidents.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.directions.deleteMany({});
  });

  afterAll(async () => {
    await prisma.user.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.incidents.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.$disconnect();
  });
  it('should login a company successfully', async () => {
    const request = supertest('http://localhost:3000/company/CompanyLogin');
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
      .send({ email: Company.email, password: password })
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
      'company to register worker',
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
      .send({ email: company.email, password: company.password })
      .expect(201);
    console.log('Login Response Body:', companyLogin.body); // Agregado para depuración

    const token: string = companyLogin.body.token;
    console.log('Token:', token); // Agregado para depuración
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
    console.log('Response Body:', response.body); // Agregado para depuración
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
      'company to edit worker',
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
      .send({ email: company.email, password: company.password })
      .expect(201);
    console.log('Login Response Body:', companyLogin.body); // Agregado para depuración
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const token = companyLogin.body.token;
    console.log('Token:', token); // Agregado para depuración
    const response = await request
      .patch('')
      .send({
        workerID: worker.workerid,
        data: { name: 'Updated Worker Name' },
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    console.log('Response Body:', response.body); // Agregado para depuración

    expect(response.body).toBeDefined();
  });
  it('should register machinery successfully', async () => {
    const request = supertest('http://localhost:3000/company/createMachinery');
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
      'company to register machinery',
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
      .send({ email: company.email, password: company.password })
      .expect(201);
    console.log('Login Response Body:', companyLogin.body); // Agregado para depuración
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const token = companyLogin.body.token;
    console.log('Token:', token); // Agregado para depuración
    const response = await request
      .post('')
      .send({
        name: 'Excavator',
        description: 'Heavy duty excavator',
        maintanceDate: new Date(),
        lastInspectionDate: new Date(),
        InstalledAT: new Date(), // corregido el nombre del campo
        clientId: 1,
        companyName: company.name,
        machineType: 'ExcavatorType',
        companyID: company.companyID,
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    console.log('Response Body:', response.body); // Agregado para depuración

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
      'company with workers',
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
    console.log('Login Response Body:', companyLogin.body); // Agregado para depuración
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const token = companyLogin.body.token;
    console.log('Token:', token); // Agregado para depuración
    expect(worker1).toBeDefined();
    expect(worker2).toBeDefined();
    const response = await request
      .post('')
      .send({ companyID: company.companyID })
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    console.log('Response Body:', response.body); // Agregado para depuración
    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body)).toBe(true);
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
      'company to delete worker',
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
      .send({ email: company.email, password: company.password })
      .expect(201);
    console.log('Login Response Body:', companyLogin.body); // Agregado para depuración
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const token = companyLogin.body.token;
    console.log('Token:', token); // Agregado para depuración
    const response = await request
      .delete('')
      .send({ workerID: worker.workerid })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    console.log('Response Body:', response.body); // Agregado para depuración
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
      'company with budget',
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
      .send({ email: company.email, password: company.password })
      .expect(201);
    console.log('Login Response Body:', companyLogin.body); // Agregado para depuración
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const token = companyLogin.body.token;
    console.log('Token:', token); // Agregado para depuración
    const response = await request
      .post('')
      .send({
        companyID: company.companyID,
        amount: 10000,
        description: 'This is a test budget',
        incidentID: incident.IncidentsID,
        userID: user.userID,
        workerID: worker.workerid,
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(201);
    console.log('Response Body:', response.body); // Agregado para depuración
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
      'company to assign incident',
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
    const loginCompany = await supertest(
      'http://localhost:3000/company/CompanyLogin',
    )
      .post('')
      .send({ email: company.email, password: 'securePassword' })
      .expect(201);
    console.log('Login Response Body:', loginCompany.body); // Agregado para depuración
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const token = loginCompany.body.token;
    console.log('Token:', token); // Agregado para depuración
    const response = await request
      .post('')
      .send({ incidentID: 1, workerID: worker.workerid })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    console.log('Response Body:', response.body); // Agregado para depuración

    expect(response.body).toBeDefined();
  });
  it('should assign a shift to a worker successfully', async () => {
    const request = supertest(
      'http://localhost:3000/company/assignShiftWorker',
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
      'company to assign shift',
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
      'http://localhost:3000/worker/companyLogin',
    )
      .post('')
      .send({
        email: company.email,
        password: company.password,
      })
      .expect(201);
    console.log('Login Response Body:', loginResponse.body); // Agregado para depuración
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const token = loginResponse.body.token;
    console.log('Token:', token); // Agregado para depuración

    const response = await request
      .post('')
      .send({
        workerID: worker.workerid,
        shiftSchedule: new Date(),
        shiftType: 'Morning',
      })
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    console.log('Response Body:', response.body); // Agregado para depuración

    expect(response.body).toBeDefined();
  });
});
