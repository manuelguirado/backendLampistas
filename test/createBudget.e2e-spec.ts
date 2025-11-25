import { registerCompany } from '../src/modules/companies/registerCompany';
import { PrismaClient } from './../generated/prisma';
import { createBudget } from '../src/modules/budgets/createbudget';
import { createIncident } from '../src/modules/incidents/createIncident';
import { userRegister } from '../src/modules/users/userRegister';
import { registerDirections } from '../src/modules/directions/registerDirections';
import registerAdmin from '../src/modules/admin/registerAdmin';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
const prisma = new PrismaClient();
jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));

describe('createBudget', () => {
  jest.setTimeout(20000); // 20 segundos para cada test
  beforeEach(async () => {
    // Clean up all test data before running tests
    await prisma.worker.deleteMany({});
    await prisma.budget.deleteMany({});
    await prisma.incidents.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
  });

  afterAll(async () => {
    // Clean up all test data and disconnect after all tests
    await prisma.worker.deleteMany({});
    await prisma.budget.deleteMany({});
    await prisma.incidents.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.$disconnect();
  });

  it('should create a budget successfully', async () => {
    // First, register a company
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
    const company = await registerCompany(
      'Test Company',
      '1234567890',
      'test@company.com',
      '123 Test St',
      admin.adminID,
      directions,
    );

    // Finally, register a user
    const user = await userRegister(
      'Test User',
      'user@test.com',
      'password123',
    );

    // Then, create an incident for that company
    const incident = await createIncident(
      'Test Incident',
      'This is a test incident',
      user.userID,
      company.companyID,
    );

    // Finally, create a budget for that incident
    const budget = await createBudget(
      Math.floor(Math.random() * 1000000).toString(), // budgetNumber
      0, // subtotal
      0, // tax
      1000, // totalAmount
      incident?.IncidentsID ?? 0,
      'Test budget description',
      user.userID,
      company.companyID,
      [
        { description: 'Item1', quantity: 1, unitPrice: 100, total: 100 },
        { description: 'Item2', quantity: 2, unitPrice: 100, total: 200 },
      ],
    );
    expect(budget).toHaveProperty('budget');
  });

  it('should throw an error if incident does not exist', async () => {
    // First, register a company
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
    const company = await registerCompany(
      'Test Company 2',
      '1234567890',
      'test2@company.com',
      'mysecurepassword',
      admin.adminID,
      directions,
    );

    const user = await userRegister(
      'Test User 2',
      'user2@test.com',
      'password123',
    );
    await expect(
      createBudget(
        Math.floor(Math.random() * 1000000).toString(),
        0,
        0,
        1000,
        9999,
        'Description',
        user.userID,
        company.companyID,
        [{ description: 'Item1', quantity: 1, unitPrice: 100, total: 100 }],
      ),
    ).rejects.toThrow('Incident not found');
  });

  it('should return JWT token upon successful budget creation', async () => {
    // First, register a company
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
    const company = await registerCompany(
      'Test Company 3',
      '1234567890',
      'test3@company.com',
      'mysecurepassword',
      admin.adminID,
      directions,
    );

    // Finally, register a user
    const user = await userRegister(
      'Test User 3',
      'user3@test.com',
      'password123',
    );
    const incident = await createIncident(
      'Test Incident 3',
      'This is a test incident 3',
      user.userID,
      company.companyID,
    );
    const budget = await createBudget(
      Math.floor(Math.random() * 1000000).toString(),
      0,
      0,
      1500,
      incident?.IncidentsID ?? 0,
      'Test budget description 3',
      user.userID,
      company.companyID,
      [{ description: 'Item1', quantity: 1, unitPrice: 100, total: 100 }],
    );
    const token = budget.token;
    expect(token).toBeDefined();

    // Generate JWT token
    const secret = process.env.JWT_SECRET as string;

    const decoded: any = jwt.verify(token, secret);
    expect(decoded).toHaveProperty('companyID', company.companyID);
  });
});
