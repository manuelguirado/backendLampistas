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
const registerWorker_1 = require("../src/modules/workers/registerWorker");
const assignShiftWorker_1 = require("../src/modules/companies/assignShiftWorker");
const registerCompany_1 = require("../src/modules/companies/registerCompany");
const registerDirections_1 = require("../src/modules/directions/registerDirections");
const registerAdmin_1 = __importDefault(require("../src/modules/admin/registerAdmin"));
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
describe('assignShiftWorker', () => {
    jest.setTimeout(20000);
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$connect();
        yield prisma.shiftSchedule.deleteMany({});
        yield prisma.worker.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.company.deleteMany({});
        yield prisma.admin.deleteMany({});
        yield prisma.directions.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.shiftSchedule.deleteMany({});
        yield prisma.worker.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.company.deleteMany({});
        yield prisma.admin.deleteMany({});
        yield prisma.directions.deleteMany({});
        yield prisma.$disconnect();
    }));
    it('should assign a shift to a worker successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const Directions = yield (0, registerDirections_1.registerDirections)('123 Test St, Test City, TS 12345', 'Test City', 'TS', '12345');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        const newCompany = yield (0, registerCompany_1.registerCompany)(`Shift Test Company ${Date.now()}`, '1234567890', `shift-company-${Date.now()}@example.com`, 'compPassword', admin.adminID, Directions);
        // Register a worker
        const worker = yield (0, registerWorker_1.registerWorker)(`shift-worker-${Date.now()}@example.com`, 'workerPassword', 'Shift Worker', newCompany.companyID);
        // Assign a shift to the worker
        const shiftDate = new Date('2024-07-01T08:00:00Z');
        const shiftType = 'morning';
        const createdShift = yield (0, assignShiftWorker_1.assignShiftWorker)(worker.workerid, shiftDate, shiftType);
        expect(createdShift).toBeDefined();
        expect(createdShift.workerID).toBe(worker.workerid);
        expect(createdShift.shiftType).toBe(shiftType);
    }));
});
