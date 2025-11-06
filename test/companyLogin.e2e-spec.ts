import jwt from 'jsonwebtoken';
import { PrismaClient } from '../generated/prisma';
import { companyLogin } from '../src/modules/companies/companyLogin';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

const secret = process.env.JWT_SECRET as string;

const prisma = new PrismaClient();
describe('Company login', () => {
  beforeEach(async () => {
    // Clean up all test data before each test
    await prisma.incidents.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
  });
  afterAll(async () => {
    // Clean up all test data and disconnect after all tests
    await prisma.incidents.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.$disconnect();
  });
  it('Should login a company successfully with correct name and password', async () => {
    const companyName = `company-login-test-${Date.now()}-1`;
    const password = 'companySecurePassword';
    const email = `company-login-test-${Date.now()}-1@example.com`;

    const company = await prisma.company.create({
      data: {
        name: companyName,
        email,
        password: await bcrypt.hash(password, 10),
        phone: '123456789',
      },
    });
    expect(company).toBeDefined();
    const response = await companyLogin(email, password);
    expect(company.name).toBe(companyName);
    expect(response).toBeDefined();
  });
  it('Should throw an error if company does not exist', async () => {
    const email = `nonexisting-company-${Date.now()}@example.com`;
    const password = 'companySecurePassword';

    await expect(companyLogin(email, password)).rejects.toThrow(
      'Company not found',
    );
  });
  it('Should throw an error if password is incorrect', async () => {
    const companyName = `company-login-test-${Date.now()}-2`;
    const correctPassword = 'companySecurePassword';
    const wrongPassword = 'wrongPassword';
    const email = `company-login-test-${Date.now()}-2@example.com`;
    await prisma.company.create({
      data: {
        name: companyName,
        email,
        password: await bcrypt.hash(correctPassword, 10),
        phone: '123456789',
      },
    });

    await expect(companyLogin(email, wrongPassword)).rejects.toThrow(
      'Invalid password',
    );
  });
  it('Should throw an error if the company doesnt exist', async () => {
    const password = 'companySecurePassword';
    const email = `company-login-test-${Date.now()}-3@example.com`;
    // Then, attempt to login
    await expect(companyLogin(email, password)).rejects.toThrow(
      'Company not found',
    );
  });

  it('Should throw an error if user role is not COMPANY', async () => {
    const email = `user-login-test-${Date.now()}-3@example.com`;
    const password = 'userSecurePassword';
    // First, register the user
    await prisma.user.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
        role: 'USER',
      },
    });
    // Then, attempt to login
    await expect(companyLogin(email, password)).rejects.toThrow(
      'Unauthorized - Invalid role',
    );
  });
  it('Should lock the company out after 3 failed attempts', async () => {
    const companyName = `company-login-test-${Date.now()}-4`;
    const correctPassword = 'companySecurePassword';
    const wrongPassword = 'wrongPassword';
    const email = `company-login-test-${Date.now()}-4@example.com`;
    await prisma.company.create({
      data: {
        name: companyName,
        email,
        password: await bcrypt.hash(correctPassword, 10),
        phone: '123456789',
      },
    });
    // Primeros dos intentos: Invalid password
    for (let i = 0; i < 2; i++) {
      await expect(companyLogin(email, wrongPassword)).rejects.toThrow(
        'Invalid password',
      );
    }
    // Tercer intento: Account locked
    await expect(companyLogin(email, wrongPassword)).rejects.toThrow(
      'Account locked. Try again later',
    );
    // Cuarto intento (seguido): también Account locked
    await expect(companyLogin(email, wrongPassword)).rejects.toThrow(
      'Account locked. Try again later',
    );
  });
  it('should verify the jwt token upon successful login', async () => {
    const companyName = `company-login-test-${Date.now()}-5`;
    const password = 'companySecurePassword';
    const email = `company-login-test-${Date.now()}-5@example.com`;
    const company = await prisma.company.create({
      data: {
        name: companyName,
        email,
        password: await bcrypt.hash(password, 10),
        phone: '123456789',
      },
    });
    const response = await companyLogin(email, password);
    expect(response).toBeDefined();
    const token = response.token;
    expect(token).toBeDefined();
    // Verify the token
    const decoded = jwt.verify(token, secret);
    expect(decoded).toBeDefined();
    expect(company).toBeDefined();
  });
});
