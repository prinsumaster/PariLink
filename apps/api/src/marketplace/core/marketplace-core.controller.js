"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.MarketplaceCoreController = void 0;
var common_1 = require("@nestjs/common");
var swagger_1 = require("@nestjs/swagger");
var jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
// In a real application, you would also use a CompanyGuard or RolesGuard
var MarketplaceCoreController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Enterprise Plugins'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.Controller)('admin/marketplace'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getCatalog_decorators;
    var _getInstalledApps_decorators;
    var _getAppDetails_decorators;
    var _getInstallationDetails_decorators;
    var _installApp_decorators;
    var _uninstallApp_decorators;
    var _disableApp_decorators;
    var _enableApp_decorators;
    var MarketplaceCoreController = _classThis = /** @class */ (function () {
        function MarketplaceCoreController_1(marketplaceService) {
            this.marketplaceService = (__runInitializers(this, _instanceExtraInitializers), marketplaceService);
        }
        /**
         * Get marketplace catalog (Phase 6 & 7)
         */
        MarketplaceCoreController_1.prototype.getCatalog = function (search, category) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.marketplaceService.getCatalog({ search: search, category: category })];
                });
            });
        };
        /**
         * Get installed apps for a company (Phase 5)
         */
        MarketplaceCoreController_1.prototype.getInstalledApps = function (req) {
            return __awaiter(this, void 0, void 0, function () {
                var companyId;
                return __generator(this, function (_a) {
                    companyId = req.user.companyId || req.user.currentWorkspaceId;
                    return [2 /*return*/, this.marketplaceService.getInstalledApps(companyId)];
                });
            });
        };
        /**
         * Get specific app details (Phase 6)
         */
        MarketplaceCoreController_1.prototype.getAppDetails = function (id) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.marketplaceService.getAppDetails(id)];
                });
            });
        };
        /**
         * Get specific installation details (Phase 5)
         */
        MarketplaceCoreController_1.prototype.getInstallationDetails = function (appId, req) {
            return __awaiter(this, void 0, void 0, function () {
                var companyId;
                return __generator(this, function (_a) {
                    companyId = req.user.companyId || req.user.currentWorkspaceId;
                    return [2 /*return*/, this.marketplaceService.getInstallationDetails(companyId, appId)];
                });
            });
        };
        /**
         * Install an App (Phase 2 & 3)
         */
        MarketplaceCoreController_1.prototype.installApp = function (appId, dto, req) {
            return __awaiter(this, void 0, void 0, function () {
                var companyId, installDto;
                return __generator(this, function (_a) {
                    companyId = req.user.companyId || req.user.currentWorkspaceId;
                    installDto = __assign({ appId: appId }, dto);
                    return [2 /*return*/, this.marketplaceService.installApp(companyId, req.user.id, installDto)];
                });
            });
        };
        /**
         * Uninstall an App (Phase 3)
         */
        MarketplaceCoreController_1.prototype.uninstallApp = function (appId, req) {
            return __awaiter(this, void 0, void 0, function () {
                var companyId;
                return __generator(this, function (_a) {
                    companyId = req.user.companyId || req.user.currentWorkspaceId;
                    return [2 /*return*/, this.marketplaceService.uninstallApp(companyId, appId)];
                });
            });
        };
        /**
         * Disable an App (Phase 3)
         */
        MarketplaceCoreController_1.prototype.disableApp = function (appId, req) {
            return __awaiter(this, void 0, void 0, function () {
                var companyId;
                return __generator(this, function (_a) {
                    companyId = req.user.companyId || req.user.currentWorkspaceId;
                    return [2 /*return*/, this.marketplaceService.toggleAppStatus(companyId, appId, 'SUSPENDED')];
                });
            });
        };
        /**
         * Enable an App (Phase 3)
         */
        MarketplaceCoreController_1.prototype.enableApp = function (appId, req) {
            return __awaiter(this, void 0, void 0, function () {
                var companyId;
                return __generator(this, function (_a) {
                    companyId = req.user.companyId || req.user.currentWorkspaceId;
                    return [2 /*return*/, this.marketplaceService.toggleAppStatus(companyId, appId, 'ACTIVE')];
                });
            });
        };
        return MarketplaceCoreController_1;
    }());
    __setFunctionName(_classThis, "MarketplaceCoreController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getCatalog_decorators = [(0, common_1.Get)('apps'), (0, swagger_1.ApiOperation)({ summary: 'Get marketplace catalog' })];
        _getInstalledApps_decorators = [(0, common_1.Get)('installed'), (0, swagger_1.ApiOperation)({ summary: 'Get installed apps for a company' })];
        _getAppDetails_decorators = [(0, common_1.Get)('apps/:id'), (0, swagger_1.ApiOperation)({ summary: 'Get specific app details' })];
        _getInstallationDetails_decorators = [(0, common_1.Get)('installed/:id'), (0, swagger_1.ApiOperation)({ summary: 'Get specific installation details' })];
        _installApp_decorators = [(0, common_1.Post)('apps/:id/install'), (0, swagger_1.ApiOperation)({ summary: 'Install an App' })];
        _uninstallApp_decorators = [(0, common_1.Delete)('apps/:id')];
        _disableApp_decorators = [(0, common_1.Patch)('apps/:id/disable')];
        _enableApp_decorators = [(0, common_1.Patch)('apps/:id/enable')];
        __esDecorate(_classThis, null, _getCatalog_decorators, { kind: "method", name: "getCatalog", static: false, private: false, access: { has: function (obj) { return "getCatalog" in obj; }, get: function (obj) { return obj.getCatalog; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getInstalledApps_decorators, { kind: "method", name: "getInstalledApps", static: false, private: false, access: { has: function (obj) { return "getInstalledApps" in obj; }, get: function (obj) { return obj.getInstalledApps; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getAppDetails_decorators, { kind: "method", name: "getAppDetails", static: false, private: false, access: { has: function (obj) { return "getAppDetails" in obj; }, get: function (obj) { return obj.getAppDetails; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getInstallationDetails_decorators, { kind: "method", name: "getInstallationDetails", static: false, private: false, access: { has: function (obj) { return "getInstallationDetails" in obj; }, get: function (obj) { return obj.getInstallationDetails; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _installApp_decorators, { kind: "method", name: "installApp", static: false, private: false, access: { has: function (obj) { return "installApp" in obj; }, get: function (obj) { return obj.installApp; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _uninstallApp_decorators, { kind: "method", name: "uninstallApp", static: false, private: false, access: { has: function (obj) { return "uninstallApp" in obj; }, get: function (obj) { return obj.uninstallApp; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _disableApp_decorators, { kind: "method", name: "disableApp", static: false, private: false, access: { has: function (obj) { return "disableApp" in obj; }, get: function (obj) { return obj.disableApp; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _enableApp_decorators, { kind: "method", name: "enableApp", static: false, private: false, access: { has: function (obj) { return "enableApp" in obj; }, get: function (obj) { return obj.enableApp; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        MarketplaceCoreController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return MarketplaceCoreController = _classThis;
}();
exports.MarketplaceCoreController = MarketplaceCoreController;
