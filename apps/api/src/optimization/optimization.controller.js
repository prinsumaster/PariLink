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
exports.OptimizationController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var permissions_guard_1 = require("../auth/guards/permissions.guard");
var permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
var OptimizationController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('optimization'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Controller)('optimization')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _generateScenarios_decorators;
    var _listScenarios_decorators;
    var _getScenario_decorators;
    var _acceptScenario_decorators;
    var _simulateWhatIf_decorators;
    var _getExecutiveMetrics_decorators;
    var OptimizationController = _classThis = /** @class */ (function () {
        function OptimizationController_1(prisma, optimizer, orchestration, simulationService, analyticsService) {
            this.prisma = (__runInitializers(this, _instanceExtraInitializers), prisma);
            this.optimizer = optimizer;
            this.orchestration = orchestration;
            this.simulationService = simulationService;
            this.analyticsService = analyticsService;
        }
        OptimizationController_1.prototype.generateScenarios = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var scenarioIds;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.optimizer.generateScenarios(user.companyId)];
                        case 1:
                            scenarioIds = _a.sent();
                            if (scenarioIds.length === 0) {
                                throw new common_1.BadRequestException('No feasible optimization scenarios could be generated. Ensure there are OPEN loads and AVAILABLE vehicles.');
                            }
                            return [2 /*return*/, this.prisma.runAsTenant(user.companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.optimizationScenario.findMany({
                                                where: { id: { in: scenarioIds }, companyId: user.companyId },
                                                include: { recommendations: true },
                                                orderBy: { createdAt: 'desc' },
                                            })];
                                    });
                                }); })];
                    }
                });
            });
        };
        OptimizationController_1.prototype.listScenarios = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(user.companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.optimizationScenario.findMany({
                                        where: { companyId: user.companyId },
                                        include: { _count: { select: { recommendations: true } } },
                                        orderBy: { createdAt: 'desc' },
                                        take: 20,
                                    })];
                            });
                        }); })];
                });
            });
        };
        OptimizationController_1.prototype.getScenario = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(user.companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.optimizationScenario.findUnique({
                                        where: { id: id, companyId: user.companyId },
                                        include: { recommendations: true },
                                    })];
                            });
                        }); })];
                });
            });
        };
        OptimizationController_1.prototype.acceptScenario = function (user, id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.orchestration.acceptScenario(user.companyId, id, user.userId)];
                });
            });
        };
        OptimizationController_1.prototype.simulateWhatIf = function (user, body) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.simulationService.simulateWhatIf(user.companyId, body.trigger, body.parameters)];
                });
            });
        };
        OptimizationController_1.prototype.getExecutiveMetrics = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.analyticsService.getExecutiveDashboardMetrics(user.companyId)];
                });
            });
        };
        return OptimizationController_1;
    }());
    __setFunctionName(_classThis, "OptimizationController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _generateScenarios_decorators = [(0, common_1.Post)('scenarios/generate'), (0, permissions_decorator_1.RequirePermissions)('dispatch:write'), (0, swagger_1.ApiOperation)({
                summary: 'Trigger heuristic optimization across the network state',
            })];
        _listScenarios_decorators = [(0, common_1.Get)('scenarios'), (0, permissions_decorator_1.RequirePermissions)('dispatch:read'), (0, swagger_1.ApiOperation)({ summary: 'List all generated optimization scenarios' })];
        _getScenario_decorators = [(0, common_1.Get)('scenarios/:id'), (0, permissions_decorator_1.RequirePermissions)('dispatch:read'), (0, swagger_1.ApiOperation)({ summary: 'Get details of a specific optimization scenario' })];
        _acceptScenario_decorators = [(0, common_1.Post)('scenarios/:id/accept'), (0, permissions_decorator_1.RequirePermissions)('dispatch:write'), (0, swagger_1.ApiOperation)({ summary: 'Accept a scenario and orchestrate dispatch plans' })];
        _simulateWhatIf_decorators = [(0, common_1.Post)('scenarios/simulate'), (0, permissions_decorator_1.RequirePermissions)('dispatch:write'), (0, swagger_1.ApiOperation)({ summary: 'Run a what-if simulation' })];
        _getExecutiveMetrics_decorators = [(0, common_1.Get)('analytics/executive'), (0, permissions_decorator_1.RequirePermissions)('dispatch:read'), (0, swagger_1.ApiOperation)({ summary: 'Get executive dashboard metrics' })];
        __esDecorate(_classThis, null, _generateScenarios_decorators, { kind: "method", name: "generateScenarios", static: false, private: false, access: { has: function (obj) { return "generateScenarios" in obj; }, get: function (obj) { return obj.generateScenarios; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _listScenarios_decorators, { kind: "method", name: "listScenarios", static: false, private: false, access: { has: function (obj) { return "listScenarios" in obj; }, get: function (obj) { return obj.listScenarios; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getScenario_decorators, { kind: "method", name: "getScenario", static: false, private: false, access: { has: function (obj) { return "getScenario" in obj; }, get: function (obj) { return obj.getScenario; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _acceptScenario_decorators, { kind: "method", name: "acceptScenario", static: false, private: false, access: { has: function (obj) { return "acceptScenario" in obj; }, get: function (obj) { return obj.acceptScenario; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _simulateWhatIf_decorators, { kind: "method", name: "simulateWhatIf", static: false, private: false, access: { has: function (obj) { return "simulateWhatIf" in obj; }, get: function (obj) { return obj.simulateWhatIf; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getExecutiveMetrics_decorators, { kind: "method", name: "getExecutiveMetrics", static: false, private: false, access: { has: function (obj) { return "getExecutiveMetrics" in obj; }, get: function (obj) { return obj.getExecutiveMetrics; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        OptimizationController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return OptimizationController = _classThis;
}();
exports.OptimizationController = OptimizationController;
