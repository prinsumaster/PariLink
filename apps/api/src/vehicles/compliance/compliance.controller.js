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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
var permissions_guard_1 = require("../../auth/guards/permissions.guard");
var permissions_decorator_1 = require("../../auth/decorators/permissions.decorator");
var swagger_1 = require("@nestjs/swagger");
var ComplianceController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('compliance'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Controller)('vehicles/compliance')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _logHosViolation_decorators;
    var _getHosViolations_decorators;
    var _submitDvir_decorators;
    var _getDvirLogs_decorators;
    var _registerVehicle_decorators;
    var _logInsurance_decorators;
    var ComplianceController = _classThis = /** @class */ (function () {
        function ComplianceController_1(complianceService) {
            this.complianceService = (__runInitializers(this, _instanceExtraInitializers), complianceService);
        }
        ComplianceController_1.prototype.logHosViolation = function (user, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.complianceService.logHosViolation(user.companyId, data, user.id)];
                });
            });
        };
        ComplianceController_1.prototype.getHosViolations = function (user, driverId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.complianceService.getHosViolations(user.companyId, driverId)];
                });
            });
        };
        ComplianceController_1.prototype.submitDvir = function (user, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.complianceService.submitDvir(user.companyId, data, user.id)];
                });
            });
        };
        ComplianceController_1.prototype.getDvirLogs = function (user, vehicleId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.complianceService.getDvirLogs(user.companyId, vehicleId)];
                });
            });
        };
        ComplianceController_1.prototype.registerVehicle = function (user, vehicleId, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.complianceService.registerVehicle(user.companyId, vehicleId, data, user.id)];
                });
            });
        };
        ComplianceController_1.prototype.logInsurance = function (user, vehicleId, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.complianceService.logInsurance(user.companyId, vehicleId, data, user.id)];
                });
            });
        };
        return ComplianceController_1;
    }());
    __setFunctionName(_classThis, "ComplianceController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _logHosViolation_decorators = [(0, common_1.Post)('hos-violations'), (0, permissions_decorator_1.RequirePermissions)('vehicles:write'), (0, swagger_1.ApiOperation)({ summary: 'Log HOS violation' })];
        _getHosViolations_decorators = [(0, common_1.Get)('hos-violations'), (0, permissions_decorator_1.RequirePermissions)('vehicles:read'), (0, swagger_1.ApiOperation)({ summary: 'Get HOS violations' })];
        _submitDvir_decorators = [(0, common_1.Post)('dvir'), (0, permissions_decorator_1.RequirePermissions)('vehicles:write'), (0, swagger_1.ApiOperation)({ summary: 'Submit DVIR (Driver Vehicle Inspection Report)' })];
        _getDvirLogs_decorators = [(0, common_1.Get)('dvir'), (0, permissions_decorator_1.RequirePermissions)('vehicles:read'), (0, swagger_1.ApiOperation)({ summary: 'Get DVIR logs' })];
        _registerVehicle_decorators = [(0, common_1.Post)('registration/:vehicleId'), (0, permissions_decorator_1.RequirePermissions)('vehicles:write'), (0, swagger_1.ApiOperation)({ summary: 'Register/Update vehicle registration' })];
        _logInsurance_decorators = [(0, common_1.Post)('insurance/:vehicleId'), (0, permissions_decorator_1.RequirePermissions)('vehicles:write'), (0, swagger_1.ApiOperation)({ summary: 'Log new insurance policy for a vehicle' })];
        __esDecorate(_classThis, null, _logHosViolation_decorators, { kind: "method", name: "logHosViolation", static: false, private: false, access: { has: function (obj) { return "logHosViolation" in obj; }, get: function (obj) { return obj.logHosViolation; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getHosViolations_decorators, { kind: "method", name: "getHosViolations", static: false, private: false, access: { has: function (obj) { return "getHosViolations" in obj; }, get: function (obj) { return obj.getHosViolations; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _submitDvir_decorators, { kind: "method", name: "submitDvir", static: false, private: false, access: { has: function (obj) { return "submitDvir" in obj; }, get: function (obj) { return obj.submitDvir; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getDvirLogs_decorators, { kind: "method", name: "getDvirLogs", static: false, private: false, access: { has: function (obj) { return "getDvirLogs" in obj; }, get: function (obj) { return obj.getDvirLogs; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _registerVehicle_decorators, { kind: "method", name: "registerVehicle", static: false, private: false, access: { has: function (obj) { return "registerVehicle" in obj; }, get: function (obj) { return obj.registerVehicle; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _logInsurance_decorators, { kind: "method", name: "logInsurance", static: false, private: false, access: { has: function (obj) { return "logInsurance" in obj; }, get: function (obj) { return obj.logInsurance; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ComplianceController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ComplianceController = _classThis;
}();
exports.ComplianceController = ComplianceController;
