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
exports.CopilotService = void 0;
var common_1 = require("@nestjs/common");
var CopilotService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var CopilotService = _classThis = /** @class */ (function () {
        function CopilotService_1(prisma, security, bpm, eventStore, observability, sqlGenerator) {
            this.prisma = prisma;
            this.security = security;
            this.bpm = bpm;
            this.eventStore = eventStore;
            this.observability = observability;
            this.sqlGenerator = sqlGenerator;
            this.logger = new common_1.Logger(CopilotService.name);
        }
        /**
         * Main entrypoint for Natural Language Operations.
         */
        CopilotService_1.prototype.processRequest = function (req) {
            return __awaiter(this, void 0, void 0, function () {
                var startTime, user, roles, intent, result, _a, latency, err_1, errorMessage;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            startTime = Date.now();
                            this.logger.log("Copilot processing request from User ".concat(req.userId, ": \"").concat(req.prompt, "\""));
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.user.findUnique({
                                                where: { id: req.userId },
                                                include: { role: true },
                                            })];
                                    });
                                }); })];
                        case 1:
                            user = _b.sent();
                            roles = (user === null || user === void 0 ? void 0 : user.role) ? [user.role.name.toUpperCase()] : [];
                            if (!roles || roles.length === 0) {
                                throw new common_1.ForbiddenException('User lacks sufficient roles to invoke Copilot.');
                            }
                            _b.label = 2;
                        case 2:
                            _b.trys.push([2, 12, , 14]);
                            intent = this.classifyIntent(req.prompt);
                            result = void 0;
                            _a = intent.type;
                            switch (_a) {
                                case 'QUERY': return [3 /*break*/, 3];
                                case 'ACTION': return [3 /*break*/, 5];
                                case 'SUMMARY': return [3 /*break*/, 7];
                            }
                            return [3 /*break*/, 9];
                        case 3: return [4 /*yield*/, this.executeDataQuery(req.companyId, intent, roles, req.prompt)];
                        case 4:
                            result = _b.sent();
                            return [3 /*break*/, 10];
                        case 5: return [4 /*yield*/, this.executeBpmAction(req.companyId, req.userId, intent)];
                        case 6:
                            result = _b.sent();
                            return [3 /*break*/, 10];
                        case 7: return [4 /*yield*/, this.generateSummary(req.companyId, intent)];
                        case 8:
                            result = _b.sent();
                            return [3 /*break*/, 10];
                        case 9:
                            result = {
                                response: "I'm sorry, I couldn't understand that operational request.",
                            };
                            _b.label = 10;
                        case 10:
                            latency = Date.now() - startTime;
                            return [4 /*yield*/, this.observability.logRequest(req, intent, result, latency, 0.95)];
                        case 11:
                            _b.sent();
                            return [2 /*return*/, result];
                        case 12:
                            err_1 = _b.sent();
                            errorMessage = err_1 instanceof Error ? err_1.message : String(err_1);
                            return [4 /*yield*/, this.observability.logError(req, errorMessage, Date.now() - startTime)];
                        case 13:
                            _b.sent();
                            throw err_1;
                        case 14: return [2 /*return*/];
                    }
                });
            });
        };
        CopilotService_1.prototype.classifyIntent = function (prompt) {
            // Simulated NLP classification extracting intent, entities, and action
            if (prompt.toLowerCase().includes('delayed trips')) {
                return {
                    type: 'QUERY',
                    domain: 'DISPATCH',
                    entity: 'TRIP',
                    filter: 'DELAYED',
                };
            }
            if (prompt.toLowerCase().includes('approve invoice')) {
                return {
                    type: 'ACTION',
                    domain: 'FINANCE',
                    action: 'APPROVE_INVOICE',
                    targetId: 'INV-123',
                };
            }
            if (prompt.toLowerCase().includes('summarize today')) {
                return { type: 'SUMMARY', domain: 'OPERATIONS', scope: 'TODAY' };
            }
            return { type: 'UNKNOWN' };
        };
        CopilotService_1.prototype.executeDataQuery = function (companyId, intent, userRoles, prompt) {
            return __awaiter(this, void 0, void 0, function () {
                var sqlResult, e_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // Check basic roles or domains
                            if (!userRoles.includes('DISPATCHER') && !userRoles.includes('ADMIN')) {
                                throw new common_1.ForbiddenException("Access denied to domain ".concat(intent.domain));
                            }
                            _a.label = 1;
                        case 1:
                            _a.trys.push([1, 3, , 4]);
                            this.logger.log("Invoking SqlGenerator for prompt: ".concat(prompt));
                            return [4 /*yield*/, this.sqlGenerator.generateAndExecuteSafeSql(companyId, prompt)];
                        case 2:
                            sqlResult = _a.sent();
                            // If result is empty or not useful, we can format a generic message, else we just return the raw data.
                            return [2 /*return*/, {
                                    response: "Found ".concat((sqlResult === null || sqlResult === void 0 ? void 0 : sqlResult.length) || 0, " records matching your query."),
                                    data: sqlResult,
                                }];
                        case 3:
                            e_1 = _a.sent();
                            this.logger.error('Error executing AI SQL query: ' + e_1.message);
                            throw e_1;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        CopilotService_1.prototype.executeBpmAction = function (companyId, userId, intent) {
            return __awaiter(this, void 0, void 0, function () {
                var bpmResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            // Copilot NEVER bypasses existing APIs; it strictly invokes BPM Process Engine.
                            this.logger.log("Copilot initiating BPM action: ".concat(intent.action));
                            return [4 /*yield*/, this.bpm.startProcess(companyId, intent.action, { targetId: intent.targetId }, userId)];
                        case 1:
                            bpmResult = _a.sent();
                            return [2 /*return*/, {
                                    response: "I have initiated the approval workflow for ".concat(intent.targetId, "."),
                                    processId: bpmResult.processInstanceId,
                                }];
                    }
                });
            });
        };
        CopilotService_1.prototype.generateSummary = function (companyId, intent) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, {
                            response: "Today's operations encountered 2 delays and 1 breakdown. 450 loads were delivered.",
                        }];
                });
            });
        };
        return CopilotService_1;
    }());
    __setFunctionName(_classThis, "CopilotService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        CopilotService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return CopilotService = _classThis;
}();
exports.CopilotService = CopilotService;
