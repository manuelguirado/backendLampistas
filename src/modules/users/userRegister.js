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
exports.userRegister = userRegister;
const prisma_1 = require("../../../generated/prisma");
const hashPassword_1 = require("../../utils/hash/hashPassword");
const prisma = new prisma_1.PrismaClient();
function userRegister(name, email, password, CompanyID) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!email || !password) {
            throw new Error('Email and password are required');
        }
        const existingUser = yield prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new Error('User already exists');
        }
        const hashedPassword = yield (0, hashPassword_1.hashPassword)(password);
        return yield prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'USER',
                companyID: CompanyID,
            },
        });
    });
}
