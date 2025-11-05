"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin_guard_1 = require("./admin.guard");
describe('AdminGuard', () => {
    it('should be defined', () => {
        expect(new admin_guard_1.AdminGuard()).toBeDefined();
    });
});
