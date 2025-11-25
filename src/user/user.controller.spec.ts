import supertest from 'supertest';
import { userRegister } from '../modules/users/userRegister';
import { PrismaClient } from '../../generated/prisma';
import { registerDirections } from '../modules/directions/registerDirections';
import registerAdmin from '../modules/admin/registerAdmin';
import { registerCompany } from '../modules/companies/registerCompany';
const prisma = new PrismaClient();
describe('UserController', () => {
  beforeAll(async () => {
    await prisma.$connect();
    // Eliminar primero las entidades hijas
    await prisma.machinery.deleteMany({});
    await prisma.incidents.deleteMany({});
    await prisma.worker.deleteMany({});
    // Luego las entidades padres
    await prisma.user.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.admin.deleteMany({});
  });
  afterAll(async () => {
    // Eliminar primero las entidades hijas
    await prisma.machinery.deleteMany({});
    await prisma.incidents.deleteMany({});
    await prisma.worker.deleteMany({});
    // Luego las entidades padres
    await prisma.user.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.$disconnect();
  });
  it('should register a user successfully', async () => {
    const request = supertest('http://localhost:3000/user/userRegister');
    const name = 'Test User';
    const email = `testuser-${Date.now()}@example.com`;
    const password = 'securePassword';
    const response = await request
      .post('')
      .send({ name, email, password })
      .expect(201);
    expect(response.body).toBeDefined();
  });
  it('should login a user successfully', async () => {
    const request = supertest('http://localhost:3000/user/userLogin');
    const email = `loginuser-${Date.now()}@example.com`;
    const password = 'securePassword';
    // First, register the user
    await userRegister('Login User', email, password);
    // Then, attempt to login
    const response = await request
      .post('')
      .send({ email, password })
      .expect(201);

    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body)).toBe(false);
  });
});
it('should create an incident successfully', async () => {
  const userLogin = supertest('http://localhost:3000/user/userLogin');
  const user = await userRegister(
    'Incident User',
    `incidentuser-${Date.now()}@example.com`,
    'incidentPassword',
  );
  const userloginResponse = await userLogin
    .post('')
    .send({ email: user.email, password: 'incidentPassword' })
    .expect(201);
  const directions = await registerDirections(
    '123 Test St',
    'Test City',
    'TS',
    '12345',
  );
  const admin = await registerAdmin(
    `adminuser-${Date.now()}@example.com`,
    'adminPassword',
  );
  const company = await registerCompany(
    `Test Company-${Date.now()}`,
    '1234567890',
    `companyuser-${Date.now()}@example.com`,
    'companyPassword',
    admin.adminID,
    directions,
  );

  const body = userloginResponse.body as { token: string; userID: number };
  const token = body.token;
  const userID = body.userID;
  const request = supertest('http://localhost:3000/user/createIncident');
  const title = 'Test Incident';
  const description = 'This is a test incident';

  const response = await request
    .post('')
    .send({
      title,
      description,
      companyID: company.companyID,
      status: 'OPEN',
      priority: 'MEDIUM',
      urgency: false,

      userID,
    })
    .set('Authorization', `Bearer ${token}`)
    .expect(201);
  expect(response.body).toBeDefined();
  expect(Array.isArray(response.body)).toBe(false);
});

it('should find machinery for a user successfully', async () => {
  const userLogin = supertest('http://localhost:3000/user/userLogin');
  const user = await userRegister(
    `Machinery User-${Date.now()}`,
    `machineryuser-${Date.now()}@example.com`,
    'machineryPassword',
  );
  const loginResponse = await userLogin
    .post('')
    .send({ email: user.email, password: 'machineryPassword' })
    .expect(201);
  const body = loginResponse.body as { token: string; userID: number };
  const token = body.token;
  const userID = body.userID;
  const request = supertest('http://localhost:3000/user/userMachinery');
  const response = await request
    .get(`?userID=${userID}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
  expect(response.body).toBeDefined();
});
it('should retrieve received budgets for a user successfully', async () => {
  const userLogin = supertest('http://localhost:3000/user/userLogin');
  const user = await userRegister(
    `Budget User-${Date.now()}`,
    `budgetuser-${Date.now()}@example.com`,
    'budgetPassword',
  );
  const loginResponse = await userLogin
    .post('')
    .send({ email: user.email, password: 'budgetPassword' })
    .expect(201);
  const body = loginResponse.body as { token: string; userID: number };
  const token = body.token;
  const userID = body.userID;
  const request = supertest(
    `http://localhost:3000/user/recievedBudgets/${userID}`,
  );
  const response = await request
    .get(`?userID=${userID}`)
    .set('Authorization', `Bearer ${token}`)
    .expect(200);
  expect(response.body).toBeDefined();
});
