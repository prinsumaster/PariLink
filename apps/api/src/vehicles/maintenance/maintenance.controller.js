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
exports.MaintenanceController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
var permissions_guard_1 = require("../../auth/guards/permissions.guard");
var permissions_decorator_1 = require("../../auth/decorators/permissions.decorator");
var swagger_1 = require("@nestjs/swagger");
var MaintenanceController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('maintenance'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Controller)('vehicles/maintenance')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createWorkshop_decorators;
    var _getWorkshops_decorators;
    var _createMechanic_decorators;
    var _getMechanics_decorators;
    var _createJobCard_decorators;
    var _getJobCards_decorators;
    var _closeJobCard_decorators;
    var _createSchedule_decorators;
    var _getSchedules_decorators;
    var MaintenanceController = _classThis = /** @class */ (function () {
        function MaintenanceController_1(maintenance) {
            this.maintenance = (__runInitializers(this, _instanceExtraInitializers), maintenance);
        }
        MaintenanceController_1.prototype.createWorkshop = function (user, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.maintenance.createWorkshop(user.companyId, data, user.id)];
                });
            });
        };
        MaintenanceController_1.prototype.getWorkshops = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.maintenance.getWorkshops(user.companyId)];
                });
            });
        };
        MaintenanceController_1.prototype.createMechanic = function (user, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.maintenance.createMechanic(user.companyId, data, user.id)];
                });
            });
        };
        MaintenanceController_1.prototype.getMechanics = function (user, workshopId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.maintenance.getMechanics(user.companyId, workshopId)];
                });
            });
        };
        MaintenanceController_1.prototype.createJobCard = function (user, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.maintenance.createJobCard(user.companyId, data, user.id)];
                });
            });
        };
        MaintenanceController_1.prototype.getJobCards = function (user, vehicleId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.maintenance.getJobCards(user.companyId, vehicleId)];
                });
            });
        };
        MaintenanceController_1.prototype.closeJobCard = function (user, id, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.maintenance.closeJobCard(user.companyId, id, data, user.id)];
                });
            });
        };
        MaintenanceController_1.prototype.createSchedule = function (user, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.maintenance.createSchedule(user.companyId, data, user.id)];
                });
            });
        };
        MaintenanceController_1.prototype.getSchedules = function (user, vehicleId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.maintenance.getSchedules(user.companyId, vehicleId)];
                });
            });
        };
        return MaintenanceController_1;
    }());
    __setFunctionName(_classThis, "MaintenanceController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createWorkshop_decorators = [(0, common_1.Post)('workshops'), (0, permissions_decorator_1.RequirePermissions)('vehicles:write'), (0, swagger_1.ApiOperation)({ summary: 'Create Workshop' })];
        _getWorkshops_decorators = [(0, common_1.Get)('workshops'), (0, permissions_decorator_1.RequirePermissions)('vehicles:read'), (0, swagger_1.ApiOperation)({ summary: 'Get Workshops' })];
        _createMechanic_decorators = [(0, common_1.Post)('mechanics'), (0, permissions_decorator_1.RequirePermissions)('vehicles:write'), (0, swagger_1.ApiOperation)({ summary: 'Create Mechanic' })];
        _getMechanics_decorators = [(0, common_1.Get)('mechanics'), (0, permissions_decorator_1.RequirePermissions)('vehicles:read'), (0, swagger_1.ApiOperation)({ summary: 'Get Mechanics' })];
        _createJobCard_decorators = [(0, common_1.Post)('job-cards'), (0, permissions_decorator_1.RequirePermissions)('vehicles:write'), (0, swagger_1.ApiOperation)({ summary: 'Create Job Card (Repair Order)' })];
        _getJobCards_decorators = [(0, common_1.Get)('job-cards'), (0, permissions_decorator_1.RequirePermissions)('vehicles:read'), (0, swagger_1.ApiOperation)({ summary: 'Get Job Cards' })];
        _closeJobCard_decorators = [(0, common_1.Put)('job-cards/:id/close'), (0, permissions_decorator_1.RequirePermissions)('vehicles:write'), (0, swagger_1.ApiOperation)({ summary: 'Close Job Card' })];
        _createSchedule_decorators = [(0, common_1.Post)('schedules'), (0, permissions_decorator_1.RequirePermissions)('vehicles:write'), (0, swagger_1.ApiOperation)({ summary: 'Create Maintenance Schedule' })];
        _getSchedules_decorators = [(0, common_1.Get)('schedules'), (0, permissions_decorator_1.RequirePermissions)('vehicles:read'), (0, swagger_1.ApiOperation)({ summary: 'Get Maintenance Schedules' })];
        __esDecorate(_classThis, null, _createWorkshop_decorators, { kind: "method", name: "createWorkshop", static: false, private: false, access: { has: function (obj) { return "createWorkshop" in obj; }, get: function (obj) { return obj.createWorkshop; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getWorkshops_decorators, { kind: "method", name: "getWorkshops", static: false, private: false, access: { has: function (obj) { return "getWorkshops" in obj; }, get: function (obj) { return obj.getWorkshops; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createMechanic_decorators, { kind: "method", name: "createMechanic", static: false, private: false, access: { has: function (obj) { return "createMechanic" in obj; }, get: function (obj) { return obj.createMechanic; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMechanics_decorators, { kind: "method", name: "getMechanics", static: false, private: false, access: { has: function (obj) { return "getMechanics" in obj; }, get: function (obj) { return obj.getMechanics; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createJobCard_decorators, { kind: "method", name: "createJobCard", static: false, private: false, access: { has: function (obj) { return "createJobCard" in obj; }, get: function (obj) { return obj.createJobCard; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getJobCards_decorators, { kind: "method", name: "getJobCards", static: false, private: false, access: { has: function (obj) { return "getJobCards" in obj; }, get: function (obj) { return obj.getJobCards; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _closeJobCard_decorators, { kind: "method", name: "closeJobCard", static: false, private: false, access: { has: function (obj) { return "closeJobCard" in obj; }, get: function (obj) { return obj.closeJobCard; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createSchedule_decorators, { kind: "method", name: "createSchedule", static: false, private: false, access: { has: function (obj) { return "createSchedule" in obj; }, get: function (obj) { return obj.createSchedule; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSchedules_decorators, { kind: "method", name: "getSchedules", static: false, private: false, access: { has: function (obj) { return "getSchedules" in obj; }, get: function (obj) { return obj.getSchedules; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MaintenanceController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MaintenanceController = _classThis;
}();
exports.MaintenanceController = MaintenanceController;
