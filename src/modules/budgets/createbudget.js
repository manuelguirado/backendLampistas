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
exports.createBudget = createBudget;
const prisma_1 = require("../../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
function createBudget(incidentID, amount, description, userID, companyID, workerID, items) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!incidentID || !amount || !description || !companyID || !workerID) {
            throw new Error('All fields are required');
        }
        const foundIncident = yield prisma.incidents.findUnique({
            where: { IncidentsID: incidentID },
        });
        if (!foundIncident) {
            throw new Error('Incident not found');
        }
        const foundCompany = yield prisma.company.findUnique({
            where: { companyID },
        });
        if (!foundCompany) {
            throw new Error('Company not found');
        }
        const foundWorker = yield prisma.worker.findUnique({
            where: { workerid: workerID },
        });
        if (!foundWorker) {
            throw new Error('Worker not found');
        }
        const foundUser = yield prisma.user.findUnique({
            where: { userID },
        });
        if (!foundUser) {
            throw new Error('User not found');
        }
        const item = items ? items.join(', ') : '';
        const budget = yield prisma.budget.create({
            data: {
                incidentID,
                totalAmount: amount,
                description,
                userID: userID,
                companyID,
                workerID,
                items: item,
            },
        });
        return budget;
    });
}
