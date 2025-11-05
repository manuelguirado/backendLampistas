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
const registerDirections_1 = require("../src/modules/directions/registerDirections");
const prisma_1 = require("../generated/prisma");
const registerCompany_1 = require("../src/modules/companies/registerCompany");
const registerAdmin_1 = __importDefault(require("../src/modules/admin/registerAdmin"));
const prisma = new prisma_1.PrismaClient();
describe('Company registration', () => {
    jest.setTimeout(20000); // 20 segundos para cada test
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Setup code before all tests run
        yield prisma.$connect();
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.company.deleteMany({});
        yield prisma.admin.deleteMany({});
        yield prisma.directions.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Cleanup code after all tests run
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.company.deleteMany({});
        yield prisma.admin.deleteMany({});
        yield prisma.directions.deleteMany({});
        yield prisma.$disconnect();
    }));
    it('Should register a company succesfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const name = 'Test Company';
        const phone = '1234567890';
        const email = `company-${Date.now()}@test.com`;
        const address = '123 Test St, Test City, TS 12345';
        const password = 'securePassword';
        const directions = yield (0, registerDirections_1.registerDirections)(address, 'Test City', 'TS', '12345');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        if (!admin || typeof admin.adminID !== 'number') {
            throw new Error('Failed to register admin or invalid adminID');
        }
        const Company = yield (0, registerCompany_1.registerCompany)(name, phone, email, password, admin.adminID, directions);
        expect(Company).toBeDefined();
        expect(Company.name).toBe(name);
        expect(Company.phone).toBe(phone);
        expect(Company.email).toBe(email);
    }));
    it('should not allow registration with existing company name', () => __awaiter(void 0, void 0, void 0, function* () {
        const name = 'Duplicate Company';
        const phone = '1234567890';
        const email1 = `duplicate1-${Date.now()}@test.com`;
        const email2 = `duplicate2-${Date.now()}@test.com`;
        const address = yield (0, registerDirections_1.registerDirections)('456 Another St, Another City, AC 67890', 'Another City', 'AC', '67890');
        const password = 'anotherSecurePassword';
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        // First registration should succeed
        yield (0, registerCompany_1.registerCompany)(name, phone, email1, password, admin.adminID, {
            address: address.address,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
        });
        // Second registration with same name should fail
        yield expect((0, registerCompany_1.registerCompany)(name, phone, email2, password, admin.adminID, {
            address: address.address,
            city: address.city,
            state: address.state,
            zipCode: address.zipCode,
        })).rejects.toThrow('Company with this name already exists');
    }));
    it('should create directions if provided', () => __awaiter(void 0, void 0, void 0, function* () {
        const name = 'Direction Test Company';
        const phone = '5555555555';
        const email = `direction-${Date.now()}@test.com`;
        const password = 'directionPassword';
        const directions = yield (0, registerDirections_1.registerDirections)('789 Direction St, Direction City, DC 11223', 'Direction City', 'DC', '11223');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        const company = yield (0, registerCompany_1.registerCompany)(name, phone, email, password, admin.adminID, directions);
        const fetchedDirections = yield prisma.directions.findFirst({
            where: { companyID: company.companyID },
        });
        expect(fetchedDirections).toBeDefined();
        expect(fetchedDirections === null || fetchedDirections === void 0 ? void 0 : fetchedDirections.address).toBe(directions.address);
        expect(fetchedDirections === null || fetchedDirections === void 0 ? void 0 : fetchedDirections.city).toBe(directions.city);
        expect(fetchedDirections === null || fetchedDirections === void 0 ? void 0 : fetchedDirections.state).toBe(directions.state);
        expect(fetchedDirections === null || fetchedDirections === void 0 ? void 0 : fetchedDirections.zipCode).toBe(directions.zipCode);
    }));
    it('should throw error if required fields are missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const name = '';
        const phone = '1234567890';
        const email = `incomplete-${Date.now()}@test.com`;
        const address = yield (0, registerDirections_1.registerDirections)('000 Incomplete St, Incomplete City, IC 00000', 'Incomplete City', 'IC', '00000');
        const password = 'password';
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        yield expect((0, registerCompany_1.registerCompany)(name, phone, email, password, admin.adminID, address)).rejects.toThrow('Name, phone, password and directions are required');
    }));
});
