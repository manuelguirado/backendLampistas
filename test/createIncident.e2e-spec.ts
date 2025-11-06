import { PrismaClient } from '../generated/prisma';
import { createIncident } from '../src/modules/incidents/createIncident';
import { registerCompany } from '../src/modules/companies/registerCompany';
import jwt from 'jsonwebtoken';
import { userRegister } from '../src/modules/users/userRegister';
import { registerDirections } from '../src/modules/directions/registerDirections';
import registerAdmin from '../src/modules/admin/registerAdmin';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });
const prisma = new PrismaClient();
jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));
describe('createIncident', () => {
  jest.setTimeout(20000); // 20 segundos para cada test
  beforeEach(async () => {
    // ✅ Limpiar en orden correcto (dependencias primero)
    await prisma.incidents.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
  });

  afterAll(async () => {
    // ✅ Cleanup final
    await prisma.incidents.deleteMany({});

    await prisma.user.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.$disconnect();
  });

  it('should create an incident successfully', async () => {
    // ✅ Crear company
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
      'company test',
      '1234567890',
      `company-test-${Date.now()}@example.com`,
      'pasword123',
      admin.adminID,
      directions,
    );

    // ✅ Verificar que company se creó
    expect(company).toBeDefined();
    expect(company.companyID).toBeDefined();

    // ✅ Crear user
    const user = await userRegister(
      `user-test-${Date.now()}@example.com`,
      'userPassword',
      'Test User',
    );

    // ✅ Verificar que user se creó
    expect(user).toBeDefined();
    expect(user.userID).toBeDefined();

    // ✅ Crear incident
    const incident = await createIncident(
      'My boiler is not working',
      'Details of the issue...',
      user.userID,
      company.companyID,
      'URGENT',
      'HIGH',
      true,
    );

    // ✅ Verificar resultado
    expect(incident).toBeDefined();
    expect(incident?.title).toBe('My boiler is not working');
    expect(incident?.description).toBe('Details of the issue...');
    expect(incident?.userID).toBe(user.userID);
    expect(incident?.companyID).toBe(company.companyID);
    expect(incident?.status).toBe('URGENT');
    expect(incident?.status).toBe('URGENT');
    expect(incident?.priority).toBe('HIGH');
    expect(incident?.urgency).toBe(true);
  });

  it('should throw error if required fields are missing', async () => {
    // ✅ Test con campos requeridos faltantes
    await expect(
      createIncident(
        '', // ✅ title vacío
        'Test description',
        1,
        1,
      ),
    ).rejects.toThrow(
      'Title, description, companyID, and workerID are required',
    );
  });
  it('should return JWT token upon successful incident creation', async () => {
    // ✅ Crear company
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
      'JWT Test Company',
      '1234567890',
      `jwt-company-${Date.now()}@test.com`,
      'jwtPassword',
      admin.adminID,
      directions,
    );
    // ✅ Crear user
    const user = await userRegister(
      'JWT Test User',
      `jwt-user-${Date.now()}@test.com`,
      'jwtUserPassword',
    );
    // ✅ Crear incident
    const incident = await createIncident(
      'JWT Incident',
      'Testing JWT token generation',
      user.userID,
      company.companyID,
    );
    // ✅ Verificar token
    expect(incident).toBeDefined();
    expect(incident?.token).toBeDefined();
    // ✅ Verificar contenido del token
    const secret = process.env.JWT_SECRET as string;
    const decoded = jwt.verify(incident!.token, secret) as {
      incidentID: number;
      companyID: number;
      role: string;
      iat: number;
      exp: number;
    };
    expect(decoded.incidentID).toBe(incident!.IncidentsID);
    expect(decoded.companyID).toBe(company.companyID);
    expect(decoded.role).toBe(company.role);
  });
});
