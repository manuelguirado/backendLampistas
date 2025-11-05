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
exports.eliminateWorker = eliminateWorker;
const prisma_1 = require("../../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
function eliminateWorker(workerid) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!workerid) {
            throw new Error('workerid is required');
        }
        const existingWorker = yield prisma.worker.findUnique({
            where: { workerid: workerid },
        });
        if (!existingWorker) {
            throw new Error('Worker not found');
        }
        yield prisma.worker.delete({
            where: { workerid: workerid },
        });
        return { message: 'Worker deleted successfully' };
    });
}
