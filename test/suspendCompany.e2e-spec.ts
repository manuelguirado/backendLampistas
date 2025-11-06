import { suspendCompany } from '../src/modules/admin/suspendCompany';
import { registerDirections } from '../src/modules/directions/registerDirections';
import { registerCompany } from '../src/modules/companies/registerCompany';
import { PrismaClient } from '../generated/prisma';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
import registerAdmin from '../src/modules/admin/registerAdmin';
jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));
const prisma = new PrismaClient();
describe('suspendCompany', () => {
  jest.setTimeout(20000); // 20 segundos para cada test
  beforeAll(async () => {
    // Clean up all test data before tests
    await prisma.$connect();

    await prisma.directions.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.admin.deleteMany({});
  });
  afterAll(async () => {
    // Clean up all test data and disconnect after all tests
    await prisma.directions.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.$disconnect();
  });
  it('should suspend a company successfully', async () => {
    const directions = await registerDirections(
      'Test Direction',
      '123 Test St',
      '555-1234',
      'test-uuid',
    );
    const admin = await registerAdmin(
      `admin-${Date.now()}@test.com`,
      'adminPassword',
    );
    // First, register a new company
    const company = await registerCompany(
      'testcompany',
      '59289289042',
      'testcompany@example.com',
      'password123',
      admin.adminID,
      directions,
    );
    const suspendUntil = new Date();
    suspendUntil.setDate(suspendUntil.getDate() + 7); // Suspender por 7 días
    // Then, suspend the company
    await suspendCompany(company.companyID, suspendUntil);
    // Finally, verify that the company is suspended
    const suspendedCompany = await prisma.company.findUnique({
      where: { companyID: company.companyID },
    });
    expect(suspendedCompany).not.toBeNull();
    expect(suspendedCompany?.suspended).toBe(true);
  });
  it('should suspend a company indefinitely when no date is provided', async () => {
    const directions = await registerDirections(
      'Test Direction 2',
      '456 Test Ave',
      '555-5678',
      'test-uuid-2',
    );
    const admin = await registerAdmin(
      `admin-${Date.now()}@test.com`,
      'adminPassword',
    );
    // First, register a new company
    const company = await registerCompany(
      'testcompany2',
      '12345678901',
      'testcompany2@example.com',
      'password456',
      admin.adminID,
      directions,
    );
    // Then, suspend the company without a date
    await suspendCompany(company.companyID);
    // Finally, verify that the company is suspended indefinitely
    const suspendedCompany = await prisma.company.findUnique({
      where: { companyID: company.companyID },
    });
    expect(suspendedCompany).not.toBeNull();
    expect(suspendedCompany?.suspended).toBe(true);
    expect(suspendedCompany?.suspendedUntil).toBeNull();
  });
  it('should throw an error when trying to suspend a company with invalid ID', async () => {
    await expect(suspendCompany(0)).rejects.toThrow('Company ID is required');
  });
  it('should return JWT token with companyID when suspending a company', async () => {
    const directions = await registerDirections(
      'Test Direction 3',
      '789 Test Blvd',
      '555-9012',
      'test-uuid-3',
    );
    const admin = await registerAdmin(
      `admin-${Date.now()}@test.com`,
      'adminPassword',
    );
    // First, register a new company
    const company = await registerCompany(
      'testcompany3',
      '10987654321',
      `testcompany3-${Date.now()}@example.com`,
      'password789',
      admin.adminID,
      directions,
    );
    // Then, suspend the company
    const suspendResult: { token: string } = await suspendCompany(
      company.companyID,
    );
    const token = suspendResult.token;
    // Finally, verify the JWT token
    expect(token).toBeDefined();
    const secret = process.env.JWT_SECRET || 'defaultsecret';
    const decoded = jwt.verify(token, secret) as { companyID: number };
    expect(decoded).toHaveProperty('companyID', company.companyID);
  });
});
