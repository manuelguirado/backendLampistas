import { registerWorker } from '../src/modules/workers/registerWorker';
import { registerCompany } from '../src/modules/companies/registerCompany';
import { registerDirections } from '../src/modules/directions/registerDirections';
import { assignCode } from '../src/modules/admin/assingCode';
import { PrismaClient } from '../generated/prisma';
import { userRegister } from '../src/modules/users/userRegister';
import registerAdmin from '../src/modules/admin/registerAdmin';
jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));
const prisma = new PrismaClient();
describe('Assign Code E2E Tests', () => {
  beforeAll(async () => {
    // Clean up database before tests
    await prisma.worker.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
  });

  afterAll(async () => {
    // Clean up database after tests
    await prisma.worker.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.$disconnect();
  });

  it('should assign code to a company', async () => {
    const directions = await registerDirections(
      '456 Corporate Blvd',
      'Businesstown',
      'Businessstate',
      '67890',
    );
    const admin = await registerAdmin(
      `admintest-${Date.now()}@test.com`,
      'adminPassword',
    );
    const company = await registerCompany(
      'Test Company',
      '1234567890',
      'testcompany@example.com',
      'securepassword',
      admin.adminID,
      directions,
    );

    const response = await assignCode('company', company.companyID);
    expect(response).toHaveProperty('message', 'Code assigned successfully');
    expect(response).toHaveProperty('code');

    const updatedCompany = await prisma.company.findUnique({
      where: { companyID: company.companyID },
    });
    expect(updatedCompany?.companyCode).toBe(response.code);
  });
  it('should assign code to a worker', async () => {
    const admin = await registerAdmin(
      `workeradmintest-${Date.now()}@test.com`,
      'adminPassword',
    );
    const directions = await registerDirections(
      '789 Industrial Rd',
      'Worktown',
      'Workstate',
      '54321',
    );
    const company = await registerCompany(
      'Worker Company',
      '0987654321',
      'workercompany@example.com',
      'securepassword',
      admin.adminID,
      directions,
    );

    const worker = await registerWorker(
      'testworker@example.com',
      'securepassword',
      'Test Worker',
      company.companyID,
    );
    const response = await assignCode(
      'worker',
      company.companyID,
      worker.workerid,
    );
    expect(response).toHaveProperty('message', 'Code assigned successfully');
    expect(response).toHaveProperty('code');

    const updatedWorker = await prisma.worker.findUnique({
      where: { workerid: worker.workerid },
    });
    expect(updatedWorker?.workerCode).toBe(response.code);
  });

  it('should assign code to a user', async () => {
    const user = await userRegister(
      'Test User',
      'testuser@example.com',
      'securepassword',
    );
    const response = await assignCode(
      'user',
      undefined,
      undefined,
      user.userID,
    );
    expect(response).toHaveProperty('message', 'Code assigned successfully');
    expect(response).toHaveProperty('code');

    const updatedUser = await prisma.user.findUnique({
      where: { userID: user.userID },
    });
    expect(updatedUser?.userCode).toBe(response.code);
  });
});
