import { PrismaClient } from '../generated/prisma';
import { myShifts } from '../src/modules/workers/myShifts';
import { registerWorker } from '../src/modules/workers/registerWorker';
import { registerCompany } from '../src/modules/companies/registerCompany';
import { registerDirections } from '../src/modules/directions/registerDirections';
import registerAdmin from '../src/modules/admin/registerAdmin';
import { assignShiftWorker } from '../src/modules/companies/assignShiftWorker';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
const prisma = new PrismaClient();

describe('myShifts', () => {
  jest.setTimeout(20000);

  beforeAll(async () => {
    await prisma.$connect();
    await prisma.incidents.deleteMany({});
    await prisma.shiftSchedule.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.directions.deleteMany({});
  });

  afterAll(async () => {
    await prisma.incidents.deleteMany({});
    await prisma.shiftSchedule.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.$disconnect();
  });

  it('should retrieve shifts assigned to a worker', async () => {
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
    const newCompany = await registerCompany(
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

    // Assign shifts to the worker
    const shiftDate1 = new Date('2024-07-01T08:00:00Z');
    const shiftType1 = 'morning';
    await assignShiftWorker(worker.workerid, shiftDate1, shiftType1);

    const shiftDate2 = new Date('2024-07-02T16:00:00Z');
    const shiftType2 = 'evening';
    await assignShiftWorker(worker.workerid, shiftDate2, shiftType2);

    // Retrieve shifts for the worker
    const shifts = await myShifts(worker.workerid);
    expect(shifts).toBeDefined();
    const shiftList = Array.isArray(shifts) ? shifts : shifts.shifts;
    expect(shiftList.length).toBe(2);

    const mappedShifts = shiftList.map(
      (shift: {
        workerID: number;
        shiftSchedule: Date;
        shiftType: string;
      }) => ({
        workerID: shift.workerID,
        shiftSchedule: shift.shiftSchedule,
        shiftType: shift.shiftType,
      }),
    );

    expect(mappedShifts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          workerID: worker.workerid,
          shiftSchedule: shiftDate1,
          shiftType: shiftType1,
        }),
        expect.objectContaining({
          workerID: worker.workerid,
          shiftSchedule: shiftDate2,
          shiftType: shiftType2,
        }),
      ]),
    );
  });
  it('should return jwt token along with shifts', async () => {
    const Directions = await registerDirections(
      '456 Another St, Another City, AC 67890',
      'Another City',
      'AC',
      '67890',
    );
    const admin = await registerAdmin(
      `admin-${Date.now()}@test.com`,
      'adminPassword',
    );
    const newCompany = await registerCompany(
      `JWT Shift Test Company ${Date.now()}`,
      '0987654321',
      `jwt-shift-company-${Date.now()}@example.com`,
      'compPassword',
      admin.adminID,
      Directions,
    );

    // Register a worker
    const worker = await registerWorker(
      `jwt-shift-worker-${Date.now()}@example.com`,
      'workerPassword',
      'JWT Shift Worker',
      newCompany.companyID,
    );

    // Assign a shift to the worker
    const shiftDate = new Date('2024-08-01T08:00:00Z');
    const shiftType = 'morning';
    await assignShiftWorker(worker.workerid, shiftDate, shiftType);

    // Retrieve shifts for the worker
    const result = await myShifts(worker.workerid);
    expect(result).toBeDefined();
    if (!Array.isArray(result)) {
      expect(result.token).toBeDefined();

      // Verify JWT token
      const secret = process.env.JWT_SECRET as string;
      const decoded = jwt.verify(result.token, secret) as {
        workerID: number;
        companyID: number;
        iat: number;
        exp: number;
      };
      expect(decoded.workerID).toBe(worker.workerid);
      expect(decoded.companyID).toBe(worker.companyID);
    } else {
      throw new Error(
        'Expected result to be an object with token, but got an array',
      );
    }
  });
});
