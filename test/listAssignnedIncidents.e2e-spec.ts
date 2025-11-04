import { createIncident } from '../src/modules/incidents/createIncident';
import { userRegister } from '../src/modules/users/userRegister';
import registerAdmin from '../src/modules/admin/registerAdmin';
import { registerCompany } from '../src/modules/companies/registerCompany';
import { registerDirections } from '../src/modules/directions/registerDirections';
import { PrismaClient } from '../generated/prisma';
import { registerWorker } from '../src/modules/workers/registerWorker';
import { listAssignedIncidents } from '../src/modules/workers/listAssignedIncidents';
const prisma = new PrismaClient();
describe('List Assigned Incidents', () => {
  jest.setTimeout(20000); // 20 segundos para cada test
  beforeAll(async () => {
    // Setup code before all tests run
    await prisma.$connect();
    await prisma.incidents.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
  });

  afterAll(async () => {
    // Cleanup code after all tests run
    await prisma.incidents.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.$disconnect();
  });
  it('should list assigned incidents for a worker', async () => {
    // Register admin
    const admin = await registerAdmin(
      `admin-${Date.now()}@test.com`,
      'adminPassword',
    );
    // Register company
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
    // Register user
    const user = await userRegister(
      `worker-${Date.now()}@test.com`,
      'workerPassword',
      'Test Worker',
    );
    // Assign worker to company with unique email
    const uniqueWorkerEmail = `worker1-${Date.now()}@test.com`;
    const worker = await registerWorker(
      uniqueWorkerEmail,
      'superSecurePassword',
      'Worker One',
      company.companyID,
    );
    // Create incident
    const incident = await createIncident(
      'Incident Title',
      'Incident Description',
      user.userID,
      company.companyID,
      'OPEN',
      'HIGH',
    );
    // Assign incident to worker
    await prisma.incidents.update({
      where: { IncidentsID: incident.IncidentsID },
      data: {
        assignedWorkerID: worker.workerid,
      },
    });
    // List assigned incidents
    const assignedIncidents = await listAssignedIncidents(worker.workerid);
    expect(assignedIncidents).toBeDefined();
    expect(assignedIncidents.length).toBe(1);
    expect(assignedIncidents[0].incidentID).toBe(incident.IncidentsID);
  });
  it('should return empty list if no incidents assigned', async () => {
    // Register admin
    const admin = await registerAdmin(
      `admin-${Date.now()}@test.com`,
      'adminPassword',
    );
    // Register company
    const directions = await registerDirections(
      '123 Test St',
      'Test City',
      'TS',
      '12345',
    );
    const company = await registerCompany(
      'Test_Company',
      '1234567890',
      `company-${Date.now()}@test.com`,
      'securePassword',
      admin.adminID,
      directions,
    );
    // Register worker with unique email
    const uniqueWorkerEmail = `worker2-${Date.now()}@test.com`;
    const worker = await registerWorker(
      uniqueWorkerEmail,
      'superSecurePassword',
      'Worker One',
      company.companyID,
    );
    // List assigned incidents
    const assignedIncidents = await listAssignedIncidents(worker.workerid);
    expect(assignedIncidents).toBeDefined();
    expect(assignedIncidents.length).toBe(0);
  });
});
