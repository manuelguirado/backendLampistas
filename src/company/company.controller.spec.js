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
const registerCompany_1 = require("../modules/companies/registerCompany");
const registerDirections_1 = require("../modules/directions/registerDirections");
const registerAdmin_1 = __importDefault(require("../modules/admin/registerAdmin"));
const registerWorker_1 = require("../modules/workers/registerWorker");
const prisma_1 = require("../../generated/prisma");
const supertest_1 = __importDefault(require("supertest"));
const prisma = new prisma_1.PrismaClient();
describe('CompanyController', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$connect();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    it('should login a company successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = (0, supertest_1.default)('http://localhost:3000/company/companyLogin');
        const name = 'Test Company';
        const phone = '1234567890';
        const email = `company-login-${Date.now()}@test.com`;
        const address = '123 Test St, Test City, TS 12345';
        const password = 'securePassword';
        const directions = yield (0, registerDirections_1.registerDirections)(address, 'Test City', 'TS', '12345');
        const admin = yield (0, registerAdmin_1.default)(`admin-login-${Date.now()}@test.com`, 'adminPassword');
        const Company = yield (0, registerCompany_1.registerCompany)(name, phone, email, password, admin.adminID, directions);
        const response = yield request
            .post('')
            .send({ email: Company.email, password: 'securePassword' })
            .expect(201);
        console.log(response.body);
        expect(response.body).toBeDefined();
    }));
    it('should register a worker successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = (0, supertest_1.default)('http://localhost:3000/company/company/registerWorker');
        const directions = yield (0, registerDirections_1.registerDirections)('123 Test St, Test City, TS 12345', 'Test City', 'TS', '12345');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        const company = yield (0, registerCompany_1.registerCompany)('Test Company', '1234567890', `company-${Date.now()}@test.com`, 'securePassword', admin.adminID, directions);
        const response = yield request
            .post('')
            .send({
            email: `worker-${Date.now()}@example.com`,
            password: 'workerPassword',
            name: 'Test Worker',
            companyID: company.companyID,
        })
            .expect(201);
        expect(response.body).toBeDefined();
    }));
    it('should edit a worker successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = (0, supertest_1.default)('http://localhost:3000/company/company/editWorker');
        const directions = yield (0, registerDirections_1.registerDirections)('123 Test St, Test City, TS 12345', 'Test City', 'TS', '12345');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        const company = yield (0, registerCompany_1.registerCompany)('Test Company', '1234567890', `company-${Date.now()}@test.com`, 'securePassword', admin.adminID, directions);
        const worker = yield (0, registerWorker_1.registerWorker)(`worker-${Date.now()}@example.com`, 'workerPassword', 'Test Worker', company.companyID);
        const response = yield request
            .patch('')
            .send({
            workerID: worker.workerid,
            data: { name: 'Updated Worker Name' },
        })
            .expect(200);
        expect(response.body).toBeDefined();
    }));
    it('should register machinery successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = (0, supertest_1.default)('http://localhost:3000/company/company/createMachinery');
        const directions = yield (0, registerDirections_1.registerDirections)('123 Test St, Test City, TS 12345', 'Test City', 'TS', '12345');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        const company = yield (0, registerCompany_1.registerCompany)('Test Company', '1234567890', `company-${Date.now()}@test.com`, 'securePassword', admin.adminID, directions);
        const response = yield request
            .post('')
            .send({
            name: 'Excavator',
            description: 'Heavy duty excavator',
            maintanceDate: new Date(),
            lastInspectionDate: new Date(),
            installedAt: new Date(),
            clientId: 1,
            companyName: company.name,
            machineType: 'ExcavatorType',
            companyID: company.companyID,
        })
            .expect(201);
        expect(response.body).toBeDefined();
    }));
    it('should list workers for a company', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = (0, supertest_1.default)('http://localhost:3000/company/listWorker');
        const directions = yield (0, registerDirections_1.registerDirections)('123 Test St, Test City, TS 12345', 'Test City', 'TS', '12345');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        const company = yield (0, registerCompany_1.registerCompany)('Test Company', '1234567890', `company-${Date.now()}@test.com`, 'securePassword', admin.adminID, directions);
        const worker1 = yield (0, registerWorker_1.registerWorker)(`worker1-${Date.now()}@example.com`, 'workerPassword1', 'Worker One', company.companyID);
        const worker2 = yield (0, registerWorker_1.registerWorker)(`worker2-${Date.now()}@example.com`, 'workerPassword2', 'Worker Two', company.companyID);
        expect(worker1).toBeDefined();
        expect(worker2).toBeDefined();
        const response = yield request
            .post('')
            .send({ companyID: company.companyID })
            .expect(201);
        expect(response.body).toBeDefined();
        expect(Array.isArray(response.body)).toBe(true);
    }));
    it('should delete a worker successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = (0, supertest_1.default)('http://localhost:3000/company/company/deleteWorker');
        const directions = yield (0, registerDirections_1.registerDirections)('123 Test St, Test City, TS 12345', 'Test City', 'TS', '12345');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        const company = yield (0, registerCompany_1.registerCompany)('Test Company', '1234567890', `company-${Date.now()}@test.com`, 'securePassword', admin.adminID, directions);
        const worker = yield (0, registerWorker_1.registerWorker)(`worker-to-delete-${Date.now()}@example.com`, 'workerPassword', 'Worker To Delete', company.companyID);
        const response = yield request
            .delete('')
            .send({ workerID: worker.workerid })
            .expect(200);
        expect(response.body).toBeDefined();
    }));
    it('should create a budget successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = (0, supertest_1.default)('http://localhost:3000/company/company/createBudget');
        const directions = yield (0, registerDirections_1.registerDirections)('123 Test St, Test City, TS 12345', 'Test City', 'TS', '12345');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        const company = yield (0, registerCompany_1.registerCompany)('Test Company', '1234567890', `company-${Date.now()}@test.com`, 'securePassword', admin.adminID, directions);
        const response = yield request
            .post('')
            .send({
            companyID: company.companyID,
            title: 'Test Budget',
            amount: 10000,
            description: 'This is a test budget',
        })
            .expect(201);
        expect(response.body).toBeDefined();
    }));
    it('should return empty list if company has no workers', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = (0, supertest_1.default)('http://localhost:3000/company/listWorker');
        const directions = yield (0, registerDirections_1.registerDirections)('456 Empty St, NoWorker City, NW 67890', 'NoWorker City', 'NW', '67890');
        const admin = yield (0, registerAdmin_1.default)(`admin-noworker-${Date.now()}@test.com`, 'adminPassword');
        const company = yield (0, registerCompany_1.registerCompany)('No Worker Company', '0987654321', `noworker-company-${Date.now()}@test.com`, 'securePassword', admin.adminID, directions);
        const response = yield request
            .post('')
            .send({ companyID: company.companyID })
            .expect(201);
        expect(response.body).toBeDefined();
        expect(Array.isArray(response.body)).toBe(true);
    }));
    it('should assign an incident to a worker successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = (0, supertest_1.default)('http://localhost:3000/company/company/assignIncident');
        const directions = yield (0, registerDirections_1.registerDirections)('123 Test St, Test City, TS 12345', 'Test City', 'TS', '12345');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        const company = yield (0, registerCompany_1.registerCompany)('Test Company', '1234567890', `company-${Date.now()}@test.com`, 'securePassword', admin.adminID, directions);
        const worker = yield (0, registerWorker_1.registerWorker)(`worker-${Date.now()}@example.com`, 'workerPassword', 'Test Worker', company.companyID);
        const response = yield request
            .post('')
            .send({ incidentID: 1, workerID: worker.workerid })
            .expect(200);
        expect(response.body).toBeDefined();
    }));
    it('should assign a shift to a worker successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = (0, supertest_1.default)('http://localhost:3000/company/company/assignShiftWorker');
        const directions = yield (0, registerDirections_1.registerDirections)('123 Test St, Test City, TS 12345', 'Test City', 'TS', '12345');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        const company = yield (0, registerCompany_1.registerCompany)('Test Company', '1234567890', `company-${Date.now()}@test.com`, 'securePassword', admin.adminID, directions);
        const worker = yield (0, registerWorker_1.registerWorker)(`worker-${Date.now()}@example.com`, 'workerPassword', 'Test Worker', company.companyID);
        const response = yield request
            .post('')
            .send({
            workerID: worker.workerid,
            shiftSchedule: new Date(),
            shiftType: 'Morning',
        })
            .expect(200);
        expect(response.body).toBeDefined();
    }));
});
