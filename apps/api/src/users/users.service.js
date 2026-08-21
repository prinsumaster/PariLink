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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
var pagination_util_1 = require("../platform/api/utils/pagination.util");
var common_1 = require("@nestjs/common");
var bcrypt = __importStar(require("bcryptjs"));
var UsersService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var UsersService = _classThis = /** @class */ (function () {
        function UsersService_1(prisma, auditService, eventStore) {
            this.prisma = prisma;
            this.auditService = auditService;
            this.eventStore = eventStore;
        }
        UsersService_1.prototype.create = function (companyId, createUserDto) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var existingUser, hashedPassword, user, password, result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.user.findUnique({
                                            where: { email: createUserDto.email },
                                        })];
                                    case 1:
                                        existingUser = _a.sent();
                                        if (existingUser) {
                                            throw new common_1.ConflictException('Email already exists');
                                        }
                                        return [4 /*yield*/, bcrypt.hash(createUserDto.password, 12)];
                                    case 2:
                                        hashedPassword = _a.sent();
                                        return [4 /*yield*/, tx.user.create({
                                                data: __assign(__assign({}, createUserDto), { password: hashedPassword, companyId: companyId }),
                                            })];
                                    case 3:
                                        user = _a.sent();
                                        password = user.password, result = __rest(user, ["password"]);
                                        return [4 /*yield*/, this.auditService.logEvent({
                                                action: 'USER_CREATED',
                                                entity: 'User',
                                                entityId: user.id,
                                                companyId: companyId,
                                                source: 'API',
                                                details: { email: user.email },
                                            })];
                                    case 4:
                                        _a.sent();
                                        return [4 /*yield*/, this.eventStore.append({
                                                tenantId: companyId,
                                                streamType: 'USER',
                                                streamId: user.id,
                                                eventType: 'UserCreated',
                                                payload: { email: user.email, roleId: user.roleId },
                                            })];
                                    case 5:
                                        _a.sent();
                                        return [2 /*return*/, result];
                                }
                            });
                        }); })];
                });
            });
        };
        UsersService_1.prototype.findAll = function (companyId, query) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, page, _b, limit, search, status, _c, skip, take, where, _d, users, total, data;
                            return __generator(this, function (_e) {
                                switch (_e.label) {
                                    case 0:
                                        _a = query.page, page = _a === void 0 ? 1 : _a, _b = query.limit, limit = _b === void 0 ? 10 : _b, search = query.search, status = query.status;
                                        _c = (0, pagination_util_1.getPaginationParams)(page, limit), skip = _c.skip, take = _c.take;
                                        where = { companyId: companyId };
                                        if (search) {
                                            where.OR = [
                                                { firstName: { contains: search, mode: 'insensitive' } },
                                                { lastName: { contains: search, mode: 'insensitive' } },
                                                { email: { contains: search, mode: 'insensitive' } },
                                            ];
                                        }
                                        if (query.roleId) {
                                            where.roleId = query.roleId;
                                        }
                                        if (status) {
                                            where.status = status;
                                        }
                                        return [4 /*yield*/, Promise.all([
                                                tx.user.findMany({
                                                    where: where,
                                                    skip: skip,
                                                    take: take,
                                                    orderBy: { createdAt: 'desc' },
                                                    include: { role: true },
                                                }),
                                                tx.user.count({ where: where }),
                                            ])];
                                    case 1:
                                        _d = _e.sent(), users = _d[0], total = _d[1];
                                        data = users.map(function (user) {
                                            var password = user.password, result = __rest(user, ["password"]);
                                            return result;
                                        });
                                        return [2 /*return*/, (0, pagination_util_1.createPaginationResponse)(data, total, page, limit)];
                                }
                            });
                        }); })];
                });
            });
        };
        UsersService_1.prototype.findOne = function (companyId, id) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var user, password, result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.user.findFirst({
                                            where: { id: id, companyId: companyId },
                                            include: { role: true },
                                        })];
                                    case 1:
                                        user = _a.sent();
                                        if (!user) {
                                            throw new common_1.NotFoundException("User with ID ".concat(id, " not found"));
                                        }
                                        password = user.password, result = __rest(user, ["password"]);
                                        return [2 /*return*/, result];
                                }
                            });
                        }); })];
                });
            });
        };
        UsersService_1.prototype.update = function (companyId, id, updateUserDto) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var existingUser, user, password, result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.user.findFirst({
                                            where: { id: id, companyId: companyId },
                                        })];
                                    case 1:
                                        existingUser = _a.sent();
                                        if (!existingUser)
                                            throw new common_1.NotFoundException();
                                        return [4 /*yield*/, tx.user.update({
                                                where: { id: id, companyId: companyId },
                                                data: updateUserDto,
                                            })];
                                    case 2:
                                        user = _a.sent();
                                        password = user.password, result = __rest(user, ["password"]);
                                        return [4 /*yield*/, this.auditService.logEvent({
                                                action: 'USER_UPDATED',
                                                entity: 'User',
                                                entityId: user.id,
                                                companyId: companyId,
                                                source: 'API',
                                            })];
                                    case 3:
                                        _a.sent();
                                        return [4 /*yield*/, this.eventStore.append({
                                                tenantId: companyId,
                                                streamType: 'USER',
                                                streamId: user.id,
                                                eventType: 'UserUpdated',
                                                payload: updateUserDto,
                                            })];
                                    case 4:
                                        _a.sent();
                                        return [2 /*return*/, result];
                                }
                            });
                        }); })];
                });
            });
        };
        UsersService_1.prototype.remove = function (companyId, id) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var existingUser, user, password, result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.user.findFirst({
                                            where: { id: id, companyId: companyId },
                                        })];
                                    case 1:
                                        existingUser = _a.sent();
                                        if (!existingUser)
                                            throw new common_1.NotFoundException();
                                        return [4 /*yield*/, tx.user.update({
                                                where: { id: id, companyId: companyId },
                                                data: { deletedAt: new Date(), status: 'INACTIVE' },
                                            })];
                                    case 2:
                                        user = _a.sent();
                                        password = user.password, result = __rest(user, ["password"]);
                                        return [4 /*yield*/, this.auditService.logEvent({
                                                action: 'USER_DELETED',
                                                entity: 'User',
                                                entityId: user.id,
                                                companyId: companyId,
                                                source: 'API',
                                            })];
                                    case 3:
                                        _a.sent();
                                        return [4 /*yield*/, this.eventStore.append({
                                                tenantId: companyId,
                                                streamType: 'USER',
                                                streamId: user.id,
                                                eventType: 'UserDeleted',
                                                payload: {},
                                            })];
                                    case 4:
                                        _a.sent();
                                        return [2 /*return*/, result];
                                }
                            });
                        }); })];
                });
            });
        };
        return UsersService_1;
    }());
    __setFunctionName(_classThis, "UsersService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UsersService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UsersService = _classThis;
}();
exports.UsersService = UsersService;
