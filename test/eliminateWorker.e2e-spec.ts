import { PrismaClient } from './../generated/prisma';
import { registerDirections } from '../src/modules/directions/registerDirections';
import { eliminateWorker } from '../src/modules/workers/eliminateWorker';
import { registerCompany } from '../src/modules/companies/registerCompany';
import { registerWorker } from '../src/modules/workers/registerWorker';
import registerAdmin from '../src/modules/admin/registerAdmin';
jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));
const prisma = new PrismaClient();
describe('eliminateWorker', () => {
  jest.setTimeout(20000); // 20 segundos para cada test
  beforeAll(async () => {
    // Clean up all test data before tests
    await prisma.$connect();
    await prisma.worker.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.admin.deleteMany({});
  });
  afterAll(async () => {
    // Clean up all test data and disconnect after all tests
    await prisma.worker.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.$disconnect();
  });
  it('should eliminate an existing worker successfully', async () => {
    // First, register a company to associate the worker with
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
      'Test Company',
      '1234567890',
      'test@company.com',
      'securePassword',
      admin.adminID,
      directions,
    );
    // Then, create a worker for that company
    const worker = await registerWorker(
      'John',
      'Doe',
      'john.doe@example.com',
      company.companyID,
    );
    // Now, eliminate the worker
    const response = await eliminateWorker(worker.workerid);
    expect(response).toEqual({ message: 'Worker deleted successfully' });
    // Verify the worker is actually deleted
    const deletedWorker = await prisma.worker.findUnique({
      where: { workerid: worker.workerid },
    });
    expect(deletedWorker).toBeNull();
  });
  it('should throw an error when trying to eliminate a non-existing worker', async () => {
    const nonExistingWorkerId = 99999; // Assuming this ID does not exist
    await expect(eliminateWorker(nonExistingWorkerId)).rejects.toThrow(
      'Worker not found',
    );
  });
  it('should throw an error when workerid is not provided', async () => {
    await expect(eliminateWorker(9010)).rejects.toThrow('Worker not found');
  });
});
