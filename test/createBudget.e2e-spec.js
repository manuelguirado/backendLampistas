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
const prisma_1 = require("./../generated/prisma");
const createbudget_1 = require("../src/modules/budgets/createbudget");
const createIncident_1 = require("../src/modules/incidents/createIncident");
const registerWorker_1 = require("../src/modules/workers/registerWorker");
const userRegister_1 = require("../src/modules/users/userRegister");
const registerDirections_1 = require("../src/modules/directions/registerDirections");
const registerAdmin_1 = __importDefault(require("../src/modules/admin/registerAdmin"));
const prisma = new prisma_1.PrismaClient();
jest.mock('uuid', () => ({
    v4: () => 'test-uuid',
}));
describe('createBudget', () => {
    jest.setTimeout(20000); // 20 segundos para cada test
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up all test data before running tests
        yield prisma.worker.deleteMany({});
        yield prisma.budget.deleteMany({});
        yield prisma.incidents.deleteMany({});
        yield prisma.user.deleteMany({});
        yield prisma.directions.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.admin.deleteMany({});
        yield prisma.company.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up all test data and disconnect after all tests
        yield prisma.worker.deleteMany({});
        yield prisma.budget.deleteMany({});
        yield prisma.incidents.deleteMany({});
        yield prisma.user.deleteMany({});
        yield prisma.directions.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.admin.deleteMany({});
        yield prisma.company.deleteMany({});
        yield prisma.$disconnect();
    }));
    it('should create a budget successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        // First, register a company
        const directions = yield (0, registerDirections_1.registerDirections)('123 Test St, Test City, TS 12345', 'Test City', 'TS', '12345');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        const company = yield (0, registerCompany_1.registerCompany)('Test Company', '1234567890', 'test@company.com', '123 Test St', admin.adminID, directions);
        // Then, register a worker
        const worker = yield (0, registerWorker_1.registerWorker)('John Doe', 'worker@test.com', 'password123', company.companyID);
        // Finally, register a user
        const user = yield (0, userRegister_1.userRegister)('Test User', 'user@test.com', 'password123');
        // Then, create an incident for that company
        const incident = yield (0, createIncident_1.createIncident)('Test Incident', 'This is a test incident', user.userID, company.companyID);
        // Finally, create a budget for that incident
        const budget = yield (0, createbudget_1.createBudget)(incident.IncidentsID, 1000, 'Test budget description', user.userID, company.companyID, worker.workerid, // ✅ AGREGAR workerID
        ['Item1', 'Item2']);
        expect(budget).toHaveProperty('budgetID');
        expect(budget.totalAmount);
        expect(budget.description);
        expect(budget.companyID).toBe(company.companyID);
        expect(budget.items);
    }));
    it('should throw an error if the worker does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        // First, register a company
        const directions = yield (0, registerDirections_1.registerDirections)('123 Test St, Test City, TS 12345', 'Test City', 'TS', '12345');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        const company = yield (0, registerCompany_1.registerCompany)('Test Company 1', '1234567890', 'test1@company.com', 'mysecurepassword', admin.adminID, directions);
        // Finally, register a user
        const user = yield (0, userRegister_1.userRegister)('Test User 1', 'user1@test.com', 'password123');
        // Then, create an incident for that company
        const incident = yield (0, createIncident_1.createIncident)('Test Incident 1', 'This is a test incident 1', user.userID, company.companyID);
        // Finally, attempt to create a budget with a non-existing worker
        yield expect((0, createbudget_1.createBudget)(incident.IncidentsID, 1000, 'Description', user.userID, company.companyID, 9999, // ✅ workerID inexistente
        ['Item1'])).rejects.toThrow('Worker not found');
    }));
    it('should throw an error if required fields are missing', () => __awaiter(void 0, void 0, void 0, function* () {
        // ✅ Test con parámetros faltantes
        return yield expect((0, createbudget_1.createBudget)(0, 0, '', 0, 0, 0, [])).rejects.toThrow('All fields are required');
    }));
    it('should throw an error if incident does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        // First, register a company
        const directions = yield (0, registerDirections_1.registerDirections)('123 Test St, Test City, TS 12345', 'Test City', 'TS', '12345');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        const company = yield (0, registerCompany_1.registerCompany)('Test Company 2', '1234567890', 'test2@company.com', 'mysecurepassword', admin.adminID, directions);
        // Then, register a worker
        const worker = yield (0, registerWorker_1.registerWorker)('John Doe', 'worker2@test.com', 'password123', company.companyID);
        // Finally, register a user
        const user = yield (0, userRegister_1.userRegister)('Test User 2', 'user2@test.com', 'password123');
        // Finally, attempt to create a budget for a non-existing incident
        yield expect((0, createbudget_1.createBudget)(9999, // ✅ IncidentID inexistente
        1000, 'Description', user.userID, company.companyID, worker.workerid, ['Item1'])).rejects.toThrow('Incident not found');
    }));
});
