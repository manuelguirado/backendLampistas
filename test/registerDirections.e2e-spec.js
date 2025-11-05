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
const prisma_1 = require("../generated/prisma");
const registerDirections_1 = require("../src/modules/directions/registerDirections");
const prisma = new prisma_1.PrismaClient();
describe('registerDirections', () => {
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up test data before each test
        yield prisma.directions.deleteMany({});
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up and disconnect after all tests
        yield prisma.directions.deleteMany({});
        yield prisma.$disconnect();
    }));
    it('should register new directions successfully', () => __awaiter(void 0, void 0, void 0, function* () {
        const directionData = {
            address: '123 Test St, Test City, TS 12345',
            city: 'Test City',
            state: 'TS',
            zipCode: '12345',
        };
        const directions = yield (0, registerDirections_1.registerDirections)(directionData.address, directionData.city, directionData.state, directionData.zipCode);
        expect(directions).not.toBeNull();
        expect(directions.address).toBe(directionData.address);
        expect(directions.city).toBe(directionData.city);
        expect(directions.state).toBe(directionData.state);
        expect(directions.zipCode).toBe(directionData.zipCode);
    }));
    it('should throw an error if any direction field is missing', () => __awaiter(void 0, void 0, void 0, function* () {
        yield expect((0, registerDirections_1.registerDirections)('', 'City', 'State', '12345')).rejects.toThrow('All direction fields are required');
        yield expect((0, registerDirections_1.registerDirections)('123 St', '', 'State', '12345')).rejects.toThrow('All direction fields are required');
        yield expect((0, registerDirections_1.registerDirections)('123 St', 'City', '', '12345')).rejects.toThrow('All direction fields are required');
        yield expect((0, registerDirections_1.registerDirections)('123 St', 'City', 'State', '')).rejects.toThrow('All direction fields are required');
    }));
});
