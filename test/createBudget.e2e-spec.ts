import { registerCompany } from '../src/modules/companies/registerCompany';
import { PrismaClient } from './../generated/prisma';
import { createBudget } from '../src/modules/budgets/createbudget';
import { createIncident } from '../src/modules/incidents/createIncident';
import { registerWorker } from '../src/modules/workers/registerWorker';
import { userRegister } from '../src/modules/users/userRegister';
import { registerDirections } from '../src/modules/directions/registerDirections';

const prisma = new PrismaClient();
jest.mock('uuid', () => ({
  v4: () => 'test-uuid',
}));

describe('createBudget', () => {
  beforeEach(async () => {
    // Clean up all test data before running tests
    await prisma.budget.deleteMany({});
    await prisma.incidents.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.directions.deleteMany({});
  });

  afterAll(async () => {
    // Clean up all test data and disconnect after all tests
    await prisma.budget.deleteMany({});
    await prisma.incidents.deleteMany({});
    await prisma.user.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.$disconnect();
  });

  it('should create a budget successfully', async () => {
    // First, register a company
    const directions = await registerDirections(
      '123 Test St, Test City, TS 12345',
      'Test City',
      'TS',
      '12345',
    );
    const company = await registerCompany(
      'Test Company',
      '123-456-7890',
      'test@company.com',
      '123 Test St',
      directions,
    );

    // Then, register a worker
    const worker = await registerWorker(
      'John Doe',
      'worker@test.com',
      'password123',
      company.companyID,
    );
    // Finally, register a user
    const user = await userRegister(
      'Test User',
      'user@test.com',
      'password123',
    );

    // Then, create an incident for that company
    const incident = await createIncident(
      'Test Incident',
      'This is a test incident',
      user.userID,
      company.companyID,
      worker.workerid,
    );

    // Finally, create a budget for that incident
    const budget = await createBudget(
      incident.IncidentsID,
      1000,
      'Test budget description',
      user.userID,
      company.companyID,
      worker.workerid, // ✅ AGREGAR workerID
      ['Item1', 'Item2'],
    );
    expect(budget).toHaveProperty('budgetID');
    expect(budget.totalAmount);
    expect(budget.description);
    expect(budget.companyID).toBe(company.companyID);
    expect(budget.items);
  });
  it('should throw an error if the worker does not exist', async () => {
    // First, register a company
    const directions = await registerDirections(
      '123 Test St, Test City, TS 12345',
      'Test City',
      'TS',
      '12345',
    );
    const company = await registerCompany(
      'Test Company 1',
      '123-456-7890',
      'test1@company.com',
      'mysecurepassword',
      directions,
    );

    // Then, register a worker
    const worker = await registerWorker(
      'John Doe',
      'worker1@test.com',
      'password123',
      company.companyID,
    );
    // Finally, register a user
    const user = await userRegister(
      'Test User 1',
      'user1@test.com',
      'password123',
    );

    // Then, create an incident for that company
    const incident = await createIncident(
      'Test Incident 1',
      'This is a test incident 1',
      user.userID,
      company.companyID,
      worker.workerid,
    );

    // Finally, attempt to create a budget with a non-existing worker
    await expect(
      createBudget(
        incident.IncidentsID,
        1000,
        'Description',
        user.userID,
        company.companyID,
        9999, // ✅ workerID inexistente
        ['Item1'],
      ),
    ).rejects.toThrow('Worker not found');
  });
  it('should throw an error if required fields are missing', async () => {
    // ✅ Test con parámetros faltantes
    return await expect(createBudget(0, 0, '', 0, 0, 0, [])).rejects.toThrow(
      'All fields are required',
    );
  });
  it('should throw an error if incident does not exist', async () => {
    // First, register a company
    const directions = await registerDirections(
      '123 Test St, Test City, TS 12345',
      'Test City',
      'TS',
      '12345',
    );
    const company = await registerCompany(
      'Test Company 2',
      '123-456-7890',
      'test2@company.com',
      'mysecurepassword',
      directions,
    );

    // Then, register a worker
    const worker = await registerWorker(
      'John Doe',
      'worker2@test.com',
      'password123',
      company.companyID,
    );
    // Finally, register a user
    const user = await userRegister(
      'Test User 2',
      'user2@test.com',
      'password123',
    );
    // Finally, attempt to create a budget for a non-existing incident
    await expect(
      createBudget(
        9999, // ✅ IncidentID inexistente
        1000,
        'Description',
        user.userID,
        company.companyID,
        worker.workerid,
        ['Item1'],
      ),
    ).rejects.toThrow('Incident not found');
  });
});
