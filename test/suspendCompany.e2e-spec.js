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
const suspendCompany_1 = require("../src/modules/admin/suspendCompany");
const registerDirections_1 = require("../src/modules/directions/registerDirections");
const registerCompany_1 = require("../src/modules/companies/registerCompany");
const prisma_1 = require("../generated/prisma");
const registerAdmin_1 = __importDefault(require("../src/modules/admin/registerAdmin"));
jest.mock('uuid', () => ({
    v4: () => 'test-uuid',
}));
const prisma = new prisma_1.PrismaClient();
describe('suspendCompany', () => {
    jest.setTimeout(20000); // 20 segundos para cada test
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up all test data before tests
        yield prisma.$connect();
        yield prisma.directions.deleteMany({});
        yield prisma.worker.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.company.deleteMany({});
        yield prisma.admin.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up all test data and disconnect after all tests
        yield prisma.directions.deleteMany({});
        yield prisma.worker.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.company.deleteMany({});
        yield prisma.admin.deleteMany({});
        yield prisma.$disconnect();
    }));
    it('should suspend a company successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const directions = yield (0, registerDirections_1.registerDirections)('Test Direction', '123 Test St', '555-1234', 'test-uuid');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        // First, register a new company
        const company = yield (0, registerCompany_1.registerCompany)('testcompany', '59289289042', 'testcompany@example.com', 'password123', admin.adminID, directions);
        const suspendUntil = new Date();
        suspendUntil.setDate(suspendUntil.getDate() + 7); // Suspender por 7 días
        // Then, suspend the company
        yield (0, suspendCompany_1.suspendCompany)(company.companyID, suspendUntil);
        // Finally, verify that the company is suspended
        const suspendedCompany = yield prisma.company.findUnique({
            where: { companyID: company.companyID },
        });
        expect(suspendedCompany).not.toBeNull();
        expect(suspendedCompany === null || suspendedCompany === void 0 ? void 0 : suspendedCompany.suspended).toBe(true);
    }));
    it('should suspend a company indefinitely when no date is provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const directions = yield (0, registerDirections_1.registerDirections)('Test Direction 2', '456 Test Ave', '555-5678', 'test-uuid-2');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        // First, register a new company
        const company = yield (0, registerCompany_1.registerCompany)('testcompany2', '12345678901', 'testcompany2@example.com', 'password456', admin.adminID, directions);
        // Then, suspend the company without a date
        yield (0, suspendCompany_1.suspendCompany)(company.companyID);
        // Finally, verify that the company is suspended indefinitely
        const suspendedCompany = yield prisma.company.findUnique({
            where: { companyID: company.companyID },
        });
        expect(suspendedCompany).not.toBeNull();
        expect(suspendedCompany === null || suspendedCompany === void 0 ? void 0 : suspendedCompany.suspended).toBe(true);
        expect(suspendedCompany === null || suspendedCompany === void 0 ? void 0 : suspendedCompany.suspendedUntil).toBeNull();
    }));
    it('should throw an error when trying to suspend a company with invalid ID', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, suspendCompany_1.suspendCompany)(0)).rejects.toThrow('Company ID is required');
    }));
});
