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
exports.assignIncident = assignIncident;
const prisma_1 = require("../../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
function assignIncident(incidentID, workerID) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!incidentID || !workerID) {
            throw new Error('Incident ID and Worker ID are required');
        }
        // Verificar que la incidencia existe
        const incident = yield prisma.incidents.findUnique({
            where: { IncidentsID: incidentID },
        });
        if (!incident) {
            throw new Error('Incident not found');
        }
        // Verificar que el trabajador existe
        const worker = yield prisma.worker.findUnique({
            where: { workerid: workerID },
        });
        if (!worker) {
            throw new Error('Worker not found');
        }
        // Asignar el trabajador a la incidencia
        const updatedIncident = yield prisma.incidents.update({
            where: { IncidentsID: incidentID },
            data: { assignedWorkerID: workerID },
        });
        return updatedIncident;
    });
}
