import { createMachinery } from '../src/modules/machinery/createMachinery';
import { registerCompany } from '../src/modules/companies/registerCompany';
import { userRegister } from '../src/modules/users/userRegister';
import { registerDirections } from '../src/modules/directions/registerDirections';
import registerAdmin from '../src/modules/admin/registerAdmin';
import { PrismaClient } from '../generated/prisma';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
const prisma = new PrismaClient();
jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));
describe('createMachinery', () => {
  jest.setTimeout(20000); // 20 segundos para cada test
  beforeAll(async () => {
    // Clean up all test data before tests
    await prisma.user.deleteMany({});
    await prisma.machinery.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
  });
  afterAll(async () => {
    // Clean up all test data and disconnect after all tests
    await prisma.user.deleteMany({});
    await prisma.machinery.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.$disconnect();
  });
  it('should create machinery successfully with valid data', async () => {
    // First, register a company

    const directions = await registerDirections(
      '123 Main St',
      'Metropolis',
      'NY',
      '10001',
    );
    const admin = await registerAdmin(
      `admin-${Date.now()}@test.com`,
      'adminPassword',
    );

    const companyEmail = `machinery-test-company-${Date.now()}@example.com`;
    const companyPassword = 'companyPassword';
    const company = await registerCompany(
      'Test Company',
      '1234567890',
      companyEmail,
      companyPassword,
      admin.adminID,
      directions,
    );
    // Then, register a user for that company
    const userEmail = `machinery-test-user-${Date.now()}@example.com`;
    const userPassword = 'userPassword';
    const user = await userRegister('testUser', userEmail, userPassword);
    // Now, create machinery
    const machinery = await createMachinery(
      'Excavator',
      'Heavy duty excavator',
      new Date('2024-12-01'),
      new Date('2024-11-01'),
      new Date('2024-01-15'),
      user.userID,
      company.name,
      'Construction',
      company.companyID,
      'SN12345',
    );
    expect(machinery).toBeDefined();
    expect(machinery.name).toBe('Excavator');
    expect(machinery.companyID).toBe(company.companyID);
  });
  it('should throw an error when required fields are missing', async () => {
    await expect(
      createMachinery(
        '',
        'Heavy duty excavator',
        new Date('2024-12-01'),
        new Date('2024-11-01'),
        new Date('2024-01-15'),
        1,
        'Test Company',
        'Construction',
        1,
        'SN12345',
      ),
    ).rejects.toThrow('All fields are required');
  });
  it('should return jwt token upon machinery creation', async () => {
    // First, register a company
    const directions = await registerDirections(
      '456 Another St',
      'Gotham',
      'IL',
      '60601',
    );
    const admin = await registerAdmin(
      `admin-${Date.now()}@test.com`,
      'adminPassword',
    );
    const companyEmail = `jwt-test-company-${Date.now()}@example.com`;
    const companyPassword = 'companyPassword';
    const company = await registerCompany(
      'JWT Test Company',
      '0987654321',
      companyEmail,
      companyPassword,
      admin.adminID,
      directions,
    );
    // Then, register a user for that company
    const userEmail = `jwt-test-user-${Date.now()}@example.com`;
    const userPassword = 'userPassword';
    const user = await userRegister('jwtTestUser', userEmail, userPassword);
    // Now, create machinery
    const machineryWithToken = await createMachinery(
      'Bulldozer',
      'Heavy duty bulldozer',
      new Date('2024-10-01'),
      new Date('2024-09-01'),
      new Date('2024-02-20'),
      user.userID,
      company.name,
      'Construction',
      company.companyID,
      'ABC123',
    );
    expect(machineryWithToken).toBeDefined();
    const token = machineryWithToken.token;
    expect(token).toBeDefined();
    // Verify JWT token
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as {
      companyID: number;
      role: string;
      iat: number;
      exp: number;
    };
    expect(decoded.companyID).toBe(company.companyID);
    expect(decoded.role).toBe('COMPANY');
  });
});
