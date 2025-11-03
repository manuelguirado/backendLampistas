import { registerCompany } from '../src/modules/companies/registerCompany';
import { registerDirections } from '../src/modules/directions/registerDirections';
import { registerWorker } from '../src/modules/workers/registerWorker';
import { listWorker } from '../src/modules/workers/listWorker';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();
describe('listWorker', () => {
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.worker.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.company.deleteMany({});
  });
  afterAll(async () => {
    await prisma.worker.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.$disconnect();
  });
  it('should list workers for a given company', async () => {
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
      directions,
    );
    // Register workers for the company
    const worker1 = await registerWorker(
      'worker@gmail.com',
      'mysecurepassword',
      'Test Worker 1',
      company.companyID,
    );
    const worker2 = await registerWorker(
      'worker2@gmail.com',
      'mysecurepassword2',
      'Test Worker 2',
      company.companyID,
    );
    // List workers for the company
    expect(worker1).toBeDefined();
    expect(worker2).toBeDefined();
    const workers = await listWorker(company.companyID);
    expect(workers.length).toBe(2);
    const workerEmails = workers.map((w) => w.email);
    expect(workerEmails).toContain('worker@gmail.com');
    expect(workerEmails).toContain('worker2@gmail.com');
  });
  it('should return empty list if company has no workers', async () => {
    const directions = await registerDirections(
      '456 Another St',
      'Another City',
      'AC',
      '67890',
    );
    const company = await registerCompany(
      'Empty Company',
      '0987654321',
      `empty-company-${Date.now()}@test.com`,
      'anotherSecurePassword',
      directions,
    );
    const workers = await listWorker(company.companyID);
    expect(workers.length).toBe(0);
  });
  it('should throw an error if company does not exist', async () => {
    const nonExistingCompanyID = 999999;
    await expect(listWorker(nonExistingCompanyID)).rejects.toThrow(
      'Company does not exist',
    );
  });
});
