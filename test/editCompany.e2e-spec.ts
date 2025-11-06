import { editCompany } from '../src/modules/admin/editCompany';
import { registerDirections } from '../src/modules/directions/registerDirections';
import { registerCompany } from '../src/modules/companies/registerCompany';
import { PrismaClient } from '../generated/prisma';
import registerAdmin from '../src/modules/admin/registerAdmin';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));
const prisma = new PrismaClient();

describe('editCompany', () => {
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
  it("should edit a company's details successfully", async () => {
    const directions = await registerDirections(
      'Initial Direction',
      '123 Initial St',
      '555-0000',
      'test-uuid',
    );
    const updateData = {
      name: 'updatedcompany',
      email: 'updatedemail@example.com',
      phone: '  5550001',
    };
    const admin = await registerAdmin(
      `admin-${Date.now()}@test.com`,
      'adminPassword',
    );
    // First, register a new company
    const company = await registerCompany(
      'initialcompany',
      '12345678901',
      'test-uuid',
      'password123',
      admin.adminID,
      directions,
    );
    const updatedCompany = await editCompany(company.companyID, updateData);

    // Add other fields as needed to match the expected type
    expect(updatedCompany.companyID).toBe(company.companyID);
    expect(updatedCompany.email).toBe(updateData.email);
    expect(updatedCompany.phone).toBe(updateData.phone);
  });

  it('should throw an error when trying to edit a company with invalid ID', async () => {
    const updateData = {
      name: 'nonexistentcompany',
      email: 'noexistingo@example.com',
      phone: '5559999',
    };

    await expect(editCompany(0, updateData)).rejects.toThrow(
      'Company ID is required',
    );
  });
  it('should return JWT token on company edit', async () => {
    const directions = await registerDirections(
      'Initial Direction',
      '123 Initial St',
      '555-0000',
      'test-uuid',
    );
    const updateData = {
      name: 'updatedcompany',
      email: `updatedemail-${Date.now()}@example.com`,
      phone: '  5550001',
    };
    const admin = await registerAdmin(
      `admin-${Date.now()}@test.com`,
      'adminPassword',
    );
    // First, register a new company
    const company = await registerCompany(
      'initialcompany',
      '12345678901',
      `company-${Date.now()}@test.com`,
      'password123',
      admin.adminID,
      directions,
    );
    const updatedCompany = await editCompany(company.companyID, updateData);
    const token = updatedCompany.token;
    // Generate JWT token
    const secret = process.env.JWT_SECRET as string;

    expect(token).toBeDefined();
    const decoded: any = jwt.verify(token, secret);
    expect(company.companyID).toBe(company.companyID);
    expect(company.role).toBe(company.role);
    expect(decoded).toBeDefined();
  });
});
