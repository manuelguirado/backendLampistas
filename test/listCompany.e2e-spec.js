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
const listCompany_1 = require("../src/modules/admin/listCompany");
const registerCompany_1 = require("../src/modules/companies/registerCompany");
const registerDirections_1 = require("../src/modules/directions/registerDirections");
const registerAdmin_1 = __importDefault(require("../src/modules/admin/registerAdmin"));
const prisma = new prisma_1.PrismaClient();
describe('listCompany', () => {
    jest.setTimeout(20000); // 20 segundos para cada test
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$connect();
        yield prisma.directions.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.admin.deleteMany({});
        yield prisma.company.deleteMany({});
        yield prisma.company.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.directions.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.admin.deleteMany({});
        yield prisma.company.deleteMany({});
        yield prisma.$disconnect();
    }));
    it('should list all companies', () => __awaiter(void 0, void 0, void 0, function* () {
        const directions = yield (0, registerDirections_1.registerDirections)('123 Test St, Test City, TS 12345', 'Test City', 'TS', '12345');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        const company1 = yield (0, registerCompany_1.registerCompany)('Test Company 1', '1234567890', `company1-${Date.now()}@test.com`, 'securePassword1', admin.adminID, directions);
        const company2 = yield (0, registerCompany_1.registerCompany)('Test Company 2', '0987654321', `company2-${Date.now()}@test.com`, 'securePassword2', admin.adminID, directions);
        const companies = yield (0, listCompany_1.listCompany)(admin.adminID);
        expect(companies.length).toBeGreaterThanOrEqual(2);
        const companyNames = companies.map((comp) => comp.name);
        expect(company1).toBeDefined();
        expect(company2).toBeDefined();
        expect(companyNames).toContain('Test Company 1');
        expect(companyNames).toContain('Test Company 2');
    }));
    it('should return an empty array when no companies are registered', () => __awaiter(void 0, void 0, void 0, function* () {
        // First, clean up all companies
        const admin = yield (0, registerAdmin_1.default)(`admin-no-companies-${Date.now()}@test.com`, 'adminPassword');
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.company.deleteMany({});
        const companies = yield (0, listCompany_1.listCompany)(admin.adminID);
        expect(companies).toEqual([]);
    }));
});
