"use strict";
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
exports.ExportService = void 0;
var common_1 = require("@nestjs/common");
var json2csv_1 = require("json2csv");
var archiver = __importStar(require("archiver"));
var ExportService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ExportService = _classThis = /** @class */ (function () {
        function ExportService_1(prisma) {
            this.prisma = prisma;
            this.logger = new common_1.Logger(ExportService.name);
        }
        ExportService_1.prototype.exportCompanyData = function (companyId, modules, format, res) {
            return __awaiter(this, void 0, void 0, function () {
                var exportData, _a, _b, _c, _d, _e, _f, _g, archive, _i, _h, _j, key, data, csv;
                var _this = this;
                return __generator(this, function (_k) {
                    switch (_k.label) {
                        case 0:
                            this.logger.log("Starting enterprise export for company ".concat(companyId, ", modules: ").concat(modules.join(',')));
                            exportData = {};
                            if (!modules.includes('Fleet')) return [3 /*break*/, 2];
                            _a = exportData;
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.vehicle.findMany({
                                                where: { companyId: companyId },
                                                take: 10000,
                                            })];
                                    });
                                }); })];
                        case 1:
                            _a.vehicles = _k.sent();
                            _k.label = 2;
                        case 2:
                            if (!modules.includes('Drivers')) return [3 /*break*/, 4];
                            _b = exportData;
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.driver.findMany({
                                                where: { companyId: companyId },
                                                take: 10000,
                                            })];
                                    });
                                }); })];
                        case 3:
                            _b.drivers = _k.sent();
                            _k.label = 4;
                        case 4:
                            if (!modules.includes('Customers')) return [3 /*break*/, 6];
                            _c = exportData;
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.customer.findMany({
                                                where: { companyId: companyId },
                                                take: 10000,
                                            })];
                                    });
                                }); })];
                        case 5:
                            _c.customers = _k.sent();
                            _k.label = 6;
                        case 6:
                            if (!modules.includes('Loads')) return [3 /*break*/, 8];
                            _d = exportData;
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.load.findMany({
                                                where: { companyId: companyId },
                                                take: 10000,
                                            })];
                                    });
                                }); })];
                        case 7:
                            _d.loads = _k.sent();
                            _k.label = 8;
                        case 8:
                            if (!modules.includes('Trips')) return [3 /*break*/, 10];
                            _e = exportData;
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.trip.findMany({
                                                where: { companyId: companyId },
                                                take: 10000,
                                            })];
                                    });
                                }); })];
                        case 9:
                            _e.trips = _k.sent();
                            _k.label = 10;
                        case 10:
                            if (!modules.includes('Invoices')) return [3 /*break*/, 12];
                            _f = exportData;
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.invoice.findMany({
                                                where: { companyId: companyId },
                                                take: 10000,
                                            })];
                                    });
                                }); })];
                        case 11:
                            _f.invoices = _k.sent();
                            _k.label = 12;
                        case 12:
                            if (!modules.includes('AuditLogs')) return [3 /*break*/, 14];
                            _g = exportData;
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.auditLog.findMany({
                                                where: { companyId: companyId },
                                                take: 10000,
                                            })];
                                    });
                                }); })];
                        case 13:
                            _g.auditLogs = _k.sent();
                            _k.label = 14;
                        case 14:
                            if (format.toLowerCase() === 'json') {
                                res.setHeader('Content-Type', 'application/json');
                                res.setHeader('Content-Disposition', "attachment; filename=\"parilink_export_".concat(companyId, ".json\""));
                                return [2 /*return*/, res.send(exportData)];
                            }
                            if (!(format.toLowerCase() === 'csv')) return [3 /*break*/, 16];
                            archive = archiver('zip', { zlib: { level: 9 } });
                            res.setHeader('Content-Type', 'application/zip');
                            res.setHeader('Content-Disposition', "attachment; filename=\"parilink_export_".concat(companyId, ".zip\""));
                            archive.pipe(res);
                            for (_i = 0, _h = Object.entries(exportData); _i < _h.length; _i++) {
                                _j = _h[_i], key = _j[0], data = _j[1];
                                if (data.length > 0) {
                                    try {
                                        csv = (0, json2csv_1.parse)(data);
                                        archive.append(csv, { name: "".concat(key, ".csv") });
                                    }
                                    catch (err) {
                                        this.logger.error("Error parsing CSV for ".concat(key), err);
                                    }
                                }
                            }
                            return [4 /*yield*/, archive.finalize()];
                        case 15:
                            _k.sent();
                            return [2 /*return*/];
                        case 16: throw new common_1.BadRequestException("Unsupported export format: ".concat(format));
                    }
                });
            });
        };
        return ExportService_1;
    }());
    __setFunctionName(_classThis, "ExportService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ExportService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ExportService = _classThis;
}();
exports.ExportService = ExportService;
