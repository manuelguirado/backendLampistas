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
const editCompany_1 = require("../src/modules/admin/editCompany");
const registerDirections_1 = require("../src/modules/directions/registerDirections");
const registerCompany_1 = require("../src/modules/companies/registerCompany");
const prisma_1 = require("../generated/prisma");
const registerAdmin_1 = __importDefault(require("../src/modules/admin/registerAdmin"));
jest.mock('uuid', () => ({
    v4: () => 'test-uuid',
}));
const prisma = new prisma_1.PrismaClient();
describe('editCompany', () => {
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
    it("should edit a company's details successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const directions = yield (0, registerDirections_1.registerDirections)('Initial Direction', '123 Initial St', '555-0000', 'test-uuid');
        const updateData = {
            name: 'updatedcompany',
            email: 'updatedemail@example.com',
            phone: '  5550001',
        };
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        // First, register a new company
        const company = yield (0, registerCompany_1.registerCompany)('initialcompany', '12345678901', 'test-uuid', 'password123', admin.adminID, directions);
        const updatedCompany = yield (0, editCompany_1.editCompany)(company.companyID, updateData);
        // Add other fields as needed to match the expected type
        expect(updatedCompany.companyID).toBe(company.companyID);
        expect(updatedCompany.email).toBe(updateData.email);
        expect(updatedCompany.phone).toBe(updateData.phone);
    }));
    it('should throw an error when trying to edit a company with invalid ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const updateData = {
            name: 'nonexistentcompany',
            email: 'noexistingo@example.com',
            phone: '5559999',
        };
        yield expect((0, editCompany_1.editCompany)(0, updateData)).rejects.toThrow('Company ID is required');
    }));
});
