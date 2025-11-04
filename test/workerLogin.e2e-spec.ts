import { workerLogin } from '../src/modules/workers/workerLogin';
import { registerWorker } from '../src/modules/workers/registerWorker';
import { PrismaClient } from '../generated/prisma';
import { registerCompany } from '../src/modules/companies/registerCompany';
import { registerDirections } from '../src/modules/directions/registerDirections';
import registerAdmin from '../src/modules/admin/registerAdmin';
const prisma = new PrismaClient();
describe('workerLogin', () => {
  jest.setTimeout(10000); // Aumentar timeout a 10 segundos
  beforeEach(async () => {
    // Limpiar TODAS las tablas relacionadas
    await prisma.$connect();
    await prisma.worker.deleteMany({});
    await prisma.adminsCompanies.deleteMany({}); //  Limpiar tabla intermedia
    await prisma.company.deleteMany({}); // ✅ También limpiar companies
    await prisma.directions.deleteMany({});
    await prisma.admin.deleteMany({});
  });

  afterAll(async () => {
    await prisma.worker.deleteMany({});
    await prisma.adminsCompanies.deleteMany({}); // Limpiar tabla intermedia
    await prisma.company.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.$disconnect();
  });
  it('should login a worker successfully with correct email and password', async () => {
    const email = `worker-login-test-${Date.now()}-email@example.com`;
    const password = 'password123';
    const Directions = await registerDirections(
      '123 Test St, Test City, TS 12345',
      'Test City',
      'TS',
      '12345',
    );
    const admin = await registerAdmin(
      `admin-${Date.now()}@test.com`,
      'adminPassword',
    );
    const newCompany = await registerCompany(
      `Worker Login Test Company ${Date.now()}`,
      '1234567890',
      `worker-login-company-${Date.now()}@example.com`,
      'compPassword',
      admin.adminID,
      Directions,
    );

    // Create a test worker
    await registerWorker(email, password, 'testWorker', newCompany.companyID);

    // Attempt login
    const worker = await workerLogin(email, password);
    expect(worker).toBeDefined();
    expect(worker.email).toBe(email);
  });
  it('should throw an error if worker does not exist', async () => {
    const email = `nonexisting-worker-${Date.now()}@example.com`;
    const password = 'password123';

    await expect(workerLogin(email, password)).rejects.toThrow(
      'Worker does not exist',
    );
  });
  it('should throw an error if password is incorrect', async () => {
    const email = `worker-login-test-${Date.now()}-email@example.com`;
    const correctPassword = 'password123';
    const wrongPassword = 'wrongPassword';
    const Directions = await registerDirections(
      '123 Test St, Test City, TS 12345',
      'Test City',
      'TS',
      '12345',
    );
    const admin = await registerAdmin(
      `admin-${Date.now()}@test.com`,
      'adminPassword',
    );
    const newCompany = await registerCompany(
      `Worker Login Test Company ${Date.now()}`,
      '1234567890',
      `worker-login-company-${Date.now()}@example.com`,
      'compPassword',
      admin.adminID,
      Directions,
    );

    // Create a test worker
    await registerWorker(
      email,
      correctPassword,
      'testWorker',
      newCompany.companyID,
    );
    // Attempt login with wrong password
    await expect(workerLogin(email, wrongPassword)).rejects.toThrow(
      'Invalid password',
    );
  });
  it('should block login after maximum failed attempts', async () => {
    const email = `worker-login-test-${Date.now()}-email@example.com`;
    const correctPassword = 'password123';
    const wrongPassword = 'wrongPassword';
    const Directions = await registerDirections(
      '123 Test St, Test City, TS 12345',
      'Test City',
      'TS',
      '12345',
    );
    const Admin = await registerAdmin(
      `admin-${Date.now()}@test.com`,
      'adminPassword',
    );
    const newCompany = await registerCompany(
      `Worker Login Test Company ${Date.now()}`,
      '1234567890',
      `worker-login-company-${Date.now()}@example.com`,
      'compPassword',
      Admin.adminID,
      Directions,
    );

    // Create a test worker
    await registerWorker(
      email,
      correctPassword,
      'testWorker',
      newCompany.companyID,
    );

    // Primeros dos intentos: Invalid password
    for (let i = 0; i < 2; i++) {
      await expect(workerLogin(email, wrongPassword)).rejects.toThrow(
        'Invalid password',
      );
    }
    // Tercer intento: Account locked
    await expect(workerLogin(email, wrongPassword)).rejects.toThrow(
      'Account locked. Try again later',
    );
    // Cuarto intento (seguido): también Account locked
    await expect(workerLogin(email, wrongPassword)).rejects.toThrow(
      'Account locked. Try again later',
    );
  });
});
