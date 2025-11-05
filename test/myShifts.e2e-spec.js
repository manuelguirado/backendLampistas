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
const myShifts_1 = require("../src/modules/workers/myShifts");
const registerWorker_1 = require("../src/modules/workers/registerWorker");
const registerCompany_1 = require("../src/modules/companies/registerCompany");
const registerDirections_1 = require("../src/modules/directions/registerDirections");
const registerAdmin_1 = __importDefault(require("../src/modules/admin/registerAdmin"));
const assignShiftWorker_1 = require("../src/modules/companies/assignShiftWorker");
const prisma = new prisma_1.PrismaClient();
describe('myShifts', () => {
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
    it('should retrieve shifts assigned to a worker', () => __awaiter(void 0, void 0, void 0, function* () {
        const Directions = yield (0, registerDirections_1.registerDirections)('123 Test St, Test City, TS 12345', 'Test City', 'TS', '12345');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        const newCompany = yield (0, registerCompany_1.registerCompany)(`Shift Test Company ${Date.now()}`, '1234567890', `shift-company-${Date.now()}@example.com`, 'compPassword', admin.adminID, Directions);
        // Register a worker
        const worker = yield (0, registerWorker_1.registerWorker)(`shift-worker-${Date.now()}@example.com`, 'workerPassword', 'Shift Worker', newCompany.companyID);
        // Assign shifts to the worker
        const shiftDate1 = new Date('2024-07-01T08:00:00Z');
        const shiftType1 = 'morning';
        yield (0, assignShiftWorker_1.assignShiftWorker)(worker.workerid, shiftDate1, shiftType1);
        const shiftDate2 = new Date('2024-07-02T16:00:00Z');
        const shiftType2 = 'evening';
        yield (0, assignShiftWorker_1.assignShiftWorker)(worker.workerid, shiftDate2, shiftType2);
        // Retrieve shifts for the worker
        const shifts = yield (0, myShifts_1.myShifts)(worker.workerid);
        expect(shifts).toBeDefined();
        expect(shifts.length).toBe(2);
        const mappedShifts = shifts.map((shift) => ({
            workerID: shift.workerID,
            shiftSchedule: shift.shiftSchedule,
            shiftType: shift.shiftType,
        }));
        expect(mappedShifts).toEqual(expect.arrayContaining([
            expect.objectContaining({
                workerID: worker.workerid,
                shiftSchedule: shiftDate1,
                shiftType: shiftType1,
            }),
            expect.objectContaining({
                workerID: worker.workerid,
                shiftSchedule: shiftDate2,
                shiftType: shiftType2,
            }),
        ]));
    }));
});
