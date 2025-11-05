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
const companyLogin_1 = require("../src/modules/companies/companyLogin");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new prisma_1.PrismaClient();
describe('Company login', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up all test data before each test
        yield prisma.company.deleteMany({});
        yield prisma.user.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up all test data and disconnect after all tests
        yield prisma.company.deleteMany({});
        yield prisma.user.deleteMany({});
        yield prisma.$disconnect();
    }));
    it('Should login a company successfully with correct name and password', () => __awaiter(void 0, void 0, void 0, function* () {
        const companyName = `company-login-test-${Date.now()}-1`;
        const password = 'companySecurePassword';
        const email = `company-login-test-${Date.now()}-1@example.com`;
        yield prisma.company.create({
            data: {
                name: companyName,
                email,
                password: yield bcryptjs_1.default.hash(password, 10),
                phone: '123456789',
            },
        });
        const response = yield (0, companyLogin_1.companyLogin)(email, password);
        expect(response.name).toBe(companyName);
    }));
    it('Should throw an error if company does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = `nonexisting-company-${Date.now()}@example.com`;
        const password = 'companySecurePassword';
        yield expect((0, companyLogin_1.companyLogin)(email, password)).rejects.toThrow('Company not found');
    }));
    it('Should throw an error if password is incorrect', () => __awaiter(void 0, void 0, void 0, function* () {
        const companyName = `company-login-test-${Date.now()}-2`;
        const correctPassword = 'companySecurePassword';
        const wrongPassword = 'wrongPassword';
        const email = `company-login-test-${Date.now()}-2@example.com`;
        yield prisma.company.create({
            data: {
                name: companyName,
                email,
                password: yield bcryptjs_1.default.hash(correctPassword, 10),
                phone: '123456789',
            },
        });
        yield expect((0, companyLogin_1.companyLogin)(email, wrongPassword)).rejects.toThrow('Invalid password');
    }));
    it('Should throw an error if the company doesnt exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const password = 'companySecurePassword';
        const email = `company-login-test-${Date.now()}-3@example.com`;
        // Then, attempt to login
        yield expect((0, companyLogin_1.companyLogin)(email, password)).rejects.toThrow('Company not found');
    }));
    it('Should throw an error if user role is not COMPANY', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = `user-login-test-${Date.now()}-3@example.com`;
        const password = 'userSecurePassword';
        // First, register the user
        yield prisma.user.create({
            data: {
                email,
                password: yield bcryptjs_1.default.hash(password, 10),
                role: 'USER',
            },
        });
        // Then, attempt to login
        yield expect((0, companyLogin_1.companyLogin)(email, password)).rejects.toThrow('Unauthorized - Invalid role');
    }));
    it('Should lock the company out after 3 failed attempts', () => __awaiter(void 0, void 0, void 0, function* () {
        const companyName = `company-login-test-${Date.now()}-4`;
        const correctPassword = 'companySecurePassword';
        const wrongPassword = 'wrongPassword';
        const email = `company-login-test-${Date.now()}-4@example.com`;
        yield prisma.company.create({
            data: {
                name: companyName,
                email,
                password: yield bcryptjs_1.default.hash(correctPassword, 10),
                phone: '123456789',
            },
        });
        // Primeros dos intentos: Invalid password
        for (let i = 0; i < 2; i++) {
            yield expect((0, companyLogin_1.companyLogin)(email, wrongPassword)).rejects.toThrow('Invalid password');
        }
        // Tercer intento: Account locked
        yield expect((0, companyLogin_1.companyLogin)(email, wrongPassword)).rejects.toThrow('Account locked. Try again later');
        // Cuarto intento (seguido): también Account locked
        yield expect((0, companyLogin_1.companyLogin)(email, wrongPassword)).rejects.toThrow('Account locked. Try again later');
    }));
});
