import { PrismaClient } from '../generated/prisma';
import { createIncident } from '../src/modules/incidents/createIncident';
import { registerCompany } from '../src/modules/companies/registerCompany';
import { registerWorker } from '../src/modules/workers/registerWorker';
import { userRegister } from '../src/modules/users/userRegister';
import { registerDirections } from '../src/modules/directions/registerDirections';

const prisma = new PrismaClient();
jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));
describe('createIncident', () => {
  beforeEach(async () => {
    // ✅ Limpiar en orden correcto (dependencias primero)
    await prisma.incidents.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.user.deleteMany({});
  });

  afterAll(async () => {
    // ✅ Cleanup final
    await prisma.incidents.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.user.deleteMany({});
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
    const company = await registerCompany(
      'company test',
      '1234567890',
      `company-test-${Date.now()}@example.com`,
      'pasword123',
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

    // ✅ Crear worker
    const worker = await registerWorker(
      `worker-test-${Date.now()}@example.com`,
      'workerPassword',
      'Test Worker',
      company.companyID,
    );

    // ✅ Verificar que worker se creó
    expect(worker).toBeDefined();
    expect(worker.workerid).toBeDefined();

    // ✅ Crear incident
    const incident = await createIncident(
      'My boiler is not working',
      'Details of the issue...',
      user.userID,
      company.companyID,
      worker.workerid,
      'URGENT',
      'HIGH',
      true,
    );

    // ✅ Verificar resultado
    expect(incident).toBeDefined();
    expect(incident.title).toBe('My boiler is not working');
    expect(incident.description).toBe('Details of the issue...');
    expect(incident.userID).toBe(user.userID);
    expect(incident.companyID).toBe(company.companyID);
    expect(incident.assignedWorkerID).toBe(worker.workerid);
    expect(incident.status).toBe('URGENT');
    expect(incident.priority).toBe('HIGH');
    expect(incident.urgency).toBe(true);
  });

  it('should throw error if worker does not exist', async () => {
    const directions = await registerDirections(
      '123 Test St, Test City, TS 12345',
      'Test City',
      'TS',
      '12345',
    );
    const company = await registerCompany(
      'Test Company, Inc.',
      '1234567890',
      `company-test-${Date.now()}@example.com`,
      'securePassword',
      directions,
    );

    // ✅ Crear user directamente
    const user = await prisma.user.create({
      data: {
        email: `user-test-${Date.now()}@example.com`,
        password: 'hashedPassword123',
        role: 'USER',
      },
    });

    // ✅ Test con workerID inexistente
    await expect(
      createIncident(
        'Test incident',
        'Test description',
        user.userID,
        company.companyID,
        99999,
        'OPEN',
        'MEDIUM',
        false,
      ),
    ).rejects.toThrow('Worker not found');
  });

  it('should throw error if required fields are missing', async () => {
    // ✅ Test con campos requeridos faltantes
    await expect(
      createIncident(
        '', // ✅ title vacío
        'Test description',
        1,
        1,
        1,
      ),
    ).rejects.toThrow(
      'Title, description, companyID, and workerID are required',
    );
  });
});
