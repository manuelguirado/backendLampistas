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
const prisma_1 = require("../generated/prisma");
const adminLogin_1 = require("../src/modules/admin/adminLogin");
const hashPassword_1 = require("../src/utils/hash/hashPassword");
const prisma = new prisma_1.PrismaClient();
describe('adminLogin', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Limpiar todas las tablas
        yield prisma.admin.deleteMany({});
        yield prisma.user.deleteMany({});
        yield prisma.worker.deleteMany({});
        yield prisma.company.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield prisma.admin.deleteMany({});
        yield prisma.user.deleteMany({});
        yield prisma.worker.deleteMany({});
        yield prisma.company.deleteMany({});
        yield prisma.$disconnect();
    }));
    it('should login admin successfully with correct credentials', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = `admin-login-test-${Date.now()}@example.com`;
        const password = 'adminPassword123';
        const hashedPassword = yield (0, hashPassword_1.hashPassword)(password);
        // ✅ CREAR admin primero
        yield prisma.admin.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
        // ✅ LUEGO intentar login
        const result = yield (0, adminLogin_1.adminLogin)(email, password);
        expect(result).toBeDefined();
        expect(result.email).toBe(email);
    }));
    it('should throw error when admin does not exist', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = `nonexisting-admin-${Date.now()}@example.com`;
        const password = 'adminPassword123';
        yield expect((0, adminLogin_1.adminLogin)(email, password)).rejects.toThrow('Admin does not exist');
    }));
    it('should throw error with incorrect password', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = `admin-wrong-pass-${Date.now()}@example.com`;
        const correctPassword = 'adminPassword123';
        const wrongPassword = 'wrongPassword';
        const hashedPassword = yield (0, hashPassword_1.hashPassword)(correctPassword);
        // ✅ Crear admin
        yield prisma.admin.create({
            data: {
                email,
                password: hashedPassword,
            },
        });
        // ✅ Intentar login con password incorrecta
        yield expect((0, adminLogin_1.adminLogin)(email, wrongPassword)).rejects.toThrow('Invalid password');
    }));
    it('should throw error if email is registered by another role', () => __awaiter(void 0, void 0, void 0, function* () {
        const email = `role-conflict-${Date.now()}@example.com`;
        const password = 'password123';
        const hashedPassword = yield (0, hashPassword_1.hashPassword)(password);
        // ✅ Crear USER primero
        yield prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: 'USER',
            },
        });
        // ✅ Intentar login como ADMIN
        yield expect((0, adminLogin_1.adminLogin)(email, password)).rejects.toThrow('Unauthorized - Invalid role');
    }));
});
