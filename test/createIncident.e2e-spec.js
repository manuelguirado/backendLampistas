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
const createIncident_1 = require("../src/modules/incidents/createIncident");
const registerCompany_1 = require("../src/modules/companies/registerCompany");
const userRegister_1 = require("../src/modules/users/userRegister");
const registerDirections_1 = require("../src/modules/directions/registerDirections");
const registerAdmin_1 = __importDefault(require("../src/modules/admin/registerAdmin"));
const prisma = new prisma_1.PrismaClient();
jest.mock('uuid', () => ({
    v4: () => 'test-uuid',
}));
describe('createIncident', () => {
    jest.setTimeout(20000); // 20 segundos para cada test
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // ✅ Limpiar en orden correcto (dependencias primero)
        yield prisma.incidents.deleteMany({});
        yield prisma.user.deleteMany({});
        yield prisma.directions.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.admin.deleteMany({});
        yield prisma.company.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // ✅ Cleanup final
        yield prisma.incidents.deleteMany({});
        yield prisma.user.deleteMany({});
        yield prisma.directions.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.admin.deleteMany({});
        yield prisma.company.deleteMany({});
        yield prisma.$disconnect();
    }));
    it('should create an incident successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        // ✅ Crear company
        const directions = yield (0, registerDirections_1.registerDirections)('123 Test St, Test City, TS 12345', 'Test City', 'TS', '12345');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        const company = yield (0, registerCompany_1.registerCompany)('company test', '1234567890', `company-test-${Date.now()}@example.com`, 'pasword123', admin.adminID, directions);
        // ✅ Verificar que company se creó
        expect(company).toBeDefined();
        expect(company.companyID).toBeDefined();
        // ✅ Crear user
        const user = yield (0, userRegister_1.userRegister)(`user-test-${Date.now()}@example.com`, 'userPassword', 'Test User');
        // ✅ Verificar que user se creó
        expect(user).toBeDefined();
        expect(user.userID).toBeDefined();
        // ✅ Crear incident
        const incident = yield (0, createIncident_1.createIncident)('My boiler is not working', 'Details of the issue...', user.userID, company.companyID, 'URGENT', 'HIGH', true);
        // ✅ Verificar resultado
        expect(incident).toBeDefined();
        expect(incident.title).toBe('My boiler is not working');
        expect(incident.description).toBe('Details of the issue...');
        expect(incident.userID).toBe(user.userID);
        expect(incident.companyID).toBe(company.companyID);
        expect(incident.status).toBe('URGENT');
        expect(incident.priority).toBe('HIGH');
        expect(incident.urgency).toBe(true);
    }));
    it('should throw error if required fields are missing', () => __awaiter(void 0, void 0, void 0, function* () {
        // ✅ Test con campos requeridos faltantes
        yield expect((0, createIncident_1.createIncident)('', // ✅ title vacío
        'Test description', 1, 1)).rejects.toThrow('Title, description, companyID, and workerID are required');
    }));
});
