import supertest from 'supertest';
import { PrismaClient } from '../../generated/prisma';
import registerAdmin from '../modules/admin/registerAdmin';
const prisma = new PrismaClient();

describe('AdminController', () => {
  beforeAll(async () => {
    await prisma.$connect();
    await prisma.admin.deleteMany({});
  });
  afterAll(async () => {
    await prisma.admin.deleteMany({});
    await prisma.$disconnect();
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
});
