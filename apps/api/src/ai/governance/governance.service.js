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
exports.AiGovernanceService = void 0;
var common_1 = require("@nestjs/common");
// ─── PII Patterns ──────────────────────────────────────────────────────────
var PII_PATTERNS = [
    {
        name: 'SSN',
        pattern: /\b\d{3}-\d{2}-\d{4}\b/g,
        replacement: '[SSN REDACTED]',
    },
    { name: 'SSN_NO_DASH', pattern: /\b\d{9}\b/g, replacement: '[ID REDACTED]' },
    {
        name: 'CREDIT_CARD',
        pattern: /\b(?:\d[ -]?){13,16}\b/g,
        replacement: '[CC REDACTED]',
    },
    {
        name: 'ROUTING_NUMBER',
        pattern: /\b\d{9}\b/g,
        replacement: '[ROUTING REDACTED]',
    },
    {
        name: 'EMAIL_INTERNAL',
        pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
        replacement: '[EMAIL REDACTED]',
    },
    {
        name: 'PHONE',
        pattern: /\b(?:\+1\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}\b/g,
        replacement: '[PHONE REDACTED]',
    },
    {
        name: 'LICENSE_PLATE',
        pattern: /\b[A-Z]{1,3}[-\s]?\d{1,4}[-\s]?[A-Z0-9]{0,4}\b/g,
        replacement: '[PLATE REDACTED]',
    },
    {
        name: 'DOB',
        pattern: /\b(?:dob|date of birth|born on|born)[\s:]+\d{1,2}[-/]\d{1,2}[-/]\d{2,4}\b/gi,
        replacement: '[DOB REDACTED]',
    },
];
// ─── Output Policy Violations ─────────────────────────────────────────────
var OUTPUT_POLICY_VIOLATIONS = [
    {
        pattern: /\bkill\s+all\s+(jobs|processes|tasks)\b/i,
        severity: 'HIGH',
        label: 'Destructive instruction',
    },
    {
        pattern: /\bexecute\s+rm\s+-rf\b/i,
        severity: 'CRITICAL',
        label: 'Shell injection attempt',
    },
    {
        pattern: /\bDROP\s+TABLE\b/i,
        severity: 'CRITICAL',
        label: 'SQL injection in output',
    },
    {
        pattern: /\bignore\s+all\s+previous\s+instructions\b/i,
        severity: 'HIGH',
        label: 'Prompt injection in output',
    },
    {
        pattern: /\bdisregard\s+(your\s+)?(instructions|guidelines|rules)\b/i,
        severity: 'HIGH',
        label: 'Instruction override attempt',
    },
    {
        pattern: /as an? (ai|llm|language model),?\s+i (don't|do not) have/i,
        severity: 'LOW',
        label: 'AI identity disclosure',
    },
];
// ─── Prompt Injection Patterns ─────────────────────────────────────────────
var INJECTION_PATTERNS = [
    /ignore\s+all\s+previous\s+instructions/i,
    /you\s+are\s+now\s+(a|an)\s+[a-z]+\s+(ai|bot|assistant)/i,
    /act\s+as\s+(?:if\s+you\s+were\s+)?(?:a\s+)?(?:unrestricted|jailbroken|dan)/i,
    /forget\s+everything\s+and/i,
    /new\s+instructions?\s*:/i,
    /system\s+override/i,
    /\[system\s*prompt\]/i,
    /\/\*.*\*\//s, // Multiline comment injection
];
var AiGovernanceService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AiGovernanceService = _classThis = /** @class */ (function () {
        function AiGovernanceService_1(prisma) {
            this.prisma = prisma;
            this.logger = new common_1.Logger(AiGovernanceService.name);
            this.CONFIDENCE_THRESHOLD = 0.85;
            // Audit log for governance events (production: persist to Prisma)
            this.governanceAuditLog = [];
        }
        // ─── Recommendation Governance ────────────────────────────────────────────
        AiGovernanceService_1.prototype.evaluateRecommendation = function (recommendationId) {
            return __awaiter(this, void 0, void 0, function () {
                var rec;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.aiRecommendation.findUnique({
                                            where: { id: recommendationId },
                                        })];
                                });
                            }); })];
                        case 1:
                            rec = _a.sent();
                            if (!rec)
                                throw new common_1.ForbiddenException('Recommendation not found');
                            if (!(rec.confidence < this.CONFIDENCE_THRESHOLD)) return [3 /*break*/, 3];
                            this.logger.warn("Recommendation ".concat(recommendationId, " rejected by Governance (confidence ").concat(rec.confidence, " < ").concat(this.CONFIDENCE_THRESHOLD, ")"));
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.aiRecommendation.update({
                                                where: { id: recommendationId },
                                                data: { status: 'REJECTED' },
                                            })];
                                    });
                                }); })];
                        case 2:
                            _a.sent();
                            this.logGovernanceEvent('RECOMMENDATION_REJECTED', 'MEDIUM', "Confidence ".concat(rec.confidence, " below threshold"), rec.companyId);
                            return [2 /*return*/, false];
                        case 3: return [2 /*return*/, true];
                    }
                });
            });
        };
        AiGovernanceService_1.prototype.acceptRecommendation = function (recommendationId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    this.logGovernanceEvent('RECOMMENDATION_ACCEPTED', 'LOW', "Accepted by ".concat(userId));
                    return [2 /*return*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.aiRecommendation.update({
                                        where: { id: recommendationId },
                                        data: {
                                            status: 'ACCEPTED',
                                            actionTakenAt: new Date(),
                                            actionTakenBy: userId,
                                        },
                                    })];
                            });
                        }); })];
                });
            });
        };
        // ─── PII Redaction ────────────────────────────────────────────────────────
        /**
         * Scrub PII from user input before sending to LLM providers.
         * Returns the redacted text and a list of what was found.
         */
        AiGovernanceService_1.prototype.redactPii = function (text) {
            var redacted = text;
            var found = [];
            for (var _i = 0, PII_PATTERNS_1 = PII_PATTERNS; _i < PII_PATTERNS_1.length; _i++) {
                var _a = PII_PATTERNS_1[_i], name_1 = _a.name, pattern = _a.pattern, replacement = _a.replacement;
                var before = redacted;
                redacted = redacted.replace(pattern, replacement);
                if (before !== redacted) {
                    found.push(name_1);
                }
            }
            if (found.length > 0) {
                this.logger.warn("PII detected and redacted: ".concat(found.join(', ')));
                this.logGovernanceEvent('PII_REDACTED', 'MEDIUM', "Redacted: ".concat(found.join(', ')));
            }
            return { redacted: redacted, found: found };
        };
        // ─── Prompt Injection Protection ─────────────────────────────────────────
        /**
         * Detect and neutralize prompt injection attacks in user input.
         */
        AiGovernanceService_1.prototype.sanitizeInput = function (input) {
            for (var _i = 0, INJECTION_PATTERNS_1 = INJECTION_PATTERNS; _i < INJECTION_PATTERNS_1.length; _i++) {
                var pattern = INJECTION_PATTERNS_1[_i];
                if (pattern.test(input)) {
                    this.logger.warn("Prompt injection attempt detected and blocked: \"".concat(input.substring(0, 80), "...\""));
                    this.logGovernanceEvent('PROMPT_INJECTION_BLOCKED', 'HIGH', "Pattern matched: ".concat(pattern.toString().substring(0, 50)));
                    // Strip the malicious segment and replace with a warning
                    return input.replace(pattern, '[BLOCKED: Policy violation]');
                }
            }
            return input;
        };
        // ─── Output Validation ────────────────────────────────────────────────────
        /**
         * Validate AI output for policy violations before returning to user.
         * Returns {valid: true} or {valid: false, violations: [...]}.
         */
        AiGovernanceService_1.prototype.validateOutput = function (output) {
            var violations = [];
            for (var _i = 0, OUTPUT_POLICY_VIOLATIONS_1 = OUTPUT_POLICY_VIOLATIONS; _i < OUTPUT_POLICY_VIOLATIONS_1.length; _i++) {
                var rule = OUTPUT_POLICY_VIOLATIONS_1[_i];
                if (rule.pattern.test(output)) {
                    violations.push({ label: rule.label, severity: rule.severity });
                    this.logger.warn("Output policy violation: ".concat(rule.label, " (").concat(rule.severity, ")"));
                    this.logGovernanceEvent('OUTPUT_POLICY_VIOLATION', rule.severity, rule.label);
                }
            }
            return { valid: violations.length === 0, violations: violations };
        };
        // ─── Compliance Reporting ─────────────────────────────────────────────────
        /**
         * Generate a governance compliance report for a company.
         */
        AiGovernanceService_1.prototype.getComplianceReport = function (companyId) {
            var relevantLogs = companyId
                ? this.governanceAuditLog.filter(function (l) { return !l.companyId || l.companyId === companyId; })
                : this.governanceAuditLog;
            var byCategory = {};
            var bySeverity = {};
            for (var _i = 0, relevantLogs_1 = relevantLogs; _i < relevantLogs_1.length; _i++) {
                var log = relevantLogs_1[_i];
                byCategory[log.event] = (byCategory[log.event] || 0) + 1;
                bySeverity[log.severity] = (bySeverity[log.severity] || 0) + 1;
            }
            // Score: start at 100, deduct for violations
            var score = 100;
            score -= (bySeverity['CRITICAL'] || 0) * 20;
            score -= (bySeverity['HIGH'] || 0) * 10;
            score -= (bySeverity['MEDIUM'] || 0) * 3;
            score -= (bySeverity['LOW'] || 0) * 1;
            score = Math.max(0, Math.min(100, score));
            return {
                reportGeneratedAt: new Date().toISOString(),
                companyId: companyId || 'GLOBAL',
                totalGovernanceEvents: relevantLogs.length,
                byCategory: byCategory,
                bySeverity: bySeverity,
                recentEvents: relevantLogs
                    .slice(-10)
                    .reverse()
                    .map(function (l) { return ({
                    event: l.event,
                    severity: l.severity,
                    timestamp: l.timestamp,
                    details: l.details,
                }); }),
                complianceScore: score,
            };
        };
        // ─── RBAC for AI ──────────────────────────────────────────────────────────
        /**
         * Validate that a user has the required AI permission before executing an action.
         */
        AiGovernanceService_1.prototype.assertAiPermission = function (userId, companyId, requiredPermission) {
            return __awaiter(this, void 0, void 0, function () {
                var user, userPermissions, hasPermission, e_1;
                var _this = this;
                var _a, _b;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.user.findFirst({
                                                where: { id: userId, companyId: companyId },
                                                include: { role: true },
                                            })];
                                    });
                                }); })];
                        case 1:
                            user = _c.sent();
                            if (!user)
                                throw new common_1.ForbiddenException('User not found');
                            userPermissions = ((_b = (_a = user.role) === null || _a === void 0 ? void 0 : _a.permissions) === null || _b === void 0 ? void 0 : _b.map(function (p) { return p.action; })) || [];
                            hasPermission = userPermissions.includes(requiredPermission) ||
                                userPermissions.includes('*') ||
                                userPermissions.includes('ai:*');
                            if (!hasPermission) {
                                this.logGovernanceEvent('AI_PERMISSION_DENIED', 'HIGH', "User ".concat(userId, " denied access to ").concat(requiredPermission), companyId, userId);
                                throw new common_1.ForbiddenException("Insufficient AI permissions. Required: ".concat(requiredPermission));
                            }
                            return [3 /*break*/, 3];
                        case 2:
                            e_1 = _c.sent();
                            if (e_1 instanceof common_1.ForbiddenException)
                                throw e_1;
                            // DB error — fail open in dev, fail closed in prod
                            if (process.env.NODE_ENV === 'production') {
                                throw new common_1.ForbiddenException('Permission verification failed');
                            }
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // ─── Internal Logging ─────────────────────────────────────────────────────
        AiGovernanceService_1.prototype.logGovernanceEvent = function (event, severity, details, companyId, userId) {
            this.governanceAuditLog.push({
                event: event,
                timestamp: new Date(),
                companyId: companyId,
                userId: userId,
                severity: severity,
                details: details,
            });
            // Keep last 5000 entries
            if (this.governanceAuditLog.length > 5000)
                this.governanceAuditLog.shift();
        };
        return AiGovernanceService_1;
    }());
    __setFunctionName(_classThis, "AiGovernanceService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AiGovernanceService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AiGovernanceService = _classThis;
}();
exports.AiGovernanceService = AiGovernanceService;
