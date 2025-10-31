import { PrismaClient } from './../generated/prisma';
import registerAdmin from '../src/modules/admin/registerAdmin';
import { hashPassword } from '../src/utils/hash/hashPassword';
import { userRegister } from '../src/modules/users/userRegister';
jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));
const prisma = new PrismaClient();
describe('registerAdmin', () => {
  beforeEach(async () => {
    // Clean up all test data before each test
    await prisma.admin.deleteMany({});
  });

  afterAll(async () => {
    // Clean up all test data and disconnect after all tests
    await prisma.admin.deleteMany({});
    await prisma.$disconnect();
  });
  it('should register an admin succesfully', async () => {
    const email = `register-admin-test-${Date.now()}@example.com`;
    const password = 'adminPassword123';

    const admin = await registerAdmin(email, password);

    expect(admin).toBeDefined();
    expect(admin.email).toBe(email);
  });
  it('should throw an error if admin with the same email already exists', async () => {
    const email = `existing-admin-${Date.now()}@example.com`;
    const password = 'adminPassword123';

    // First, create an admin directly in the database
    await prisma.admin.create({
      data: {
        email,
        password: await hashPassword(password),
      },
    });

    // Then, attempt to register with the same email
    await expect(registerAdmin(email, password)).rejects.toThrow(
      'Admin already exists',
    );
  });
  it('should throw an error if email or password is missing', async () => {
    const email = '';
    const password = 'adminPassword123';

    await expect(registerAdmin(email, password)).rejects.toThrow(
      'Email and password are required',
    );

    const email2 = `missing-password-${Date.now()}@example.com`;
    const password2 = '';

    await expect(registerAdmin(email2, password2)).rejects.toThrow(
      'Email and password are required',
    );
  });
  it('should throw an error if another user with the same email exists', async () => {
    const email = `conflict-user-${Date.now()}@example.com`;
    const password = 'somePassword123';
    const name = 'Conflict User';
    // First, create a regular user with the email
    await userRegister(name, email, password);
    // Then, attempt to register an admin with the same email
    await expect(registerAdmin(email, password)).rejects.toThrow(
      'User with this email already exists',
    );
  });
});
