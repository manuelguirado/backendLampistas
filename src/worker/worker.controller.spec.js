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
const supertest_1 = __importDefault(require("supertest"));
const registerWorker_1 = require("../modules/workers/registerWorker");
const registerCompany_1 = require("../modules/companies/registerCompany");
const registerDirections_1 = require("../modules/directions/registerDirections");
const registerAdmin_1 = __importDefault(require("../modules/admin/registerAdmin"));
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
describe('WorkerController', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$connect();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    it('should login a worker successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = (0, supertest_1.default)('http://localhost:3000/worker/worker/workerLogin');
        const email = `worker-login-${Date.now()}@test.com`;
        const password = 'workerPassword';
        // First, create a worker directly in the database
        const directions = yield (0, registerDirections_1.registerDirections)('123 Test St', 'Test City', 'TS', '12345');
        const admin = yield (0, registerAdmin_1.default)(`admin-login-worker-${Date.now()}@test.com`, 'adminPassword');
        const company = yield (0, registerCompany_1.registerCompany)('Test Company', '1234567890', `company-login-worker-${Date.now()}@test.com`, 'securePassword', admin.adminID, directions);
        const worker = yield (0, registerWorker_1.registerWorker)(email, password, 'Test Worker', company.companyID);
        const response = yield request
            .post('')
            .send({ email: worker.email, password: 'workerPassword' })
            .expect(201);
        expect(response.body).toBeDefined();
    }));
    it('should show the assigned incidents for a worker', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = (0, supertest_1.default)('http://localhost:3000/worker/worker/listAssignedIncidents');
        const directions = yield (0, registerDirections_1.registerDirections)('123 Test St', 'Test City', 'TS', '12345');
        const admin = yield (0, registerAdmin_1.default)(`admin-assigned-incidents-${Date.now()}@test.com`, 'adminPassword');
        const company = yield (0, registerCompany_1.registerCompany)('Test Company', '1234567890', `company-assigned-incidents-${Date.now()}@test.com`, 'securePassword', admin.adminID, directions);
        const worker = yield (0, registerWorker_1.registerWorker)(`worker-assigned-incidents-${Date.now()}@test.com`, 'workerPassword', 'Test Worker', company.companyID);
        const response = yield request
            .get('')
            .query({ workerID: worker.workerid })
            .expect(200);
        expect(response.body).toBeDefined();
    }));
    it('should edit status of incident assigned to worker', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = (0, supertest_1.default)('http://localhost:3000/worker/worker/updateStatusIncident');
        const response = yield request
            .patch('')
            .send({ incidentID: 1, status: 'IN_PROGRESS' })
            .expect(200);
        expect(response.body).toBeDefined();
    }));
    it('should show the shifts for a worker', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = (0, supertest_1.default)('http://localhost:3000/worker/worker/myShifts');
        const directions = yield (0, registerDirections_1.registerDirections)('123 Test St', 'Test City', 'TS', '12345');
        const admin = yield (0, registerAdmin_1.default)(`admin-my-shifts-${Date.now()}@test.com`, 'adminPassword');
        const company = yield (0, registerCompany_1.registerCompany)('Test Company', '1234567890', `company-my-shifts-${Date.now()}@test.com`, 'securePassword', admin.adminID, directions);
        const worker = yield (0, registerWorker_1.registerWorker)(`worker-my-shifts-${Date.now()}@test.com`, 'workerPassword', 'Test Worker', company.companyID);
        const response = yield request
            .get('')
            .query({ workerID: worker.workerid })
            .expect(200);
        expect(response.body).toBeDefined();
    }));
});
