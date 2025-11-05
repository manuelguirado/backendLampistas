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
exports.adminLogin = adminLogin;
const prisma_1 = require("../../../generated/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new prisma_1.PrismaClient();
function adminLogin(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!email || !password)
            throw new Error('Email and password are required');
        const admin = yield prisma.admin.findUnique({ where: { email } });
        const [user, company, worker] = yield Promise.all([
            prisma.user.findUnique({ where: { email } }),
            prisma.company.findUnique({ where: { email } }),
            prisma.worker.findUnique({ where: { email } }),
        ]);
        if (user || company || worker) {
            throw new Error('Unauthorized - Invalid role');
        }
        if (!admin) {
            throw new Error('Admin does not exist');
        }
        const passwordIsValid = yield bcryptjs_1.default.compare(password, admin.password);
        if (user || company || worker) {
            throw new Error('Email is associated with another account type');
        }
        if (!passwordIsValid) {
            throw new Error('Invalid password');
        }
        return admin;
    });
}
