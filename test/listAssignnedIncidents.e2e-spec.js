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
const createIncident_1 = require("../src/modules/incidents/createIncident");
const userRegister_1 = require("../src/modules/users/userRegister");
const registerAdmin_1 = __importDefault(require("../src/modules/admin/registerAdmin"));
const registerCompany_1 = require("../src/modules/companies/registerCompany");
const registerDirections_1 = require("../src/modules/directions/registerDirections");
const prisma_1 = require("../generated/prisma");
const registerWorker_1 = require("../src/modules/workers/registerWorker");
const listAssignedIncidents_1 = require("../src/modules/workers/listAssignedIncidents");
const prisma = new prisma_1.PrismaClient();
describe('List Assigned Incidents', () => {
    jest.setTimeout(20000); // 20 segundos para cada test
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Setup code before all tests run
        yield prisma.$connect();
        yield prisma.incidents.deleteMany({});
        yield prisma.worker.deleteMany({});
        yield prisma.directions.deleteMany({});
        yield prisma.user.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.admin.deleteMany({});
        yield prisma.company.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Cleanup code after all tests run
        yield prisma.incidents.deleteMany({});
        yield prisma.worker.deleteMany({});
        yield prisma.directions.deleteMany({});
        yield prisma.user.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.admin.deleteMany({});
        yield prisma.company.deleteMany({});
        yield prisma.$disconnect();
    }));
    it('should list assigned incidents for a worker', () => __awaiter(void 0, void 0, void 0, function* () {
        // Register admin
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        // Register company
        const directions = yield (0, registerDirections_1.registerDirections)('123 Test St', 'Test City', 'TS', '12345');
        const company = yield (0, registerCompany_1.registerCompany)('Test Company', '1234567890', `company-${Date.now()}@test.com`, 'securePassword', admin.adminID, directions);
        // Register user
        const user = yield (0, userRegister_1.userRegister)(`worker-${Date.now()}@test.com`, 'workerPassword', 'Test Worker');
        // Assign worker to company with unique email
        const uniqueWorkerEmail = `worker1-${Date.now()}@test.com`;
        const worker = yield (0, registerWorker_1.registerWorker)(uniqueWorkerEmail, 'superSecurePassword', 'Worker One', company.companyID);
        // Create incident
        const incident = yield (0, createIncident_1.createIncident)('Incident Title', 'Incident Description', user.userID, company.companyID, 'OPEN', 'HIGH');
        // Assign incident to worker
        yield prisma.incidents.update({
            where: { IncidentsID: incident.IncidentsID },
            data: {
                assignedWorkerID: worker.workerid,
            },
        });
        // List assigned incidents
        const assignedIncidents = yield (0, listAssignedIncidents_1.listAssignedIncidents)(worker.workerid);
        expect(assignedIncidents).toBeDefined();
        expect(assignedIncidents.length).toBe(1);
        expect(assignedIncidents[0].incidentID).toBe(incident.IncidentsID);
    }));
    it('should return empty list if no incidents assigned', () => __awaiter(void 0, void 0, void 0, function* () {
        // Register admin
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        // Register company
        const directions = yield (0, registerDirections_1.registerDirections)('123 Test St', 'Test City', 'TS', '12345');
        const company = yield (0, registerCompany_1.registerCompany)('Test_Company', '1234567890', `company-${Date.now()}@test.com`, 'securePassword', admin.adminID, directions);
        // Register worker with unique email
        const uniqueWorkerEmail = `worker2-${Date.now()}@test.com`;
        const worker = yield (0, registerWorker_1.registerWorker)(uniqueWorkerEmail, 'superSecurePassword', 'Worker One', company.companyID);
        // List assigned incidents
        const assignedIncidents = yield (0, listAssignedIncidents_1.listAssignedIncidents)(worker.workerid);
        expect(assignedIncidents).toBeDefined();
        expect(assignedIncidents.length).toBe(0);
    }));
});
