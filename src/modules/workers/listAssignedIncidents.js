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
exports.listAssignedIncidents = listAssignedIncidents;
const prisma_1 = require("../../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
function listAssignedIncidents(workerid) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!workerid) {
            throw new Error('Worker ID is required');
        }
        const company = yield prisma.company.findFirst({
            where: { workers: { some: { workerid: workerid } } },
        });
        if (!company) {
            throw new Error('Worker does not belong to any company');
        }
        const worker = yield prisma.worker.findUnique({
            where: { workerid: workerid },
        });
        if (!worker) {
            throw new Error('Worker not found');
        }
        const incidents = yield prisma.incidents.findMany({
            where: { assignedWorkerID: workerid },
        });
        if (!incidents || incidents.length === 0) {
            return [];
        }
        const mappedIncidents = incidents.map((incident) => ({
            incidentID: incident.IncidentsID,
            title: incident.title,
            description: incident.description,
            dateReported: incident.createdAt,
            status: incident.status,
            companyID: incident.companyID,
            reportedByUserID: incident.userID,
            assignedWorkerID: incident.assignedWorkerID,
        }));
        return mappedIncidents;
    });
}
