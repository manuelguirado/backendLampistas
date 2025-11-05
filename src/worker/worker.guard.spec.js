"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const worker_guard_1 = require("./worker.guard");
describe('WorkerGuard', () => {
    it('should be defined', () => {
        expect(new worker_guard_1.WorkerGuard()).toBeDefined();
    });
});
