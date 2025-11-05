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
exports.editCompany = editCompany;
const prisma_1 = require("../../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
function editCompany(companyID, update) {
    return __awaiter(this, void 0, void 0, function* () {
        {
            if (!companyID) {
                throw new Error('Company ID is required');
            }
            if (Object.keys(update).length === 0) {
                throw new Error('At least one field to update must be provided');
            }
            const existingCompany = yield prisma.company.findUnique({
                where: { companyID: companyID },
            });
            if (!existingCompany) {
                throw new Error('Company not found');
            }
            const updatedCompany = yield prisma.company.update({
                where: { companyID: companyID },
                data: Object.assign({}, update),
            });
            return updatedCompany;
        }
    });
}
