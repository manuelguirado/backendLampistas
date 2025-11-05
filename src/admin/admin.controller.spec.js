"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = require("../../generated/prisma");
const supertest_1 = __importDefault(require("supertest"));
const prisma = new prisma_1.PrismaClient();
describe('AdminController', () => {
    beforeAll(() => {
        //clean up the database
        prisma.admin.deleteMany({});
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        //clean up the database
        yield prisma.admin.deleteMany({});
        yield prisma.$disconnect();
    }));
    it('should register a new admin successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = (0, supertest_1.default)('http://localhost:3000/admin/register');
        const email = `admin-test-${Date.now()}@example.com`;
        const password = 'secureAdminPassword';
        const response = yield request.post('/admin/register').send({
            email,
            password,
        });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('id');
    }));
    it('should login an existing admin successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = (0, supertest_1.default)('http://localhost:3000/admin/login');
        const email = `admin-login-test-${Date.now()}@example.com`;
        const password = 'secureAdminPassword';
        // First, register the admin
        const registerResponse = yield request.post('/admin/register').send({
            email,
            password,
        });
        expect(registerResponse.status).toBe(201);
        // Then, login with the same credentials
        const loginResponse = yield request.post('/admin/login').send({
            email,
            password,
        });
        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body).toHaveProperty('token');
    }));
    it('should fail to login with incorrect password', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = (0, supertest_1.default)('http://localhost:3000/admin/login');
        const email = `admin-login-fail-test-${Date.now()}@example.com`;
        const password = 'secureAdminPassword';
        const wrongPassword = 'wrongPassword';
        // First, register the admin
        const registerResponse = yield request.post('/admin/register').send({
            email,
            password,
        });
        expect(registerResponse.status).toBe(201);
        // Then, attempt to login with wrong password
        const loginResponse = yield request.post('/admin/login').send({
            email,
            password: wrongPassword,
        });
        expect(loginResponse.status).toBe(401);
        expect(loginResponse.body).toHaveProperty('message', 'Invalid password');
    }));
    it('should modify a company suspension status', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = (0, supertest_1.default)('http://localhost:3000/admin/suspendCompany');
        const adminEmail = `admin-suspend-test-${Date.now()}@example.com`;
        const adminPassword = 'secureAdminPassword';
        // First, register the admin
        const registerResponse = yield request.post('/admin/register').send({
            email: adminEmail,
            password: adminPassword,
        });
        expect(registerResponse.status).toBe(201);
        // Login to get the token
        const loginResponse = yield request.post('/admin/login').send({
            email: adminEmail,
            password: adminPassword,
        });
        expect(loginResponse.status).toBe(200);
        const { token } = loginResponse.body;
        // Create a company directly in the database
        const companyEmail = `company-suspend-test-${Date.now()}@example.com`;
        const company = yield prisma.company.create({
            data: {
                name: 'Test Company',
                email: companyEmail,
                phone: '1234567890',
                password: 'secureCompanyPassword',
            },
        });
        // Suspend the company
        const suspendResponse = yield request
            .patch(`/admin/suspend-company/${company.companyID}`)
            .set('Authorization', `Bearer ${token}`);
        expect(suspendResponse.status).toBe(200);
        expect(suspendResponse.body).toHaveProperty('message', 'Company suspended successfully');
    }));
    it('should generate an admin code', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = (0, supertest_1.default)('http://localhost:3000/admin/generateCode');
        const adminEmail = `admin-generate-code-test-${Date.now()}@example.com`;
        const adminPassword = 'secureAdminPassword';
        // First, register the admin
        const registerResponse = yield request.post('/admin/register').send({
            email: adminEmail,
            password: adminPassword,
        });
        expect(registerResponse.status).toBe(201);
        // Login to get the token
        const loginResponse = yield request.post('/admin/login').send({
            email: adminEmail,
            password: adminPassword,
        });
        expect(loginResponse.status).toBe(200);
        const { token } = loginResponse.body;
        // Generate the code
        const codeResponse = yield request
            .get('/admin/generateCode')
            .set('Authorization', `Bearer ${token}`);
        expect(codeResponse.status).toBe(200);
        expect(codeResponse.body).toHaveProperty('code');
    }));
    it('should edit company details', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = (0, supertest_1.default)('http://localhost:3000/admin/editCompany');
        const adminEmail = `admin-edit-company-test-${Date.now()}@example.com`;
        const adminPassword = 'secureAdminPassword';
        // First, register the admin
        const registerResponse = yield request.post('/admin/register').send({
            email: adminEmail,
            password: adminPassword,
        });
        expect(registerResponse.status).toBe(201);
        // Login to get the token
        const loginResponse = yield request.post('/admin/login').send({
            email: adminEmail,
            password: adminPassword,
        });
        expect(loginResponse.status).toBe(200);
        const { token } = loginResponse.body;
        // Create a company directly in the database
        const companyEmail = `company-edit-test-${Date.now()}@example.com`;
        const company = yield prisma.company.create({
            data: {
                name: 'Edit Test Company',
                email: companyEmail,
                phone: '1234567890',
                password: 'secureCompanyPassword',
            },
        });
        // Edit the company details
        const newName = 'Updated Company Name';
        const editResponse = yield request
            .post('/admin/editCompany')
            .set('Authorization', `Bearer ${token}`)
            .send({
            companyID: company.companyID,
            data: { name: newName },
        });
        expect(editResponse.status).toBe(200);
        expect(editResponse.body).toHaveProperty('message', 'Company details updated successfully');
        // Verify the update in the database
        const updatedCompany = yield prisma.company.findUnique({
            where: { companyID: company.companyID },
        });
        expect(updatedCompany).toHaveProperty('name', newName);
    }));
    it('should eliminate a company', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = (0, supertest_1.default)('http://localhost:3000/admin/eliminateCompany');
        const adminEmail = `admin-eliminate-company-test-${Date.now()}@example.com`;
        const adminPassword = 'secureAdminPassword';
        // First, register the admin
        const registerResponse = yield request.post('/admin/register').send({
            email: adminEmail,
            password: adminPassword,
        });
        expect(registerResponse.status).toBe(201);
        // Login to get the token
        const loginResponse = yield request.post('/admin/login').send({
            email: adminEmail,
            password: adminPassword,
        });
        expect(loginResponse.status).toBe(200);
        const { token } = loginResponse.body;
        // Create a company directly in the database
        const companyEmail = `company-eliminate-test-${Date.now()}@example.com`;
        const company = yield prisma.company.create({
            data: {
                name: 'Eliminate Test Company',
                email: companyEmail,
                phone: '1234567890',
                password: 'secureCompanyPassword',
            },
        });
        // Eliminate the company
        const eliminateResponse = yield request
            .post('/admin/eliminateCompany')
            .set('Authorization', `Bearer ${token}`)
            .send({ companyID: company.companyID });
        expect(eliminateResponse.status).toBe(200);
        expect(eliminateResponse.body).toHaveProperty('message', 'Company eliminated successfully');
        // Verify the deletion in the database
        const deletedCompany = yield prisma.company.findUnique({
            where: { companyID: company.companyID },
        });
        expect(deletedCompany).toBeNull();
    }));
    it('should activate a suspended company', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = (0, supertest_1.default)('http://localhost:3000/admin/activateCompany');
        const adminEmail = `admin-activate-company-test-${Date.now()}@example.com`;
        const adminPassword = 'secureAdminPassword';
        // First, register the admin
        const registerResponse = yield request.post('/admin/register').send({
            email: adminEmail,
            password: adminPassword,
        });
        expect(registerResponse.status).toBe(201);
        // Login to get the token
        const loginResponse = yield request.post('/admin/login').send({
            email: adminEmail,
            password: adminPassword,
        });
        expect(loginResponse.status).toBe(200);
        const { token } = loginResponse.body;
        // Create a suspended company directly in the database
        const companyEmail = `company-activate-test-${Date.now()}@example.com`;
        const company = yield prisma.company.create({
            data: {
                name: 'Activate Test Company',
                email: companyEmail,
                phone: '1234567890',
                password: 'secureCompanyPassword',
                suspended: true,
            },
        });
        // Activate the company
        const activateResponse = yield request
            .patch('/admin/activateCompany')
            .set('Authorization', `Bearer ${token}`)
            .send({ companyID: company.companyID });
        expect(activateResponse.status).toBe(200);
        expect(activateResponse.body).toHaveProperty('message', 'Company activated successfully');
    }));
    it('should list companies for an admin', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = (0, supertest_1.default)('http://localhost:3000/admin/listCompany');
        const adminEmail = `admin-list-company-test-${Date.now()}@example.com`;
        const adminPassword = 'secureAdminPassword';
        // First, register the admin
        const registerResponse = yield request.post('/admin/register').send({
            email: adminEmail,
            password: adminPassword,
        });
        expect(registerResponse.status).toBe(201);
        // Login to get the token
        const loginResponse = yield request.post('/admin/login').send({
            email: adminEmail,
            password: adminPassword,
        });
        expect(loginResponse.status).toBe(200);
        const { token } = loginResponse.body;
        // List companies for the admin
        const listResponse = yield request
            .get('/admin/listCompany')
            .set('Authorization', `Bearer ${token}`);
        expect(listResponse.status).toBe(200);
        expect(Array.isArray(listResponse.body)).toBe(true);
    }));
});
