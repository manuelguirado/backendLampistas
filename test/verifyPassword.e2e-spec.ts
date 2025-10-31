import { verifyPassword } from '../src/utils/hash/verifyPassword';
import { hashPassword } from '../src/utils/hash/hashPassword';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

describe('verifyPassword', () => {
  beforeEach(async () => {
    // Clean up all test data before each test
    await prisma.user.deleteMany({});
  });

  afterEach(async () => {
    // Clean up all test data after each test
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    // Disconnect after all tests
    await prisma.$disconnect();
  });

  it('should return true for correct password', async () => {
    const email = `verify-test-${Date.now()}-1@example.com`;
    const password = 'mySecurePassword';

    // Create a user directly in the database
    const hashedPassword = await hashPassword(password);
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // Then verify the password
    const result = await verifyPassword(email, password);
    expect(result).toBe(true);
  });

  it('should return false for incorrect password', async () => {
    const email = `verify-test-${Date.now()}-2@example.com`;
    const correctPassword = 'mySecurePassword';
    const wrongPassword = 'wrongPassword';

    // Create a user directly in the database
    const hashedPassword = await hashPassword(correctPassword);
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // Then verify with wrong password
    const result = await verifyPassword(email, wrongPassword);
    expect(result).toBe(false);
  });

  it('should return false for non-existing user', async () => {
    const email = `nonexisting-${Date.now()}@example.com`;
    const password = 'mySecurePassword';
    const result = await verifyPassword(email, password);
    expect(result).toBe(false);
  });
});
