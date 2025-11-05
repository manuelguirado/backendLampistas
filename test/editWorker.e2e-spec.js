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
const editWorker_1 = require("../src/modules/workers/editWorker");
const registerWorker_1 = require("../src/modules/workers/registerWorker");
const registerCompany_1 = require("../src/modules/companies/registerCompany");
const registerDirections_1 = require("../src/modules/directions/registerDirections");
const registerAdmin_1 = __importDefault(require("../src/modules/admin/registerAdmin"));
const prisma = new prisma_1.PrismaClient();
describe('editWorker', () => {
    jest.setTimeout(20000); // 20 segundos para cada test
    let workerID;
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        //clean up the database
        yield prisma.directions.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.admin.deleteMany({});
        yield prisma.company.deleteMany({});
        yield prisma.worker.deleteMany({});
    }));
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        //clean up the database
        yield prisma.directions.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.company.deleteMany({});
        yield prisma.worker.deleteMany({});
        yield prisma.admin.deleteMany({});
        yield prisma.$disconnect();
    }));
    it('should edit a worker successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const directions = yield (0, registerDirections_1.registerDirections)('calle inventada 123, Ciudad Inventada, Estado Inventado, 12345', 'Ciudad Inventada', 'Estado Inventado', '12345');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        const company = yield (0, registerCompany_1.registerCompany)('Edit Worker Company', '1234567890', 'edit@worker.com', 'securePassword', admin.adminID, directions);
        const registeredWorker = yield (0, registerWorker_1.registerWorker)('Edit Worker', '12349809423', 'testworker', company.companyID);
        workerID = registeredWorker.workerid;
        const updates = {
            name: 'Updated Worker',
            email: 'email@test.com',
        };
        const updateWorker = yield (0, editWorker_1.editWorker)(workerID, updates);
        expect(updateWorker.name).toBe(updates.name);
        expect(updateWorker.email).toBe(updates.email);
    }));
    it('should throw an error when trying to edit a non-existing worker', () => __awaiter(void 0, void 0, void 0, function* () {
        const nonExistingWorkerID = 99999;
        yield expect((0, editWorker_1.editWorker)(nonExistingWorkerID, { name: 'Non Existing' })).rejects.toThrow('Worker not found');
    }));
    it('should throw an error when workerID is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, editWorker_1.editWorker)(undefined, { name: 'No ID' })).rejects.toThrow('workerID and update data are required');
    }));
});
