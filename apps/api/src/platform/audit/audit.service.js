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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditService = void 0;
var common_1 = require("@nestjs/common");
var crypto = __importStar(require("crypto"));
var AuditService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuditService = _classThis = /** @class */ (function () {
        function AuditService_1(prisma, encryption) {
            this.prisma = prisma;
            this.encryption = encryption;
            this.logger = new common_1.Logger(AuditService.name);
        }
        AuditService_1.prototype.logEvent = function (event, requestContext, 
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        txClient) {
            return __awaiter(this, void 0, void 0, function () {
                var timestamp, integrityPayload, eventHmac, previousRecord, prevDetails, previousHash, currentHash, sanitizedDetails, dbClient, err_1, errorMessage, errorStack;
                var _this = this;
                var _a, _b, _c, _d, _e;
                return __generator(this, function (_f) {
                    switch (_f.label) {
                        case 0:
                            timestamp = new Date().toISOString();
                            integrityPayload = JSON.stringify({
                                action: event.action,
                                entity: event.entity,
                                entityId: event.entityId,
                                companyId: event.companyId,
                                userId: (_a = event.userId) !== null && _a !== void 0 ? _a : 'SYSTEM',
                                timestamp: timestamp,
                            });
                            eventHmac = this.encryption.hmacSign(integrityPayload);
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.auditLog.findFirst({
                                                where: { companyId: event.companyId },
                                                orderBy: { createdAt: 'desc' },
                                                select: { id: true, details: true },
                                            })];
                                    });
                                }); })];
                        case 1:
                            previousRecord = _f.sent();
                            prevDetails = previousRecord === null || previousRecord === void 0 ? void 0 : previousRecord.details;
                            previousHash = (_c = (_b = prevDetails === null || prevDetails === void 0 ? void 0 : prevDetails._integrity) === null || _b === void 0 ? void 0 : _b.currentHash) !== null && _c !== void 0 ? _c : '0'.repeat(64);
                            currentHash = crypto
                                .createHash('sha256')
                                .update(previousHash + integrityPayload)
                                .digest('hex');
                            sanitizedDetails = this.sanitizeForAudit(__assign(__assign({}, event.details), { requestContext: requestContext, _integrity: { hmac: eventHmac, timestamp: timestamp, previousHash: previousHash, currentHash: currentHash } }));
                            _f.label = 2;
                        case 2:
                            _f.trys.push([2, 4, , 5]);
                            dbClient = txClient || this.prisma;
                            // eslint-disable-next-line no-restricted-syntax
                            return [4 /*yield*/, dbClient.auditLog.create({
                                    data: {
                                        action: event.action,
                                        entity: event.entity,
                                        entityType: (_d = event.entityType) !== null && _d !== void 0 ? _d : event.entity,
                                        entityId: event.entityId,
                                        details: sanitizedDetails,
                                        beforeValue: event.beforeValue
                                            ? this.sanitizeForAudit(event.beforeValue)
                                            : undefined,
                                        afterValue: event.afterValue
                                            ? this.sanitizeForAudit(event.afterValue)
                                            : undefined,
                                        reason: event.reason,
                                        correlationId: event.correlationId,
                                        source: (_e = event.source) !== null && _e !== void 0 ? _e : 'API',
                                        userId: event.userId,
                                        companyId: event.companyId,
                                    },
                                })];
                        case 3:
                            // eslint-disable-next-line no-restricted-syntax
                            _f.sent();
                            return [3 /*break*/, 5];
                        case 4:
                            err_1 = _f.sent();
                            errorMessage = err_1 instanceof Error ? err_1.message : String(err_1);
                            errorStack = err_1 instanceof Error ? err_1.stack : undefined;
                            // Audit failures must be highly visible — never silently swallowed
                            this.logger.error("[AuditFabric] FAILED to write audit log: ".concat(errorMessage), errorStack);
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Verify the integrity of an existing audit log entry.
         * Returns true if the record has not been tampered with.
         */
        AuditService_1.prototype.verifyIntegrity = function (auditLogId) {
            return __awaiter(this, void 0, void 0, function () {
                var record, details, _a, hmac, timestamp, expectedPayload, isValid;
                var _this = this;
                var _b, _c;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.auditLog.findUnique({
                                            where: { id: auditLogId },
                                        })];
                                });
                            }); })];
                        case 1:
                            record = _d.sent();
                            if (!record)
                                return [2 /*return*/, false];
                            details = record.details;
                            if (!((_b = details === null || details === void 0 ? void 0 : details._integrity) === null || _b === void 0 ? void 0 : _b.hmac))
                                return [2 /*return*/, false];
                            _a = details._integrity, hmac = _a.hmac, timestamp = _a.timestamp;
                            expectedPayload = JSON.stringify({
                                action: record.action,
                                entity: record.entity,
                                entityId: record.entityId,
                                companyId: record.companyId,
                                userId: (_c = record.userId) !== null && _c !== void 0 ? _c : 'SYSTEM',
                                timestamp: timestamp,
                            });
                            isValid = this.encryption.hmacVerify(expectedPayload, hmac);
                            if (!isValid) {
                                this.logger.error("[AuditFabric] TAMPER DETECTED on audit record ".concat(auditLogId));
                            }
                            return [2 /*return*/, isValid];
                    }
                });
            });
        };
        /**
         * Verify the hash chain integrity for a tenant's audit log.
         * Returns a summary of chain integrity: total records, verified count,
         * and the first broken link (if any).
         */
        AuditService_1.prototype.verifyChain = function (companyId_1) {
            return __awaiter(this, arguments, void 0, function (companyId, limit) {
                var records, valid, broken, firstBrokenId, expectedPreviousHash, _i, records_1, record, details, integrity, integrityPayload, computedHash;
                var _this = this;
                var _a;
                if (limit === void 0) { limit = 1000; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.auditLog.findMany({
                                            where: { companyId: companyId },
                                            orderBy: { createdAt: 'asc' },
                                            take: limit,
                                            select: {
                                                id: true,
                                                action: true,
                                                entity: true,
                                                entityId: true,
                                                companyId: true,
                                                userId: true,
                                                details: true,
                                            },
                                        })];
                                });
                            }); })];
                        case 1:
                            records = _b.sent();
                            valid = 0;
                            broken = 0;
                            firstBrokenId = null;
                            expectedPreviousHash = '0'.repeat(64);
                            for (_i = 0, records_1 = records; _i < records_1.length; _i++) {
                                record = records_1[_i];
                                details = record.details;
                                integrity = details === null || details === void 0 ? void 0 : details._integrity;
                                if (!(integrity === null || integrity === void 0 ? void 0 : integrity.currentHash) || !(integrity === null || integrity === void 0 ? void 0 : integrity.previousHash)) {
                                    // Legacy record without chain — skip but count
                                    valid++;
                                    continue;
                                }
                                if (integrity.previousHash !== expectedPreviousHash) {
                                    broken++;
                                    if (!firstBrokenId)
                                        firstBrokenId = record.id;
                                }
                                else {
                                    integrityPayload = JSON.stringify({
                                        action: record.action,
                                        entity: record.entity,
                                        entityId: record.entityId,
                                        companyId: record.companyId,
                                        userId: (_a = record.userId) !== null && _a !== void 0 ? _a : 'SYSTEM',
                                        timestamp: integrity.timestamp,
                                    });
                                    computedHash = crypto
                                        .createHash('sha256')
                                        .update(integrity.previousHash + integrityPayload)
                                        .digest('hex');
                                    if (computedHash === integrity.currentHash) {
                                        valid++;
                                    }
                                    else {
                                        broken++;
                                        if (!firstBrokenId)
                                            firstBrokenId = record.id;
                                    }
                                }
                                expectedPreviousHash = integrity.currentHash;
                            }
                            return [2 /*return*/, {
                                    totalChecked: records.length,
                                    valid: valid,
                                    broken: broken,
                                    firstBrokenId: firstBrokenId,
                                }];
                    }
                });
            });
        };
        /**
         * Export audit logs for a tenant within a date range.
         * Returns structured data suitable for compliance reporting.
         */
        AuditService_1.prototype.exportAuditLogs = function (companyId, fromDate, toDate, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var where, records;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            where = {
                                companyId: companyId,
                                createdAt: { gte: fromDate, lte: toDate },
                            };
                            if (userId)
                                where.userId = userId;
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.auditLog.findMany({
                                                where: where,
                                                orderBy: { createdAt: 'asc' },
                                                take: 10000,
                                            })];
                                    });
                                }); })];
                        case 1:
                            records = _a.sent();
                            return [2 /*return*/, {
                                    exportedAt: new Date().toISOString(),
                                    companyId: companyId,
                                    totalRecords: records.length,
                                    records: records,
                                }];
                    }
                });
            });
        };
        // ─────────────────────────────────────────────────────────────────────────
        // Sanitization — prevent secrets / large blobs from leaking into audit logs
        // ─────────────────────────────────────────────────────────────────────────
        AuditService_1.prototype.sanitizeForAudit = function (data) {
            if (!data || typeof data !== 'object')
                return data;
            var REDACTED = '[REDACTED]';
            var sensitiveKeys = new Set([
                'password',
                'passwordHash',
                'currentPassword',
                'newPassword',
                'token',
                'refreshToken',
                'accessToken',
                'apiKey',
                'apiSecret',
                'secret',
                'credentials',
                'privateKey',
                'encryptedDek',
                'credit_card',
                'cardNumber',
                'cvv',
                'aadhaar',
                'pan',
                'bankAccount',
                'ifsc',
                'upi',
                'drivingLicence',
                'rcNumber',
                'insuranceNumber',
                'passport',
                'nationalId',
                'ssn',
                'totpSecret',
            ]);
            var sanitize = function (obj) {
                if (Array.isArray(obj))
                    return obj.map(sanitize);
                if (obj && typeof obj === 'object') {
                    return Object.fromEntries(Object.entries(obj).map(function (_a) {
                        var k = _a[0], v = _a[1];
                        return [
                            k,
                            sensitiveKeys.has(k) ? REDACTED : sanitize(v),
                        ];
                    }));
                }
                return obj;
            };
            return sanitize(data);
        };
        return AuditService_1;
    }());
    __setFunctionName(_classThis, "AuditService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuditService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuditService = _classThis;
}();
exports.AuditService = AuditService;
