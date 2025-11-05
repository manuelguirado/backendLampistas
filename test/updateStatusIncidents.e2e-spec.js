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
const userRegister_1 = require("../src/modules/users/userRegister");
const createIncident_1 = require("../src/modules/incidents/createIncident");
const updateStatusIncident_1 = require("../src/modules/workers/updateStatusIncident");
const registerCompany_1 = require("../src/modules/companies/registerCompany");
const registerDirections_1 = require("../src/modules/directions/registerDirections");
const registerAdmin_1 = __importDefault(require("../src/modules/admin/registerAdmin"));
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
describe('Update Status Incidents', () => {
    jest.setTimeout(20000); // 20 segundos para cada test
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$connect();
        yield prisma.incidents.deleteMany({});
        yield prisma.user.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.company.deleteMany({});
        yield prisma.admin.deleteMany({});
        yield prisma.directions.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.incidents.deleteMany({});
        yield prisma.user.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.company.deleteMany({});
        yield prisma.admin.deleteMany({});
        yield prisma.directions.deleteMany({});
        yield prisma.$disconnect();
    }));
    it('should update the status of an incident', () => __awaiter(void 0, void 0, void 0, function* () {
        // First, register necessary entities: Directions, Admin, Company, Worker
        const directions = yield (0, registerDirections_1.registerDirections)('123 Test St', 'Test City', 'TS', '12345');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        const company = yield (0, registerCompany_1.registerCompany)('Test Company', '1234567890', `company-${Date.now()}@test.com`, 'securePassword', admin.adminID, directions);
        const user = yield (0, userRegister_1.userRegister)(`user-${Date.now()}@test.com`, 'userPassword', 'Test User');
        // Create an incident
        const incident = yield (0, createIncident_1.createIncident)('Test Incident', 'This is a test incident', user.userID, company.companyID, 'HIGH');
        // Update the status of the incident
        const updatedIncident = yield (0, updateStatusIncident_1.updateStatusIncident)(incident.IncidentsID, 'IN_PROGRESS');
        expect(updatedIncident).toBeDefined();
        expect(updatedIncident.status).toBe('IN_PROGRESS');
    }));
});
