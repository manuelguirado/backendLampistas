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
exports.registerWorker = registerWorker;
const prisma_1 = require("../../../generated/prisma");
const hashPassword_1 = require("../../utils/hash/hashPassword");
const prisma = new prisma_1.PrismaClient();
function registerWorker(email, password, name, companyID) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!email || !password || !name || !companyID) {
            throw new Error('Email, password, name and companyID are required');
        }
        const existingWorker = yield prisma.worker.findUnique({
            where: { email },
        });
        if (existingWorker) {
            throw new Error('Worker already exists');
        }
        const hashedPassword = yield (0, hashPassword_1.hashPassword)(password);
        const worker = yield prisma.worker.create({
            data: {
                email,
                password: hashedPassword,
                name,
                companyID,
            },
        });
        return worker;
    });
}
