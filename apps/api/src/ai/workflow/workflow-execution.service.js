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
exports.WorkflowExecutionService = void 0;
var common_1 = require("@nestjs/common");
// In-memory execution store (production: use Redis/Prisma)
var executions = new Map();
var WorkflowExecutionService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var WorkflowExecutionService = _classThis = /** @class */ (function () {
        function WorkflowExecutionService_1(prisma, llmManager, observability) {
            this.prisma = prisma;
            this.llmManager = llmManager;
            this.observability = observability;
            this.logger = new common_1.Logger(WorkflowExecutionService.name);
        }
        /**
         * Start a workflow execution. Creates steps from the workflow definition,
         * runs non-approval steps automatically, pauses at approval gates.
         */
        WorkflowExecutionService_1.prototype.executeWorkflow = function (workflowName, companyId, input, initiatedBy) {
            return __awaiter(this, void 0, void 0, function () {
                var executionId, steps, execution;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            executionId = "exec_".concat(Date.now(), "_").concat(Math.random().toString(36).slice(2, 8));
                            steps = this.buildWorkflowSteps(workflowName, input);
                            execution = {
                                executionId: executionId,
                                workflowName: workflowName,
                                companyId: companyId,
                                initiatedBy: initiatedBy,
                                steps: steps,
                                status: 'RUNNING',
                                createdAt: new Date(),
                            };
                            executions.set(executionId, execution);
                            this.logger.log("Workflow started: ".concat(workflowName, " [").concat(executionId, "] by ").concat(initiatedBy));
                            // Run workflow steps until hitting an approval gate
                            return [4 /*yield*/, this.processWorkflow(executionId, input)];
                        case 1:
                            // Run workflow steps until hitting an approval gate
                            _a.sent();
                            return [2 /*return*/, executions.get(executionId)];
                    }
                });
            });
        };
        WorkflowExecutionService_1.prototype.processWorkflow = function (executionId, input) {
            return __awaiter(this, void 0, void 0, function () {
                var execution, _i, _a, step, output, error_1;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            execution = executions.get(executionId);
                            if (!execution)
                                return [2 /*return*/];
                            _i = 0, _a = execution.steps;
                            _b.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 10];
                            step = _a[_i];
                            if (step.status !== 'PENDING')
                                return [3 /*break*/, 9];
                            step.status = 'RUNNING';
                            this.logger.log("Executing step: ".concat(step.name, " [").concat(executionId, "]"));
                            _b.label = 2;
                        case 2:
                            _b.trys.push([2, 7, , 9]);
                            return [4 /*yield*/, this.llmManager.generateResponse("You are executing step \"".concat(step.name, "\" of the \"").concat(execution.workflowName, "\" workflow.\n           Step Description: ").concat(step.description, "\n           Provide a concise execution result for this step."), "Input context: ".concat(JSON.stringify(input, null, 2)), {}, undefined, 'logistics_analyst')];
                        case 3:
                            output = _b.sent();
                            step.output = output;
                            if (!step.requiresApproval) return [3 /*break*/, 5];
                            step.status = 'AWAITING_APPROVAL';
                            execution.status = 'AWAITING_APPROVAL';
                            this.logger.log("Step \"".concat(step.name, "\" paused \u2014 awaiting human approval (").concat(step.approverRole || 'any manager', ")"));
                            // Log to audit trail
                            return [4 /*yield*/, this.logWorkflowAudit(execution, step, 'AWAITING_APPROVAL')];
                        case 4:
                            // Log to audit trail
                            _b.sent();
                            return [2 /*return*/]; // Pause until approved
                        case 5:
                            step.status = 'COMPLETED';
                            return [4 /*yield*/, this.logWorkflowAudit(execution, step, 'COMPLETED')];
                        case 6:
                            _b.sent();
                            return [3 /*break*/, 9];
                        case 7:
                            error_1 = _b.sent();
                            step.status = 'FAILED';
                            execution.status = 'FAILED';
                            this.logger.error("Step failed: ".concat(step.name, " \u2014 ").concat(error_1.message));
                            return [4 /*yield*/, this.logWorkflowAudit(execution, step, 'FAILED')];
                        case 8:
                            _b.sent();
                            return [2 /*return*/];
                        case 9:
                            _i++;
                            return [3 /*break*/, 1];
                        case 10:
                            // All steps completed
                            if (execution.steps.every(function (s) { return s.status === 'COMPLETED'; })) {
                                execution.status = 'COMPLETED';
                                execution.completedAt = new Date();
                                this.logger.log("Workflow completed: ".concat(execution.workflowName, " [").concat(executionId, "]"));
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Human approves a pending workflow step — resumes execution
         */
        WorkflowExecutionService_1.prototype.approveWorkflow = function (executionId, stepId, approvedBy) {
            return __awaiter(this, void 0, void 0, function () {
                var execution, step;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            execution = executions.get(executionId);
                            if (!execution)
                                throw new common_1.NotFoundException("Execution ".concat(executionId, " not found"));
                            step = execution.steps.find(function (s) { return s.stepId === stepId; });
                            if (!step)
                                throw new common_1.NotFoundException("Step ".concat(stepId, " not found"));
                            if (step.status !== 'AWAITING_APPROVAL') {
                                throw new Error("Step ".concat(stepId, " is not awaiting approval (status: ").concat(step.status, ")"));
                            }
                            step.status = 'APPROVED';
                            step.approvedBy = approvedBy;
                            step.approvedAt = new Date();
                            execution.status = 'RUNNING';
                            this.logger.log("Step \"".concat(step.name, "\" approved by ").concat(approvedBy, " \u2014 resuming workflow"));
                            return [4 /*yield*/, this.logWorkflowAudit(execution, step, 'APPROVED')];
                        case 1:
                            _a.sent();
                            // Resume execution
                            return [4 /*yield*/, this.processWorkflow(executionId, {})];
                        case 2:
                            // Resume execution
                            _a.sent();
                            return [2 /*return*/, executions.get(executionId)];
                    }
                });
            });
        };
        /**
         * Human rejects a pending workflow step — triggers escalation
         */
        WorkflowExecutionService_1.prototype.rejectWorkflow = function (executionId, stepId, rejectedBy, reason) {
            return __awaiter(this, void 0, void 0, function () {
                var execution, step;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            execution = executions.get(executionId);
                            if (!execution)
                                throw new common_1.NotFoundException("Execution ".concat(executionId, " not found"));
                            step = execution.steps.find(function (s) { return s.stepId === stepId; });
                            if (!step)
                                throw new common_1.NotFoundException("Step ".concat(stepId, " not found"));
                            step.status = 'REJECTED';
                            execution.status = 'REJECTED';
                            execution.rollbackReason = reason;
                            this.logger.warn("Workflow \"".concat(execution.workflowName, "\" rejected by ").concat(rejectedBy, ": ").concat(reason));
                            return [4 /*yield*/, this.logWorkflowAudit(execution, step, 'REJECTED', reason)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, execution];
                    }
                });
            });
        };
        /**
         * List all active executions for a company
         */
        WorkflowExecutionService_1.prototype.getExecutions = function (companyId) {
            return Array.from(executions.values()).filter(function (e) { return e.companyId === companyId; });
        };
        /**
         * Get a specific execution by ID
         */
        WorkflowExecutionService_1.prototype.getExecution = function (executionId) {
            var execution = executions.get(executionId);
            if (!execution)
                throw new common_1.NotFoundException("Execution ".concat(executionId, " not found"));
            return execution;
        };
        /**
         * Build workflow steps from a named template
         */
        WorkflowExecutionService_1.prototype.buildWorkflowSteps = function (workflowName, _input) {
            var templates = {
                shipment_delay_analysis: [
                    {
                        stepId: 'step_1',
                        name: 'Gather Delay Context',
                        description: 'Collect shipment location, estimated delay, and contributing factors',
                        requiresApproval: false,
                        status: 'PENDING',
                    },
                    {
                        stepId: 'step_2',
                        name: 'Root Cause Analysis',
                        description: 'Identify primary and secondary causes of the delay',
                        requiresApproval: false,
                        status: 'PENDING',
                    },
                    {
                        stepId: 'step_3',
                        name: 'Mitigation Recommendation',
                        description: 'Generate rerouting and notification recommendations',
                        requiresApproval: true,
                        approverRole: 'DISPATCHER',
                        status: 'PENDING',
                    },
                    {
                        stepId: 'step_4',
                        name: 'Customer Notification',
                        description: 'Draft and send proactive delay notification to customer',
                        requiresApproval: true,
                        approverRole: 'MANAGER',
                        status: 'PENDING',
                    },
                ],
                exception_handling: [
                    {
                        stepId: 'step_1',
                        name: 'Exception Classification',
                        description: 'Classify the exception type and severity level',
                        requiresApproval: false,
                        status: 'PENDING',
                    },
                    {
                        stepId: 'step_2',
                        name: 'Impact Assessment',
                        description: 'Assess operational and financial impact of the exception',
                        requiresApproval: false,
                        status: 'PENDING',
                    },
                    {
                        stepId: 'step_3',
                        name: 'Resolution Plan',
                        description: 'Generate resolution steps and timeline',
                        requiresApproval: true,
                        approverRole: 'SUPERVISOR',
                        status: 'PENDING',
                    },
                ],
                invoice_review: [
                    {
                        stepId: 'step_1',
                        name: 'Invoice Validation',
                        description: 'Validate invoice amounts, line items, and billing codes',
                        requiresApproval: false,
                        status: 'PENDING',
                    },
                    {
                        stepId: 'step_2',
                        name: 'Anomaly Detection',
                        description: 'Flag any billing discrepancies or unusual charges',
                        requiresApproval: false,
                        status: 'PENDING',
                    },
                    {
                        stepId: 'step_3',
                        name: 'Approval Decision',
                        description: 'Recommend approve, dispute, or hold for review',
                        requiresApproval: true,
                        approverRole: 'FINANCE_MANAGER',
                        status: 'PENDING',
                    },
                ],
                support_triage: [
                    {
                        stepId: 'step_1',
                        name: 'Issue Classification',
                        description: 'Classify support issue type, severity, and affected system',
                        requiresApproval: false,
                        status: 'PENDING',
                    },
                    {
                        stepId: 'step_2',
                        name: 'Knowledge Base Search',
                        description: 'Search for existing solutions or known issues',
                        requiresApproval: false,
                        status: 'PENDING',
                    },
                    {
                        stepId: 'step_3',
                        name: 'Resolution Draft',
                        description: 'Generate draft resolution or escalation path',
                        requiresApproval: false,
                        status: 'PENDING',
                    },
                ],
                operational_summary: [
                    {
                        stepId: 'step_1',
                        name: 'Data Collection',
                        description: 'Aggregate operational data across fleet, loads, and finance',
                        requiresApproval: false,
                        status: 'PENDING',
                    },
                    {
                        stepId: 'step_2',
                        name: 'KPI Analysis',
                        description: 'Analyze KPI trends and flag anomalies',
                        requiresApproval: false,
                        status: 'PENDING',
                    },
                    {
                        stepId: 'step_3',
                        name: 'Executive Summary',
                        description: 'Generate executive operational summary with recommendations',
                        requiresApproval: false,
                        status: 'PENDING',
                    },
                ],
            };
            return (templates[workflowName] || [
                {
                    stepId: 'step_1',
                    name: 'Analysis',
                    description: "Execute custom workflow: ".concat(workflowName),
                    requiresApproval: true,
                    approverRole: 'MANAGER',
                    status: 'PENDING',
                },
            ]);
        };
        WorkflowExecutionService_1.prototype.logWorkflowAudit = function (execution, step, status, notes) {
            return __awaiter(this, void 0, void 0, function () {
                var agentRecord_1, _a;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 4, , 5]);
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.aiAgent.findFirst()];
                                }); }); })];
                        case 1:
                            agentRecord_1 = _b.sent();
                            if (!agentRecord_1) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.aiInteractionLog.create({
                                                data: {
                                                    agentId: agentRecord_1.id,
                                                    prompt: "Workflow: ".concat(execution.workflowName, " | Step: ").concat(step.name),
                                                    response: step.output || notes || status,
                                                    userId: step.approvedBy || execution.initiatedBy,
                                                    companyId: execution.companyId,
                                                    sessionId: execution.executionId,
                                                },
                                            })];
                                    });
                                }); })];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3: return [3 /*break*/, 5];
                        case 4:
                            _a = _b.sent();
                            return [3 /*break*/, 5];
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        return WorkflowExecutionService_1;
    }());
    __setFunctionName(_classThis, "WorkflowExecutionService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WorkflowExecutionService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WorkflowExecutionService = _classThis;
}();
exports.WorkflowExecutionService = WorkflowExecutionService;
