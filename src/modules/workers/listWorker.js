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
exports.listWorker = listWorker;
const prisma_1 = require("../../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
function listWorker(companyID) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!companyID) {
            throw new Error('companyID is required');
        }
        const company = yield prisma.company.findUnique({
            where: { companyID },
        });
        if (!company) {
            throw new Error('Company does not exist');
        }
        const workers = yield prisma.worker.findMany({
            where: { companyID },
        });
        if (!workers) {
            return [];
        }
        const mapWorkers = workers.map((worker) => {
            return {
                workerID: worker.workerid,
                email: worker.email,
                name: worker.name,
                companyID: worker.companyID,
            };
        });
        return mapWorkers;
    });
}
