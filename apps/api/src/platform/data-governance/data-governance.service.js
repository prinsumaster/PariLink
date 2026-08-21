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
exports.DataGovernanceService = exports.RETENTION_POLICIES = exports.SENSITIVE_FIELD_REGISTRY = void 0;
var common_1 = require("@nestjs/common");
/** Canonical sensitive field registry.
 *  All PII and financial fields across the platform are registered here.
 *  This drives automatic masking in API responses for non-privileged callers. */
exports.SENSITIVE_FIELD_REGISTRY = [
    {
        field: 'email',
        classification: 'CONFIDENTIAL',
        pii: true,
        financial: false,
        maskPattern: 'email',
    },
    {
        field: 'phone',
        classification: 'CONFIDENTIAL',
        pii: true,
        financial: false,
        maskPattern: 'phone',
    },
    {
        field: 'mobileNumber',
        classification: 'CONFIDENTIAL',
        pii: true,
        financial: false,
        maskPattern: 'phone',
    },
    {
        field: 'aadhaarNumber',
        classification: 'RESTRICTED',
        pii: true,
        financial: false,
        maskPattern: 'aadhaar',
    },
    {
        field: 'panNumber',
        classification: 'RESTRICTED',
        pii: true,
        financial: false,
        maskPattern: 'pan',
    },
    {
        field: 'licenseNumber',
        classification: 'CONFIDENTIAL',
        pii: true,
        financial: false,
        maskPattern: 'partial',
    },
    {
        field: 'bankAccount',
        classification: 'RESTRICTED',
        pii: true,
        financial: true,
        maskPattern: 'partial',
    },
    {
        field: 'ifscCode',
        classification: 'CONFIDENTIAL',
        pii: false,
        financial: true,
    },
    {
        field: 'password',
        classification: 'RESTRICTED',
        pii: false,
        financial: false,
        maskPattern: 'partial',
    },
    {
        field: 'passwordHash',
        classification: 'RESTRICTED',
        pii: false,
        financial: false,
        maskPattern: 'partial',
    },
    {
        field: 'gstNumber',
        classification: 'INTERNAL',
        pii: false,
        financial: true,
    },
    {
        field: 'invoiceAmount',
        classification: 'CONFIDENTIAL',
        pii: false,
        financial: true,
    },
];
/** Retention policies per entity type (days). 0 = indefinite. */
exports.RETENTION_POLICIES = {
    auditLog: 2555, // 7 years — regulatory requirement
    platformMetric: 90, // 90 days
    vehicleLocation: 365, // 1 year
    domainEvent: 365,
    aiInteractionLog: 180,
    webhookDelivery: 30,
    syncJob: 30,
};
var DataGovernanceService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var DataGovernanceService = _classThis = /** @class */ (function () {
        function DataGovernanceService_1() {
            this.logger = new common_1.Logger(DataGovernanceService.name);
            this.fieldRegistry = new Map(exports.SENSITIVE_FIELD_REGISTRY.map(function (f) { return [f.field, f]; }));
        }
        /** Classify a field name and return its governance metadata. */
        DataGovernanceService_1.prototype.classify = function (fieldName) {
            return this.fieldRegistry.get(fieldName);
        };
        /**
         * Mask PII and financial fields in an object for API responses.
         * Call this before returning data to low-privilege callers.
         * Pass `privileged=true` to skip masking (e.g., for admin dashboards).
         */
        DataGovernanceService_1.prototype.maskForResponse = function (data, privileged) {
            var _this = this;
            if (privileged === void 0) { privileged = false; }
            if (privileged)
                return data;
            var result = (Array.isArray(data) ? [] : {});
            for (var _i = 0, _a = Object.entries(data); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value = _b[1];
                var classification = this.fieldRegistry.get(key);
                if (classification === null || classification === void 0 ? void 0 : classification.maskPattern) {
                    result[key] = this.applyMask(typeof value === 'string' ? value : JSON.stringify(value !== null && value !== void 0 ? value : ''), classification.maskPattern);
                }
                else if (Array.isArray(value)) {
                    result[key] = value.map(function (item) {
                        return typeof item === 'object' && item !== null
                            ? _this.maskForResponse(item, privileged)
                            : item;
                    });
                }
                else if (value && typeof value === 'object') {
                    result[key] = this.maskForResponse(value, privileged);
                }
                else {
                    result[key] = value;
                }
            }
            return result;
        };
        /** Returns the retention policy (days) for an entity type. */
        DataGovernanceService_1.prototype.getRetentionDays = function (entityType) {
            var _a;
            return (_a = exports.RETENTION_POLICIES[entityType]) !== null && _a !== void 0 ? _a : 0;
        };
        /** Returns all PII fields registered in the platform (for DPDP erasure processing). */
        DataGovernanceService_1.prototype.getPiiFields = function () {
            return exports.SENSITIVE_FIELD_REGISTRY.filter(function (f) { return f.pii; }).map(function (f) { return f.field; });
        };
        /** Annotates a data record with data lineage metadata. */
        DataGovernanceService_1.prototype.annotateLineage = function (data, source, tenantId) {
            return __assign(__assign({}, data), { _lineage: {
                    source: source,
                    tenantId: tenantId,
                    ingestedAt: new Date().toISOString(),
                    classification: 'INTERNAL',
                } });
        };
        // ─────────────────────────────────────────────────────────────────────────
        DataGovernanceService_1.prototype.applyMask = function (value, pattern) {
            if (!value)
                return value;
            switch (pattern) {
                case 'email': {
                    var _a = value.split('@'), name_1 = _a[0], domain = _a[1];
                    if (!domain)
                        return '***';
                    return "".concat(name_1.charAt(0), "***@").concat(domain);
                }
                case 'phone': {
                    return value.replace(/\d(?=\d{4})/g, '*');
                }
                case 'aadhaar': {
                    return "****-****-".concat(value.slice(-4));
                }
                case 'pan': {
                    return "".concat(value.slice(0, 2), "***").concat(value.slice(-2));
                }
                case 'partial': {
                    if (value.length <= 4)
                        return '****';
                    return "".concat(value.slice(0, 2)).concat('*'.repeat(value.length - 4)).concat(value.slice(-2));
                }
                default:
                    return '***';
            }
        };
        return DataGovernanceService_1;
    }());
    __setFunctionName(_classThis, "DataGovernanceService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        DataGovernanceService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return DataGovernanceService = _classThis;
}();
exports.DataGovernanceService = DataGovernanceService;
