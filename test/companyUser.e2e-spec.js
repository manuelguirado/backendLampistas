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
const companyUsers_1 = require("../src/modules/companies/companyUsers");
const registerCompany_1 = require("../src/modules/companies/registerCompany");
const registerDirections_1 = require("../src/modules/directions/registerDirections");
const registerAdmin_1 = __importDefault(require("../src/modules/admin/registerAdmin"));
const userRegister_1 = require("../src/modules/users/userRegister");
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
describe('companyUsers', () => {
    jest.setTimeout(20000); // 20 segundos para cada test
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$connect();
        yield prisma.directions.deleteMany({});
        yield prisma.user.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.company.deleteMany({});
        yield prisma.admin.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.directions.deleteMany({});
        yield prisma.user.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.company.deleteMany({});
        yield prisma.admin.deleteMany({});
        yield prisma.$disconnect();
    }));
    it('should return users associated with a company', () => __awaiter(void 0, void 0, void 0, function* () {
        const directions = yield (0, registerDirections_1.registerDirections)('123 Test St, Test City, TS 12345', 'Test City', 'TS', '12345');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        const company = yield (0, registerCompany_1.registerCompany)('Test Company', '1234567890', `company-${Date.now()}@test.com`, 'securePassword', admin.adminID, directions);
        const user1 = yield (0, userRegister_1.userRegister)(`user1-${Date.now()}@test.com`, 'userPassword1', 'Test User 1', company.companyID);
        const user2 = yield (0, userRegister_1.userRegister)('Test User 2', `user2-${Date.now()}@test.com`, 'userPassword2', company.companyID);
        expect(user1).toBeDefined();
        expect(user2).toBeDefined();
        const users = yield (0, companyUsers_1.companyUsers)(company.companyID);
        expect(users).toHaveLength(2);
        const userEmails = users.map((u) => u.email);
        expect(userEmails).toContain(user1.email);
        expect(userEmails).toContain(user2.email);
    }));
    it('should return an empty array if no users are associated with the company', () => __awaiter(void 0, void 0, void 0, function* () {
        const directions = yield (0, registerDirections_1.registerDirections)('456 Another St, Another City, AC 67890', 'Another City', 'AC', '67890');
        const admin = yield (0, registerAdmin_1.default)(`admin2-${Date.now()}@test.com`, 'adminPassword2');
        const company = yield (0, registerCompany_1.registerCompany)('Another Test Company', '0987654321', `another-company-${Date.now()}@test.com`, 'anotherSecurePassword', admin.adminID, directions);
        const users = yield (0, companyUsers_1.companyUsers)(company.companyID);
        expect(users).toEqual([]);
    }));
});
