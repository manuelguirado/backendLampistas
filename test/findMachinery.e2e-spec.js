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
const findMymachinery_1 = require("../src/modules/machinery/findMymachinery");
const createMachinery_1 = require("../src/modules/machinery/createMachinery");
const prisma_1 = require("../generated/prisma");
const registerCompany_1 = require("../src/modules/companies/registerCompany");
const registerDirections_1 = require("../src/modules/directions/registerDirections");
const userRegister_1 = require("../src/modules/users/userRegister");
const registerAdmin_1 = __importDefault(require("../src/modules/admin/registerAdmin"));
const prisma = new prisma_1.PrismaClient();
describe('findMyMachinery', () => {
    jest.setTimeout(20000); // 20 segundos para cada test
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$connect();
        yield prisma.machinery.deleteMany({});
        yield prisma.directions.deleteMany({});
        yield prisma.user.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.company.deleteMany({});
        yield prisma.admin.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.machinery.deleteMany({});
        yield prisma.directions.deleteMany({});
        yield prisma.user.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.company.deleteMany({});
        yield prisma.admin.deleteMany({});
        yield prisma.$disconnect();
    }));
    it('should find machinery for a given company', () => __awaiter(void 0, void 0, void 0, function* () {
        const directions = yield (0, registerDirections_1.registerDirections)('123 Test St', 'Test City', 'TS', '12345');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        const company = yield (0, registerCompany_1.registerCompany)('Test Company', '1234567890', `company-${Date.now()}@test.com`, 'securePassword', admin.adminID, directions);
        const user = yield (0, userRegister_1.userRegister)(`user-${Date.now()}@test.com`, 'userPassword', 'Test User');
        const installedAt = Date.now() - 365 * 24 * 60 * 60 * 1000; // 1 year ago
        // Add machinery for the company
        const machinery1 = yield (0, createMachinery_1.createMachinery)('Excavator', 'caterpillar', new Date(Date.now() - 2 * 365 * 24 * 60 * 60 * 1000), // maintanceDate
        new Date(installedAt), // lastInspectionDate
        new Date(installedAt), // InstalledAT
        user.userID, // clientId
        company.name, // companyName
        'ExcavatorType', // machineType
        company.companyID);
        const machinery2 = yield (0, createMachinery_1.createMachinery)('Bulldozer', 'Komatsu', new Date('2019-01-01'), // maintanceDate
        new Date(installedAt), // lastInspectionDate
        new Date(installedAt), // InstalledAT
        user.userID, // clientId
        company.name, // companyName
        'BulldozerType', // machineType
        company.companyID);
        // Fetch machinery for the company
        const machineryList = yield (0, findMymachinery_1.findMyMachinery)(company.companyID);
        expect(machineryList.length).toBe(2);
        const machineryNames = machineryList.map((m) => m.name);
        expect(machinery1).toBeDefined();
        expect(machinery2).toBeDefined();
        expect(machineryNames).toContain('Excavator');
        expect(machineryNames).toContain('Bulldozer');
    }));
    it('should return an empty array if no machinery exists for the company', () => __awaiter(void 0, void 0, void 0, function* () {
        const directions = yield (0, registerDirections_1.registerDirections)('456 Another St', 'Another City', 'AC', '67890');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        const company = yield (0, registerCompany_1.registerCompany)('Another Company', '0987654321', `company-${Date.now()}@test.com`, 'securePassword', admin.adminID, directions);
        const machineryList = yield (0, findMymachinery_1.findMyMachinery)(company.companyID);
        expect(machineryList.length).toBe(0);
    }));
});
