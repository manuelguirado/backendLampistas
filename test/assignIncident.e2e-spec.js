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
const assignIncident_1 = require("../src/modules/incidents/assignIncident");
const registerWorker_1 = require("../src/modules/workers/registerWorker");
const userRegister_1 = require("../src/modules/users/userRegister");
const registerDirections_1 = require("../src/modules/directions/registerDirections");
const registerCompany_1 = require("../src/modules/companies/registerCompany");
const registerAdmin_1 = __importDefault(require("../src/modules/admin/registerAdmin"));
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
describe('assignIncident', () => {
    jest.setTimeout(20000); // 20 segundos para cada test
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // ✅ Limpiar en orden correcto (dependencias primero)
        yield prisma.incidents.deleteMany({});
        yield prisma.worker.deleteMany({});
        yield prisma.user.deleteMany({});
        yield prisma.directions.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.company.deleteMany({});
        yield prisma.admin.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // ✅ Cleanup final
        yield prisma.incidents.deleteMany({});
        yield prisma.worker.deleteMany({});
        yield prisma.user.deleteMany({});
        yield prisma.directions.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.company.deleteMany({});
        yield prisma.admin.deleteMany({});
        yield prisma.$disconnect();
    }));
    it('should assign an incident to a worker successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        // ✅ Crear company
        const directions = yield (0, registerDirections_1.registerDirections)('123 Test St, Test City, TS 12345', 'Test City', 'TS', '12345');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        const company = yield (0, registerCompany_1.registerCompany)('company test', '1234567890', `company-test-${Date.now()}@example.com`, 'pasword123', admin.adminID, directions);
        // ✅ Crear usuario
        const user = yield (0, userRegister_1.userRegister)(`user-${Date.now()}@example.com`, 'userPassword', 'Test User');
        // ✅ Crear worker
        const worker = yield (0, registerWorker_1.registerWorker)(`worker-${Date.now()}@example.com`, 'workerPassword', 'Worker Name', company.companyID);
        // ✅ Crear incidente
        const incident = yield prisma.incidents.create({
            data: {
                title: 'Test Incident',
                description: 'Incident details',
                userID: user.userID,
                companyID: company.companyID,
                status: 'OPEN',
                priority: 'MEDIUM',
                urgency: false,
            },
        });
        // ✅ Asignar incidente al worker
        yield (0, assignIncident_1.assignIncident)(incident.IncidentsID, worker.workerid);
        const updatedIncident = yield prisma.incidents.findUnique({
            where: { IncidentsID: incident.IncidentsID },
        });
        // ✅ Verificar resultado
        expect(updatedIncident).toBeDefined();
        expect(updatedIncident === null || updatedIncident === void 0 ? void 0 : updatedIncident.assignedWorkerID).toBe(worker.workerid);
    }));
});
it('should throw an error when assigning to a non-existent worker', () => __awaiter(void 0, void 0, void 0, function* () {
    // ✅ Crear company
    const directions = yield (0, registerDirections_1.registerDirections)('123 Test St, Test City, TS 12345', 'Test City', 'TS', '12345');
    const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
    const company = yield (0, registerCompany_1.registerCompany)('company test', '1234567890', `company-test-${Date.now()}@example.com`, 'pasword123', admin.adminID, directions);
    // ✅ Crear usuario
    const user = yield (0, userRegister_1.userRegister)(`user-${Date.now()}@example.com`, 'userPassword', 'Test User');
    // ✅ Crear incidente
    const incident = yield prisma.incidents.create({
        data: {
            title: 'Test Incident',
            description: 'Incident details',
            userID: user.userID,
            companyID: company.companyID,
            status: 'OPEN',
            priority: 'MEDIUM',
            urgency: false,
        },
    });
    // ✅ Intentar asignar incidente a un worker inexistente
    yield expect((0, assignIncident_1.assignIncident)(incident.IncidentsID, 9999)).rejects.toThrow('Worker not found');
}));
