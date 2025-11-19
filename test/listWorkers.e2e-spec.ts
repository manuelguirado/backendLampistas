import { registerCompany } from '../src/modules/companies/registerCompany';
import { registerDirections } from '../src/modules/directions/registerDirections';
import { registerWorker } from '../src/modules/workers/registerWorker';
import { listWorkers } from '../src/modules/companies/listWorkers';
import { PrismaClient } from '../generated/prisma';
import registerAdmin from '../src/modules/admin/registerAdmin';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const prisma = new PrismaClient();
describe('listWorker', () => {
  jest.setTimeout(20000); // 20 segundos para cada test
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.incidents.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.admin.deleteMany({});
  });
  afterAll(async () => {
    await prisma.incidents.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.$disconnect();
  });
  it('should list workers for a given company', async () => {
    const directions = await registerDirections(
      '123 Test St',
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
      `company-${Date.now()}@test.com`,
      'securePassword',
      admin.adminID,
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
    const result = await listWorkers(company.companyID);
    expect(result).toBeDefined();
  });
  it('should return empty list if company has no workers', async () => {
    const directions = await registerDirections(
      '456 Another St',
      'Another City',
      'AC',
      '67890',
    );
    const admin = await registerAdmin(
      `admin-${Date.now()}@test.com`,
      'adminPassword',
    );
    const company = await registerCompany(
      'Empty Company',
      '0987654321',
      `empty-company-${Date.now()}@test.com`,
      'anotherSecurePassword',
      admin.adminID,
      directions,
    );
    const result = await listWorkers(company.companyID);
    if (Array.isArray(result)) {
      expect(result).toEqual([]); // Verifica que la lista de workers está vacía
    } else {
      expect(result).toHaveProperty('clients');
      expect(result).toEqual([]); // Verifica que la lista de workers está vacía
    }
  });

  it('should throw an error if company does not exist', async () => {
    const nonExistingCompanyID = 999999;
    await expect(listWorkers(nonExistingCompanyID)).rejects.toThrow(
      'Company does not exist',
    );
  });
  it('should throw an error if companyID is not provided', async () => {
    await expect(listWorkers(0)).rejects.toThrow('companyID is required');
  });
  it('should return jwt token along with workers', async () => {
    const directions = await registerDirections(
      '123 Test St',
      'Test City',
      'TS',
      '12345',
    );
    const admin = await registerAdmin(
      `admin-${Date.now()}@test.com`,
      'adminPassword',
    );
    const company = await registerCompany(
      'JWT Company',
      '1234567890',
      `jwt-company-${Date.now()}@test.com`,
      'securePassword',
      admin.adminID,
      directions,
    );
    // Register a worker
    const worker = await registerWorker(
      `jwt-worker-${Date.now()}@test.com`,
      'workerPassword',
      'JWT Worker',
      company.companyID,
    );

    const result = await listWorkers(company.companyID);
    expect(result).toBeDefined();

    if (Array.isArray(result)) {
      // If result is an array, token should not exist
      expect(result.length).toBeGreaterThanOrEqual(0);
    } else {
      expect(result.token).toBeDefined();
    }

    // Verify JWT token
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify((result as { token: string }).token, secret) as {
      companyID: number;
      iat: number;
      exp: number;
    };
    expect(decoded).toBeDefined();
    expect(worker).toBeDefined();
    expect(decoded.companyID).toBe(company.companyID);
  });
});
