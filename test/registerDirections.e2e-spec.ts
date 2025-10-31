import { PrismaClient } from '../generated/prisma';
import { registerDirections } from '../src/modules/directions/registerDirections';

const prisma = new PrismaClient();
describe('registerDirections', () => {
  beforeEach(async () => {
    // Clean up test data before each test
    await prisma.directions.deleteMany({});
  });

  afterAll(async () => {
    // Clean up and disconnect after all tests
    await prisma.directions.deleteMany({});
    await prisma.$disconnect();
  });

  it('should register new directions successfully', async () => {
    const directionData = {
      address: '123 Test St, Test City, TS 12345',
      city: 'Test City',
      state: 'TS',
      zipCode: '12345',
    };
    const directions = await registerDirections(
      directionData.address,
      directionData.city,
      directionData.state,
      directionData.zipCode,
    );

    expect(directions).not.toBeNull();
    expect(directions.address).toBe(directionData.address);
    expect(directions.city).toBe(directionData.city);
    expect(directions.state).toBe(directionData.state);
    expect(directions.zipCode).toBe(directionData.zipCode);
  });

  it('should throw an error if any direction field is missing', async () => {
    await expect(
      registerDirections('', 'City', 'State', '12345'),
    ).rejects.toThrow('All direction fields are required');

    await expect(
      registerDirections('123 St', '', 'State', '12345'),
    ).rejects.toThrow('All direction fields are required');

    await expect(
      registerDirections('123 St', 'City', '', '12345'),
    ).rejects.toThrow('All direction fields are required');

    await expect(
      registerDirections('123 St', 'City', 'State', ''),
    ).rejects.toThrow('All direction fields are required');
  });
});
