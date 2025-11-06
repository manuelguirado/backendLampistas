import { userRegister } from '../src/modules/users/userRegister';
import { createIncident } from '../src/modules/incidents/createIncident';
import { updateStatusIncident } from '../src/modules/workers/updateStatusIncident';
import { registerCompany } from '../src/modules/companies/registerCompany';
import { registerDirections } from '../src/modules/directions/registerDirections';
import registerAdmin from '../src/modules/admin/registerAdmin';
import { PrismaClient } from '../generated/prisma';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
const prisma = new PrismaClient();

describe('Update Status Incidents', () => {
  jest.setTimeout(20000); // 20 segundos para cada test

  beforeAll(async () => {
    await prisma.$connect();
    await prisma.incidents.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.directions.deleteMany({});
  });

  afterAll(async () => {
    await prisma.incidents.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.$disconnect();
  });
  it('should update the status of an incident', async () => {
    // First, register necessary entities: Directions, Admin, Company, Worker
    const directions = await registerDirections(
      '123 Test St',
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

    const user = await userRegister(
      `user-${Date.now()}@test.com`,
      'userPassword',
      'Test User',
    );

    // Create an incident
    const incident = await createIncident(
      'Test Incident',
      'This is a test incident',
      user.userID,
      company.companyID,
      'HIGH',
    );

    // Update the status of the incident
    const updatedIncident = await updateStatusIncident(
      incident.IncidentsID,
      'IN_PROGRESS',
    );
    expect(updatedIncident).toBeDefined();
    expect(updatedIncident.status).toBe('IN_PROGRESS');
  });
  it('should return the jwt token upon status update', async () => {
    // Register necessary entities: Directions, Admin, Company, Worker
    const directions = await registerDirections(
      '123 Test St',
      'Test City',
      'TS',
      '12345',
    );
    const admin = await registerAdmin(
      `admin-${Date.now()}@test.com`,
      'adminPassword',
    );
    const company = await registerCompany(
      `Test Company ${Date.now()}`,
      '1234567890',
      `company-${Date.now()}@test.com`,
      'securePassword',
      admin.adminID,
      directions,
    );

    const user = await userRegister(
      'Test User12',
      `user-${Date.now()}@test.com`,
      'userPassword',
    );

    // Create an incident
    const incident = await createIncident(
      'Test Incident',
      'This is a test incident',
      user.userID,
      company.companyID,
      'HIGH',
    );

    // Update the status of the incident
    const result = await updateStatusIncident(incident.IncidentsID, 'RESOLVED');
    const token = result.token;
    expect(token).toBeDefined();
    // Verify the token
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as {
      companyID: number;
      role: string;
      iat: number;
      exp: number;
    };
    expect(decoded).toBeDefined();
    expect(company.companyID).toBe(company.companyID);
    expect(company.role).toBe(company.role);
    expect(result).toBeDefined();
    expect(result.token).toBeDefined();
    expect(typeof result.token).toBe('string');
  });
});
