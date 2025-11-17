import { PrismaClient } from '../../generated/prisma';
import supertest from 'supertest';
import registerAdmin from '../modules/admin/registerAdmin';
import { registerDirections } from '../modules/directions/registerDirections';
import { registerCompany } from '../modules/companies/registerCompany';

const prisma = new PrismaClient();

describe('AdminController', () => {
  beforeAll(async () => {
    //clean up the database
    await prisma.$connect();
    // Delete child tables first (those with foreign keys)
    await prisma.incidents.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    // Then parent tables
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
  });
  afterAll(async () => {
    //clean up the database
    // Delete child tables first (those with foreign keys)
    await prisma.incidents.deleteMany({});
    await prisma.worker.deleteMany({});
    await prisma.adminsCompanies.deleteMany({});
    // Then parent tables
    await prisma.admin.deleteMany({});
    await prisma.company.deleteMany({});
    await prisma.$disconnect();
  });
  it('should assign code to a company', async () => {
    const request = supertest('http://localhost:3000/admin/assignCode');
    const directions = await registerDirections(
      '456 Business Rd',
      'Commercetown',
      'Comstate',
      '67890',
    );
    const admin = await registerAdmin(
      `admintest-${Date.now()}@test.com`,
      'adminPassword',
    );
    const company = await registerCompany(
      'Test Company',
      '1234567890',
      `test-company-${Date.now()}@test.com`,
      'securepassword',
      admin.adminID,
      directions,
    );
    const adminLogin = supertest('http://localhost:3000/admin/adminLogin');
    const loginResponse = await adminLogin.post('').send({
      email: admin.email,
      password: 'adminPassword',
    });
    expect(loginResponse.status).toBe(201);
    const body = loginResponse.body as { token: string; code: string };
    const token = body.token;
    const response = await request
      .get(`?companyID=${company.companyID}`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty(
      'message',
      'Code assigned successfully',
    );
    expect(response.body).toHaveProperty('code');
  });
  it('should register a new admin successfully', async () => {
    const request = supertest('http://localhost:3000/admin/adminRegister');
    const email = `admin-test-${Date.now()}@example.com`;
    const password = 'secureAdminPassword';

    const response = await request.post('').send({
      email,
      password,
    });

    expect(response.status).toBe(201);
  });
  it('should login an existing admin successfully', async () => {
    const request = supertest('http://localhost:3000/admin/adminLogin');
    const email = `admin-login-test-${Date.now()}@example.com`;
    const password = 'secureAdminPassword';

    // First, register the admin
    const registerResponse = await registerAdmin(email, password);
    expect(registerResponse).toBeDefined();

    // Then, attempt to login
    const loginResponse = await request
      .post('')
      .send({ email, password: 'secureAdminPassword' })
      .expect(201);

    expect(loginResponse.body).toBeDefined();
    expect(loginResponse.body).toHaveProperty('token');
  });
  it('should modify a company suspension status', async () => {
    const request = supertest('http://localhost:3000');
    const adminEmail = `admin-suspend-test-${Date.now()}@example.com`;
    const adminPassword = 'secureAdminPassword';
    const admin = await registerAdmin(adminEmail, adminPassword);
    expect(admin).toBeDefined();
    // First, register the admin
    const login = supertest('http://localhost:3000/admin/adminLogin');
    const companyEmail = `company-suspend-test-${Date.now()}@example.com`;
    const company = await prisma.company.create({
      data: {
        name: 'Test Company',
        email: companyEmail,
        phone: '1234567890',
        password: 'secureCompanyPassword',
      },
    });
    expect(company).toBeDefined();

    // Login to get the token
    const loginResponse = await login.post('').send({
      email: adminEmail,
      password: adminPassword,
    });
    expect(loginResponse.status).toBe(201);
    expect(loginResponse.body).toHaveProperty('token');
    const body = loginResponse.body as { token: string };
    const token = body.token;
    // Create a company directly in the database
    // Suspend the company
    const suspendResponse = await request
      .patch('/admin/suspendCompany')
      .send({ companyID: company.companyID })
      .set('Authorization', `Bearer ${token}`);

    expect(suspendResponse.status).toBe(200);
  });
  it('should edit company details', async () => {
    const request = supertest('http://localhost:3000');
    const adminEmail = `admin-edit-company-test-${Date.now()}@example.com`;
    const adminPassword = 'secureAdminPassword';

    const admin = await registerAdmin(adminEmail, adminPassword);
    expect(admin).toBeDefined();
    const endpointAdmin = supertest('http://localhost:3000/admin/adminLogin');
    // Login to get the token
    const loginResponse = await endpointAdmin.post('').send({
      email: adminEmail,
      password: adminPassword,
    });
    expect(loginResponse.status).toBe(201);
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
      .patch('/admin/editCompany')
      .set('Authorization', `Bearer ${token}`)
      .send({
        companyID: company.companyID,
        data: { name: newName },
      });

    expect(editResponse.status).toBe(200);
  });
  it('should eliminate a company', async () => {
    const request = supertest('http://localhost:3000');
    const adminEmail = `admin-eliminate-company-test-${Date.now()}@example.com`;
    const adminPassword = 'secureAdminPassword';

    // First, register the admin
    const admin = await registerAdmin(adminEmail, adminPassword);
    expect(admin).toBeDefined();
    const endpointAdmin = supertest('http://localhost:3000/admin/adminLogin');
    // Login to get the token
    const loginResponse = await endpointAdmin.post('').send({
      email: adminEmail,
      password: adminPassword,
    });
    expect(loginResponse.status).toBe(201);
    const body = loginResponse.body as { token: string };
    const token = body.token;

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
      .send({ companyID: company.companyID })
      .set('Authorization', `Bearer ${token}`);

    expect(eliminateResponse.status).toBe(201);
  });

  it('should activate a suspended company', async () => {
    const request = supertest('http://localhost:3000');
    const adminEmail = `admin-activate-company-test-${Date.now()}@example.com`;
    const adminPassword = 'secureAdminPassword';

    // First, register the admin
    const admin = await registerAdmin(adminEmail, adminPassword);
    expect(admin).toBeDefined();
    const endpointAdmin = supertest('http://localhost:3000/admin/adminLogin');
    // Login to get the token
    const loginResponse = await endpointAdmin.post('').send({
      email: adminEmail,
      password: adminPassword,
    });
    expect(loginResponse.status).toBe(201);
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
  });

  it('should list companies for an admin', async () => {
    const request = supertest('http://localhost:3000');
    const adminEmail = `admin-list-company-test-${Date.now()}@example.com`;
    const adminPassword = 'secureAdminPassword';

    // First, register the admin
    const admin = await registerAdmin(adminEmail, adminPassword);
    expect(admin).toBeDefined();

    // Login to get the token
    const loginResponse = await request.post('/admin/adminLogin').send({
      email: adminEmail,
      password: adminPassword,
    });
    expect(loginResponse.status).toBe(201);
    const { token, adminID } = loginResponse.body as {
      token: string;
      adminID: string;
    };

    // List companies for the admin
    const listResponse = await request
      .get('/admin/listCompany')
      .query({ adminID })
      .set('Authorization', `Bearer ${token}`);

    expect(listResponse.status).toBe(200);
  });
  it('should register a company under an admin', async () => {
    const request = supertest('http://localhost:3000');
    const adminEmail = `admin-register-company-test-${Date.now()}@example.com`;
    const adminPassword = 'secureAdminPassword';

    // First, register the admin
    const admin = await registerAdmin(adminEmail, adminPassword);
    expect(admin).toBeDefined();

    // Login to get the token
    const loginResponse = await request.post('/admin/adminLogin').send({
      email: adminEmail,
      password: adminPassword,
    });
    expect(loginResponse.status).toBe(201);
    const { token, adminID } = loginResponse.body as {
      token: string;
      adminID: string;
    };

    // Register a new company under the admin
    const companyData = {
      name: `New Company-${Date.now()}`,
      phone: '1234567890',
      email: `new-company-${Date.now()}@example.com`,
      password: 'secureCompanyPassword',
      directions: {
        address: '123 Main St',
        city: 'Test City',
        state: 'TS',
        zipCode: '12345',
      },
    };

    const registerResponse = await request
      .post('/admin/registerCompany')
      .set('Authorization', `Bearer ${token}`)
      .send({ ...companyData, admin: adminID });

    expect(registerResponse.status).toBe(201);
  });
});
