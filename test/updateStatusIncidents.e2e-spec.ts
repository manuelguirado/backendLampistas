import { userRegister } from '../src/modules/users/userRegister';
import { createIncident } from '../src/modules/incidents/createIncident';
import { updateStatusIncident } from '../src/modules/workers/updateStatusIncident';
import { registerCompany } from '../src/modules/companies/registerCompany';
import { registerDirections } from '../src/modules/directions/registerDirections';
import registerAdmin from '../src/modules/admin/registerAdmin';
import { PrismaClient } from '../generated/prisma';

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
});
