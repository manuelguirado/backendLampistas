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
exports.updateStatusIncident = updateStatusIncident;
const prisma_1 = require("../../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
function updateStatusIncident(incidentID, status) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!incidentID || !status) {
            throw new Error('Incident ID and status are required');
        }
        const incident = yield prisma.incidents.findUnique({
            where: { IncidentsID: incidentID },
        });
        if (!incident) {
            throw new Error('Incident not found');
        }
        const updatedIncident = yield prisma.incidents.update({
            where: { IncidentsID: incidentID },
            data: { status: status },
        });
        return updatedIncident;
    });
}
