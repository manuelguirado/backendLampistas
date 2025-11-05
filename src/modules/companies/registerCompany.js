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
exports.registerCompany = registerCompany;
const prisma_1 = require("../../../generated/prisma");
const hashPassword_1 = require("../../utils/hash/hashPassword");
const prisma = new prisma_1.PrismaClient();
function registerCompany(name, phone, email, password, admin, directions) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!name || !phone || !password || !directions) {
            throw new Error('Name, phone, password and directions are required');
        }
        // Check if company with same name already exists (since there's no email field)
        const existingCompany = yield prisma.company.findFirst({
            where: { name },
        });
        const existingUser = yield prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw new Error('Email is already associated with another account');
        }
        if (existingCompany) {
            throw new Error('Company with this name already exists');
        }
        const existingAdmin = yield prisma.admin.findUnique({
            where: { adminID: admin },
        });
        if (!existingAdmin) {
            throw new Error('Admin does not exist');
        }
        const hashedPassword = yield (0, hashPassword_1.hashPassword)(password);
        const company = yield prisma.company.create({
            data: {
                name,
                email,
                phone,
                password: hashedPassword,
                role: 'COMPANY',
            },
        });
        const companyAdmin = yield prisma.admin.findUnique({
            where: { adminID: admin },
        });
        if (!companyAdmin) {
            throw new Error('Admin does not exist');
        }
        yield prisma.adminsCompanies.create({
            data: {
                Admin: { connect: { adminID: admin } },
                Company: { connect: { companyID: company.companyID } },
            },
        });
        yield prisma.company.update({
            where: { companyID: company.companyID },
            data: {
                admins: {
                    connect: [
                        {
                            adminID_companyID: { adminID: admin, companyID: company.companyID },
                        },
                    ],
                },
            },
        });
        yield prisma.directions.create({
            data: {
                address: directions.address,
                city: directions.city,
                state: directions.state,
                zipCode: directions.zipCode,
                company: { connect: { companyID: company.companyID } },
            },
        });
        return company;
    });
}
