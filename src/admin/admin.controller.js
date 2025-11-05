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
exports.AdminController = void 0;
const auth_guard_1 = require("../auth/auth.guard");
const common_1 = require("@nestjs/common");
let AdminController = (() => {
    let _classDecorators = [(0, common_1.Controller)('admin')];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _instanceExtraInitializers = [];
    let _adminLogin_decorators;
    let _registerAdmin_decorators;
    let _generateCode_decorators;
    let _suspendCompany_decorators;
    let _eliminateCompany_decorators;
    let _activateCompany_decorators;
    let _editCompany_decorators;
    let _listCompany_decorators;
    var AdminController = _classThis = class {
        constructor(adminService) {
            this.adminService = (__runInitializers(this, _instanceExtraInitializers), adminService);
        }
        adminLogin(body) {
            const { email, password } = body;
            return this.adminService.adminLogin(email, password);
        }
        registerAdmin(body) {
            const { email, password } = body;
            return this.adminService.registerAdmin(email, password);
        }
        generateCode() {
            return this.adminService.generateCode();
        }
        suspendCompany(body) {
            const { companyID, until } = body;
            return this.adminService.suspendCompany(companyID, until);
        }
        eliminateCompany(body) {
            const { companyID } = body;
            return this.adminService.eliminateCompany(companyID);
        }
        activateCompany(body) {
            const { companyID } = body;
            return this.adminService.activateCompany(companyID);
        }
        editCompany(body) {
            const { companyID, data } = body;
            return this.adminService.editCompany(companyID, data);
        }
        listCompany(body) {
            const { adminID } = body;
            return this.adminService.listCompany(adminID);
        }
    };
    __setFunctionName(_classThis, "AdminController");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _adminLogin_decorators = [(0, common_1.Post)('admin/login')];
        _registerAdmin_decorators = [(0, common_1.Post)('admin/register')];
        _generateCode_decorators = [(0, common_1.Get)('admin/generateCode')];
        _suspendCompany_decorators = [(0, common_1.UseGuards)(auth_guard_1.AuthGuard), (0, common_1.Patch)('admin/suspendCompany')];
        _eliminateCompany_decorators = [(0, common_1.UseGuards)(auth_guard_1.AuthGuard), (0, common_1.Post)('admin/eliminateCompany')];
        _activateCompany_decorators = [(0, common_1.UseGuards)(auth_guard_1.AuthGuard), (0, common_1.Patch)('admin/activateCompany')];
        _editCompany_decorators = [(0, common_1.UseGuards)(auth_guard_1.AuthGuard), (0, common_1.Post)('admin/editCompany')];
        _listCompany_decorators = [(0, common_1.UseGuards)(auth_guard_1.AuthGuard), (0, common_1.Get)('admin/listCompany')];
        __esDecorate(_classThis, null, _adminLogin_decorators, { kind: "method", name: "adminLogin", static: false, private: false, access: { has: obj => "adminLogin" in obj, get: obj => obj.adminLogin }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _registerAdmin_decorators, { kind: "method", name: "registerAdmin", static: false, private: false, access: { has: obj => "registerAdmin" in obj, get: obj => obj.registerAdmin }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateCode_decorators, { kind: "method", name: "generateCode", static: false, private: false, access: { has: obj => "generateCode" in obj, get: obj => obj.generateCode }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _suspendCompany_decorators, { kind: "method", name: "suspendCompany", static: false, private: false, access: { has: obj => "suspendCompany" in obj, get: obj => obj.suspendCompany }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _eliminateCompany_decorators, { kind: "method", name: "eliminateCompany", static: false, private: false, access: { has: obj => "eliminateCompany" in obj, get: obj => obj.eliminateCompany }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _activateCompany_decorators, { kind: "method", name: "activateCompany", static: false, private: false, access: { has: obj => "activateCompany" in obj, get: obj => obj.activateCompany }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _editCompany_decorators, { kind: "method", name: "editCompany", static: false, private: false, access: { has: obj => "editCompany" in obj, get: obj => obj.editCompany }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listCompany_decorators, { kind: "method", name: "listCompany", static: false, private: false, access: { has: obj => "listCompany" in obj, get: obj => obj.listCompany }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AdminController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AdminController = _classThis;
})();
exports.AdminController = AdminController;
