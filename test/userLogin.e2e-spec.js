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
const hashPassword_1 = require("./../src/utils/hash/hashPassword");
const userLogin_1 = require("../src/modules/users/userLogin");
const prisma_1 = require("../generated/prisma");
jest.mock('uuid', () => ({
    v4: () => 'test-uuid',
}));
const prisma = new prisma_1.PrismaClient();
describe('userLogin', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up all test data before each test
        yield prisma.user.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up all test data and disconnect after all tests
        yield prisma.user.deleteMany({});
        yield prisma.$disconnect();
    }));
    it('should login a user succesfully with correct email and password', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = `login-test-${Date.now()}-1@example.com`;
        const password = 'mySecurePassword';
        // First, register the user
        yield prisma.user.create({
            data: {
                email,
                password: yield (0, hashPassword_1.hashPassword)(password),
            },
        });
        // Then, attempt to login
        const user = yield (0, userLogin_1.userLogin)(email, password);
        expect(user).not.toBeNull();
        expect(user.email).toBe(email);
    }));
    it('should throw an error if user does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = `nonexisting-${Date.now()}@example.com`;
        const password = 'mySecurePassword';
        yield expect((0, userLogin_1.userLogin)(email, password)).rejects.toThrow('User does not exist');
    }));
    it('should throw an error if password is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = `login-test-${Date.now()}-2@example.com`;
        const correctPassword = 'mySecurePassword';
        const wrongPassword = 'wrongPassword';
        // First, register the user
        yield prisma.user.create({
            data: {
                email,
                password: yield (0, hashPassword_1.hashPassword)(correctPassword),
            },
        });
        // Then, attempt to login with wrong password
        yield expect((0, userLogin_1.userLogin)(email, wrongPassword)).rejects.toThrow('Invalid password');
    }));
    it('should throw an error if user role is not USER', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = `login-test-${Date.now()}-3@example.com`;
        const password = 'mySecurePassword';
        // First, register the user
        yield prisma.user.create({
            data: {
                email,
                password: yield (0, hashPassword_1.hashPassword)(password),
                role: 'ADMIN',
            },
        });
        // Then, attempt to login
        yield expect((0, userLogin_1.userLogin)(email, password)).rejects.toThrow('Unauthorized');
    }));
    it('should lock the user out after 3 failed attempts', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = `login-test-${Date.now()}-4@example.com`;
        const correctPassword = 'mySecurePassword';
        const wrongPassword = 'wrongPassword';
        // First, register the user
        yield prisma.user.create({
            data: {
                email,
                password: yield (0, hashPassword_1.hashPassword)(correctPassword),
            },
        });
        // Primeros dos intentos: Invalid password
        for (let i = 0; i < 2; i++) {
            yield expect((0, userLogin_1.userLogin)(email, wrongPassword)).rejects.toThrow('Invalid password');
        }
        // Tercer intento: Account locked
        yield expect((0, userLogin_1.userLogin)(email, wrongPassword)).rejects.toThrow('Account locked. Try again later');
        // Cuarto intento (seguido): también Account locked
        yield expect((0, userLogin_1.userLogin)(email, wrongPassword)).rejects.toThrow('Account locked. Try again later');
    }));
});
