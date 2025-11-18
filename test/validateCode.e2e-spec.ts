import { validateCode } from '../src/utils/validateCode';
import { assignCode } from '../src/utils/assingCode';
import { PrismaClient } from '../generated/prisma';
import { userRegister } from '../src/modules/users/userRegister';
import { registerCompany } from '../src/modules/companies/registerCompany';
import { registerWorker } from '../src/modules/workers/registerWorker';
import { registerDirections } from '../src/modules/directions/registerDirections';
import registerAdmin from '../src/modules/admin/registerAdmin';
const prisma = new PrismaClient();
jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));
describe('validateCode', () => {
  beforeAll(async () => {
    // Clean up database before tests
    await prisma.$connect();
    await prisma.user.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
  });

  afterAll(async () => {
    // Clean up database after tests
    await prisma.user.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.$disconnect();
  });
  it('should validate code for company', async () => {
    const directions = await registerDirections(
      '123 Main St',
      'City',
      'State',
      '12345',
    );
    const admin = await registerAdmin(
      `admin@example.com-${Date.now()}`,
      'password123',
    );
    const company = await registerCompany(
      'Test Company',
      '555-1234',
      `company-${Date.now()}@example.com`,
      'password123',
      admin.adminID,
      directions,
    );

    // Asignar código a la compañía
    const { code } = await assignCode('company', company.companyID);

    const isValid = await validateCode('company', company.companyID, code);
    expect(isValid).toBe(true);
  });

  it('should validate code for user', async () => {
    const user = await userRegister(
      `user-${Date.now()}@example.com`,
      'password123',
      'Test User',
    );

    // Asignar código al usuario
    const { code } = await assignCode(
      'user',
      undefined,
      undefined,
      user.userID,
    );

    const isValid = await validateCode('user', user.userID, code);
    expect(isValid).toBe(true);
  });

  it('should validate code for worker', async () => {
    const directions = await registerDirections(
      '456 Elm St',
      'City',
      'State',
      '67890',
    );
    const admin = await registerAdmin(
      `admin@example.com-${Date.now()}`,
      'password123',
    );
    const company = await registerCompany(
      'Worker Company',
      '555-5678',
      `worker-company-${Date.now()}@example.com`,
      'password123',
      admin.adminID,
      directions,
    );
    const worker = await registerWorker(
      `worker-${Date.now()}@example.com`,
      'password123',
      'Test Worker',
      company.companyID,
    );

    // Asignar código al trabajador
    const { code } = await assignCode('worker', undefined, worker.workerid);

    const isValid = await validateCode('worker', worker.workerid, code);
    expect(isValid).toBe(true);
  });

  it('should return false for invalid code', async () => {
    const isValid = await validateCode('user', 1, 'invalid-code');
    expect(isValid).toBe(false);
  });
});
