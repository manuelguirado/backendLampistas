import { userRegister } from '../src/modules/users/userRegister';
import { createIncident } from '../src/modules/incidents/createIncident';
import { PrismaClient } from '../generated/prisma';
import { registerCompany } from '../src/modules/companies/registerCompany';
import registerAdmin from '../src/modules/admin/registerAdmin';
import { registerDirections } from '../src/modules/directions/registerDirections';
import myIncidents from '../src/modules/users/myIncidents';
const prisma = new PrismaClient();
describe('My Incidents ', () => {
  beforeAll(async () => {
    await prisma.shiftSchedule.deleteMany({});
    await prisma.budget.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.contracts.deleteMany({});
    await prisma.incidents.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
  });
  afterAll(async () => {
    await prisma.shiftSchedule.deleteMany({});
    await prisma.budget.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.contracts.deleteMany({});
    await prisma.incidents.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.$disconnect();
  });
  it('should fetch incidents for a user', async () => {
    const user = await userRegister(
      'testuser',
      `testpass-${Date.now()}@example.com`,
      'user',
    );
    const admin = await registerAdmin(
      `admin-${Date.now()}@test.com`,
      'adminPassword',
    );
    const directions = await registerDirections(
      '123 Test St',
      'Test City',
      'TS',
      '12345',
    );
    const company = await registerCompany(
      'Test Company',
      '1234567890',
      `company-${Date.now()}@test.com`,
      'securePassword',
      admin.adminID,
      directions,
    );
    const incident1 = await createIncident(
      'Incident 1',
      'Description 1',
      user.userID,
      company.companyID,
      'open',
      'high',
    );
    const incident2 = await createIncident(
      'Incident 2',
      'Description 2',
      user.userID,
      company.companyID,
      'in_progress',
      'medium',
    );
    expect(incident1).toBeDefined();
    expect(incident2).toBeDefined();

    const result = await myIncidents(user.userID);
    expect(result.incidents).toHaveLength(2);
  });
});
