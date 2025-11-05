"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerController = void 0;
const common_1 = require("@nestjs/common");
let WorkerController = (() => {
    let _classDecorators = [(0, common_1.Controller)('worker')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _workerLogin_decorators;
    let _listAssignedIncidents_decorators;
    let _updateIncidentStatus_decorators;
    let _myShifts_decorators;
    var WorkerController = _classThis = class {
        constructor(workerService) {
            this.workerService = (__runInitializers(this, _instanceExtraInitializers), workerService);
        }
        workerLogin(body) {
            return __awaiter(this, void 0, void 0, function* () {
                const { email, password } = body;
                return this.workerService.workerLogin(email, password);
            });
        }
        listAssignedIncidents(workerID) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.workerService.listAssignedIncidents(workerID);
            });
        }
        updateIncidentStatus(body) {
            return __awaiter(this, void 0, void 0, function* () {
                const { incidentID, status } = body;
                return this.workerService.updateStatusIncident(incidentID, status);
            });
        }
        myShifts(workerID) {
            return __awaiter(this, void 0, void 0, function* () {
                return this.workerService.myShifts(workerID);
            });
        }
    };
    __setFunctionName(_classThis, "WorkerController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _workerLogin_decorators = [(0, common_1.Post)('worker/login')];
        _listAssignedIncidents_decorators = [(0, common_1.Get)('worker/assignedIncidents')];
        _updateIncidentStatus_decorators = [(0, common_1.Patch)('worker/updateIncidentStatus')];
        _myShifts_decorators = [(0, common_1.Get)('worker/myShifts')];
        __esDecorate(_classThis, null, _workerLogin_decorators, { kind: "method", name: "workerLogin", static: false, private: false, access: { has: obj => "workerLogin" in obj, get: obj => obj.workerLogin }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listAssignedIncidents_decorators, { kind: "method", name: "listAssignedIncidents", static: false, private: false, access: { has: obj => "listAssignedIncidents" in obj, get: obj => obj.listAssignedIncidents }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _updateIncidentStatus_decorators, { kind: "method", name: "updateIncidentStatus", static: false, private: false, access: { has: obj => "updateIncidentStatus" in obj, get: obj => obj.updateIncidentStatus }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _myShifts_decorators, { kind: "method", name: "myShifts", static: false, private: false, access: { has: obj => "myShifts" in obj, get: obj => obj.myShifts }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WorkerController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WorkerController = _classThis;
})();
exports.WorkerController = WorkerController;
