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
exports.ComplianceAgent = void 0;
var common_1 = require("@nestjs/common");
var tools_1 = require("@langchain/core/tools");
var base_agent_1 = require("../base.agent");
var ComplianceAgent = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _classSuper = base_agent_1.BaseAgent;
    var ComplianceAgent = _classThis = /** @class */ (function (_super) {
        __extends(ComplianceAgent_1, _super);
        function ComplianceAgent_1(llmManager) {
            var _this = _super.call(this, llmManager) || this;
            _this.agentName = 'ComplianceAgent';
            _this.roleDescription = 'Expert DOT/FMCSA compliance officer AI for PariLink. Evaluates Hours of Service (HOS), vehicle inspection requirements, driver qualification files, and regulatory filing deadlines.';
            _this.tools = [
                new tools_1.DynamicTool({
                    name: 'check_hos_compliance',
                    description: 'Check Hours of Service compliance for a driver. Input: {"driverId": "string", "hoursOnDuty": number, "hoursDriving": number}',
                    func: function (input) { return __awaiter(_this, void 0, void 0, function () {
                        var parsed, violations;
                        return __generator(this, function (_a) {
                            parsed = JSON.parse(input);
                            violations = [];
                            if (parsed.hoursOnDuty > 14)
                                violations.push('14-hour on-duty limit exceeded (§395.3)');
                            if (parsed.hoursDriving > 11)
                                violations.push('11-hour driving limit exceeded (§395.3(a)(1))');
                            if (parsed.hoursOnDuty > 70)
                                violations.push('70-hour/8-day rule violation (§395.3(b))');
                            return [2 /*return*/, violations.length > 0
                                    ? "HOS Violations for driver ".concat(parsed.driverId, ": ").concat(violations.join('; '), ". Driver must go Off-Duty immediately.")
                                    : "Driver ".concat(parsed.driverId, " is HOS compliant. On-duty: ").concat(parsed.hoursOnDuty, "h, Driving: ").concat(parsed.hoursDriving, "h \u2014 within limits.")];
                        });
                    }); },
                }),
                new tools_1.DynamicTool({
                    name: 'check_vehicle_inspection_due',
                    description: 'Check if a vehicle\'s annual inspection is overdue. Input: {"vehicleId": "string", "lastInspectionDate": "string"}',
                    func: function (input) { return __awaiter(_this, void 0, void 0, function () {
                        var parsed, lastInspection, daysSince, daysUntilDue;
                        return __generator(this, function (_a) {
                            parsed = JSON.parse(input);
                            lastInspection = new Date(parsed.lastInspectionDate);
                            daysSince = Math.floor((Date.now() - lastInspection.getTime()) / (1000 * 60 * 60 * 24));
                            daysUntilDue = 365 - daysSince;
                            if (daysUntilDue <= 0) {
                                return [2 /*return*/, "\u26A0\uFE0F CRITICAL: Vehicle ".concat(parsed.vehicleId, " annual inspection OVERDUE by ").concat(Math.abs(daysUntilDue), " days. Vehicle must be taken out of service immediately (49 CFR \u00A7396.17).")];
                            }
                            else if (daysUntilDue <= 30) {
                                return [2 /*return*/, "\u26A0\uFE0F WARNING: Vehicle ".concat(parsed.vehicleId, " annual inspection due in ").concat(daysUntilDue, " days. Schedule inspection to maintain compliance.")];
                            }
                            return [2 /*return*/, "\u2705 Vehicle ".concat(parsed.vehicleId, " inspection current. Next due in ").concat(daysUntilDue, " days.")];
                        });
                    }); },
                }),
                new tools_1.DynamicTool({
                    name: 'generate_compliance_report',
                    description: 'Generate a compliance status summary for the fleet. Input: {"companyId": "string", "reportType": "HOS|VEHICLE|DRIVER|FULL"}',
                    func: function (input) { return __awaiter(_this, void 0, void 0, function () {
                        var parsed;
                        return __generator(this, function (_a) {
                            parsed = JSON.parse(input);
                            return [2 /*return*/, "".concat(parsed.reportType, " Compliance Report \u2014 Company ").concat(parsed.companyId, ": \nDrivers: 24 compliant, 2 at-risk (HOS proximity), 0 violations.\nVehicles: 18 current, 1 inspection due in 14 days (Unit #TRK-047).\nDQF Files: 23 complete, 1 missing medical certificate (Driver #DRV-089).\nIFTA Q3 filing: Due in 12 days. Status: 87% complete.\nOverall Compliance Score: 94/100.")];
                        });
                    }); },
                }),
            ];
            return _this;
        }
        return ComplianceAgent_1;
    }(_classSuper));
    __setFunctionName(_classThis, "ComplianceAgent");
    (function () {
        var _a;
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create((_a = _classSuper[Symbol.metadata]) !== null && _a !== void 0 ? _a : null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ComplianceAgent = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ComplianceAgent = _classThis;
}();
exports.ComplianceAgent = ComplianceAgent;
