import { PrismaClient } from '../../generated/prisma';
import supertest from 'supertest';

const prisma = new PrismaClient();

describe('AdminController', () => {
  beforeAll(() => {
    //clean up the database
    prisma.admin.deleteMany({});
  });
  afterAll(async () => {
    //clean up the database
    await prisma.admin.deleteMany({});
    await prisma.$disconnect();
  });
  it('should register a new admin successfully', async () => {
    const request = supertest('http://localhost:3000/admin/register');
    const email = `admin-test-${Date.now()}@example.com`;
    const password = 'secureAdminPassword';

    const response = await request.post('/admin/register').send({
      email,
      password,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
  });
  it('should login an existing admin successfully', async () => {
    const request = supertest('http://localhost:3000/admin/login');
    const email = `admin-login-test-${Date.now()}@example.com`;
    const password = 'secureAdminPassword';

    // First, register the admin
    const registerResponse = await request.post('/admin/register').send({
      email,
      password,
    });
    expect(registerResponse.status).toBe(201);

    // Then, login with the same credentials
    const loginResponse = await request.post('/admin/login').send({
      email,
      password,
    });

    expect(loginResponse.status).toBe(200);
    expect(loginResponse.body).toHaveProperty('token');
  });
  it('should fail to login with incorrect password', async () => {
    const request = supertest('http://localhost:3000/admin/login');
    const email = `admin-login-fail-test-${Date.now()}@example.com`;
    const password = 'secureAdminPassword';
    const wrongPassword = 'wrongPassword';

    // First, register the admin
    const registerResponse = await request.post('/admin/register').send({
      email,
      password,
    });
    expect(registerResponse.status).toBe(201);

    // Then, attempt to login with wrong password
    const loginResponse = await request.post('/admin/login').send({
      email,
      password: wrongPassword,
    });

    expect(loginResponse.status).toBe(401);
    expect(loginResponse.body).toHaveProperty('message', 'Invalid password');
  });
  it('should modify a company suspension status', async () => {
    const request = supertest('http://localhost:3000/admin/suspendCompany');
    const adminEmail = `admin-suspend-test-${Date.now()}@example.com`;
    const adminPassword = 'secureAdminPassword';

    // First, register the admin
    const registerResponse = await request.post('/admin/register').send({
      email: adminEmail,
      password: adminPassword,
    });
    expect(registerResponse.status).toBe(201);

    // Login to get the token
    const loginResponse = await request.post('/admin/login').send({
      email: adminEmail,
      password: adminPassword,
    });
    expect(loginResponse.status).toBe(200);
    const { token } = loginResponse.body as { token: string };

    // Create a company directly in the database
    const companyEmail = `company-suspend-test-${Date.now()}@example.com`;
    const company = await prisma.company.create({
      data: {
        name: 'Test Company',
        email: companyEmail,
        phone: '1234567890',
        password: 'secureCompanyPassword',
      },
    });

    // Suspend the company
    const suspendResponse = await request
      .patch(`/admin/suspend-company/${company.companyID}`)
      .set('Authorization', `Bearer ${token}`);

    expect(suspendResponse.status).toBe(200);
    expect(suspendResponse.body).toHaveProperty(
      'message',
      'Company suspended successfully',
    );
  });
  it('should generate an admin code', async () => {
    const request = supertest('http://localhost:3000/admin/generateCode');
    const adminEmail = `admin-generate-code-test-${Date.now()}@example.com`;
    const adminPassword = 'secureAdminPassword';

    // First, register the admin
    const registerResponse = await request.post('/admin/register').send({
      email: adminEmail,
      password: adminPassword,
    });
    expect(registerResponse.status).toBe(201);

    // Login to get the token
    const loginResponse = await request.post('/admin/login').send({
      email: adminEmail,
      password: adminPassword,
    });
    expect(loginResponse.status).toBe(200);
    const { token } = loginResponse.body as { token: string };

    // Generate the code
    const codeResponse = await request
      .get('/admin/generateCode')
      .set('Authorization', `Bearer ${token}`);

    expect(codeResponse.status).toBe(200);
    expect(codeResponse.body).toHaveProperty('code');
  });
  it('should edit company details', async () => {
    const request = supertest('http://localhost:3000/admin/editCompany');
    const adminEmail = `admin-edit-company-test-${Date.now()}@example.com`;
    const adminPassword = 'secureAdminPassword';

    // First, register the admin
    const registerResponse = await request.post('/admin/register').send({
      email: adminEmail,
      password: adminPassword,
    });
    expect(registerResponse.status).toBe(201);

    // Login to get the token
    const loginResponse = await request.post('/admin/login').send({
      email: adminEmail,
      password: adminPassword,
    });
    expect(loginResponse.status).toBe(200);
    const { token } = loginResponse.body as { token: string };

    // Create a company directly in the database
    const companyEmail = `company-edit-test-${Date.now()}@example.com`;
    const company = await prisma.company.create({
      data: {
        name: 'Edit Test Company',
        email: companyEmail,
        phone: '1234567890',
        password: 'secureCompanyPassword',
      },
    });

    // Edit the company details
    const newName = 'Updated Company Name';
    const editResponse = await request
      .post('/admin/editCompany')
      .set('Authorization', `Bearer ${token}`)
      .send({
        companyID: company.companyID,
        data: { name: newName },
      });

    expect(editResponse.status).toBe(200);
    expect(editResponse.body).toHaveProperty(
      'message',
      'Company details updated successfully',
    );

    // Verify the update in the database
    const updatedCompany = await prisma.company.findUnique({
      where: { companyID: company.companyID },
    });
    expect(updatedCompany).toHaveProperty('name', newName);
  });
  it('should eliminate a company', async () => {
    const request = supertest('http://localhost:3000/admin/eliminateCompany');
    const adminEmail = `admin-eliminate-company-test-${Date.now()}@example.com`;
    const adminPassword = 'secureAdminPassword';

    // First, register the admin
    const registerResponse = await request.post('/admin/register').send({
      email: adminEmail,
      password: adminPassword,
    });
    expect(registerResponse.status).toBe(201);

    // Login to get the token
    const loginResponse = await request.post('/admin/login').send({
      email: adminEmail,
      password: adminPassword,
    });
    expect(loginResponse.status).toBe(200);
    const { token } = loginResponse.body as { token: string };

    // Create a company directly in the database
    const companyEmail = `company-eliminate-test-${Date.now()}@example.com`;
    const company = await prisma.company.create({
      data: {
        name: 'Eliminate Test Company',
        email: companyEmail,
        phone: '1234567890',
        password: 'secureCompanyPassword',
      },
    });

    // Eliminate the company
    const eliminateResponse = await request
      .post('/admin/eliminateCompany')
      .set('Authorization', `Bearer ${token}`)
      .send({ companyID: company.companyID });

    expect(eliminateResponse.status).toBe(200);
    expect(eliminateResponse.body).toHaveProperty(
      'message',
      'Company eliminated successfully',
    );

    // Verify the deletion in the database
    const deletedCompany = await prisma.company.findUnique({
      where: { companyID: company.companyID },
    });
    expect(deletedCompany).toBeNull();
  });
  it('should activate a suspended company', async () => {
    const request = supertest('http://localhost:3000/admin/activateCompany');
    const adminEmail = `admin-activate-company-test-${Date.now()}@example.com`;
    const adminPassword = 'secureAdminPassword';

    // First, register the admin
    const registerResponse = await request.post('/admin/register').send({
      email: adminEmail,
      password: adminPassword,
    });
    expect(registerResponse.status).toBe(201);

    // Login to get the token
    const loginResponse = await request.post('/admin/login').send({
      email: adminEmail,
      password: adminPassword,
    });
    expect(loginResponse.status).toBe(200);
    const { token } = loginResponse.body as { token: string };

    // Create a suspended company directly in the database
    const companyEmail = `company-activate-test-${Date.now()}@example.com`;
    const company = await prisma.company.create({
      data: {
        name: 'Activate Test Company',
        email: companyEmail,
        phone: '1234567890',
        password: 'secureCompanyPassword',
        suspended: true,
      },
    });

    // Activate the company
    const activateResponse = await request
      .patch('/admin/activateCompany')
      .set('Authorization', `Bearer ${token}`)
      .send({ companyID: company.companyID });

    expect(activateResponse.status).toBe(200);
    expect(activateResponse.body).toHaveProperty(
      'message',
      'Company activated successfully',
    );
  });
  it('should list companies for an admin', async () => {
    const request = supertest('http://localhost:3000/admin/listCompany');
    const adminEmail = `admin-list-company-test-${Date.now()}@example.com`;
    const adminPassword = 'secureAdminPassword';

    // First, register the admin
    const registerResponse = await request.post('/admin/register').send({
      email: adminEmail,
      password: adminPassword,
    });
    expect(registerResponse.status).toBe(201);

    // Login to get the token
    const loginResponse = await request.post('/admin/login').send({
      email: adminEmail,
      password: adminPassword,
    });
    expect(loginResponse.status).toBe(200);
    const { token } = loginResponse.body as { token: string };

    // List companies for the admin
    const listResponse = await request
      .get('/admin/listCompany')
      .set('Authorization', `Bearer ${token}`);

    expect(listResponse.status).toBe(200);
    expect(Array.isArray(listResponse.body)).toBe(true);
  });
});
