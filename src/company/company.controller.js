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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompanyController = void 0;
const common_1 = require("@nestjs/common");
const common_2 = require("@nestjs/common");
const auth_guard_1 = require("../auth/auth.guard");
let CompanyController = (() => {
    let _classDecorators = [(0, common_1.Controller)('company')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _companyLogin_decorators;
    let _registerCompany_decorators;
    let _registerWorker_decorators;
    let _editWorker_decorators;
    let _deleteWorker_decorators;
    let _createBudget_decorators;
    let _listWorker_decorators;
    let _assignIncident_decorators;
    let _createMachinery_decorators;
    let _assignShiftWorker_decorators;
    var CompanyController = _classThis = class {
        constructor(companyService) {
            this.companyService = (__runInitializers(this, _instanceExtraInitializers), companyService);
        }
        companyLogin(body) {
            const { email, password } = body;
            return this.companyService.companyLogin(email, password);
        }
        registerCompany(body) {
            const { name, email, phone, password, admin, directions } = body;
            return this.companyService.registerCompany(name, email, phone, password, admin, directions);
        }
        registerWorker(body) {
            const { email, password, name, companyID } = body;
            return this.companyService.registerWorker(email, password, name, companyID);
        }
        editWorker(workerID, data) {
            return this.companyService.editWorker(workerID, data);
        }
        deleteWorker(workerID) {
            return this.companyService.eliminateWorker(workerID);
        }
        createBudget(body) {
            const { incidentID, amount, description, userID, companyID, workerID, items, } = body;
            return this.companyService.createBudget(incidentID, amount, description, userID, companyID, workerID, items);
        }
        listWorker(body) {
            const { companyID } = body;
            return this.companyService.listWorker(companyID);
        }
        assignIncident(body) {
            const { incidentID, workerID } = body;
            return this.companyService.assignIncident(incidentID, workerID);
        }
        createMachinery(body) {
            const { name, description, maintanceDate, lastInspectionDate, InstalledAT, clientId, companyName, machineType, companyID, } = body;
            return this.companyService.createMachinery(name, description, maintanceDate, lastInspectionDate, InstalledAT, clientId, companyName, machineType, companyID);
        }
        assignShiftWorker(body) {
            const { workerID, shiftSchedule, shiftType } = body;
            return this.companyService.assignShiftWorker(workerID, shiftSchedule, shiftType);
        }
    };
    __setFunctionName(_classThis, "CompanyController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _companyLogin_decorators = [(0, common_2.Post)('company/login')];
        _registerCompany_decorators = [(0, common_2.Post)('company/register')];
        _registerWorker_decorators = [(0, common_2.Post)('company/registerWorker')];
        _editWorker_decorators = [(0, common_2.UseGuards)(auth_guard_1.AuthGuard), (0, common_2.Patch)('company/editWorker')];
        _deleteWorker_decorators = [(0, common_2.UseGuards)(auth_guard_1.AuthGuard), (0, common_1.Delete)('company/deleteWorker')];
        _createBudget_decorators = [(0, common_2.UseGuards)(auth_guard_1.AuthGuard), (0, common_2.Post)('company/createBudget')];
        _listWorker_decorators = [(0, common_2.UseGuards)(auth_guard_1.AuthGuard), (0, common_2.Post)('company/listWorker')];
        _assignIncident_decorators = [(0, common_2.UseGuards)(auth_guard_1.AuthGuard), (0, common_2.Post)('company/assignIncident')];
        _createMachinery_decorators = [(0, common_2.UseGuards)(auth_guard_1.AuthGuard), (0, common_2.Post)('company/createMachinery')];
        _assignShiftWorker_decorators = [(0, common_2.UseGuards)(auth_guard_1.AuthGuard), (0, common_2.Post)('company/assignShiftWorker')];
        __esDecorate(_classThis, null, _companyLogin_decorators, { kind: "method", name: "companyLogin", static: false, private: false, access: { has: obj => "companyLogin" in obj, get: obj => obj.companyLogin }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _registerCompany_decorators, { kind: "method", name: "registerCompany", static: false, private: false, access: { has: obj => "registerCompany" in obj, get: obj => obj.registerCompany }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _registerWorker_decorators, { kind: "method", name: "registerWorker", static: false, private: false, access: { has: obj => "registerWorker" in obj, get: obj => obj.registerWorker }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _editWorker_decorators, { kind: "method", name: "editWorker", static: false, private: false, access: { has: obj => "editWorker" in obj, get: obj => obj.editWorker }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteWorker_decorators, { kind: "method", name: "deleteWorker", static: false, private: false, access: { has: obj => "deleteWorker" in obj, get: obj => obj.deleteWorker }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createBudget_decorators, { kind: "method", name: "createBudget", static: false, private: false, access: { has: obj => "createBudget" in obj, get: obj => obj.createBudget }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listWorker_decorators, { kind: "method", name: "listWorker", static: false, private: false, access: { has: obj => "listWorker" in obj, get: obj => obj.listWorker }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _assignIncident_decorators, { kind: "method", name: "assignIncident", static: false, private: false, access: { has: obj => "assignIncident" in obj, get: obj => obj.assignIncident }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createMachinery_decorators, { kind: "method", name: "createMachinery", static: false, private: false, access: { has: obj => "createMachinery" in obj, get: obj => obj.createMachinery }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _assignShiftWorker_decorators, { kind: "method", name: "assignShiftWorker", static: false, private: false, access: { has: obj => "assignShiftWorker" in obj, get: obj => obj.assignShiftWorker }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CompanyController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CompanyController = _classThis;
})();
exports.CompanyController = CompanyController;
