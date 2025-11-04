import supertest from 'supertest';
import { userRegister } from '../modules/users/userRegister';
import { PrismaClient } from '../../generated/prisma';
const prisma = new PrismaClient();
describe('UserController', () => {
  beforeAll(async () => {
    await prisma.$connect();
  });
  afterAll(async () => {
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
    const email = `loginuser-${Date.now()}@example.com`;
    const password = 'securePassword';
    // First, register the user
    await userRegister('Login User', email, password);
    // Then, attempt to login
    const request = supertest('http://localhost:3000/user/userLogin');
    const response = await request
      .post('')
      .send({ email, password })
      .expect(200);
    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body)).toBe(false);
  });
  it('should create an incident successfully', async () => {
    const user = await userRegister(
      `incidentuser-${Date.now()}@example.com`,
      'incidentPassword',
      'Incident User',
    );
    const request = supertest('http://localhost:3000/incidents/createIncident');
    const title = 'Test Incident';
    const description = 'This is a test incident';
    const machineryID = 1;
    const response = await request
      .post('')
      .send({
        title,
        description,
        machineryID,
        userID: user.userID,
      })
      .expect(201);
    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body)).toBe(false);
  });
  it('should find machinery for a user successfully', async () => {
    const user = await userRegister(
      `machineryuser-${Date.now()}@example.com`,
      'machineryPassword',
      'Machinery User',
    );
    const request = supertest('http://localhost:3000/user/userMachinery');
    const response = await request
      .get('')
      .send({ userID: user.userID })
      .expect(200);
    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body)).toBe(true);
  });
});
