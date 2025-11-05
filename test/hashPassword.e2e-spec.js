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
const hashPassword_1 = require("../src/utils/hash/hashPassword");
describe('hashPassword', () => {
    it('should hash the password correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        const password = 'mySecurePassword';
        const hashed = yield (0, hashPassword_1.hashPassword)(password);
        expect(hashed).not.toBe(password);
        expect(hashed).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt hash format
    }));
    it('should handle empty password', () => __awaiter(void 0, void 0, void 0, function* () {
        const password = '';
        const hashed = yield (0, hashPassword_1.hashPassword)(password);
        expect(hashed).not.toBe(password);
        expect(hashed).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt hash format
    }));
    it('should handle very long password', () => __awaiter(void 0, void 0, void 0, function* () {
        const password = 'a'.repeat(1000); // 1000 characters long
        const hashed = yield (0, hashPassword_1.hashPassword)(password);
        expect(hashed).not.toBe(password);
        expect(hashed).toMatch(/^\$2[ayb]\$.{56}$/); // bcrypt hash format
    }));
    it('should produce different hashes for the same password', () => __awaiter(void 0, void 0, void 0, function* () {
        const password = 'mySecurePassword';
        const hashed1 = yield (0, hashPassword_1.hashPassword)(password);
        const hashed2 = yield (0, hashPassword_1.hashPassword)(password);
        expect(hashed1).not.toBe(hashed2);
    }));
});
