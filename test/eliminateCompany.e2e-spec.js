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
const eliminateCompany_1 = require("../src/modules/admin/eliminateCompany");
const registerDirections_1 = require("../src/modules/directions/registerDirections");
const registerCompany_1 = require("../src/modules/companies/registerCompany");
const registerAdmin_1 = __importDefault(require("../src/modules/admin/registerAdmin"));
const prisma_1 = require("../generated/prisma");
jest.mock('uuid', () => ({
    v4: () => 'test-uuid',
}));
const prisma = new prisma_1.PrismaClient();
describe('eliminateCompany', () => {
    jest.setTimeout(20000); // 20 segundos para cada test
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up all test data before tests
        yield prisma.$connect();
        yield prisma.directions.deleteMany({});
        yield prisma.worker.deleteMany({});
        yield prisma.directions.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.admin.deleteMany({});
        yield prisma.company.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up all test data and disconnect after all tests
        yield prisma.directions.deleteMany({});
        yield prisma.worker.deleteMany({});
        yield prisma.directions.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.admin.deleteMany({});
        yield prisma.company.deleteMany({});
        yield prisma.$disconnect();
    }));
    it('should eliminate a company and its associated workers successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const directions = yield (0, registerDirections_1.registerDirections)('Test Direction', '123 Test St', '555-1234', 'test-uuid');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        // First, register a new company
        const company = yield (0, registerCompany_1.registerCompany)('testcompany', '59289289042', 'company-test@gmail.com', 'password123', admin.adminID, directions);
        // Then, eliminate the company
        yield (0, eliminateCompany_1.eliminateCompany)(company.companyID);
        // Finally, verify that the company and its workers have been deleted
        const deletedCompany = yield prisma.company.findUnique({
            where: { companyID: company.companyID },
        });
        const deletedWorkers = yield prisma.worker.findMany({
            where: { companyID: company.companyID },
        });
        expect(deletedCompany).toBeNull();
        expect(deletedWorkers).toHaveLength(0);
    }));
    it('should throw an error when trying to eliminate a company with invalid ID', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, eliminateCompany_1.eliminateCompany)(0)).rejects.toThrow('Company ID is required');
    }));
});
