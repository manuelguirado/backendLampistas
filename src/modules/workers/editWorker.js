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
exports.editWorker = editWorker;
const prisma_1 = require("../../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
function editWorker(workerID, update) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!workerID || !update) {
            throw new Error('workerID and update data are required');
        }
        const existingWorker = yield prisma.worker.findUnique({
            where: { workerid: workerID },
        });
        if (!existingWorker) {
            throw new Error('Worker not found');
        }
        const updateWorker = yield prisma.worker.update({
            where: { workerid: workerID },
            data: update,
        });
        return updateWorker;
    });
}
