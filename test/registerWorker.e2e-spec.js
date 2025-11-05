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
const prisma_1 = require("../generated/prisma");
const registerWorker_1 = require("../src/modules/workers/registerWorker");
const registerCompany_1 = require("../src/modules/companies/registerCompany");
const registerDirections_1 = require("../src/modules/directions/registerDirections");
const registerAdmin_1 = __importDefault(require("../src/modules/admin/registerAdmin"));
const prisma = new prisma_1.PrismaClient();
describe('registerWorker', () => {
    jest.setTimeout(20000); // 20 segundos para cada test
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // cleanup database before each test
        yield prisma.$connect();
        yield prisma.worker.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.company.deleteMany({});
        yield prisma.directions.deleteMany({});
        yield prisma.admin.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // cleanup database after tests
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.worker.deleteMany({});
        yield prisma.company.deleteMany({});
        yield prisma.directions.deleteMany({});
        yield prisma.admin.deleteMany({});
        yield prisma.$disconnect();
    }));
    it('should register a new worker', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = `worker-test-${Date.now()}@example.com`;
        const name = 'Test Worker';
        const password = 'workerPassword';
        const directions = yield (0, registerDirections_1.registerDirections)('123 Worker St, Worker City, WC 12345', 'Worker City', 'WC', '12345');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        // First, create a company to associate the worker with
        const company = yield (0, registerCompany_1.registerCompany)(`Worker Test Company ${Date.now()}`, '1234567890', `worker-company-${Date.now()}@example.com`, 'compPassword', admin.adminID, directions);
        const worker = yield (0, registerWorker_1.registerWorker)(email, password, name, company.companyID);
        // Verify the worker was created
        expect(worker).toBeDefined();
        expect(worker.email).toBe(email);
        expect(worker.name).toBe(name);
        expect(worker.companyID).toBe(company.companyID);
        // Verify in database
        const dbWorker = yield prisma.worker.findUnique({
            where: { email },
        });
        expect(dbWorker).not.toBeNull();
        expect(dbWorker === null || dbWorker === void 0 ? void 0 : dbWorker.name).toBe(name);
        expect(dbWorker === null || dbWorker === void 0 ? void 0 : dbWorker.companyID).toBe(company.companyID);
    }));
    it('should throw error if worker already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = `worker-duplicate-${Date.now()}@example.com`;
        const name = 'Test Worker';
        const password = 'workerPassword';
        const directions = yield (0, registerDirections_1.registerDirections)('123 Worker St, Worker City, WC 12345', 'Worker City', 'WC', '12345');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        // First, create a company to associate the worker with
        const company = yield (0, registerCompany_1.registerCompany)(`Worker Test Company ${Date.now()}`, '1234567890', `worker-company-${Date.now()}@example.com`, 'compPassword', admin.adminID, directions);
        // Register worker first time
        yield (0, registerWorker_1.registerWorker)(email, password, name, company.companyID);
        // Try to register same worker again
        yield expect((0, registerWorker_1.registerWorker)(email, password, name, company.companyID)).rejects.toThrow('Worker already exists');
    }));
});
