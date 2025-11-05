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
exports.companyUsers = companyUsers;
const prisma_1 = require("../../../generated/prisma");
const prisma = new prisma_1.PrismaClient();
function companyUsers(companyID) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!companyID) {
            throw new Error('companyID is required');
        }
        const Company = yield prisma.company.findUnique({
            where: { companyID },
        });
        if (!Company) {
            throw new Error('Company does not exist');
        }
        const users = yield prisma.user.findMany({
            where: { companyID },
        });
        if (!users) {
            return [];
        }
        const mapUsers = users.map((user) => {
            var _a;
            return {
                userID: user.userID,
                email: user.email,
                name: (_a = user.name) !== null && _a !== void 0 ? _a : '',
                companyID,
            };
        });
        return mapUsers;
    });
}
