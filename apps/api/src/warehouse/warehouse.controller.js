"use strict";
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var permissions_guard_1 = require("../auth/guards/permissions.guard");
var permissions_decorator_1 = require("../auth/decorators/permissions.decorator");
var WarehouseController = function () {
    var _classDecorators = [(0, common_1.Controller)('warehouse'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, permissions_guard_1.PermissionsGuard)];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getWarehouses_decorators;
    var _createWarehouse_decorators;
    var _getTopology_decorators;
    var _createAsn_decorators;
    var _receiveGoods_decorators;
    var _createOutbound_decorators;
    var _pickOrder_decorators;
    var _scheduleDock_decorators;
    var _runAbcAnalysis_decorators;
    var WarehouseController = _classThis = /** @class */ (function () {
        function WarehouseController_1(masterData, inventory, inbound, outbound, dockScheduler, optimizer) {
            this.masterData = (__runInitializers(this, _instanceExtraInitializers), masterData);
            this.inventory = inventory;
            this.inbound = inbound;
            this.outbound = outbound;
            this.dockScheduler = dockScheduler;
            this.optimizer = optimizer;
        }
        WarehouseController_1.prototype.getWarehouses = function (user) {
            // Assuming masterData has a getWarehouses or findAll method, we'll mock it if not
            return this.masterData.getWarehouses(user.companyId);
        };
        WarehouseController_1.prototype.createWarehouse = function (user, data) {
            return this.masterData.createWarehouse(user.companyId, data);
        };
        WarehouseController_1.prototype.getTopology = function (user, id) {
            return this.masterData.getTopology(id, user.companyId);
        };
        WarehouseController_1.prototype.createAsn = function (user, data) {
            return this.inbound.createASN(user.companyId, data.warehouseId, 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data);
        };
        WarehouseController_1.prototype.receiveGoods = function (user, id, data) {
            return this.inbound.receiveGoods(user.companyId, id, data.stagingBinId, 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data.items, user.userId);
        };
        WarehouseController_1.prototype.createOutbound = function (user, data) {
            return this.outbound.createOutboundOrder(user.companyId, data.loadId, data.orderNumber, 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data.items);
        };
        WarehouseController_1.prototype.pickOrder = function (user, id, data) {
            return this.outbound.pickOrder(user.companyId, id, 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data.picks, user.userId);
        };
        WarehouseController_1.prototype.scheduleDock = function (user, data) {
            return this.dockScheduler.scheduleAppointment(user.companyId, data.dockId, user.userId, 
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            data.type || 'INBOUND', new Date(data.start), new Date(data.end), user.userId);
        };
        WarehouseController_1.prototype.runAbcAnalysis = function (user, id) {
            return this.optimizer.runAbcAnalysis(user.companyId, id);
        };
        return WarehouseController_1;
    }());
    __setFunctionName(_classThis, "WarehouseController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getWarehouses_decorators = [(0, common_1.Get)(), (0, permissions_decorator_1.RequirePermissions)('warehouse:read')];
        _createWarehouse_decorators = [(0, common_1.Post)(), (0, permissions_decorator_1.RequirePermissions)('warehouse:write')];
        _getTopology_decorators = [(0, common_1.Get)(':id/topology'), (0, permissions_decorator_1.RequirePermissions)('warehouse:read')];
        _createAsn_decorators = [(0, common_1.Post)('inbound/asn'), (0, permissions_decorator_1.RequirePermissions)('warehouse:write')];
        _receiveGoods_decorators = [(0, common_1.Post)('inbound/:id/receive'), (0, permissions_decorator_1.RequirePermissions)('warehouse:write')];
        _createOutbound_decorators = [(0, common_1.Post)('outbound/order'), (0, permissions_decorator_1.RequirePermissions)('warehouse:write')];
        _pickOrder_decorators = [(0, common_1.Post)('outbound/:id/pick'), (0, permissions_decorator_1.RequirePermissions)('warehouse:write')];
        _scheduleDock_decorators = [(0, common_1.Post)('docks/schedule'), (0, permissions_decorator_1.RequirePermissions)('warehouse:write')];
        _runAbcAnalysis_decorators = [(0, common_1.Get)(':id/inventory/abc'), (0, permissions_decorator_1.RequirePermissions)('warehouse:read')];
        __esDecorate(_classThis, null, _getWarehouses_decorators, { kind: "method", name: "getWarehouses", static: false, private: false, access: { has: function (obj) { return "getWarehouses" in obj; }, get: function (obj) { return obj.getWarehouses; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createWarehouse_decorators, { kind: "method", name: "createWarehouse", static: false, private: false, access: { has: function (obj) { return "createWarehouse" in obj; }, get: function (obj) { return obj.createWarehouse; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getTopology_decorators, { kind: "method", name: "getTopology", static: false, private: false, access: { has: function (obj) { return "getTopology" in obj; }, get: function (obj) { return obj.getTopology; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createAsn_decorators, { kind: "method", name: "createAsn", static: false, private: false, access: { has: function (obj) { return "createAsn" in obj; }, get: function (obj) { return obj.createAsn; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _receiveGoods_decorators, { kind: "method", name: "receiveGoods", static: false, private: false, access: { has: function (obj) { return "receiveGoods" in obj; }, get: function (obj) { return obj.receiveGoods; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createOutbound_decorators, { kind: "method", name: "createOutbound", static: false, private: false, access: { has: function (obj) { return "createOutbound" in obj; }, get: function (obj) { return obj.createOutbound; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _pickOrder_decorators, { kind: "method", name: "pickOrder", static: false, private: false, access: { has: function (obj) { return "pickOrder" in obj; }, get: function (obj) { return obj.pickOrder; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _scheduleDock_decorators, { kind: "method", name: "scheduleDock", static: false, private: false, access: { has: function (obj) { return "scheduleDock" in obj; }, get: function (obj) { return obj.scheduleDock; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _runAbcAnalysis_decorators, { kind: "method", name: "runAbcAnalysis", static: false, private: false, access: { has: function (obj) { return "runAbcAnalysis" in obj; }, get: function (obj) { return obj.runAbcAnalysis; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        WarehouseController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return WarehouseController = _classThis;
}();
exports.WarehouseController = WarehouseController;
