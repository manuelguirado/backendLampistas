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
exports.companyLogin = companyLogin;
const prisma_1 = require("../../../generated/prisma");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma = new prisma_1.PrismaClient();
const MAX_ATTEMPTS = 3;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes in milliseconds
const loginAttempts = new Map();
function companyLogin(email, password) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!email || !password)
            throw new Error('Email and password are required');
        const now = Date.now();
        const attempt = loginAttempts.get(email);
        if (attempt && attempt.lockUntil && attempt.lockUntil > now) {
            throw new Error('Account locked. Try again later');
        }
        const user = yield prisma.user.findUnique({ where: { email } });
        if (user && user.role !== 'COMPANY') {
            throw new Error('Unauthorized - Invalid role');
        }
        const company = yield prisma.company.findUnique({ where: { email } });
        if (!company) {
            throw new Error('Company not found');
        }
        const passwordIsValid = yield bcryptjs_1.default.compare(password, company.password);
        if (!passwordIsValid) {
            const count = attempt ? attempt.count + 1 : 1;
            let lockUntil = 0;
            if (count >= MAX_ATTEMPTS) {
                lockUntil = now + LOCK_TIME;
            }
            loginAttempts.set(email, { count, lockUntil });
            if (lockUntil)
                throw new Error('Account locked. Try again later');
            throw new Error('Invalid password');
        }
        // Login correcto: resetea contador
        loginAttempts.delete(email);
        return company;
    });
}
