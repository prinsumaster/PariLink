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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportRulesDto = exports.SimulateRuleDto = exports.UpdateWorkflowRuleDto = exports.EvaluateWorkflowDto = exports.CreateWorkflowRuleDto = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var CreateWorkflowRuleDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _entityType_decorators;
    var _entityType_initializers = [];
    var _entityType_extraInitializers = [];
    var _trigger_decorators;
    var _trigger_initializers = [];
    var _trigger_extraInitializers = [];
    var _conditions_decorators;
    var _conditions_initializers = [];
    var _conditions_extraInitializers = [];
    var _actions_decorators;
    var _actions_initializers = [];
    var _actions_extraInitializers = [];
    var _priority_decorators;
    var _priority_initializers = [];
    var _priority_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateWorkflowRuleDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.entityType = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _entityType_initializers, void 0));
                this.trigger = (__runInitializers(this, _entityType_extraInitializers), __runInitializers(this, _trigger_initializers, void 0));
                this.conditions = (__runInitializers(this, _trigger_extraInitializers), __runInitializers(this, _conditions_initializers, void 0));
                this.actions = (__runInitializers(this, _conditions_extraInitializers), __runInitializers(this, _actions_initializers, void 0));
                this.priority = (__runInitializers(this, _actions_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                __runInitializers(this, _priority_extraInitializers);
            }
            return CreateWorkflowRuleDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _entityType_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _trigger_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _conditions_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsOptional)()];
            _actions_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsArray)()];
            _priority_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _entityType_decorators, { kind: "field", name: "entityType", static: false, private: false, access: { has: function (obj) { return "entityType" in obj; }, get: function (obj) { return obj.entityType; }, set: function (obj, value) { obj.entityType = value; } }, metadata: _metadata }, _entityType_initializers, _entityType_extraInitializers);
            __esDecorate(null, null, _trigger_decorators, { kind: "field", name: "trigger", static: false, private: false, access: { has: function (obj) { return "trigger" in obj; }, get: function (obj) { return obj.trigger; }, set: function (obj, value) { obj.trigger = value; } }, metadata: _metadata }, _trigger_initializers, _trigger_extraInitializers);
            __esDecorate(null, null, _conditions_decorators, { kind: "field", name: "conditions", static: false, private: false, access: { has: function (obj) { return "conditions" in obj; }, get: function (obj) { return obj.conditions; }, set: function (obj, value) { obj.conditions = value; } }, metadata: _metadata }, _conditions_initializers, _conditions_extraInitializers);
            __esDecorate(null, null, _actions_decorators, { kind: "field", name: "actions", static: false, private: false, access: { has: function (obj) { return "actions" in obj; }, get: function (obj) { return obj.actions; }, set: function (obj, value) { obj.actions = value; } }, metadata: _metadata }, _actions_initializers, _actions_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: function (obj) { return "priority" in obj; }, get: function (obj) { return obj.priority; }, set: function (obj, value) { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateWorkflowRuleDto = CreateWorkflowRuleDto;
var EvaluateWorkflowDto = function () {
    var _a;
    var _entityType_decorators;
    var _entityType_initializers = [];
    var _entityType_extraInitializers = [];
    var _trigger_decorators;
    var _trigger_initializers = [];
    var _trigger_extraInitializers = [];
    var _entityData_decorators;
    var _entityData_initializers = [];
    var _entityData_extraInitializers = [];
    return _a = /** @class */ (function () {
            function EvaluateWorkflowDto() {
                this.entityType = __runInitializers(this, _entityType_initializers, void 0);
                this.trigger = (__runInitializers(this, _entityType_extraInitializers), __runInitializers(this, _trigger_initializers, void 0));
                this.entityData = (__runInitializers(this, _trigger_extraInitializers), __runInitializers(this, _entityData_initializers, void 0));
                __runInitializers(this, _entityData_extraInitializers);
            }
            return EvaluateWorkflowDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _entityType_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _trigger_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _entityData_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _entityType_decorators, { kind: "field", name: "entityType", static: false, private: false, access: { has: function (obj) { return "entityType" in obj; }, get: function (obj) { return obj.entityType; }, set: function (obj, value) { obj.entityType = value; } }, metadata: _metadata }, _entityType_initializers, _entityType_extraInitializers);
            __esDecorate(null, null, _trigger_decorators, { kind: "field", name: "trigger", static: false, private: false, access: { has: function (obj) { return "trigger" in obj; }, get: function (obj) { return obj.trigger; }, set: function (obj, value) { obj.trigger = value; } }, metadata: _metadata }, _trigger_initializers, _trigger_extraInitializers);
            __esDecorate(null, null, _entityData_decorators, { kind: "field", name: "entityData", static: false, private: false, access: { has: function (obj) { return "entityData" in obj; }, get: function (obj) { return obj.entityData; }, set: function (obj, value) { obj.entityData = value; } }, metadata: _metadata }, _entityData_initializers, _entityData_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.EvaluateWorkflowDto = EvaluateWorkflowDto;
var UpdateWorkflowRuleDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _trigger_decorators;
    var _trigger_initializers = [];
    var _trigger_extraInitializers = [];
    var _conditions_decorators;
    var _conditions_initializers = [];
    var _conditions_extraInitializers = [];
    var _actions_decorators;
    var _actions_initializers = [];
    var _actions_extraInitializers = [];
    var _priority_decorators;
    var _priority_initializers = [];
    var _priority_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateWorkflowRuleDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.trigger = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _trigger_initializers, void 0));
                this.conditions = (__runInitializers(this, _trigger_extraInitializers), __runInitializers(this, _conditions_initializers, void 0));
                this.actions = (__runInitializers(this, _conditions_extraInitializers), __runInitializers(this, _actions_initializers, void 0));
                this.priority = (__runInitializers(this, _actions_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                __runInitializers(this, _priority_extraInitializers);
            }
            return UpdateWorkflowRuleDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _trigger_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _conditions_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsOptional)()];
            _actions_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsArray)(), (0, class_validator_1.IsOptional)()];
            _priority_decorators = [(0, swagger_1.ApiProperty)({ required: false }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _trigger_decorators, { kind: "field", name: "trigger", static: false, private: false, access: { has: function (obj) { return "trigger" in obj; }, get: function (obj) { return obj.trigger; }, set: function (obj, value) { obj.trigger = value; } }, metadata: _metadata }, _trigger_initializers, _trigger_extraInitializers);
            __esDecorate(null, null, _conditions_decorators, { kind: "field", name: "conditions", static: false, private: false, access: { has: function (obj) { return "conditions" in obj; }, get: function (obj) { return obj.conditions; }, set: function (obj, value) { obj.conditions = value; } }, metadata: _metadata }, _conditions_initializers, _conditions_extraInitializers);
            __esDecorate(null, null, _actions_decorators, { kind: "field", name: "actions", static: false, private: false, access: { has: function (obj) { return "actions" in obj; }, get: function (obj) { return obj.actions; }, set: function (obj, value) { obj.actions = value; } }, metadata: _metadata }, _actions_initializers, _actions_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: function (obj) { return "priority" in obj; }, get: function (obj) { return obj.priority; }, set: function (obj, value) { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateWorkflowRuleDto = UpdateWorkflowRuleDto;
var SimulateRuleDto = function () {
    var _a;
    var _ruleDefinition_decorators;
    var _ruleDefinition_initializers = [];
    var _ruleDefinition_extraInitializers = [];
    var _ruleId_decorators;
    var _ruleId_initializers = [];
    var _ruleId_extraInitializers = [];
    var _entityData_decorators;
    var _entityData_initializers = [];
    var _entityData_extraInitializers = [];
    return _a = /** @class */ (function () {
            function SimulateRuleDto() {
                this.ruleDefinition = __runInitializers(this, _ruleDefinition_initializers, void 0);
                this.ruleId = (__runInitializers(this, _ruleDefinition_extraInitializers), __runInitializers(this, _ruleId_initializers, void 0));
                this.entityData = (__runInitializers(this, _ruleId_extraInitializers), __runInitializers(this, _entityData_initializers, void 0));
                __runInitializers(this, _entityData_extraInitializers);
            }
            return SimulateRuleDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _ruleDefinition_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsOptional)()];
            _ruleId_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsString)(), (0, class_validator_1.IsOptional)()];
            _entityData_decorators = [(0, swagger_1.ApiProperty)()];
            __esDecorate(null, null, _ruleDefinition_decorators, { kind: "field", name: "ruleDefinition", static: false, private: false, access: { has: function (obj) { return "ruleDefinition" in obj; }, get: function (obj) { return obj.ruleDefinition; }, set: function (obj, value) { obj.ruleDefinition = value; } }, metadata: _metadata }, _ruleDefinition_initializers, _ruleDefinition_extraInitializers);
            __esDecorate(null, null, _ruleId_decorators, { kind: "field", name: "ruleId", static: false, private: false, access: { has: function (obj) { return "ruleId" in obj; }, get: function (obj) { return obj.ruleId; }, set: function (obj, value) { obj.ruleId = value; } }, metadata: _metadata }, _ruleId_initializers, _ruleId_extraInitializers);
            __esDecorate(null, null, _entityData_decorators, { kind: "field", name: "entityData", static: false, private: false, access: { has: function (obj) { return "entityData" in obj; }, get: function (obj) { return obj.entityData; }, set: function (obj, value) { obj.entityData = value; } }, metadata: _metadata }, _entityData_initializers, _entityData_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.SimulateRuleDto = SimulateRuleDto;
var ImportRulesDto = function () {
    var _a;
    var _rules_decorators;
    var _rules_initializers = [];
    var _rules_extraInitializers = [];
    return _a = /** @class */ (function () {
            function ImportRulesDto() {
                this.rules = __runInitializers(this, _rules_initializers, void 0);
                __runInitializers(this, _rules_extraInitializers);
            }
            return ImportRulesDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _rules_decorators = [(0, swagger_1.ApiProperty)(), (0, class_validator_1.IsArray)()];
            __esDecorate(null, null, _rules_decorators, { kind: "field", name: "rules", static: false, private: false, access: { has: function (obj) { return "rules" in obj; }, get: function (obj) { return obj.rules; }, set: function (obj, value) { obj.rules = value; } }, metadata: _metadata }, _rules_initializers, _rules_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.ImportRulesDto = ImportRulesDto;
