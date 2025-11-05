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
const supertest_1 = __importDefault(require("supertest"));
const userRegister_1 = require("../modules/users/userRegister");
const prisma_1 = require("../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
describe('UserController', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$connect();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.$disconnect();
    }));
    it('should register a user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const request = (0, supertest_1.default)('http://localhost:3000/user/userRegister');
        const name = 'Test User';
        const email = `testuser-${Date.now()}@example.com`;
        const password = 'securePassword';
        const response = yield request
            .post('')
            .send({ name, email, password })
            .expect(201);
        expect(response.body).toBeDefined();
    }));
    it('should login a user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = `loginuser-${Date.now()}@example.com`;
        const password = 'securePassword';
        // First, register the user
        yield (0, userRegister_1.userRegister)('Login User', email, password);
        // Then, attempt to login
        const request = (0, supertest_1.default)('http://localhost:3000/user/userLogin');
        const response = yield request
            .post('')
            .send({ email, password })
            .expect(200);
        expect(response.body).toBeDefined();
        expect(Array.isArray(response.body)).toBe(false);
    }));
    it('should create an incident successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, userRegister_1.userRegister)(`incidentuser-${Date.now()}@example.com`, 'incidentPassword', 'Incident User');
        const request = (0, supertest_1.default)('http://localhost:3000/incidents/createIncident');
        const title = 'Test Incident';
        const description = 'This is a test incident';
        const machineryID = 1;
        const response = yield request
            .post('')
            .send({
            title,
            description,
            machineryID,
            userID: user.userID,
        })
            .expect(201);
        expect(response.body).toBeDefined();
        expect(Array.isArray(response.body)).toBe(false);
    }));
    it('should find machinery for a user successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, userRegister_1.userRegister)(`machineryuser-${Date.now()}@example.com`, 'machineryPassword', 'Machinery User');
        const request = (0, supertest_1.default)('http://localhost:3000/user/userMachinery');
        const response = yield request
            .get('')
            .send({ userID: user.userID })
            .expect(200);
        expect(response.body).toBeDefined();
        expect(Array.isArray(response.body)).toBe(true);
    }));
});
