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
exports.assignShiftWorker = assignShiftWorker;
const prisma_1 = require("../../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
function assignShiftWorker(workerID, shiftSchedule, shiftType) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!workerID || !shiftSchedule || !shiftType) {
            throw new Error('shiftID, workerID, shiftSchedule and shiftType are required');
        }
        const worker = yield prisma.worker.findUnique({
            where: { workerid: workerID },
        });
        if (!worker) {
            throw new Error('Worker does not exist');
        }
        const assignedShift = yield prisma.shiftSchedule.create({
            data: {
                workerID,
                shiftSchedule,
                shiftType,
            },
        });
        return assignedShift;
    });
}
