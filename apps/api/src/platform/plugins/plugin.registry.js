"use strict";
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
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
exports.PluginRegistry = void 0;
var common_1 = require("@nestjs/common");
var PluginRegistry = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var PluginRegistry = _classThis = /** @class */ (function () {
        function PluginRegistry_1(prisma, workerRegistry, runtimeManager, permissionValidator) {
            this.prisma = prisma;
            this.workerRegistry = workerRegistry;
            this.runtimeManager = runtimeManager;
            this.permissionValidator = permissionValidator;
            this.logger = new common_1.Logger(PluginRegistry.name);
            // In-memory store of loaded plugin instances
            this.loadedPlugins = new Map();
        }
        /**
         * Registers a plugin into the runtime memory.
         */
        PluginRegistry_1.prototype.registerPlugin = function (plugin) {
            return __awaiter(this, void 0, void 0, function () {
                var manifest;
                return __generator(this, function (_a) {
                    manifest = plugin.getManifest();
                    if (this.loadedPlugins.has(manifest.id)) {
                        this.logger.warn("Plugin ".concat(manifest.id, " is already loaded."));
                        return [2 /*return*/];
                    }
                    this.loadedPlugins.set(manifest.id, plugin);
                    this.logger.log("Loaded Plugin: ".concat(manifest.name, " v").concat(manifest.version));
                    // Dynamically wire up Extension Points
                    this.wireExtensions(plugin);
                    return [2 /*return*/];
                });
            });
        };
        PluginRegistry_1.prototype.wireExtensions = function (plugin) {
            var _this = this;
            var manifest = plugin.getManifest();
            // 1. Digital Workers (Validating permissions before registration)
            if (plugin.registerAiWorkers) {
                var workers = plugin.registerAiWorkers();
                workers.forEach(function (w) {
                    // Enforce Isolation Rule: Only allow registration if manifested
                    if (_this.permissionValidator.validateWorkerExecution(manifest, w.name)) {
                        _this.workerRegistry.registerWorker(w);
                    }
                });
                this.logger.debug("[".concat(manifest.id, "] Registered ").concat(workers.length, " Digital Workers"));
            }
            // 2. Health Metrics
            if (plugin.registerHealthMetrics) {
                var metrics = plugin.registerHealthMetrics();
                this.logger.debug("[".concat(manifest.id, "] Registered ").concat(metrics.length, " Health Metrics"));
            }
        };
        /**
         * Called during tenant initialization to activate their specific installed plugins via the Runtime.
         */
        PluginRegistry_1.prototype.activateTenantPlugins = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var installations, _loop_1, this_1, _i, installations_1, install;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.appInstallation.findMany({
                                            where: { companyId: companyId, status: 'ACTIVE' },
                                            include: { app: true },
                                        })];
                                });
                            }); })];
                        case 1:
                            installations = _a.sent();
                            _loop_1 = function (install) {
                                var plugin, isValid;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            plugin = this_1.loadedPlugins.get(install.app.name);
                                            if (!plugin) return [3 /*break*/, 3];
                                            return [4 /*yield*/, this_1.runtimeManager.loadPluginSafely(plugin, companyId)];
                                        case 1:
                                            isValid = _b.sent();
                                            if (!isValid) return [3 /*break*/, 3];
                                            // Execute the lifecycle hook within a secure try/catch boundary
                                            return [4 /*yield*/, this_1.runtimeManager.executeSafely(plugin, companyId, 'onActivate', function () { return __awaiter(_this, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0: return [4 /*yield*/, plugin.onActivate(companyId)];
                                                            case 1:
                                                                _a.sent();
                                                                return [2 /*return*/];
                                                        }
                                                    });
                                                }); })];
                                        case 2:
                                            // Execute the lifecycle hook within a secure try/catch boundary
                                            _b.sent();
                                            _b.label = 3;
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            };
                            this_1 = this;
                            _i = 0, installations_1 = installations;
                            _a.label = 2;
                        case 2:
                            if (!(_i < installations_1.length)) return [3 /*break*/, 5];
                            install = installations_1[_i];
                            return [5 /*yield**/, _loop_1(install)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 2];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        return PluginRegistry_1;
    }());
    __setFunctionName(_classThis, "PluginRegistry");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PluginRegistry = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PluginRegistry = _classThis;
}();
exports.PluginRegistry = PluginRegistry;
