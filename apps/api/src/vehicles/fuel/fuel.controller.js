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
exports.FuelController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
var permissions_guard_1 = require("../../auth/guards/permissions.guard");
var permissions_decorator_1 = require("../../auth/decorators/permissions.decorator");
var swagger_1 = require("@nestjs/swagger");
var FuelController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('fuel'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard), (0, common_1.Controller)('vehicles/fuel')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _createFuelCard_decorators;
    var _getFuelCards_decorators;
    var _createFuelStation_decorators;
    var _getFuelStations_decorators;
    var _logFuelTransaction_decorators;
    var _getFuelTransactions_decorators;
    var FuelController = _classThis = /** @class */ (function () {
        function FuelController_1(fuel) {
            this.fuel = (__runInitializers(this, _instanceExtraInitializers), fuel);
        }
        FuelController_1.prototype.createFuelCard = function (user, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.fuel.createFuelCard(user.companyId, data, user.id)];
                });
            });
        };
        FuelController_1.prototype.getFuelCards = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.fuel.getFuelCards(user.companyId)];
                });
            });
        };
        FuelController_1.prototype.createFuelStation = function (user, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.fuel.createFuelStation(user.companyId, data, user.id)];
                });
            });
        };
        FuelController_1.prototype.getFuelStations = function (user) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.fuel.getFuelStations(user.companyId)];
                });
            });
        };
        FuelController_1.prototype.logFuelTransaction = function (user, data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.fuel.logFuelTransaction(user.companyId, data, user.id)];
                });
            });
        };
        FuelController_1.prototype.getFuelTransactions = function (user, vehicleId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.fuel.getFuelTransactions(user.companyId, vehicleId)];
                });
            });
        };
        return FuelController_1;
    }());
    __setFunctionName(_classThis, "FuelController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _createFuelCard_decorators = [(0, common_1.Post)('cards'), (0, permissions_decorator_1.RequirePermissions)('vehicles:write'), (0, swagger_1.ApiOperation)({ summary: 'Create Fuel Card' })];
        _getFuelCards_decorators = [(0, common_1.Get)('cards'), (0, permissions_decorator_1.RequirePermissions)('vehicles:read'), (0, swagger_1.ApiOperation)({ summary: 'Get Fuel Cards' })];
        _createFuelStation_decorators = [(0, common_1.Post)('stations'), (0, permissions_decorator_1.RequirePermissions)('vehicles:write'), (0, swagger_1.ApiOperation)({ summary: 'Create Fuel Station' })];
        _getFuelStations_decorators = [(0, common_1.Get)('stations'), (0, permissions_decorator_1.RequirePermissions)('vehicles:read'), (0, swagger_1.ApiOperation)({ summary: 'Get Fuel Stations' })];
        _logFuelTransaction_decorators = [(0, common_1.Post)('transactions'), (0, permissions_decorator_1.RequirePermissions)('vehicles:write'), (0, swagger_1.ApiOperation)({ summary: 'Log Fuel Transaction' })];
        _getFuelTransactions_decorators = [(0, common_1.Get)('transactions'), (0, permissions_decorator_1.RequirePermissions)('vehicles:read'), (0, swagger_1.ApiOperation)({ summary: 'Get Fuel Transactions' })];
        __esDecorate(_classThis, null, _createFuelCard_decorators, { kind: "method", name: "createFuelCard", static: false, private: false, access: { has: function (obj) { return "createFuelCard" in obj; }, get: function (obj) { return obj.createFuelCard; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getFuelCards_decorators, { kind: "method", name: "getFuelCards", static: false, private: false, access: { has: function (obj) { return "getFuelCards" in obj; }, get: function (obj) { return obj.getFuelCards; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createFuelStation_decorators, { kind: "method", name: "createFuelStation", static: false, private: false, access: { has: function (obj) { return "createFuelStation" in obj; }, get: function (obj) { return obj.createFuelStation; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getFuelStations_decorators, { kind: "method", name: "getFuelStations", static: false, private: false, access: { has: function (obj) { return "getFuelStations" in obj; }, get: function (obj) { return obj.getFuelStations; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _logFuelTransaction_decorators, { kind: "method", name: "logFuelTransaction", static: false, private: false, access: { has: function (obj) { return "logFuelTransaction" in obj; }, get: function (obj) { return obj.logFuelTransaction; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getFuelTransactions_decorators, { kind: "method", name: "getFuelTransactions", static: false, private: false, access: { has: function (obj) { return "getFuelTransactions" in obj; }, get: function (obj) { return obj.getFuelTransactions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FuelController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FuelController = _classThis;
}();
exports.FuelController = FuelController;
