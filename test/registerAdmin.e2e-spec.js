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
const registerAdmin_1 = __importDefault(require("../src/modules/admin/registerAdmin"));
const hashPassword_1 = require("../src/utils/hash/hashPassword");
const userRegister_1 = require("../src/modules/users/userRegister");
jest.mock('uuid', () => ({
    v4: () => 'test-uuid',
}));
const prisma = new prisma_1.PrismaClient();
describe('registerAdmin', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up all test data before each test
        yield prisma.admin.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up all test data and disconnect after all tests
        yield prisma.admin.deleteMany({});
        yield prisma.$disconnect();
    }));
    it('should register an admin succesfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = `register-admin-test-${Date.now()}@example.com`;
        const password = 'adminPassword123';
        const admin = yield (0, registerAdmin_1.default)(email, password);
        expect(admin).toBeDefined();
        expect(admin.email).toBe(email);
    }));
    it('should throw an error if admin with the same email already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = `existing-admin-${Date.now()}@example.com`;
        const password = 'adminPassword123';
        // First, create an admin directly in the database
        yield prisma.admin.create({
            data: {
                email,
                password: yield (0, hashPassword_1.hashPassword)(password),
            },
        });
        // Then, attempt to register with the same email
        yield expect((0, registerAdmin_1.default)(email, password)).rejects.toThrow('Admin already exists');
    }));
    it('should throw an error if email or password is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = '';
        const password = 'adminPassword123';
        yield expect((0, registerAdmin_1.default)(email, password)).rejects.toThrow('Email and password are required');
        const email2 = `missing-password-${Date.now()}@example.com`;
        const password2 = '';
        yield expect((0, registerAdmin_1.default)(email2, password2)).rejects.toThrow('Email and password are required');
    }));
    it('should throw an error if another user with the same email exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = `conflict-user-${Date.now()}@example.com`;
        const password = 'somePassword123';
        const name = 'Conflict User';
        // First, create a regular user with the email
        yield (0, userRegister_1.userRegister)(name, email, password);
        // Then, attempt to register an admin with the same email
        yield expect((0, registerAdmin_1.default)(email, password)).rejects.toThrow('User with this email already exists');
    }));
});
