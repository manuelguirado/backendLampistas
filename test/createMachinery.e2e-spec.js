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
const createMachinery_1 = require("../src/modules/machinery/createMachinery");
const registerCompany_1 = require("../src/modules/companies/registerCompany");
const userRegister_1 = require("../src/modules/users/userRegister");
const registerDirections_1 = require("../src/modules/directions/registerDirections");
const registerAdmin_1 = __importDefault(require("../src/modules/admin/registerAdmin"));
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
jest.mock('uuid', () => ({
    v4: () => 'test-uuid',
}));
describe('createMachinery', () => {
    jest.setTimeout(20000); // 20 segundos para cada test
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up all test data before tests
        yield prisma.machinery.deleteMany({});
        yield prisma.directions.deleteMany({});
        yield prisma.user.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.admin.deleteMany({});
        yield prisma.company.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up all test data and disconnect after all tests
        yield prisma.machinery.deleteMany({});
        yield prisma.directions.deleteMany({});
        yield prisma.user.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.admin.deleteMany({});
        yield prisma.company.deleteMany({});
        yield prisma.$disconnect();
    }));
    it('should create machinery successfully with valid data', () => __awaiter(void 0, void 0, void 0, function* () {
        // First, register a company
        const directions = yield (0, registerDirections_1.registerDirections)('123 Main St', 'Metropolis', 'NY', '10001');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        const companyEmail = `machinery-test-company-${Date.now()}@example.com`;
        const companyPassword = 'companyPassword';
        const company = yield (0, registerCompany_1.registerCompany)('Test Company', '1234567890', companyEmail, companyPassword, admin.adminID, directions);
        // Then, register a user for that company
        const userEmail = `machinery-test-user-${Date.now()}@example.com`;
        const userPassword = 'userPassword';
        const user = yield (0, userRegister_1.userRegister)('testUser', userEmail, userPassword);
        // Now, create machinery
        const machinery = yield (0, createMachinery_1.createMachinery)('Excavator', 'Heavy duty excavator', new Date('2024-12-01'), new Date('2024-11-01'), new Date('2024-01-15'), user.userID, company.name, 'Construction', company.companyID);
        expect(machinery).toBeDefined();
        expect(machinery.name).toBe('Excavator');
        expect(machinery.companyID).toBe(company.companyID);
    }));
    it('should throw an error when required fields are missing', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, createMachinery_1.createMachinery)('', 'Heavy duty excavator', new Date('2024-12-01'), new Date('2024-11-01'), new Date('2024-01-15'), 1, 'Test Company', 'Construction', 1)).rejects.toThrow('All fields are required');
    }));
});
