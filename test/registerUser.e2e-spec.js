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
Object.defineProperty(exports, "__esModule", { value: true });
const userRegister_1 = require("../src/modules/users/userRegister");
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
jest.mock('uuid', () => ({
    v4: () => 'test-uuid',
}));
describe('userRegister', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up test data before each test
        yield prisma.user.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up and disconnect after all tests
        yield prisma.user.deleteMany({
            where: {
                email: {
                    contains: 'test',
                },
            },
        });
        yield prisma.$disconnect();
    }));
    it('should register a new user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = 'test1@example.com';
        const password = 'mySecurePassword';
        const name = 'Test User';
        yield (0, userRegister_1.userRegister)(name, email, password);
        const user = yield prisma.user.findUnique({ where: { email } });
        expect(user).not.toBeNull();
        expect(user === null || user === void 0 ? void 0 : user.email).toBe(email);
        expect(user === null || user === void 0 ? void 0 : user.password).not.toBe(password); // Should be hashed
    }));
    it('should throw an error if email or password is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        const name = 'Test User';
        yield expect((0, userRegister_1.userRegister)(name, '', 'password')).rejects.toThrow('Email and password are required');
        yield expect((0, userRegister_1.userRegister)(name, 'test2@example.com', '')).rejects.toThrow('Email and password are required');
    }));
    it('should throw an error if user already exists', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = 'test3@example.com';
        const password = 'mySecurePassword';
        const name = 'Test User';
        // First registration should succeed
        yield (0, userRegister_1.userRegister)(name, email, password);
        // Second registration should fail
        yield expect((0, userRegister_1.userRegister)(name, email, password)).rejects.toThrow('User already exists');
    }));
});
