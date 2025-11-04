import { assignIncident } from '../src/modules/incidents/assignIncident';
import { registerWorker } from '../src/modules/workers/registerWorker';
import { userRegister } from '../src/modules/users/userRegister';
import { registerDirections } from '../src/modules/directions/registerDirections';
import { registerCompany } from '../src/modules/companies/registerCompany';
import registerAdmin from '../src/modules/admin/registerAdmin';
import { PrismaClient } from '../generated/prisma';
const prisma = new PrismaClient();

describe('assignIncident', () => {
  jest.setTimeout(20000); // 20 segundos para cada test

  beforeEach(async () => {
    // ✅ Limpiar en orden correcto (dependencias primero)
    await prisma.incidents.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.admin.deleteMany({});
  });

  afterAll(async () => {
    // ✅ Cleanup final
    await prisma.incidents.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.admin.deleteMany({});
    await prisma.$disconnect();
  });

  it('should assign an incident to a worker successfully', async () => {
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

    // ✅ Crear usuario
    const user = await userRegister(
      `user-${Date.now()}@example.com`,
      'userPassword',
      'Test User',
    );

    // ✅ Crear worker
    const worker = await registerWorker(
      `worker-${Date.now()}@example.com`,
      'workerPassword',
      'Worker Name',
      company.companyID,
    );

    // ✅ Crear incidente
    const incident = await prisma.incidents.create({
      data: {
        title: 'Test Incident',
        description: 'Incident details',
        userID: user.userID,
        companyID: company.companyID,
        status: 'OPEN',
        priority: 'MEDIUM',
        urgency: false,
      },
    });

    // ✅ Asignar incidente al worker
    await assignIncident(incident.IncidentsID, worker.workerid);
    const updatedIncident = await prisma.incidents.findUnique({
      where: { IncidentsID: incident.IncidentsID },
    });

    // ✅ Verificar resultado
    expect(updatedIncident).toBeDefined();
    expect(updatedIncident?.assignedWorkerID).toBe(worker.workerid);
  });
});

it('should throw an error when assigning to a non-existent worker', async () => {
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

  // ✅ Crear usuario
  const user = await userRegister(
    `user-${Date.now()}@example.com`,
    'userPassword',
    'Test User',
  );

  // ✅ Crear incidente
  const incident = await prisma.incidents.create({
    data: {
      title: 'Test Incident',
      description: 'Incident details',
      userID: user.userID,
      companyID: company.companyID,
      status: 'OPEN',
      priority: 'MEDIUM',
      urgency: false,
    },
  });

  // ✅ Intentar asignar incidente a un worker inexistente
  await expect(
    assignIncident(incident.IncidentsID, 9999), // workerID que no existe
  ).rejects.toThrow('Worker not found');
});
