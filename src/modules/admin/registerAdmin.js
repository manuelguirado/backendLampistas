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
exports.default = registerAdmin;
const prisma_1 = require("../../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
const hashPassword_1 = require("../../utils/hash/hashPassword");
function registerAdmin(email, password, requesterId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        // ✅ Verificar que no existe ya como admin
        const existingAdmin = yield prisma.admin.findUnique({
            where: { email },
        });
        if (existingAdmin) {
            throw new Error('Admin already exists');
        }
        // ✅ Verificar que el email no esté en uso en NINGUNA tabla
        const [existingUser, existingCompany, existingWorker] = yield Promise.all([
            prisma.user.findUnique({ where: { email } }),
            prisma.company.findUnique({ where: { email } }),
            prisma.worker.findUnique({ where: { email } }),
        ]);
        if (existingUser || existingCompany || existingWorker) {
            throw new Error('User with this email already exists');
        }
        // ✅ Verificar que quien hace la request es admin (si se proporciona requesterId)
        if (requesterId) {
            const requester = yield prisma.admin.findUnique({
                where: { adminID: requesterId },
            });
            if (!requester) {
                throw new Error('Only existing admins can create new admins');
            }
        }
        // ✅ Hash password y crear admin
        const hashedPassword = yield (0, hashPassword_1.hashPassword)(password);
        const admin = yield prisma.admin.create({
            data: {
                email,
                password: hashedPassword,
                role: 'ADMIN', // Explícito
            },
        });
        return admin;
    });
}
