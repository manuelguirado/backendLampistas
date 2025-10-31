import { PrismaClient } from '../generated/prisma';
import { adminLogin } from '../src/modules/admin/adminLogin';
import { hashPassword } from '../src/utils/hash/hashPassword';

const prisma = new PrismaClient();

describe('adminLogin', () => {
  beforeEach(async () => {
    // Limpiar todas las tablas
    await prisma.admin.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.company.deleteMany({});
  });

  afterAll(async () => {
    await prisma.admin.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.$disconnect();
  });

  it('should login admin successfully with correct credentials', async () => {
    const email = `admin-login-test-${Date.now()}@example.com`;
    const password = 'adminPassword123';
    const hashedPassword = await hashPassword(password);

    // ✅ CREAR admin primero
    await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // ✅ LUEGO intentar login
    const result = await adminLogin(email, password);

    expect(result).toBeDefined();
    expect(result.email).toBe(email);
  });

  it('should throw error when admin does not exist', async () => {
    const email = `nonexisting-admin-${Date.now()}@example.com`;
    const password = 'adminPassword123';

    await expect(adminLogin(email, password)).rejects.toThrow(
      'Admin does not exist',
    );
  });

  it('should throw error with incorrect password', async () => {
    const email = `admin-wrong-pass-${Date.now()}@example.com`;
    const correctPassword = 'adminPassword123';
    const wrongPassword = 'wrongPassword';
    const hashedPassword = await hashPassword(correctPassword);

    // ✅ Crear admin
    await prisma.admin.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // ✅ Intentar login con password incorrecta
    await expect(adminLogin(email, wrongPassword)).rejects.toThrow(
      'Invalid password',
    );
  });

  it('should throw error if email is registered by another role', async () => {
    const email = `role-conflict-${Date.now()}@example.com`;
    const password = 'password123';
    const hashedPassword = await hashPassword(password);

    // ✅ Crear USER primero
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: 'USER',
      },
    });

    // ✅ Intentar login como ADMIN
    await expect(adminLogin(email, password)).rejects.toThrow(
      'Unauthorized - Invalid role',
    );
  });
});
