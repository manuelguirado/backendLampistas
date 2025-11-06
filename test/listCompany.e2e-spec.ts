import { PrismaClient } from '../generated/prisma';
import { listCompany } from '../src/modules/admin/listCompany';
import { registerCompany } from '../src/modules/companies/registerCompany';
import { registerDirections } from '../src/modules/directions/registerDirections';
import registerAdmin from '../src/modules/admin/registerAdmin';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const prisma = new PrismaClient();

describe('listCompany', () => {
  jest.setTimeout(20000); // 20 segundos para cada test
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.directions.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.company.deleteMany({});
  });

  afterAll(async () => {
    await prisma.directions.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.$disconnect();
  });
  it('should list all companies', async () => {
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
    const company1 = await registerCompany(
      'Test Company 1',
      '1234567890',
      `company1-${Date.now()}@test.com`,
      'securePassword1',
      admin.adminID,
      directions,
    );
    const company2 = await registerCompany(
      'Test Company 2',
      '0987654321',
      `company2-${Date.now()}@test.com`,
      'securePassword2',
      admin.adminID,
      directions,
    );
    const result = await listCompany(admin.adminID);
    expect(result).toHaveProperty('companies');
    const companies = Array.isArray(result) ? result : result.companies;
    expect(companies.length).toBeGreaterThanOrEqual(2);
    const companyNames = companies.map((comp) => comp.name);
    expect(company1).toBeDefined();
    expect(company2).toBeDefined();
    expect(companyNames).toContain('Test Company 1');
    expect(companyNames).toContain('Test Company 2');
    expect(companyNames).toContain('Test Company 1');
    expect(companyNames).toContain('Test Company 2');
  });
  it('should return an empty array when no companies are registered', async () => {
    // First, clean up all companies
    const admin = await registerAdmin(
      `admin-no-companies-${Date.now()}@test.com`,
      'adminPassword',
    );
    await prisma.adminsCompanies.deleteMany({});
    await prisma.company.deleteMany({});
    const result = await listCompany(admin.adminID);
    if (Array.isArray(result)) {
      expect(result).toEqual([]);
    } else {
      expect(result).toHaveProperty('companies');
      expect(result.companies).toEqual([]);
    }
  });
  it('should also return a valid JWT token', async () => {
    const directions = await registerDirections(
      '123 Test St, Test City, TS 12345',
      'Test City',
      'TS',
      '12345',
    );
    const admin = await registerAdmin(
      `admin-jwt-${Date.now()}@test.com`,
      'adminPassword',
    );
    await registerCompany(
      'JWT Test Company',
      '1234567890',
      `jwt-company-${Date.now()}@test.com`,
      'securePassword',
      admin.adminID,
      directions,
    );
    const result = await listCompany(admin.adminID);
    // Ensure result is an object with a token property
    if (Array.isArray(result)) {
      throw new Error(
        'Expected result to be an object with a token property, but got an array.',
      );
    }
    expect(result).toHaveProperty('token');
    const token = result.token;
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret) as {
      adminID: number;
      role: string;
      iat: number;
      exp: number;
    };
    expect(decoded).toBeDefined();
    expect(admin.adminID).toBe(admin.adminID);
    expect(admin.role).toBe(admin.role);
  });
});
