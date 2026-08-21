"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __makeTemplateObject = (this && this.__makeTemplateObject) || function (cooked, raw) {
    if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
    return cooked;
};
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
exports.PrismaService = void 0;
var common_1 = require("@nestjs/common");
var client_1 = require("@prisma/client");
var PrismaService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = client_1.PrismaClient;
    var PrismaService = _classThis = /** @class */ (function (_super) {
        __extends(PrismaService_1, _super);
        function PrismaService_1() {
            var _this = this;
            var datasourceUrl = process.env.DATABASE_URL;
            if (datasourceUrl) {
                try {
                    var url = new URL(datasourceUrl);
                    if (process.env.USE_PGBOUNCER === 'true') {
                        url.searchParams.set('pgbouncer', 'true');
                    }
                    if (process.env.NODE_ENV === 'test') {
                        url.searchParams.set('connection_limit', '2');
                        url.searchParams.set('pool_timeout', '10');
                    }
                    datasourceUrl = url.toString();
                }
                catch (e) {
                    // ignore invalid URL parsing errors
                }
            }
            _this = _super.call(this, {
                datasourceUrl: datasourceUrl,
                log: [
                    { emit: 'event', level: 'query' },
                    { emit: 'event', level: 'error' },
                    { emit: 'event', level: 'warn' },
                ],
            }) || this;
            _this.logger = new common_1.Logger(PrismaService.name);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            _this.dmmfModels = new Map();
            _this.$on('error', function (e) { return _this.logger.error("Prisma Error: ".concat(e.message)); });
            _this.$on('warn', function (e) { return _this.logger.warn("Prisma Warn: ".concat(e.message)); });
            return _this;
        }
        PrismaService_1.prototype.onModuleInit = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _i, _a, model, fieldsMap, _b, _c, field;
                return __generator(this, function (_d) {
                    // Cache DMMF models and their fields for O(1) lookup during soft-delete middleware
                    for (_i = 0, _a = client_1.Prisma.dmmf.datamodel.models; _i < _a.length; _i++) {
                        model = _a[_i];
                        fieldsMap = new Map();
                        for (_b = 0, _c = model.fields; _b < _c.length; _b++) {
                            field = _c[_b];
                            fieldsMap.set(field.name, field);
                        }
                        this.dmmfModels.set(model.name, __assign(__assign({}, model), { fieldsMap: fieldsMap }));
                    }
                    // await this.$connect(); // Bypassed for local load testing without a running DB
                    this.setupSoftDeleteMiddleware();
                    return [2 /*return*/];
                });
            });
        };
        PrismaService_1.prototype.setupSoftDeleteMiddleware = function () {
            var _this = this;
            this.$use(function (params, next) { return __awaiter(_this, void 0, void 0, function () {
                var model, hasDeletedAt, injectSoftDelete_1;
                var _this = this;
                return __generator(this, function (_a) {
                    if (!params.model)
                        return [2 /*return*/, next(params)];
                    model = this.dmmfModels.get(params.model);
                    if (!model)
                        return [2 /*return*/, next(params)];
                    hasDeletedAt = model.fields.some(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    function (f) { return f.name === 'deletedAt'; });
                    if (!hasDeletedAt)
                        return [2 /*return*/, next(params)];
                    if (params.action === 'findUnique' ||
                        params.action === 'findFirst' ||
                        params.action === 'findMany') {
                        if (params.action === 'findUnique') {
                            params.action = 'findFirst';
                        }
                        params.args = params.args || {};
                        injectSoftDelete_1 = function (args, modelName) {
                            if (!args)
                                return;
                            var currentModel = _this.dmmfModels.get(modelName);
                            if (!currentModel)
                                return;
                            var hasDelAt = currentModel.fields.some(
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            function (f) { return f.name === 'deletedAt'; });
                            if (hasDelAt) {
                                if (!args.where) {
                                    args.where = {};
                                }
                                else if (args.where.deletedAt === undefined) {
                                    args.where.deletedAt = null;
                                }
                            }
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            var processNested = function (container) {
                                if (!container)
                                    return;
                                for (var _i = 0, _a = Object.keys(container); _i < _a.length; _i++) {
                                    var key = _a[_i];
                                    var val = container[key];
                                    var field = currentModel.fieldsMap.get(key);
                                    if (field && field.kind === 'object') {
                                        if (val === true) {
                                            container[key] = {};
                                            if (field.isList) {
                                                injectSoftDelete_1(container[key], field.type);
                                            }
                                            else {
                                                // For to-one relations, we just process nested includes but don't inject `where` on this level
                                                processNestedIncludeOnly(container[key], field.type);
                                            }
                                        }
                                        else if (typeof val === 'object' && val !== null) {
                                            if (field.isList) {
                                                injectSoftDelete_1(val, field.type);
                                            }
                                            else {
                                                processNestedIncludeOnly(val, field.type);
                                            }
                                        }
                                    }
                                }
                            };
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            var processNestedIncludeOnly = function (args, modelName) {
                                if (!args)
                                    return;
                                var nestedModel = _this.dmmfModels.get(modelName);
                                if (!nestedModel)
                                    return;
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                var nestedProcess = function (container) {
                                    if (!container)
                                        return;
                                    for (var _i = 0, _a = Object.keys(container); _i < _a.length; _i++) {
                                        var key = _a[_i];
                                        var val = container[key];
                                        var field = nestedModel.fieldsMap.get(key);
                                        if (field && field.kind === 'object') {
                                            if (val === true) {
                                                container[key] = {};
                                                if (field.isList) {
                                                    injectSoftDelete_1(container[key], field.type);
                                                }
                                                else {
                                                    processNestedIncludeOnly(container[key], field.type);
                                                }
                                            }
                                            else if (typeof val === 'object' && val !== null) {
                                                if (field.isList) {
                                                    injectSoftDelete_1(val, field.type);
                                                }
                                                else {
                                                    processNestedIncludeOnly(val, field.type);
                                                }
                                            }
                                        }
                                    }
                                };
                                nestedProcess(args.include);
                                nestedProcess(args.select);
                            };
                            processNested(args.include);
                            processNested(args.select);
                        };
                        injectSoftDelete_1(params.args, params.model);
                    }
                    // We DO NOT convert 'update' to 'updateMany' because updateMany does not support 'include'/'select'
                    // and returns a BatchPayload { count: number } instead of the updated object.
                    // If we want to prevent updating deleted records, we rely on findFirst/findUnique checks beforehand,
                    // which the services already do.
                    if (params.action === 'updateMany') {
                        params.args = params.args || {};
                        if (params.args.where) {
                            if (params.args.where.deletedAt === undefined) {
                                params.args.where = __assign({}, params.args.where);
                            }
                        }
                        else {
                            params.args.where = {};
                        }
                    }
                    if (params.action === 'delete') {
                        params.action = 'update';
                        params.args = params.args || {};
                        params.args.data = { deletedAt: new Date() };
                    }
                    if (params.action === 'deleteMany') {
                        params.action = 'updateMany';
                        params.args = params.args || {};
                        if (params.args.data !== undefined) {
                            params.args.data = __assign(__assign({}, params.args.data), { deletedAt: new Date() });
                        }
                        else {
                            params.args.data = { deletedAt: new Date() };
                        }
                    }
                    return [2 /*return*/, next(params)];
                });
            }); });
        };
        PrismaService_1.prototype.onModuleDestroy = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.$disconnect()];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Executes a callback within a Prisma transaction that has RLS enabled
         * for the given companyId.
         */
        PrismaService_1.prototype.runAsTenant = function (companyId, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: 
                                    // Set the PostgreSQL local configuration variable for this transaction
                                    return [4 /*yield*/, tx.$executeRaw(templateObject_1 || (templateObject_1 = __makeTemplateObject(["SELECT set_config('app.current_company_id', ", ", true)"], ["SELECT set_config('app.current_company_id', ", ", true)"])), companyId)];
                                    case 1:
                                        // Set the PostgreSQL local configuration variable for this transaction
                                        _a.sent();
                                        // Execute the business logic within the RLS-constrained transaction
                                        return [2 /*return*/, callback(tx)];
                                }
                            });
                        }); })];
                });
            });
        };
        /**
         * Executes a callback within a Prisma transaction that bypasses RLS policies
         * for system/admin operations across all companies.
         * A valid reason MUST be provided for security auditing.
         */
        PrismaService_1.prototype.runAsSystem = function (reason, callback) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    if (!reason || reason.trim().length < 5) {
                        throw new Error('A valid reason must be provided to bypass RLS.');
                    }
                    this.logger.warn("[SECURITY_AUDIT] SYSTEM_BYPASS: Bypassing RLS. Reason: ".concat(reason));
                    return [2 /*return*/, this.$transaction(function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: 
                                    // Set the PostgreSQL local configuration variable to bypass RLS
                                    return [4 /*yield*/, tx.$executeRaw(templateObject_2 || (templateObject_2 = __makeTemplateObject(["SELECT set_config('app.bypass_rls', 'on', true)"], ["SELECT set_config('app.bypass_rls', 'on', true)"])))];
                                    case 1:
                                        // Set the PostgreSQL local configuration variable to bypass RLS
                                        _a.sent();
                                        // Execute the business logic
                                        return [2 /*return*/, callback(tx)];
                                }
                            });
                        }); })];
                });
            });
        };
        /**
         * Framework-Level Optimistic Concurrency Control (OCC) Updater.
         * Eliminates the duplicate updateMany -> check count -> findFirst pattern.
         */
        PrismaService_1.prototype.updateWithOcc = function (tx, modelName, id, existingUpdatedAt, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        include) {
            return __awaiter(this, void 0, void 0, function () {
                var model, updateResult, configResult, companyId, finalWhere, updatedEntity;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            model = tx[modelName];
                            return [4 /*yield*/, model.updateMany({
                                    where: { id: id, updatedAt: existingUpdatedAt },
                                    data: __assign(__assign({}, data), { updatedAt: new Date() }),
                                })];
                        case 1:
                            updateResult = _b.sent();
                            if (updateResult.count === 0) {
                                throw new common_1.ConflictException("".concat(modelName, " was modified by another process. Please refresh and try again."));
                            }
                            return [4 /*yield*/, tx.$queryRaw(templateObject_3 || (templateObject_3 = __makeTemplateObject(["SELECT current_setting('app.current_company_id', true) as current_company_id"], ["SELECT current_setting('app.current_company_id', true) as current_company_id"])))];
                        case 2:
                            configResult = _b.sent();
                            companyId = (_a = configResult[0]) === null || _a === void 0 ? void 0 : _a.current_company_id;
                            finalWhere = { id: id };
                            if (companyId) {
                                finalWhere.companyId = companyId;
                            }
                            return [4 /*yield*/, model.findFirst({
                                    where: finalWhere,
                                    include: include,
                                })];
                        case 3:
                            updatedEntity = _b.sent();
                            if (!updatedEntity) {
                                throw new common_1.NotFoundException("".concat(modelName, " not found after update."));
                            }
                            return [2 /*return*/, updatedEntity];
                    }
                });
            });
        };
        return PrismaService_1;
    }(_classSuper));
    __setFunctionName(_classThis, "PrismaService");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        PrismaService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return PrismaService = _classThis;
}();
exports.PrismaService = PrismaService;
var templateObject_1, templateObject_2, templateObject_3;
