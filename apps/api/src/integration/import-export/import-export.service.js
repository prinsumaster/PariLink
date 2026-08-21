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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImportExportService = void 0;
var common_1 = require("@nestjs/common");
var ImportExportService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ImportExportService = _classThis = /** @class */ (function () {
        function ImportExportService_1(prisma, audit) {
            this.prisma = prisma;
            this.audit = audit;
            this.logger = new common_1.Logger(ImportExportService.name);
        }
        ImportExportService_1.prototype.previewImport = function (companyId, entityType, format, rows) {
            return __awaiter(this, void 0, void 0, function () {
                var validRows, errorRows, duplicateRows, _loop_1, this_1, i;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!Array.isArray(rows) || rows.length === 0) {
                                throw new common_1.BadRequestException('Rows must be a non-empty array');
                            }
                            validRows = [];
                            errorRows = [];
                            duplicateRows = [];
                            _loop_1 = function (i) {
                                var row, rowNum, existing, existing, existing;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            row = rows[i];
                                            rowNum = i + 1;
                                            if (!(entityType === 'INVOICE')) return [3 /*break*/, 2];
                                            if (!row.invoiceNumber || row.amount === undefined) {
                                                errorRows.push({
                                                    row: rowNum,
                                                    data: row,
                                                    error: 'Missing required field: invoiceNumber or amount',
                                                });
                                                return [2 /*return*/, "continue"];
                                            }
                                            return [4 /*yield*/, this_1.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        return [2 /*return*/, tx.invoice.findFirst({
                                                                where: { companyId: companyId, invoiceNumber: String(row.invoiceNumber) },
                                                            })];
                                                    });
                                                }); })];
                                        case 1:
                                            existing = _b.sent();
                                            if (existing) {
                                                duplicateRows.push({
                                                    row: rowNum,
                                                    data: row,
                                                    existingId: existing.id,
                                                    error: "Duplicate invoice number ".concat(row.invoiceNumber),
                                                });
                                                return [2 /*return*/, "continue"];
                                            }
                                            return [3 /*break*/, 6];
                                        case 2:
                                            if (!(entityType === 'DRIVER')) return [3 /*break*/, 4];
                                            if ((!row.firstName && !row.name) || !row.licenseNumber) {
                                                errorRows.push({
                                                    row: rowNum,
                                                    data: row,
                                                    error: 'Missing required field: firstName/name or licenseNumber',
                                                });
                                                return [2 /*return*/, "continue"];
                                            }
                                            return [4 /*yield*/, this_1.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        return [2 /*return*/, tx.driver.findFirst({
                                                                where: { companyId: companyId, licenseNumber: String(row.licenseNumber) },
                                                            })];
                                                    });
                                                }); })];
                                        case 3:
                                            existing = _b.sent();
                                            if (existing) {
                                                duplicateRows.push({
                                                    row: rowNum,
                                                    data: row,
                                                    existingId: existing.id,
                                                    error: "Duplicate license number ".concat(row.licenseNumber),
                                                });
                                                return [2 /*return*/, "continue"];
                                            }
                                            return [3 /*break*/, 6];
                                        case 4:
                                            if (!(entityType === 'VEHICLE')) return [3 /*break*/, 6];
                                            if (!row.licensePlate) {
                                                errorRows.push({
                                                    row: rowNum,
                                                    data: row,
                                                    error: 'Missing required field: licensePlate',
                                                });
                                                return [2 /*return*/, "continue"];
                                            }
                                            return [4 /*yield*/, this_1.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        return [2 /*return*/, tx.vehicle.findFirst({
                                                                where: { companyId: companyId, licensePlate: String(row.licensePlate) },
                                                            })];
                                                    });
                                                }); })];
                                        case 5:
                                            existing = _b.sent();
                                            if (existing) {
                                                duplicateRows.push({
                                                    row: rowNum,
                                                    data: row,
                                                    existingId: existing.id,
                                                    error: "Duplicate license plate ".concat(row.licensePlate),
                                                });
                                                return [2 /*return*/, "continue"];
                                            }
                                            _b.label = 6;
                                        case 6:
                                            validRows.push({ row: rowNum, data: row });
                                            return [2 /*return*/];
                                    }
                                });
                            };
                            this_1 = this;
                            i = 0;
                            _a.label = 1;
                        case 1:
                            if (!(i < rows.length)) return [3 /*break*/, 4];
                            return [5 /*yield**/, _loop_1(i)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/, {
                                entityType: entityType,
                                format: format.toUpperCase(),
                                totalRows: rows.length,
                                validCount: validRows.length,
                                errorCount: errorRows.length,
                                duplicateCount: duplicateRows.length,
                                validRows: validRows,
                                errorRows: errorRows,
                                duplicateRows: duplicateRows,
                            }];
                    }
                });
            });
        };
        ImportExportService_1.prototype.executeImport = function (companyId_1, userId_1, entityType_1, format_1, rows_1) {
            return __awaiter(this, arguments, void 0, function (companyId, userId, entityType, format, rows, rollbackOnError) {
                var preview;
                var _this = this;
                if (rollbackOnError === void 0) { rollbackOnError = true; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.previewImport(companyId, entityType, format, rows)];
                        case 1:
                            preview = _a.sent();
                            if (rollbackOnError && preview.errorCount > 0) {
                                throw new common_1.BadRequestException({
                                    message: 'Import aborted due to validation errors (rollbackOnError=true)',
                                    errorCount: preview.errorCount,
                                    errorRows: preview.errorRows,
                                });
                            }
                            return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    var job, importedCount, createdIds, defaultCustomer, _i, _a, item, rowData, inv, parts, firstName, lastName, drv, veh, completedJob, err_1, importErr, failedJob;
                                    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
                                    return __generator(this, function (_o) {
                                        switch (_o.label) {
                                            case 0: return [4 /*yield*/, tx.backgroundJob.create({
                                                    data: {
                                                        companyId: companyId,
                                                        userId: userId,
                                                        type: 'IMPORT',
                                                        status: 'PROCESSING',
                                                        progress: 0,
                                                        metadata: { entityType: entityType, format: format, totalRows: rows.length },
                                                        startedAt: new Date(),
                                                    },
                                                })];
                                            case 1:
                                                job = _o.sent();
                                                importedCount = 0;
                                                createdIds = [];
                                                _o.label = 2;
                                            case 2:
                                                _o.trys.push([2, 17, , 19]);
                                                defaultCustomer = null;
                                                if (!(entityType === 'INVOICE')) return [3 /*break*/, 5];
                                                return [4 /*yield*/, tx.customer.findFirst({
                                                        where: { companyId: companyId },
                                                    })];
                                            case 3:
                                                defaultCustomer = _o.sent();
                                                if (!!defaultCustomer) return [3 /*break*/, 5];
                                                return [4 /*yield*/, tx.customer.create({
                                                        data: {
                                                            companyId: companyId,
                                                            name: 'Default Import Customer',
                                                            status: 'ACTIVE',
                                                        },
                                                    })];
                                            case 4:
                                                defaultCustomer = _o.sent();
                                                _o.label = 5;
                                            case 5:
                                                _i = 0, _a = preview.validRows;
                                                _o.label = 6;
                                            case 6:
                                                if (!(_i < _a.length)) return [3 /*break*/, 14];
                                                item = _a[_i];
                                                rowData = item.data;
                                                if (!(entityType === 'INVOICE')) return [3 /*break*/, 8];
                                                return [4 /*yield*/, tx.invoice.create({
                                                        data: {
                                                            companyId: companyId,
                                                            customerId: ((_b = rowData.customerId) !== null && _b !== void 0 ? _b : defaultCustomer.id),
                                                            invoiceNumber: String(rowData.invoiceNumber),
                                                            amount: Number(rowData.amount),
                                                            status: ((_c = rowData.status) !== null && _c !== void 0 ? _c : 'DRAFT'),
                                                            notes: "Imported via job ".concat(job.id),
                                                        },
                                                    })];
                                            case 7:
                                                inv = _o.sent();
                                                createdIds.push(inv.id);
                                                return [3 /*break*/, 12];
                                            case 8:
                                                if (!(entityType === 'DRIVER')) return [3 /*break*/, 10];
                                                parts = String((_e = (_d = rowData.name) !== null && _d !== void 0 ? _d : rowData.firstName) !== null && _e !== void 0 ? _e : 'Unknown Driver')
                                                    .trim()
                                                    .split(' ');
                                                firstName = ((_f = rowData.firstName) !== null && _f !== void 0 ? _f : parts[0]);
                                                lastName = ((_g = rowData.lastName) !== null && _g !== void 0 ? _g : (parts.length > 1
                                                    ? parts.slice(1).join(' ')
                                                    : 'Driver'));
                                                return [4 /*yield*/, tx.driver.create({
                                                        data: {
                                                            companyId: companyId,
                                                            firstName: firstName,
                                                            lastName: lastName,
                                                            licenseNumber: String(rowData.licenseNumber),
                                                            phone: ((_h = rowData.phone) !== null && _h !== void 0 ? _h : null),
                                                            status: ((_j = rowData.status) !== null && _j !== void 0 ? _j : 'AVAILABLE'),
                                                        },
                                                    })];
                                            case 9:
                                                drv = _o.sent();
                                                createdIds.push(drv.id);
                                                return [3 /*break*/, 12];
                                            case 10:
                                                if (!(entityType === 'VEHICLE')) return [3 /*break*/, 12];
                                                return [4 /*yield*/, tx.vehicle.create({
                                                        data: {
                                                            companyId: companyId,
                                                            licensePlate: String(rowData.licensePlate),
                                                            make: ((_k = rowData.make) !== null && _k !== void 0 ? _k : 'GENERIC'),
                                                            model: ((_l = rowData.model) !== null && _l !== void 0 ? _l : 'TRUCK'),
                                                            status: ((_m = rowData.status) !== null && _m !== void 0 ? _m : 'IN_SERVICE'),
                                                        },
                                                    })];
                                            case 11:
                                                veh = _o.sent();
                                                createdIds.push(veh.id);
                                                _o.label = 12;
                                            case 12:
                                                importedCount++;
                                                _o.label = 13;
                                            case 13:
                                                _i++;
                                                return [3 /*break*/, 6];
                                            case 14: return [4 /*yield*/, tx.backgroundJob.update({
                                                    where: { id: job.id },
                                                    data: {
                                                        status: 'COMPLETED',
                                                        progress: 100,
                                                        result: {
                                                            importedCount: importedCount,
                                                            createdIds: createdIds,
                                                            errorCount: preview.errorCount,
                                                        },
                                                        completedAt: new Date(),
                                                    },
                                                })];
                                            case 15:
                                                completedJob = _o.sent();
                                                return [4 /*yield*/, this.audit.logEvent({
                                                        companyId: companyId,
                                                        userId: userId,
                                                        entity: 'BackgroundJob',
                                                        entityId: job.id,
                                                        action: 'EXECUTE_BULK_IMPORT',
                                                        details: {
                                                            entityType: entityType,
                                                            importedCount: importedCount,
                                                            createdIdsCount: createdIds.length,
                                                        },
                                                    })];
                                            case 16:
                                                _o.sent();
                                                return [2 /*return*/, completedJob];
                                            case 17:
                                                err_1 = _o.sent();
                                                importErr = err_1;
                                                this.logger.error("Import job ".concat(job.id, " failed: ").concat(importErr.message));
                                                return [4 /*yield*/, tx.backgroundJob.update({
                                                        where: { id: job.id },
                                                        data: {
                                                            status: 'FAILED',
                                                            error: importErr.message,
                                                            completedAt: new Date(),
                                                        },
                                                    })];
                                            case 18:
                                                failedJob = _o.sent();
                                                if (rollbackOnError)
                                                    throw err_1;
                                                return [2 /*return*/, failedJob];
                                            case 19: return [2 /*return*/];
                                        }
                                    });
                                }); })];
                    }
                });
            });
        };
        ImportExportService_1.prototype.executeExport = function (companyId, userId, entityType, format, filter) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            var job, records, exportData, fmt, headers, rows, xmlRows, completedJob;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tx.backgroundJob.create({
                                            data: {
                                                companyId: companyId,
                                                userId: userId,
                                                type: 'EXPORT',
                                                status: 'PROCESSING',
                                                progress: 50,
                                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                metadata: { entityType: entityType, format: format, filter: filter || {} },
                                                startedAt: new Date(),
                                            },
                                        })];
                                    case 1:
                                        job = _a.sent();
                                        records = [];
                                        if (!(entityType === 'INVOICE')) return [3 /*break*/, 3];
                                        return [4 /*yield*/, tx.invoice.findMany({
                                                where: { companyId: companyId },
                                                take: 1000,
                                            })];
                                    case 2:
                                        records = _a.sent();
                                        return [3 /*break*/, 9];
                                    case 3:
                                        if (!(entityType === 'DRIVER')) return [3 /*break*/, 5];
                                        return [4 /*yield*/, tx.driver.findMany({
                                                where: { companyId: companyId },
                                                take: 1000,
                                            })];
                                    case 4:
                                        records = _a.sent();
                                        return [3 /*break*/, 9];
                                    case 5:
                                        if (!(entityType === 'VEHICLE')) return [3 /*break*/, 7];
                                        return [4 /*yield*/, tx.vehicle.findMany({
                                                where: { companyId: companyId },
                                                take: 1000,
                                            })];
                                    case 6:
                                        records = _a.sent();
                                        return [3 /*break*/, 9];
                                    case 7:
                                        if (!(entityType === 'TRIP')) return [3 /*break*/, 9];
                                        return [4 /*yield*/, tx.trip.findMany({ where: { companyId: companyId }, take: 1000 })];
                                    case 8:
                                        records = _a.sent();
                                        _a.label = 9;
                                    case 9:
                                        exportData = records;
                                        fmt = format.toUpperCase();
                                        if (fmt === 'CSV') {
                                            if (records.length > 0) {
                                                headers = Object.keys(records[0]).join(',');
                                                rows = records.map(function (r) {
                                                    return Object.values(r)
                                                        .map(function (val) {
                                                        return "\"".concat(val instanceof Date ? val.toISOString() : typeof val === 'object' && val !== null ? JSON.stringify(val).replace(/"/g, '""') : String(val), "\"");
                                                    })
                                                        .join(',');
                                                });
                                                exportData = __spreadArray([headers], rows, true).join('\n');
                                            }
                                            else {
                                                exportData = '';
                                            }
                                        }
                                        else if (fmt === 'XML') {
                                            xmlRows = records
                                                .map(function (r) {
                                                return "<".concat(entityType.toLowerCase(), ">") +
                                                    Object.entries(r)
                                                        .map(function (_a) {
                                                        var k = _a[0], v = _a[1];
                                                        return "<".concat(k, ">").concat(v instanceof Date ? v.toISOString() : typeof v === 'object' && v !== null ? JSON.stringify(v) : String(v), "</").concat(k, ">");
                                                    })
                                                        .join('') +
                                                    "</".concat(entityType.toLowerCase(), ">");
                                            })
                                                .join('\n');
                                            exportData = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<export total=\"".concat(records.length, "\">\n").concat(xmlRows, "\n</export>");
                                        }
                                        return [4 /*yield*/, tx.backgroundJob.update({
                                                where: { id: job.id },
                                                data: {
                                                    status: 'COMPLETED',
                                                    progress: 100,
                                                    result: {
                                                        recordCount: records.length,
                                                        format: fmt,
                                                        payload: exportData,
                                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                                    },
                                                    completedAt: new Date(),
                                                },
                                            })];
                                    case 10:
                                        completedJob = _a.sent();
                                        return [4 /*yield*/, this.audit.logEvent({
                                                companyId: companyId,
                                                userId: userId,
                                                entity: 'BackgroundJob',
                                                entityId: job.id,
                                                action: 'EXECUTE_BULK_EXPORT',
                                                details: { entityType: entityType, recordCount: records.length, format: fmt },
                                            })];
                                    case 11:
                                        _a.sent();
                                        return [2 /*return*/, completedJob];
                                }
                            });
                        }); })];
                });
            });
        };
        ImportExportService_1.prototype.getJobStatus = function (companyId, jobId) {
            return __awaiter(this, void 0, void 0, function () {
                var job;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.backgroundJob.findUnique({
                                            where: { id: jobId },
                                        })];
                                });
                            }); })];
                        case 1:
                            job = _a.sent();
                            if (!job || job.companyId !== companyId) {
                                throw new common_1.NotFoundException('Job not found');
                            }
                            return [2 /*return*/, job];
                    }
                });
            });
        };
        ImportExportService_1.prototype.listJobs = function (companyId, type) {
            return __awaiter(this, void 0, void 0, function () {
                var where;
                var _this = this;
                return __generator(this, function (_a) {
                    where = { companyId: companyId };
                    if (type)
                        where.type = type.toUpperCase();
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.backgroundJob.findMany({
                                        where: where,
                                        orderBy: { createdAt: 'desc' },
                                        take: 50,
                                    })];
                            });
                        }); })];
                });
            });
        };
        return ImportExportService_1;
    }());
    __setFunctionName(_classThis, "ImportExportService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ImportExportService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ImportExportService = _classThis;
}();
exports.ImportExportService = ImportExportService;
