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
exports.listCompany = listCompany;
const prisma_1 = require("../../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
function listCompany(adminID) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!adminID) {
            throw new Error('adminID is required');
        }
        const admin = yield prisma.admin.findUnique({
            where: { adminID: adminID },
        });
        if (!admin) {
            throw new Error('Admin does not exist');
        }
        const companies = yield prisma.company.findMany();
        if (!companies) {
            return [];
        }
        const mappedCompanies = companies.map((company) => {
            return {
                companyID: company.companyID,
                name: company.name,
                email: company.email,
                phone: company.phone,
            };
        });
        return mappedCompanies;
    });
}
