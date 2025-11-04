import { Company } from './../generated/prisma/index.d';
import { registerWorker } from '../src/modules/workers/registerWorker';
import { assignShiftWorker } from '../src/modules/companies/assignShiftWorker';
import { registerCompany } from '../src/modules/companies/registerCompany';
import { registerDirections } from '../src/modules/directions/registerDirections';
import registerAdmin from '../src/modules/admin/registerAdmin';
import { PrismaClient } from '../generated/prisma';
const prisma = new PrismaClient();
describe('assignShiftWorker', () => {
  jest.setTimeout(20000);
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.shiftSchedule.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.directions.deleteMany({});
  });

  afterAll(async () => {
    await prisma.shiftSchedule.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.$disconnect();
  });

  it('should assign a shift to a worker successfully', async () => {
    const Directions = await registerDirections(
      '123 Test St, Test City, TS 12345',
      'Test City',
      'TS',
      '12345',
    );
    const admin = await registerAdmin(
      `admin-${Date.now()}@test.com`,
      'adminPassword',
    );
    const newCompany: Company = await registerCompany(
      `Shift Test Company ${Date.now()}`,
      '1234567890',
      `shift-company-${Date.now()}@example.com`,
      'compPassword',
      admin.adminID,
      Directions,
    );

    // Register a worker
    const worker = await registerWorker(
      `shift-worker-${Date.now()}@example.com`,
      'workerPassword',
      'Shift Worker',
      newCompany.companyID,
    );

    // Assign a shift to the worker
    const shiftDate = new Date('2024-07-01T08:00:00Z');
    const shiftType = 'morning';
    const createdShift = await assignShiftWorker(
      worker.workerid,
      shiftDate,
      shiftType,
    );
    expect(createdShift).toBeDefined();
    expect(createdShift.workerID).toBe(worker.workerid);

    expect(createdShift.shiftType).toBe(shiftType);
  });
});
