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
const verifyPassword_1 = require("../src/utils/hash/verifyPassword");
const hashPassword_1 = require("../src/utils/hash/hashPassword");
const prisma_1 = require("../generated/prisma");
const prisma = new prisma_1.PrismaClient();
describe('verifyPassword', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up all test data before each test
        yield prisma.user.deleteMany({});
    }));
    afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up all test data after each test
        yield prisma.user.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Disconnect after all tests
        yield prisma.$disconnect();
    }));
    it('should return true for correct password', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = `verify-test-${Date.now()}-1@example.com`;
        const password = 'mySecurePassword';
        // Create a user directly in the database
        const hashedPassword = yield (0, hashPassword_1.hashPassword)(password);
        yield prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
        // Then verify the password
        const result = yield (0, verifyPassword_1.verifyPassword)(email, password);
        expect(result).toBe(true);
    }));
    it('should return false for incorrect password', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = `verify-test-${Date.now()}-2@example.com`;
        const correctPassword = 'mySecurePassword';
        const wrongPassword = 'wrongPassword';
        // Create a user directly in the database
        const hashedPassword = yield (0, hashPassword_1.hashPassword)(correctPassword);
        yield prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
        // Then verify with wrong password
        const result = yield (0, verifyPassword_1.verifyPassword)(email, wrongPassword);
        expect(result).toBe(false);
    }));
    it('should return false for non-existing user', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = `nonexisting-${Date.now()}@example.com`;
        const password = 'mySecurePassword';
        const result = yield (0, verifyPassword_1.verifyPassword)(email, password);
        expect(result).toBe(false);
    }));
});
