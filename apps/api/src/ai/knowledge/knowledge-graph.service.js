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
exports.KnowledgeGraphService = void 0;
var common_1 = require("@nestjs/common");
var KnowledgeGraphService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var KnowledgeGraphService = _classThis = /** @class */ (function () {
        function KnowledgeGraphService_1(prisma) {
            this.prisma = prisma;
            this.logger = new common_1.Logger(KnowledgeGraphService.name);
        }
        /**
         * Multi-hop graph traversal — builds a rich relationship map for any entity.
         * depth=1 returns direct relationships, depth=2 traverses their relationships too.
         */
        KnowledgeGraphService_1.prototype.buildEntityGraph = function (companyId_1, entityType_1, entityId_1) {
            return __awaiter(this, arguments, void 0, function (companyId, entityType, entityId, depth) {
                var graph, _a, e_1, err;
                if (depth === void 0) { depth = 1; }
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            this.logger.debug("Building Knowledge Graph: ".concat(entityType, "[").concat(entityId, "] depth=").concat(depth));
                            graph = {
                                root: { type: entityType, id: entityId, data: {} },
                                relationships: {},
                                depth: depth,
                                traversedAt: new Date().toISOString(),
                            };
                            _b.label = 1;
                        case 1:
                            _b.trys.push([1, 20, , 21]);
                            _a = entityType;
                            switch (_a) {
                                case 'Trip': return [3 /*break*/, 2];
                                case 'Vehicle': return [3 /*break*/, 4];
                                case 'Driver': return [3 /*break*/, 6];
                                case 'Load': return [3 /*break*/, 8];
                                case 'Customer': return [3 /*break*/, 10];
                                case 'Vendor': return [3 /*break*/, 12];
                                case 'MarketplaceApp': return [3 /*break*/, 14];
                                case 'Company': return [3 /*break*/, 16];
                            }
                            return [3 /*break*/, 18];
                        case 2: return [4 /*yield*/, this.buildTripGraph(companyId, entityId, graph, depth)];
                        case 3:
                            _b.sent();
                            return [3 /*break*/, 19];
                        case 4: return [4 /*yield*/, this.buildVehicleGraph(companyId, entityId, graph)];
                        case 5:
                            _b.sent();
                            return [3 /*break*/, 19];
                        case 6: return [4 /*yield*/, this.buildDriverGraph(companyId, entityId, graph)];
                        case 7:
                            _b.sent();
                            return [3 /*break*/, 19];
                        case 8: return [4 /*yield*/, this.buildLoadGraph(companyId, entityId, graph)];
                        case 9:
                            _b.sent();
                            return [3 /*break*/, 19];
                        case 10: return [4 /*yield*/, this.buildCustomerGraph(companyId, entityId, graph)];
                        case 11:
                            _b.sent();
                            return [3 /*break*/, 19];
                        case 12: return [4 /*yield*/, this.buildVendorGraph(companyId, entityId, graph)];
                        case 13:
                            _b.sent();
                            return [3 /*break*/, 19];
                        case 14: return [4 /*yield*/, this.buildMarketplaceAppGraph(companyId, entityId, graph)];
                        case 15:
                            _b.sent();
                            return [3 /*break*/, 19];
                        case 16: return [4 /*yield*/, this.buildCompanyGraph(entityId, graph)];
                        case 17:
                            _b.sent();
                            return [3 /*break*/, 19];
                        case 18:
                            this.logger.warn("Unknown entity type: ".concat(entityType));
                            graph.root.data = { error: "Unsupported entity type: ".concat(entityType) };
                            _b.label = 19;
                        case 19: return [3 /*break*/, 21];
                        case 20:
                            e_1 = _b.sent();
                            err = e_1;
                            this.logger.error("Graph traversal failed for ".concat(entityType, "[").concat(entityId, "]: ").concat(err.message));
                            graph.root.data = {
                                error: 'Graph traversal failed',
                                message: err.message,
                            };
                            return [3 /*break*/, 21];
                        case 21: return [2 /*return*/, graph];
                    }
                });
            });
        };
        // ─── Entity Builders ────────────────────────────────────────────────────────
        KnowledgeGraphService_1.prototype.buildTripGraph = function (companyId, tripId, graph, depth) {
            return __awaiter(this, void 0, void 0, function () {
                var trip, driverSubgraph;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.trip.findUnique({
                                            where: { id: tripId, companyId: companyId },
                                            include: {
                                                driver: true,
                                                vehicle: true,
                                                loads: { include: { customer: true }, take: 10 },
                                                locationHistory: { orderBy: { timestamp: 'desc' }, take: 5 },
                                            },
                                        })];
                                });
                            }); })];
                        case 1:
                            trip = _a.sent();
                            if (!trip)
                                return [2 /*return*/];
                            graph.root.data = {
                                tripNumber: trip.tripNumber,
                                status: trip.status,
                                createdAt: trip.createdAt,
                            };
                            graph.relationships.driver = trip.driver
                                ? {
                                    type: 'Driver',
                                    id: trip.driver.id,
                                    data: {
                                        name: "".concat(trip.driver.firstName, " ").concat(trip.driver.lastName),
                                        licenseNumber: trip.driver.licenseNumber,
                                    },
                                }
                                : null;
                            graph.relationships.vehicle = trip.vehicle
                                ? {
                                    type: 'Vehicle',
                                    id: trip.vehicle.id,
                                    data: {
                                        licensePlate: trip.vehicle.licensePlate,
                                        status: trip.vehicle.status,
                                    },
                                }
                                : null;
                            graph.relationships.loads = trip.loads.map(function (l) {
                                var _a;
                                return ({
                                    type: 'Load',
                                    id: l.id,
                                    data: { status: l.status, customer: (_a = l.customer) === null || _a === void 0 ? void 0 : _a.name },
                                });
                            });
                            graph.relationships.recentLocations = trip.locationHistory.map(function (h) { return ({
                                type: 'LocationEvent',
                                id: h.id,
                                data: { lat: h.latitude, lng: h.longitude, timestamp: h.timestamp },
                            }); });
                            if (!(depth >= 2 && trip.driver)) return [3 /*break*/, 3];
                            driverSubgraph = {
                                root: { type: 'Driver', id: trip.driver.id, data: {} },
                                relationships: {},
                                depth: 1,
                                traversedAt: new Date().toISOString(),
                            };
                            return [4 /*yield*/, this.buildDriverGraph(companyId, trip.driver.id, driverSubgraph)];
                        case 2:
                            _a.sent();
                            graph.relationships.driverDetail = driverSubgraph.root;
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        KnowledgeGraphService_1.prototype.buildVehicleGraph = function (companyId, vehicleId, graph) {
            return __awaiter(this, void 0, void 0, function () {
                var vehicle;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.vehicle.findUnique({
                                            where: { id: vehicleId, companyId: companyId },
                                            include: {
                                                tripsVehicle: { orderBy: { createdAt: 'desc' }, take: 5 },
                                            },
                                        })];
                                });
                            }); })];
                        case 1:
                            vehicle = _a.sent();
                            if (!vehicle)
                                return [2 /*return*/];
                            graph.root.data = {
                                licensePlate: vehicle.licensePlate,
                                status: vehicle.status,
                                make: vehicle.make,
                                model: vehicle.model,
                                year: vehicle.year,
                                capacityWeight: vehicle.capacityWeight,
                            };
                            graph.relationships.recentTrips = vehicle.tripsVehicle.map(function (t) { return ({
                                type: 'Trip',
                                id: t.id,
                                data: { status: t.status, tripNumber: t.tripNumber },
                            }); });
                            return [2 /*return*/];
                    }
                });
            });
        };
        KnowledgeGraphService_1.prototype.buildDriverGraph = function (companyId, driverId, graph) {
            return __awaiter(this, void 0, void 0, function () {
                var driver;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.driver.findUnique({
                                            where: { id: driverId, companyId: companyId },
                                            include: {
                                                trips: { orderBy: { createdAt: 'desc' }, take: 5 },
                                            },
                                        })];
                                });
                            }); })];
                        case 1:
                            driver = _a.sent();
                            if (!driver)
                                return [2 /*return*/];
                            graph.root.data = {
                                name: "".concat(driver.firstName, " ").concat(driver.lastName),
                                status: driver.status,
                                licenseNumber: driver.licenseNumber,
                                licenseExpiry: driver.licenseExpiry,
                            };
                            graph.relationships.recentTrips = driver.trips.map(function (t) { return ({
                                type: 'Trip',
                                id: t.id,
                                data: { status: t.status },
                            }); });
                            return [2 /*return*/];
                    }
                });
            });
        };
        KnowledgeGraphService_1.prototype.buildLoadGraph = function (companyId, loadId, graph) {
            return __awaiter(this, void 0, void 0, function () {
                var load;
                var _this = this;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.load.findUnique({
                                            where: { id: loadId, companyId: companyId },
                                            include: {
                                                customer: true,
                                                trip: true,
                                                documents: { take: 2 },
                                            },
                                        })];
                                });
                            }); })];
                        case 1:
                            load = _b.sent();
                            if (!load)
                                return [2 /*return*/];
                            graph.root.data = {
                                referenceNumber: load.referenceNumber,
                                status: load.status,
                                weight: load.weight,
                                commodity: load.commodity,
                                pickupDate: load.pickupDate,
                                deliveryDate: load.deliveryDate,
                            };
                            graph.relationships.customer = load.customer
                                ? {
                                    type: 'Customer',
                                    id: load.customer.id,
                                    data: { name: load.customer.name, email: load.customer.email },
                                }
                                : null;
                            graph.relationships.trips = ((_a = load.trips) !== null && _a !== void 0 ? _a : []).map(function (t) { return ({
                                type: 'Trip',
                                id: t.id,
                                data: { status: t.status },
                            }); });
                            graph.relationships.documents = load.documents.map(function (d) {
                                var _a, _b;
                                return ({
                                    type: 'Document',
                                    id: d.id,
                                    data: {
                                        type: d.type,
                                        name: (_b = (_a = d.name) !== null && _a !== void 0 ? _a : d.title) !== null && _b !== void 0 ? _b : d.id,
                                    },
                                });
                            });
                            return [2 /*return*/];
                    }
                });
            });
        };
        KnowledgeGraphService_1.prototype.buildCustomerGraph = function (companyId, customerId, graph) {
            return __awaiter(this, void 0, void 0, function () {
                var customer;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.customer.findUnique({
                                            where: { id: customerId, companyId: companyId },
                                            include: {
                                                loads: { orderBy: { createdAt: 'desc' }, take: 5 },
                                                invoices: { orderBy: { createdAt: 'desc' }, take: 3 },
                                            },
                                        })];
                                });
                            }); })];
                        case 1:
                            customer = _a.sent();
                            if (!customer)
                                return [2 /*return*/];
                            graph.root.data = {
                                name: customer.name,
                                email: customer.email,
                                phone: customer.phone,
                                creditLimit: customer.creditLimit,
                                balance: customer.balance,
                            };
                            graph.relationships.recentLoads = customer.loads.map(function (l) { return ({
                                type: 'Load',
                                id: l.id,
                                data: { status: l.status, referenceNumber: l.referenceNumber },
                            }); });
                            graph.relationships.recentInvoices = customer.invoices.map(function (inv) { return ({
                                type: 'Invoice',
                                id: inv.id,
                                data: {
                                    status: inv.status,
                                    amount: inv.amount,
                                },
                            }); });
                            return [2 /*return*/];
                    }
                });
            });
        };
        KnowledgeGraphService_1.prototype.buildVendorGraph = function (companyId, vendorId, graph) {
            return __awaiter(this, void 0, void 0, function () {
                var vendor;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.vendor.findUnique({
                                            where: { id: vendorId, companyId: companyId },
                                        })];
                                });
                            }); })];
                        case 1:
                            vendor = _a.sent();
                            if (!vendor)
                                return [2 /*return*/];
                            graph.root.data = {
                                name: vendor.name,
                                type: vendor.type,
                                email: vendor.email,
                                phone: vendor.phone,
                            };
                            graph.relationships.payments = [];
                            return [2 /*return*/];
                    }
                });
            });
        };
        KnowledgeGraphService_1.prototype.buildMarketplaceAppGraph = function (_companyId, appId, graph) {
            return __awaiter(this, void 0, void 0, function () {
                var app;
                var _this = this;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.marketplaceApp.findUnique({
                                            where: { id: appId },
                                            include: {
                                                category: true,
                                                installations: { take: 5 },
                                                webhooks: { take: 3 },
                                            },
                                        })];
                                });
                            }); })];
                        case 1:
                            app = _b.sent();
                            if (!app)
                                return [2 /*return*/];
                            graph.root.data = {
                                name: app.name,
                                version: app.version,
                                category: app.category,
                                isPublished: app.isPublished,
                                installCount: ((_a = app.installs) === null || _a === void 0 ? void 0 : _a.length) || 0,
                            };
                            graph.relationships.webhooks = app.webhooks.map(function (w) { return ({
                                type: 'Webhook',
                                id: w.id,
                                data: { event: w.events, url: w.url },
                            }); });
                            return [2 /*return*/];
                    }
                });
            });
        };
        KnowledgeGraphService_1.prototype.buildCompanyGraph = function (companyId, graph) {
            return __awaiter(this, void 0, void 0, function () {
                var company;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.company.findUnique({
                                            where: { id: companyId },
                                            include: {
                                                drivers: { take: 5 },
                                                vehicles: { take: 5 },
                                                loads: { orderBy: { createdAt: 'desc' }, take: 5 },
                                            },
                                        })];
                                });
                            }); })];
                        case 1:
                            company = _a.sent();
                            if (!company)
                                return [2 /*return*/];
                            graph.root.data = {
                                name: company.name,
                                plan: company.plan,
                                status: company.status,
                            };
                            graph.relationships.drivers = company.drivers.map(function (d) { return ({
                                type: 'Driver',
                                id: d.id,
                                data: { name: "".concat(d.firstName, " ").concat(d.lastName), status: d.status },
                            }); });
                            graph.relationships.vehicles = company.vehicles.map(function (v) { return ({
                                type: 'Vehicle',
                                id: v.id,
                                data: { licensePlate: v.licensePlate, status: v.status },
                            }); });
                            graph.relationships.recentLoads = company.loads.map(function (l) { return ({
                                type: 'Load',
                                id: l.id,
                                data: { status: l.status, referenceNumber: l.referenceNumber },
                            }); });
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Convert graph to a flat string summary for use in LLM prompts
         */
        KnowledgeGraphService_1.prototype.graphToString = function (graph) {
            var lines = ["Entity: ".concat(graph.root.type, " [").concat(graph.root.id, "]")];
            for (var _i = 0, _a = Object.entries(graph.root.data || {}); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], val = _b[1];
                lines.push("  ".concat(key, ": ").concat(val));
            }
            for (var _c = 0, _d = Object.entries(graph.relationships); _c < _d.length; _c++) {
                var _e = _d[_c], rel = _e[0], value = _e[1];
                if (!value)
                    continue;
                if (Array.isArray(value)) {
                    lines.push("  ".concat(rel, ": [").concat(value.length, " items]"));
                    value
                        .slice(0, 3)
                        .forEach(function (v) {
                        return lines.push("    - ".concat(v.type, "[").concat(v.id, "]: ").concat(JSON.stringify(v.data)));
                    });
                }
                else {
                    var node = value;
                    lines.push("  ".concat(rel, ": ").concat(node.type, "[").concat(node.id, "] ").concat(JSON.stringify(node.data)));
                }
            }
            return lines.join('\n');
        };
        return KnowledgeGraphService_1;
    }());
    __setFunctionName(_classThis, "KnowledgeGraphService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        KnowledgeGraphService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return KnowledgeGraphService = _classThis;
}();
exports.KnowledgeGraphService = KnowledgeGraphService;
