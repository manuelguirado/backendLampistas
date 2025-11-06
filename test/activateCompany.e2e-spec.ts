import { activateCompany } from '../src/modules/admin/activateCompany';
import { registerDirections } from '../src/modules/directions/registerDirections';
import { registerCompany } from '../src/modules/companies/registerCompany';
import registerAdmin from '../src/modules/admin/registerAdmin';
import { PrismaClient } from '../generated/prisma';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));
const prisma = new PrismaClient();
describe('activateCompany', () => {
  beforeAll(async () => {
    // Clean up all test data before tests
    await prisma.directions.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
  });
  afterAll(async () => {
    // Clean up all test data and disconnect after all tests
    await prisma.directions.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.$disconnect();
  });
  it('should activate a suspended company successfully', async () => {
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
      ' 1234567890',
      'testcompany@example.com',
      'password123',
      admin.adminID,
      directions,
    );
    const suspendUntil = new Date();
    suspendUntil.setDate(suspendUntil.getDate() + 7); // Suspend for 7 days
    // Suspend the company
    await prisma.company.update({
      where: { companyID: company.companyID },
      data: {
        suspended: true,
        suspendedUntil: suspendUntil,
      },
    });
    // Then, activate the company
    await activateCompany(company.companyID);
    // Finally, verify that the company is activated
    const activatedCompany = await prisma.company.findUnique({
      where: { companyID: company.companyID },
    });
    expect(activatedCompany).not.toBeNull();
    expect(activatedCompany?.suspended).toBe(false);
  });
  it('should throw an error when trying to activate a company with invalid ID', async () => {
    await expect(activateCompany(0)).rejects.toThrow('Company ID is required');
  });
  it('should retunr JWT token upon successful activation', async () => {
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
      'jwtcompany',
      ' 1234567890',
      'jwtcompany@example.com',
      'password123',
      admin.adminID,
      directions,
    );
    // Activate the company
    const result = await activateCompany(company.companyID);
    expect(result).toHaveProperty('token');
    expect(result.token).toBeDefined();
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(result.token, secret);
    expect(decoded).toHaveProperty('companyID', company.companyID);
  });
});
