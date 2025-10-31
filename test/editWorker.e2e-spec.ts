import { PrismaClient } from '../generated/prisma';
import { editWorker } from '../src/modules/workers/editWorker';
import { registerWorker } from '../src/modules/workers/registerWorker';
import { registerCompany } from '../src/modules/companies/registerCompany';
import { registerDirections } from '../src/modules/directions/registerDirections';
const prisma = new PrismaClient();
describe('editWorker', () => {
  let workerID: number;
  beforeAll(async () => {
    //clean up the database
    await prisma.company.deleteMany({});
    await prisma.worker.deleteMany({});
  });
  beforeAll(async () => {
    //clean up the database
    await prisma.company.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.$disconnect();
  });
  it('should edit a worker successfully', async () => {
    const directions = await registerDirections(
      'calle inventada 123, Ciudad Inventada, Estado Inventado, 12345',
      'Ciudad Inventada',
      'Estado Inventado',
      '12345',
    );
    const company = await registerCompany(
      'Edit Worker Company',
      '1234567890',
      'edit@worker.com',
      'securePassword',
      directions,
    );
    const registeredWorker = await registerWorker(
      'Edit Worker',
      '12349809423',
      'testworker',
      company.companyID,
    );
    workerID = registeredWorker.workerid;
    const updates = {
      name: 'Updated Worker',
      email: 'email@test.com',
    };
    const updateWorker = await editWorker(workerID, updates);
    expect(updateWorker.name).toBe(updates.name);
    expect(updateWorker.email).toBe(updates.email);
  });
  it('should throw an error when trying to edit a non-existing worker', async () => {
    const nonExistingWorkerID = 99999;
    await expect(
      editWorker(nonExistingWorkerID, { name: 'Non Existing' }),
    ).rejects.toThrow('Worker not found');
  });
  it('should throw an error when workerID is not provided', async () => {
    await expect(
      editWorker(undefined as unknown as number, { name: 'No ID' }),
    ).rejects.toThrow('workerID and update data are required');
  });
});
