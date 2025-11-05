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
const prisma_1 = require("./../generated/prisma");
const registerDirections_1 = require("../src/modules/directions/registerDirections");
const eliminateWorker_1 = require("../src/modules/workers/eliminateWorker");
const registerCompany_1 = require("../src/modules/companies/registerCompany");
const registerWorker_1 = require("../src/modules/workers/registerWorker");
const registerAdmin_1 = __importDefault(require("../src/modules/admin/registerAdmin"));
jest.mock('uuid', () => ({
    v4: () => 'test-uuid',
}));
const prisma = new prisma_1.PrismaClient();
describe('eliminateWorker', () => {
    jest.setTimeout(20000); // 20 segundos para cada test
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up all test data before tests
        yield prisma.$connect();
        yield prisma.worker.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.company.deleteMany({});
        yield prisma.admin.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up all test data and disconnect after all tests
        yield prisma.worker.deleteMany({});
        yield prisma.adminsCompanies.deleteMany({});
        yield prisma.company.deleteMany({});
        yield prisma.admin.deleteMany({});
        yield prisma.$disconnect();
    }));
    it('should eliminate an existing worker successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        // First, register a company to associate the worker with
        const directions = yield (0, registerDirections_1.registerDirections)('123 Test St, Test City, TS 12345', 'Test City', 'TS', '12345');
        const admin = yield (0, registerAdmin_1.default)(`admin-${Date.now()}@test.com`, 'adminPassword');
        const company = yield (0, registerCompany_1.registerCompany)('Test Company', '1234567890', 'test@company.com', 'securePassword', admin.adminID, directions);
        // Then, create a worker for that company
        const worker = yield (0, registerWorker_1.registerWorker)('John', 'Doe', 'john.doe@example.com', company.companyID);
        // Now, eliminate the worker
        const response = yield (0, eliminateWorker_1.eliminateWorker)(worker.workerid);
        expect(response).toEqual({ message: 'Worker deleted successfully' });
        // Verify the worker is actually deleted
        const deletedWorker = yield prisma.worker.findUnique({
            where: { workerid: worker.workerid },
        });
        expect(deletedWorker).toBeNull();
    }));
    it('should throw an error when trying to eliminate a non-existing worker', () => __awaiter(void 0, void 0, void 0, function* () {
        const nonExistingWorkerId = 99999; // Assuming this ID does not exist
        yield expect((0, eliminateWorker_1.eliminateWorker)(nonExistingWorkerId)).rejects.toThrow('Worker not found');
    }));
    it('should throw an error when workerid is not provided', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, eliminateWorker_1.eliminateWorker)(9010)).rejects.toThrow('Worker not found');
    }));
});
