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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionEngineService = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
var common_1 = require("@nestjs/common");
var ConditionEngineService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ConditionEngineService = _classThis = /** @class */ (function () {
        function ConditionEngineService_1() {
            this.logger = new common_1.Logger(ConditionEngineService.name);
        }
        /**
         * Evaluates a node's condition configuration against a given context payload
         * Supports complex logical nesting (AND, OR, NOT)
         */
        ConditionEngineService_1.prototype.evaluate = function (conditionNode, payloadContext) {
            var _this = this;
            if (!conditionNode || !conditionNode.operator)
                return true; // Default to true if empty
            var operator = conditionNode.operator, rules = conditionNode.rules;
            switch (operator) {
                case 'AND':
                    return rules.every(function (rule) {
                        return _this.evaluateRule(rule, payloadContext);
                    });
                case 'OR':
                    return rules.some(function (rule) {
                        return _this.evaluateRule(rule, payloadContext);
                    });
                case 'NOT':
                    return !this.evaluateRule(rules[0] || conditionNode, payloadContext);
                default:
                    // Single rule without AND/OR grouping
                    return this.evaluateRule(conditionNode, payloadContext);
            }
        };
        ConditionEngineService_1.prototype.evaluateRule = function (rule, context) {
            if (rule.operator === 'AND' ||
                rule.operator === 'OR' ||
                rule.operator === 'NOT') {
                return this.evaluate(rule, context);
            }
            var value = this.getValueFromPath(context, rule.field);
            var target = rule.value;
            switch (rule.operator) {
                case 'EQUALS':
                    return value === target;
                case 'NOT_EQUALS':
                    return value !== target;
                case 'GREATER_THAN':
                    return value > target;
                case 'GREATER_THAN_OR_EQUAL':
                    return value >= target;
                case 'LESS_THAN':
                    return value < target;
                case 'LESS_THAN_OR_EQUAL':
                    return value <= target;
                case 'CONTAINS':
                    return typeof value === 'string' && value.includes(target);
                case 'STARTS_WITH':
                    return typeof value === 'string' && value.startsWith(target);
                case 'ENDS_WITH':
                    return typeof value === 'string' && value.endsWith(target);
                case 'REGEX':
                    try {
                        return new RegExp(target).test(String(value));
                    }
                    catch (_a) {
                        return false;
                    }
                case 'IN':
                    return Array.isArray(target) && target.includes(value);
                case 'NOT_IN':
                    return Array.isArray(target) && !target.includes(value);
                case 'BETWEEN':
                    return (Array.isArray(target) &&
                        target.length === 2 &&
                        value >= target[0] &&
                        value <= target[1]);
                case 'EXISTS':
                    return value !== undefined && value !== null;
                case 'NOT_EXISTS':
                    return value === undefined || value === null;
                default:
                    this.logger.warn("Unknown operator: ".concat(rule.operator));
                    return false;
            }
        };
        ConditionEngineService_1.prototype.getValueFromPath = function (obj, path) {
            if (!path || !obj)
                return undefined;
            var parts = path.split('.');
            return parts.reduce(function (acc, part) { return (acc && acc[part] !== undefined ? acc[part] : undefined); }, obj);
        };
        return ConditionEngineService_1;
    }());
    __setFunctionName(_classThis, "ConditionEngineService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ConditionEngineService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ConditionEngineService = _classThis;
}();
exports.ConditionEngineService = ConditionEngineService;
