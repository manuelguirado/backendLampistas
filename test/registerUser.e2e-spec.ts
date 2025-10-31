import { userRegister } from '../src/modules/users/userRegister';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();
jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));
describe('userRegister', () => {
  beforeEach(async () => {
    // Clean up test data before each test
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    // Clean up and disconnect after all tests
    await prisma.user.deleteMany({
      where: {
        email: {
          contains: 'test',
        },
      },
    });
    await prisma.$disconnect();
  });

  it('should register a new user successfully', async () => {
    const email = 'test1@example.com';
    const password = 'mySecurePassword';
    const name = 'Test User';

    await userRegister(name, email, password);

    const user = await prisma.user.findUnique({ where: { email } });
    expect(user).not.toBeNull();
    expect(user?.email).toBe(email);
    expect(user?.password).not.toBe(password); // Should be hashed
  });

  it('should throw an error if email or password is missing', async () => {
    const name = 'Test User';
    await expect(userRegister(name, '', 'password')).rejects.toThrow(
      'Email and password are required',
    );
    await expect(userRegister(name, 'test2@example.com', '')).rejects.toThrow(
      'Email and password are required',
    );
  });

  it('should throw an error if user already exists', async () => {
    const email = 'test3@example.com';
    const password = 'mySecurePassword';
    const name = 'Test User';

    // First registration should succeed
    await userRegister(name, email, password);

    // Second registration should fail
    await expect(userRegister(name, email, password)).rejects.toThrow(
      'User already exists',
    );
  });
});
