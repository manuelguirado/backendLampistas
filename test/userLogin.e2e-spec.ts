import { hashPassword } from './../src/utils/hash/hashPassword';
import { userLogin } from '../src/modules/users/userLogin';
import { PrismaClient } from '../generated/prisma';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));
const prisma = new PrismaClient();
describe('userLogin', () => {
  beforeEach(async () => {
    // Clean up all test data before each test
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    // Clean up all test data and disconnect after all tests
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });
  it('should login a user succesfully with correct email and password', async () => {
    const email = `login-test-${Date.now()}-1@example.com`;
    const password = 'mySecurePassword';

    // First, register the user
    await prisma.user.create({
      data: {
        email,
        password: await hashPassword(password),
      },
    });
    // Then, attempt to login
    const user = await userLogin(email, password);
    expect(user).not.toBeNull();
    expect(user.email).toBe(email);
  });
  it('should throw an error if user does not exist', async () => {
    const email = `nonexisting-${Date.now()}@example.com`;
    const password = 'mySecurePassword';
    await expect(userLogin(email, password)).rejects.toThrow(
      'User does not exist',
    );
  });
  it('should throw an error if password is incorrect', async () => {
    const email = `login-test-${Date.now()}-2@example.com`;
    const correctPassword = 'mySecurePassword';
    const wrongPassword = 'wrongPassword';
    // First, register the user
    await prisma.user.create({
      data: {
        email,
        password: await hashPassword(correctPassword),
      },
    });
    // Then, attempt to login with wrong password
    await expect(userLogin(email, wrongPassword)).rejects.toThrow(
      'Invalid password',
    );
  });
  it('should throw an error if user role is not USER', async () => {
    const email = `login-test-${Date.now()}-3@example.com`;
    const password = 'mySecurePassword';
    // First, register the user
    await prisma.user.create({
      data: {
        email,
        password: await hashPassword(password),
        role: 'ADMIN',
      },
    });
    // Then, attempt to login
    await expect(userLogin(email, password)).rejects.toThrow('Unauthorized');
  });
  it('should lock the user out after 3 failed attempts', async () => {
    const email = `login-test-${Date.now()}-4@example.com`;
    const correctPassword = 'mySecurePassword';
    const wrongPassword = 'wrongPassword';
    // First, register the user
    await prisma.user.create({
      data: {
        email,
        password: await hashPassword(correctPassword),
      },
    });
    // Primeros dos intentos: Invalid password
    for (let i = 0; i < 2; i++) {
      await expect(userLogin(email, wrongPassword)).rejects.toThrow(
        'Invalid password',
      );
    }
    // Tercer intento: Account locked
    await expect(userLogin(email, wrongPassword)).rejects.toThrow(
      'Account locked. Try again later',
    );
    // Cuarto intento (seguido): también Account locked
    await expect(userLogin(email, wrongPassword)).rejects.toThrow(
      'Account locked. Try again later',
    );
  });
  it('should return a valid JWT token upon successful login', async () => {
    const email = `login-test-${Date.now()}-5@example.com`;
    const password = 'mySecurePassword';
    const user = await prisma.user.create({
      data: {
        email,
        password: await hashPassword(password),
      },
    });
    const response = await userLogin(email, password);
    expect(response).toBeDefined();
    const token = response.token;
    expect(token).toBeDefined();
    // Verify the token
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(token, secret);
    expect(decoded).toBeDefined();
    expect(user).toBeDefined();
  });
});
