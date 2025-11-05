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
exports.createIncident = createIncident;
const prisma_1 = require("../../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
function createIncident(title, description, userID, companyID, status, priority, urgency) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!title || !description || !companyID) {
            throw new Error('Title, description, companyID, and workerID are required');
        }
        const foundCompany = yield prisma.company.findUnique({
            where: { companyID },
        });
        if (!foundCompany) {
            throw new Error('Company not found');
        }
        // ✅ CORRECTO - Buscar por userID, no por id
        const user = yield prisma.user.findUnique({
            where: { userID: userID }, // ✅ userID en lugar de id
        });
        if (!user) {
            throw new Error('User not found');
        }
        let finalStatus = status || 'OPEN';
        if (urgency) {
            finalStatus = 'URGENT';
        }
        // ✅ Crear incidencia
        const incident = yield prisma.incidents.create({
            data: {
                title,
                description,
                userID, // ✅ Changed to userId to match Prisma schema
                companyID,
                status: finalStatus,
                priority: priority || (urgency ? 'HIGH' : 'MEDIUM'),
                urgency: urgency || false,
            },
        });
        return incident;
    });
}
