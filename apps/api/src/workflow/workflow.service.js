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
exports.WorkflowService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
var common_1 = require("@nestjs/common");
var WorkflowService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var WorkflowService = _classThis = /** @class */ (function () {
        function WorkflowService_1(prisma, conditionEngine, eventEmitter) {
            this.prisma = prisma;
            this.conditionEngine = conditionEngine;
            this.eventEmitter = eventEmitter;
            this.logger = new common_1.Logger(WorkflowService.name);
        }
        // --- CRUD API ---
        WorkflowService_1.prototype.createRule = function (companyId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.workflowRule.create({
                                        data: {
                                            companyId: companyId,
                                            name: dto.name,
                                            entityType: dto.entityType,
                                            trigger: dto.trigger,
                                            conditions: dto.conditions,
                                            actions: dto.actions,
                                            priority: dto.priority || 0,
                                            version: 1,
                                        },
                                    })];
                            });
                        }); })];
                });
            });
        };
        WorkflowService_1.prototype.getRules = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.workflowRule.findMany({
                                        orderBy: { priority: 'desc' },
                                    })];
                            });
                        }); })];
                });
            });
        };
        WorkflowService_1.prototype.getRuleById = function (companyId, id) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var rule;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.workflowRule.findUnique({
                                            where: { id: id, companyId: companyId },
                                        })];
                                    case 1:
                                        rule = _a.sent();
                                        if (!rule)
                                            throw new common_1.NotFoundException("Rule ".concat(id, " not found"));
                                        return [2 /*return*/, rule];
                                }
                            });
                        }); })];
                });
            });
        };
        WorkflowService_1.prototype.updateRule = function (companyId, id, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.getRuleById(companyId, id)];
                                    case 1:
                                        _a.sent(); // Ensure it exists
                                        return [2 /*return*/, tx.workflowRule.update({
                                                where: { id: id, companyId: companyId },
                                                data: {
                                                    name: dto.name,
                                                    trigger: dto.trigger,
                                                    conditions: dto.conditions,
                                                    actions: dto.actions,
                                                    priority: dto.priority,
                                                },
                                            })];
                                }
                            });
                        }); })];
                });
            });
        };
        WorkflowService_1.prototype.deleteRule = function (companyId, id) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.getRuleById(companyId, id)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/, tx.workflowRule.delete({ where: { id: id, companyId: companyId } })];
                                }
                            });
                        }); })];
                });
            });
        };
        WorkflowService_1.prototype.activateRule = function (companyId, id) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.getRuleById(companyId, id)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/, tx.workflowRule.update({
                                                where: { id: id, companyId: companyId },
                                                data: { isActive: true },
                                            })];
                                }
                            });
                        }); })];
                });
            });
        };
        WorkflowService_1.prototype.deactivateRule = function (companyId, id) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.getRuleById(companyId, id)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/, tx.workflowRule.update({
                                                where: { id: id, companyId: companyId },
                                                data: { isActive: false },
                                            })];
                                }
                            });
                        }); })];
                });
            });
        };
        WorkflowService_1.prototype.cloneRule = function (companyId, id) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var rule;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.getRuleById(companyId, id)];
                                    case 1:
                                        rule = _a.sent();
                                        return [2 /*return*/, tx.workflowRule.create({
                                                data: {
                                                    companyId: companyId,
                                                    name: "".concat(rule.name, " (Clone)"),
                                                    entityType: rule.entityType,
                                                    trigger: rule.trigger,
                                                    conditions: rule.conditions || [],
                                                    actions: rule.actions || [],
                                                    priority: rule.priority,
                                                    isActive: false, // Default to inactive when cloned
                                                    version: 1,
                                                },
                                            })];
                                }
                            });
                        }); })];
                });
            });
        };
        // --- VERSIONING ---
        WorkflowService_1.prototype.createVersion = function (companyId, id) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var rule;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.getRuleById(companyId, id)];
                                    case 1:
                                        rule = _a.sent();
                                        // Deactivate current version
                                        return [4 /*yield*/, tx.workflowRule.update({
                                                where: { id: id, companyId: companyId },
                                                data: { isActive: false, name: "".concat(rule.name, " (v").concat(rule.version, ")") },
                                            })];
                                    case 2:
                                        // Deactivate current version
                                        _a.sent();
                                        // Create new version incrementing the version number
                                        return [2 /*return*/, tx.workflowRule.create({
                                                data: {
                                                    companyId: companyId,
                                                    name: rule.name.replace(/ \(v\d+\)$/, ''), // Strip old version tags if any
                                                    entityType: rule.entityType,
                                                    trigger: rule.trigger,
                                                    conditions: rule.conditions || [],
                                                    actions: rule.actions || [],
                                                    priority: rule.priority,
                                                    isActive: true, // The new version is the active one
                                                    version: rule.version + 1,
                                                },
                                            })];
                                }
                            });
                        }); })];
                });
            });
        };
        WorkflowService_1.prototype.getRuleHistory = function (companyId, id) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.ruleExecutionHistory.findMany({
                                        where: { companyId: companyId, ruleId: id },
                                        orderBy: { createdAt: 'desc' },
                                    })];
                            });
                        }); })];
                });
            });
        };
        // --- SIMULATION ---
        WorkflowService_1.prototype.simulateRule = function (companyId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var startTime, conditionsNode, actionsNode, ruleName, rule, isMatch, explanation, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            startTime = Date.now();
                            conditionsNode = null;
                            actionsNode = [];
                            ruleName = 'Simulated Rule';
                            if (!dto.ruleId) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.getRuleById(companyId, dto.ruleId)];
                        case 1:
                            rule = _a.sent();
                            conditionsNode = rule.conditions;
                            actionsNode = rule.actions || [];
                            ruleName = rule.name;
                            return [3 /*break*/, 3];
                        case 2:
                            if (dto.ruleDefinition) {
                                // Simulate arbitrary definition
                                conditionsNode = dto.ruleDefinition.conditions;
                                actionsNode = dto.ruleDefinition.actions;
                                ruleName = dto.ruleDefinition.name;
                            }
                            else {
                                throw new Error('Must provide ruleId or ruleDefinition for simulation');
                            }
                            _a.label = 3;
                        case 3:
                            isMatch = true;
                            explanation = 'All conditions met.';
                            result = 'PASS';
                            try {
                                if (conditionsNode && Object.keys(conditionsNode).length > 0) {
                                    isMatch = this.conditionEngine.evaluate(conditionsNode, dto.entityData);
                                }
                                if (!isMatch) {
                                    result = 'FAIL';
                                    explanation = 'Condition evaluation returned false.';
                                }
                            }
                            catch (e) {
                                isMatch = false;
                                result = 'FAIL';
                                explanation = "Error evaluating rule: ".concat(e.message);
                            }
                            return [2 /*return*/, {
                                    ruleName: ruleName,
                                    result: result,
                                    explanation: explanation,
                                    matchedConditions: isMatch ? conditionsNode : null,
                                    executedActions: isMatch ? actionsNode : [],
                                    executionTimeMs: Date.now() - startTime,
                                    simulationMode: true,
                                    databaseMutated: false, // Explicit guarantee for API consumers
                                }];
                    }
                });
            });
        };
        // --- IMPORT / EXPORT ---
        WorkflowService_1.prototype.exportRules = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var rules;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.getRules(companyId)];
                        case 1:
                            rules = _a.sent();
                            return [2 /*return*/, {
                                    version: '1.0',
                                    exportedAt: new Date().toISOString(),
                                    rules: rules.map(function (r) { return ({
                                        name: r.name,
                                        entityType: r.entityType,
                                        trigger: r.trigger,
                                        conditions: r.conditions,
                                        actions: r.actions,
                                        priority: r.priority,
                                        version: r.version,
                                    }); }),
                                }];
                    }
                });
            });
        };
        WorkflowService_1.prototype.importRules = function (companyId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var createdRules, skippedRules, existingRules, existingSet, rulesToCreate, _i, _a, ruleDef;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        createdRules = [];
                                        skippedRules = [];
                                        return [4 /*yield*/, tx.workflowRule.findMany({
                                                where: {
                                                    companyId: companyId,
                                                    name: { in: dto.rules.map(function (r) { return r.name; }) },
                                                },
                                                select: { name: true, trigger: true },
                                            })];
                                    case 1:
                                        existingRules = _b.sent();
                                        existingSet = new Set(existingRules.map(function (r) { return "".concat(r.name, ":").concat(r.trigger); }));
                                        rulesToCreate = [];
                                        for (_i = 0, _a = dto.rules; _i < _a.length; _i++) {
                                            ruleDef = _a[_i];
                                            // Simple duplicate detection by Name + Trigger in memory
                                            if (existingSet.has("".concat(ruleDef.name, ":").concat(ruleDef.trigger))) {
                                                skippedRules.push({ name: ruleDef.name, reason: 'Duplicate found' });
                                                continue;
                                            }
                                            rulesToCreate.push({
                                                companyId: companyId,
                                                name: ruleDef.name,
                                                entityType: ruleDef.entityType,
                                                trigger: ruleDef.trigger,
                                                conditions: ruleDef.conditions || [],
                                                actions: ruleDef.actions || [],
                                                priority: 0,
                                                version: 1,
                                                isActive: false, // Imported rules default to inactive
                                            });
                                        }
                                        if (!(rulesToCreate.length > 0)) return [3 /*break*/, 3];
                                        return [4 /*yield*/, tx.workflowRule.createMany({
                                                data: rulesToCreate,
                                            })];
                                    case 2:
                                        _b.sent();
                                        _b.label = 3;
                                    case 3: return [2 /*return*/, {
                                            imported: rulesToCreate.length,
                                            skipped: skippedRules.length,
                                            skippedDetails: skippedRules,
                                        }];
                                }
                            });
                        }); })];
                });
            });
        };
        // --- EVALUATION ENGINE ---
        WorkflowService_1.prototype.evaluateRules = function (companyId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var rules, triggeredActions, _i, rules_1, rule, startTime, conditionsNode, isMatch, explanation, result;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.workflowRule.findMany({
                                            where: {
                                                entityType: dto.entityType,
                                                trigger: dto.trigger,
                                                isActive: true,
                                            },
                                            orderBy: { priority: 'desc' },
                                        })];
                                    case 1:
                                        rules = _a.sent();
                                        triggeredActions = [];
                                        _i = 0, rules_1 = rules;
                                        _a.label = 2;
                                    case 2:
                                        if (!(_i < rules_1.length)) return [3 /*break*/, 5];
                                        rule = rules_1[_i];
                                        startTime = Date.now();
                                        conditionsNode = rule.conditions;
                                        isMatch = true;
                                        explanation = 'All conditions met.';
                                        result = 'PASS';
                                        try {
                                            if (conditionsNode && Object.keys(conditionsNode).length > 0) {
                                                isMatch = this.conditionEngine.evaluate(conditionsNode, dto.entityData);
                                            }
                                            if (!isMatch) {
                                                result = 'FAIL';
                                                explanation = 'Condition evaluation returned false.';
                                            }
                                        }
                                        catch (e) {
                                            isMatch = false;
                                            result = 'FAIL';
                                            explanation = "Error evaluating rule: ".concat(e.message);
                                        }
                                        if (isMatch) {
                                            triggeredActions.push.apply(triggeredActions, rule.actions);
                                            this.logger.log("Rule matched: ".concat(rule.name, " executing actions"));
                                        }
                                        // Record execution history
                                        return [4 /*yield*/, tx.ruleExecutionHistory.create({
                                                data: {
                                                    companyId: companyId,
                                                    ruleId: rule.id,
                                                    entityId: dto.entityData.id || 'unknown',
                                                    entityType: dto.entityType,
                                                    result: result,
                                                    explanation: explanation,
                                                    matchedConditions: isMatch ? conditionsNode : [],
                                                    executedActions: isMatch ? rule.actions : [],
                                                    executionTimeMs: Date.now() - startTime,
                                                },
                                            })];
                                    case 3:
                                        // Record execution history
                                        _a.sent();
                                        // Publish internal domain event for successful rule execution
                                        if (isMatch) {
                                            this.eventEmitter.emit('workflow.rule.passed', {
                                                companyId: companyId,
                                                ruleId: rule.id,
                                                entityType: dto.entityType,
                                                entityId: dto.entityData.id,
                                                actions: rule.actions,
                                                timestamp: new Date().toISOString(),
                                            });
                                        }
                                        else {
                                            this.eventEmitter.emit('workflow.rule.failed', {
                                                companyId: companyId,
                                                ruleId: rule.id,
                                                entityType: dto.entityType,
                                                entityId: dto.entityData.id,
                                                reason: explanation,
                                                timestamp: new Date().toISOString(),
                                            });
                                        }
                                        _a.label = 4;
                                    case 4:
                                        _i++;
                                        return [3 /*break*/, 2];
                                    case 5: return [2 /*return*/, { triggeredActions: triggeredActions }];
                                }
                            });
                        }); })];
                });
            });
        };
        return WorkflowService_1;
    }());
    __setFunctionName(_classThis, "WorkflowService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WorkflowService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WorkflowService = _classThis;
}();
exports.WorkflowService = WorkflowService;
