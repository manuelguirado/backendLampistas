import { registerDirections } from '../src/modules/directions/registerDirections';
import { PrismaClient } from '../generated/prisma';
import { registerCompany } from '../src/modules/companies/registerCompany';
const prisma = new PrismaClient();
describe('Company registration', () => {
  beforeAll(async () => {
    // Setup code before all tests run
    await prisma.$connect();
    await prisma.company.deleteMany({});
    await prisma.directions.deleteMany({});
  });

  afterAll(async () => {
    // Cleanup code after all tests run
    await prisma.company.deleteMany({});
    await prisma.directions.deleteMany({});
    await prisma.$disconnect();
  });
  it('Should register a company succesfully', async () => {
    const name = 'Test Company';
    const phone = '1234567890';
    const email = `company-${Date.now()}@test.com`;
    const address = '123 Test St, Test City, TS 12345';
    const password = 'securePassword';
    const directions = await registerDirections(
      address,
      'Test City',
      'TS',
      '12345',
    );
    const Company = await registerCompany(
      name,
      phone,
      email,
      password,
      directions,
    );
    expect(Company).toBeDefined();
    expect(Company.name).toBe(name);
    expect(Company.phone).toBe(phone);
    expect(Company.email).toBe(email);
  });
  it('should not allow registration with existing company name', async () => {
    const name = 'Duplicate Company';
    const phone = '1234567890';
    const email1 = `duplicate1-${Date.now()}@test.com`;
    const email2 = `duplicate2-${Date.now()}@test.com`;
    const address = await registerDirections(
      '456 Another St, Another City, AC 67890',
      'Another City',
      'AC',
      '67890',
    );
    const password = 'anotherSecurePassword';

    // First registration should succeed
    await registerCompany(name, phone, email1, password, {
      address: address.address,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
    });

    // Second registration with same name should fail
    await expect(
      registerCompany(name, phone, email2, password, {
        address: address.address,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
      }),
    ).rejects.toThrow('Company with this name already exists');
  });
  it('should create directions if provided', async () => {
    const name = 'Direction Test Company';
    const phone = '5555555555';
    const email = `direction-${Date.now()}@test.com`;

    const password = 'directionPassword';
    const directions = await registerDirections(
      '789 Direction St, Direction City, DC 11223',
      'Direction City',
      'DC',
      '11223',
    );
    const company = await registerCompany(
      name,
      phone,
      email,
      password,
      directions,
    );
    const fetchedDirections = await prisma.directions.findFirst({
      where: { companyID: company.companyID },
    });

    expect(fetchedDirections).toBeDefined();
    expect(fetchedDirections?.address).toBe(directions.address);
    expect(fetchedDirections?.city).toBe(directions.city);
    expect(fetchedDirections?.state).toBe(directions.state);
    expect(fetchedDirections?.zipCode).toBe(directions.zipCode);
  });
  it('should throw error if required fields are missing', async () => {
    const name = '';
    const phone = '1234567890';
    const email = `incomplete-${Date.now()}@test.com`;
    const address = await registerDirections(
      '000 Incomplete St, Incomplete City, IC 00000',
      'Incomplete City',
      'IC',
      '00000',
    );
    const password = 'password';

    await expect(
      registerCompany(name, phone, email, password, address),
    ).rejects.toThrow('Name, phone, password and directions are required');
  });
});
