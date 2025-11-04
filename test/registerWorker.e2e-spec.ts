import { PrismaClient } from '../generated/prisma';
import { registerWorker } from '../src/modules/workers/registerWorker';
import { registerCompany } from '../src/modules/companies/registerCompany';
import { registerDirections } from '../src/modules/directions/registerDirections';
import registerAdmin from '../src/modules/admin/registerAdmin';

const prisma = new PrismaClient();

describe('registerWorker', () => {
  jest.setTimeout(20000); // 20 segundos para cada test
  beforeEach(async () => {
    // cleanup database before each test
    await prisma.$connect();
    await prisma.worker.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.admin.deleteMany({});
  });

  afterAll(async () => {
    // cleanup database after tests
    await prisma.adminsCompanies.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.$disconnect();
  });

  it('should register a new worker', async () => {
    const email = `worker-test-${Date.now()}@example.com`;
    const name = 'Test Worker';
    const password = 'workerPassword';
    const directions = await registerDirections(
      '123 Worker St, Worker City, WC 12345',
      'Worker City',
      'WC',
      '12345',
    );
    const admin = await registerAdmin(
      `admin-${Date.now()}@test.com`,
      'adminPassword',
    );
    // First, create a company to associate the worker with
    const company = await registerCompany(
      `Worker Test Company ${Date.now()}`,
      '1234567890',
      `worker-company-${Date.now()}@example.com`,
      'compPassword',
      admin.adminID,
      directions,
    );

    const worker = await registerWorker(
      email,
      password,
      name,
      company.companyID,
    );

    // Verify the worker was created
    expect(worker).toBeDefined();
    expect(worker.email).toBe(email);
    expect(worker.name).toBe(name);
    expect(worker.companyID).toBe(company.companyID);

    // Verify in database
    const dbWorker = await prisma.worker.findUnique({
      where: { email },
    });
    expect(dbWorker).not.toBeNull();
    expect(dbWorker?.name).toBe(name);
    expect(dbWorker?.companyID).toBe(company.companyID);
  });

  it('should throw error if worker already exists', async () => {
    const email = `worker-duplicate-${Date.now()}@example.com`;
    const name = 'Test Worker';
    const password = 'workerPassword';
    const directions = await registerDirections(
      '123 Worker St, Worker City, WC 12345',
      'Worker City',
      'WC',
      '12345',
    );
    const admin = await registerAdmin(
      `admin-${Date.now()}@test.com`,
      'adminPassword',
    );
    // First, create a company to associate the worker with

    const company = await registerCompany(
      `Worker Test Company ${Date.now()}`,
      '1234567890',
      `worker-company-${Date.now()}@example.com`,
      'compPassword',
      admin.adminID,
      directions,
    );

    // Register worker first time
    await registerWorker(email, password, name, company.companyID);

    // Try to register same worker again
    await expect(
      registerWorker(email, password, name, company.companyID),
    ).rejects.toThrow('Worker already exists');
  });
});
