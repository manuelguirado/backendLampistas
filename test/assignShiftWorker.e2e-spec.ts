import { Company } from './../generated/prisma/index.d';
import { registerWorker } from '../src/modules/workers/registerWorker';
import { assignShiftWorker } from '../src/modules/companies/assignShiftWorker';
import { registerCompany } from '../src/modules/companies/registerCompany';
import { registerDirections } from '../src/modules/directions/registerDirections';
import registerAdmin from '../src/modules/admin/registerAdmin';
import { PrismaClient } from '../generated/prisma';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
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
  it('should return JWT token upon successful company login', async () => {
    const Directions = await registerDirections(
      '456 Login St, Login City, LC 67890',
      'Login City',
      'LC',
      '67890',
    );
    const admin = await registerAdmin(
      `login-admin-${Date.now()}@test.com`,
      'adminPassword',
    );
    const company = await registerCompany(
      `Login Test Company ${Date.now()}`,
      '0987654321',
      `login-company-${Date.now()}@example.com`,
      'loginCompPassword',
      admin.adminID,
      Directions,
    );
    const worker = await registerWorker(
      `login-worker-${Date.now()}@example.com`,
      'workerPassword',
      'Login Worker',
      company.companyID,
    );

    // Assign a shift to the worker
    const shiftDate = new Date('2024-07-02T08:00:00Z');
    const shiftType = 'evening';
    const createdShift = await assignShiftWorker(
      worker.workerid,
      shiftDate,
      shiftType,
    );
    expect(createdShift).toBeDefined();
    expect(createdShift.token).toBeDefined();
    const token = createdShift.token;
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as {
      companyID: string;
      role: string;
      iat: number;
      exp: number;
    };
    expect(company.companyID).toBe(company.companyID);
    expect(company.role).toBe(company.role);
    expect(decoded).toBeDefined();
  });
});
