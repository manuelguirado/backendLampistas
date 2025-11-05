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
const registerCompany_1 = require("../src/modules/companies/registerCompany");
const registerDirections_1 = require("../src/modules/directions/registerDirections");
const registerWorker_1 = require("../src/modules/workers/registerWorker");
const listWorker_1 = require("../src/modules/workers/listWorker");
const prisma_1 = require("../generated/prisma");
const registerAdmin_1 = __importDefault(require("../src/modules/admin/registerAdmin"));
const prisma = new prisma_1.PrismaClient();
describe('listWorker', () => {
    jest.setTimeout(20000); // 20 segundos para cada test
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$connect();
        yield prisma.worker.deleteMany({});
        yield prisma.directions.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.company.deleteMany({});
        yield prisma.admin.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.worker.deleteMany({});
        yield prisma.directions.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.company.deleteMany({});
        yield prisma.admin.deleteMany({});
        yield prisma.$disconnect();
    }));
    it('should list workers for a given company', () => __awaiter(void 0, void 0, void 0, function* () {
        const directions = yield (0, registerDirections_1.registerDirections)('123 Test St', 'Test City', 'TS', '12345');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        const company = yield (0, registerCompany_1.registerCompany)('Test Company', '1234567890', `company-${Date.now()}@test.com`, 'securePassword', admin.adminID, directions);
        // Register workers for the company
        const worker1 = yield (0, registerWorker_1.registerWorker)('worker@gmail.com', 'mysecurepassword', 'Test Worker 1', company.companyID);
        const worker2 = yield (0, registerWorker_1.registerWorker)('worker2@gmail.com', 'mysecurepassword2', 'Test Worker 2', company.companyID);
        // List workers for the company
        expect(worker1).toBeDefined();
        expect(worker2).toBeDefined();
        const workers = yield (0, listWorker_1.listWorker)(company.companyID);
        const workerEmails = workers.map((w) => w.email);
        expect(workerEmails).toContain('worker@gmail.com');
        expect(workerEmails).toContain('worker2@gmail.com');
    }));
    it('should return empty list if company has no workers', () => __awaiter(void 0, void 0, void 0, function* () {
        const directions = yield (0, registerDirections_1.registerDirections)('456 Another St', 'Another City', 'AC', '67890');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        const company = yield (0, registerCompany_1.registerCompany)('Empty Company', '0987654321', `empty-company-${Date.now()}@test.com`, 'anotherSecurePassword', admin.adminID, directions);
        const workers = yield (0, listWorker_1.listWorker)(company.companyID);
        expect(workers).toEqual([]);
    }));
    it('should throw an error if company does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const nonExistingCompanyID = 999999;
        yield expect((0, listWorker_1.listWorker)(nonExistingCompanyID)).rejects.toThrow('Company does not exist');
    }));
    it('should throw an error if companyID is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, listWorker_1.listWorker)(0)).rejects.toThrow('companyID is required');
    }));
});
