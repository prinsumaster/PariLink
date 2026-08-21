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
exports.SearchService = void 0;
var common_1 = require("@nestjs/common");
var SearchService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SearchService = _classThis = /** @class */ (function () {
        function SearchService_1(prisma) {
            this.prisma = prisma;
        }
        SearchService_1.prototype.globalSearch = function (companyId, query) {
            return __awaiter(this, void 0, void 0, function () {
                var searchQuery, _a, loads, trips, customers, vehicles, drivers, invoices, documents, results;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!query || query.length < 2) {
                                return [2 /*return*/, { results: [] }];
                            }
                            searchQuery = "%".concat(query, "%");
                            return [4 /*yield*/, Promise.all([
                                    // 1. Loads
                                    this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.load.findMany({
                                                    where: {
                                                        companyId: companyId,
                                                        OR: [
                                                            { referenceNumber: { contains: query, mode: 'insensitive' } },
                                                            { originCity: { contains: query, mode: 'insensitive' } },
                                                            { destinationCity: { contains: query, mode: 'insensitive' } },
                                                        ],
                                                    },
                                                    take: 5,
                                                    select: {
                                                        id: true,
                                                        referenceNumber: true,
                                                        originCity: true,
                                                        destinationCity: true,
                                                        status: true,
                                                    },
                                                })];
                                        });
                                    }); }),
                                    // 2. Trips
                                    this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.trip.findMany({
                                                    where: {
                                                        companyId: companyId,
                                                        tripNumber: { contains: query, mode: 'insensitive' },
                                                    },
                                                    take: 5,
                                                    select: { id: true, tripNumber: true, status: true },
                                                })];
                                        });
                                    }); }),
                                    // 3. Customers
                                    this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.customer.findMany({
                                                    where: {
                                                        companyId: companyId,
                                                        name: { contains: query, mode: 'insensitive' },
                                                    },
                                                    take: 5,
                                                    select: { id: true, name: true, email: true },
                                                })];
                                        });
                                    }); }),
                                    // 4. Vehicles
                                    this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.vehicle.findMany({
                                                    where: {
                                                        companyId: companyId,
                                                        OR: [
                                                            { licensePlate: { contains: query, mode: 'insensitive' } },
                                                            { make: { contains: query, mode: 'insensitive' } },
                                                        ],
                                                    },
                                                    take: 5,
                                                    select: { id: true, licensePlate: true, make: true, model: true },
                                                })];
                                        });
                                    }); }),
                                    // 5. Drivers
                                    this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.driver.findMany({
                                                    where: {
                                                        companyId: companyId,
                                                        OR: [
                                                            { firstName: { contains: query, mode: 'insensitive' } },
                                                            { lastName: { contains: query, mode: 'insensitive' } },
                                                        ],
                                                    },
                                                    take: 5,
                                                    select: { id: true, firstName: true, lastName: true },
                                                })];
                                        });
                                    }); }),
                                    // 6. Invoices
                                    this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.invoice.findMany({
                                                    where: {
                                                        companyId: companyId,
                                                        invoiceNumber: { contains: query, mode: 'insensitive' },
                                                    },
                                                    take: 5,
                                                    select: {
                                                        id: true,
                                                        invoiceNumber: true,
                                                        status: true,
                                                        amount: true,
                                                    },
                                                })];
                                        });
                                    }); }),
                                    // 7. Documents
                                    this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                            return [2 /*return*/, tx.document.findMany({
                                                    where: {
                                                        companyId: companyId,
                                                        fileName: { contains: query, mode: 'insensitive' },
                                                    },
                                                    take: 5,
                                                    select: { id: true, fileName: true, type: true },
                                                })];
                                        });
                                    }); }),
                                ])];
                        case 1:
                            _a = _b.sent(), loads = _a[0], trips = _a[1], customers = _a[2], vehicles = _a[3], drivers = _a[4], invoices = _a[5], documents = _a[6];
                            results = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], loads.map(function (item) { return ({
                                type: 'load',
                                id: item.id,
                                title: "Load ".concat(item.referenceNumber),
                                description: "".concat(item.originCity, " \u2192 ").concat(item.destinationCity),
                                status: item.status,
                                url: "/loads/".concat(item.id),
                            }); }), true), trips.map(function (item) { return ({
                                type: 'trip',
                                id: item.id,
                                title: "Trip ".concat(item.tripNumber),
                                description: 'Trip Route',
                                status: item.status,
                                url: "/trips/".concat(item.id),
                            }); }), true), customers.map(function (item) { return ({
                                type: 'customer',
                                id: item.id,
                                title: item.name,
                                description: item.email || 'Customer',
                                url: "/customers/".concat(item.id),
                            }); }), true), vehicles.map(function (item) { return ({
                                type: 'vehicle',
                                id: item.id,
                                title: item.licensePlate,
                                description: "".concat(item.make || '', " ").concat(item.model || ''),
                                url: "/fleet/vehicles/".concat(item.id),
                            }); }), true), drivers.map(function (item) { return ({
                                type: 'driver',
                                id: item.id,
                                title: "".concat(item.firstName, " ").concat(item.lastName),
                                description: 'Driver',
                                url: "/fleet/drivers/".concat(item.id),
                            }); }), true), invoices.map(function (item) { return ({
                                type: 'invoice',
                                id: item.id,
                                title: "Invoice ".concat(item.invoiceNumber),
                                description: "$".concat(item.amount),
                                status: item.status,
                                url: "/billing/".concat(item.id),
                            }); }), true), documents.map(function (item) { return ({
                                type: 'document',
                                id: item.id,
                                title: item.fileName,
                                description: item.type,
                                url: "/documents/".concat(item.id),
                            }); }), true);
                            return [2 /*return*/, { results: results }];
                    }
                });
            });
        };
        return SearchService_1;
    }());
    __setFunctionName(_classThis, "SearchService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SearchService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SearchService = _classThis;
}();
exports.SearchService = SearchService;
