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
exports.VrpSolverService = void 0;
var common_1 = require("@nestjs/common");
var VrpSolverService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var VrpSolverService = _classThis = /** @class */ (function () {
        function VrpSolverService_1(prisma) {
            this.prisma = prisma;
            this.logger = new common_1.Logger(VrpSolverService.name);
        }
        /**
         * Approximates distance between two points using the Haversine formula.
         * Returns distance in kilometers.
         */
        VrpSolverService_1.prototype.calculateHaversineDistance = function (lat1, lon1, lat2, lon2) {
            var toRadian = function (angle) { return (Math.PI / 180) * angle; };
            var distance = function (a, b) { return (Math.PI / 180) * (a - b); };
            var RADIUS_OF_EARTH_IN_KM = 6371;
            var dLat = distance(lat2, lat1);
            var dLon = distance(lon2, lon1);
            lat1 = toRadian(lat1);
            lat2 = toRadian(lat2);
            var a = Math.pow(Math.sin(dLat / 2), 2) +
                Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
            var c = 2 * Math.asin(Math.sqrt(a));
            return RADIUS_OF_EARTH_IN_KM * c;
        };
        /**
         * Solves the Capacitated Vehicle Routing Problem (CVRP) using a greedy Nearest-Neighbor heuristic.
         * This is scalable enough to run in a Node.js process for small-to-medium datasets.
         * For extremely large datasets, this would be swapped with a background worker (e.g. OR-Tools via BullMQ).
         */
        VrpSolverService_1.prototype.solve = function (nodes, vehicles) {
            this.logger.log("Starting VRP Solve for ".concat(nodes.length, " nodes and ").concat(vehicles.length, " vehicles."));
            var unassignedNodes = __spreadArray([], nodes, true);
            var vehicleRoutes = vehicles.map(function (v) { return ({
                vehicleId: v.id,
                route: [],
                totalDistance: 0,
                totalTimeMinutes: 0,
                totalWeight: 0,
            }); });
            // Assume average speed of 60 km/h (1 km per minute)
            var SPEED_KM_PER_MIN = 1;
            var _loop_1 = function (routeObj) {
                var vehicle = vehicles.find(function (v) { return v.id === routeObj.vehicleId; });
                if (!vehicle)
                    return "continue";
                var currentLocation = {
                    lat: vehicle.startLatitude,
                    lng: vehicle.startLongitude,
                };
                var capacityRemaining = vehicle.capacityWeight || Infinity;
                while (unassignedNodes.length > 0) {
                    var nearestIdx = -1;
                    var shortestDistance = Infinity;
                    // Find nearest feasible node
                    for (var i = 0; i < unassignedNodes.length; i++) {
                        var node = unassignedNodes[i];
                        var demand = node.demandWeight || 0;
                        if (demand > capacityRemaining)
                            continue; // Capacity constraint
                        var distance = this_1.calculateHaversineDistance(currentLocation.lat, currentLocation.lng, node.latitude, node.longitude);
                        if (distance < shortestDistance) {
                            shortestDistance = distance;
                            nearestIdx = i;
                        }
                    }
                    if (nearestIdx === -1) {
                        // No feasible node found for this vehicle (e.g., due to capacity)
                        break;
                    }
                    // Assign node
                    var assignedNode = unassignedNodes[nearestIdx];
                    routeObj.route.push(assignedNode);
                    routeObj.totalDistance += shortestDistance;
                    routeObj.totalTimeMinutes +=
                        shortestDistance / SPEED_KM_PER_MIN +
                            (assignedNode.serviceDurationMinutes || 0);
                    routeObj.totalWeight += assignedNode.demandWeight || 0;
                    capacityRemaining -= assignedNode.demandWeight || 0;
                    currentLocation = {
                        lat: assignedNode.latitude,
                        lng: assignedNode.longitude,
                    };
                    // Remove from unassigned
                    unassignedNodes.splice(nearestIdx, 1);
                }
            };
            var this_1 = this;
            for (var _i = 0, vehicleRoutes_1 = vehicleRoutes; _i < vehicleRoutes_1.length; _i++) {
                var routeObj = vehicleRoutes_1[_i];
                _loop_1(routeObj);
            }
            this.logger.log("VRP Solve complete. Unassigned nodes: ".concat(unassignedNodes.length));
            return { vehicleRoutes: vehicleRoutes, unassignedNodes: unassignedNodes };
        };
        return VrpSolverService_1;
    }());
    __setFunctionName(_classThis, "VrpSolverService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        VrpSolverService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return VrpSolverService = _classThis;
}();
exports.VrpSolverService = VrpSolverService;
