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
const activateCompany_1 = require("../src/modules/admin/activateCompany");
const registerDirections_1 = require("../src/modules/directions/registerDirections");
const registerCompany_1 = require("../src/modules/companies/registerCompany");
const registerAdmin_1 = __importDefault(require("../src/modules/admin/registerAdmin"));
const prisma_1 = require("../generated/prisma");
jest.mock('uuid', () => ({
    v4: () => 'test-uuid',
}));
const prisma = new prisma_1.PrismaClient();
describe('activateCompany', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up all test data before tests
        yield prisma.directions.deleteMany({});
        yield prisma.worker.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.admin.deleteMany({});
        yield prisma.company.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up all test data and disconnect after all tests
        yield prisma.directions.deleteMany({});
        yield prisma.worker.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.admin.deleteMany({});
        yield prisma.company.deleteMany({});
        yield prisma.$disconnect();
    }));
    it('should activate a suspended company successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const directions = yield (0, registerDirections_1.registerDirections)('Test Direction', '123 Test St', '555-1234', 'test-uuid');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        // First, register a new company
        const company = yield (0, registerCompany_1.registerCompany)('testcompany', ' 1234567890', 'testcompany@example.com', 'password123', admin.adminID, directions);
        const suspendUntil = new Date();
        suspendUntil.setDate(suspendUntil.getDate() + 7); // Suspend for 7 days
        // Suspend the company
        yield prisma.company.update({
            where: { companyID: company.companyID },
            data: {
                suspended: true,
                suspendedUntil: suspendUntil,
            },
        });
        // Then, activate the company
        yield (0, activateCompany_1.activateCompany)(company.companyID);
        // Finally, verify that the company is activated
        const activatedCompany = yield prisma.company.findUnique({
            where: { companyID: company.companyID },
        });
        expect(activatedCompany).not.toBeNull();
        expect(activatedCompany === null || activatedCompany === void 0 ? void 0 : activatedCompany.suspended).toBe(false);
    }));
    it('should throw an error when trying to activate a company with invalid ID', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, activateCompany_1.activateCompany)(0)).rejects.toThrow('Company ID is required');
    }));
});
