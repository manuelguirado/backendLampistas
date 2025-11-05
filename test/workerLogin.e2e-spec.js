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
const workerLogin_1 = require("../src/modules/workers/workerLogin");
const registerWorker_1 = require("../src/modules/workers/registerWorker");
const prisma_1 = require("../generated/prisma");
const registerCompany_1 = require("../src/modules/companies/registerCompany");
const registerDirections_1 = require("../src/modules/directions/registerDirections");
const registerAdmin_1 = __importDefault(require("../src/modules/admin/registerAdmin"));
const prisma = new prisma_1.PrismaClient();
describe('workerLogin', () => {
    jest.setTimeout(10000); // Aumentar timeout a 10 segundos
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Limpiar TODAS las tablas relacionadas
        yield prisma.$connect();
        yield prisma.worker.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({}); //  Limpiar tabla intermedia
        yield prisma.company.deleteMany({}); // ✅ También limpiar companies
        yield prisma.directions.deleteMany({});
        yield prisma.admin.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.worker.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({}); // Limpiar tabla intermedia
        yield prisma.company.deleteMany({});
        yield prisma.directions.deleteMany({});
        yield prisma.admin.deleteMany({});
        yield prisma.$disconnect();
    }));
    it('should login a worker successfully with correct email and password', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = `worker-login-test-${Date.now()}-email@example.com`;
        const password = 'password123';
        const Directions = yield (0, registerDirections_1.registerDirections)('123 Test St, Test City, TS 12345', 'Test City', 'TS', '12345');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        const newCompany = yield (0, registerCompany_1.registerCompany)(`Worker Login Test Company ${Date.now()}`, '1234567890', `worker-login-company-${Date.now()}@example.com`, 'compPassword', admin.adminID, Directions);
        // Create a test worker
        yield (0, registerWorker_1.registerWorker)(email, password, 'testWorker', newCompany.companyID);
        // Attempt login
        const worker = yield (0, workerLogin_1.workerLogin)(email, password);
        expect(worker).toBeDefined();
        expect(worker.email).toBe(email);
    }));
    it('should throw an error if worker does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = `nonexisting-worker-${Date.now()}@example.com`;
        const password = 'password123';
        yield expect((0, workerLogin_1.workerLogin)(email, password)).rejects.toThrow('Worker does not exist');
    }));
    it('should throw an error if password is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = `worker-login-test-${Date.now()}-email@example.com`;
        const correctPassword = 'password123';
        const wrongPassword = 'wrongPassword';
        const Directions = yield (0, registerDirections_1.registerDirections)('123 Test St, Test City, TS 12345', 'Test City', 'TS', '12345');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        const newCompany = yield (0, registerCompany_1.registerCompany)(`Worker Login Test Company ${Date.now()}`, '1234567890', `worker-login-company-${Date.now()}@example.com`, 'compPassword', admin.adminID, Directions);
        // Create a test worker
        yield (0, registerWorker_1.registerWorker)(email, correctPassword, 'testWorker', newCompany.companyID);
        // Attempt login with wrong password
        yield expect((0, workerLogin_1.workerLogin)(email, wrongPassword)).rejects.toThrow('Invalid password');
    }));
    it('should block login after maximum failed attempts', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = `worker-login-test-${Date.now()}-email@example.com`;
        const correctPassword = 'password123';
        const wrongPassword = 'wrongPassword';
        const Directions = yield (0, registerDirections_1.registerDirections)('123 Test St, Test City, TS 12345', 'Test City', 'TS', '12345');
        const Admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        const newCompany = yield (0, registerCompany_1.registerCompany)(`Worker Login Test Company ${Date.now()}`, '1234567890', `worker-login-company-${Date.now()}@example.com`, 'compPassword', Admin.adminID, Directions);
        // Create a test worker
        yield (0, registerWorker_1.registerWorker)(email, correctPassword, 'testWorker', newCompany.companyID);
        // Primeros dos intentos: Invalid password
        for (let i = 0; i < 2; i++) {
            yield expect((0, workerLogin_1.workerLogin)(email, wrongPassword)).rejects.toThrow('Invalid password');
        }
        // Tercer intento: Account locked
        yield expect((0, workerLogin_1.workerLogin)(email, wrongPassword)).rejects.toThrow('Account locked. Try again later');
        // Cuarto intento (seguido): también Account locked
        yield expect((0, workerLogin_1.workerLogin)(email, wrongPassword)).rejects.toThrow('Account locked. Try again later');
    }));
});
