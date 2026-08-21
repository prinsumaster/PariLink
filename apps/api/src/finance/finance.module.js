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
exports.FinanceModule = void 0;
var common_1 = require("@nestjs/common");
var finance_controller_1 = require("./finance.controller");
var finance_service_1 = require("./finance.service");
var pricing_engine_1 = require("./pricing/pricing.engine");
var settlement_engine_1 = require("./settlements/settlement.engine");
var profitability_engine_1 = require("./analytics/profitability.engine");
var finops_orchestrator_service_1 = require("./events/finops-orchestrator.service");
var invoices_module_1 = require("../invoices/invoices.module");
var bank_reconciliation_module_1 = require("./bank-reconciliation/bank-reconciliation.module");
var payroll_module_1 = require("./payroll/payroll.module");
var gl_mapper_service_1 = require("./gl-mapper.service");
var invoicing_controller_1 = require("./invoicing/invoicing.controller");
var invoicing_service_1 = require("./invoicing/invoicing.service");
var accounts_payable_controller_1 = require("./payables/accounts-payable.controller");
var accounts_payable_service_1 = require("./payables/accounts-payable.service");
var fastag_controller_1 = require("./fastag/fastag.controller");
var fastag_service_1 = require("./fastag/fastag.service");
var general_ledger_controller_1 = require("./ledger/general-ledger.controller");
var general_ledger_service_1 = require("./ledger/general-ledger.service");
var driver_wallet_controller_1 = require("./driver-wallet.controller");
var driver_wallet_service_1 = require("./driver-wallet.service");
var FinanceModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [invoices_module_1.InvoicesModule, bank_reconciliation_module_1.BankReconciliationModule, payroll_module_1.PayrollModule],
            controllers: [
                invoicing_controller_1.InvoicingController,
                accounts_payable_controller_1.AccountsPayableController,
                fastag_controller_1.FastagController,
                general_ledger_controller_1.GeneralLedgerController,
                driver_wallet_controller_1.DriverWalletController,
                finance_controller_1.FinanceController,
            ],
            providers: [
                finance_service_1.FinanceService,
                pricing_engine_1.PricingEngine,
                settlement_engine_1.SettlementEngine,
                profitability_engine_1.ProfitabilityEngine,
                finops_orchestrator_service_1.FinOpsOrchestratorService,
                gl_mapper_service_1.GlMapperService,
                invoicing_service_1.InvoicingService,
                accounts_payable_service_1.AccountsPayableService,
                fastag_service_1.FastagService,
                general_ledger_service_1.GeneralLedgerService,
                driver_wallet_service_1.DriverWalletService,
            ],
            exports: [pricing_engine_1.PricingEngine, profitability_engine_1.ProfitabilityEngine, driver_wallet_service_1.DriverWalletService],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var FinanceModule = _classThis = /** @class */ (function () {
        function FinanceModule_1() {
        }
        return FinanceModule_1;
    }());
    __setFunctionName(_classThis, "FinanceModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        FinanceModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return FinanceModule = _classThis;
}();
exports.FinanceModule = FinanceModule;
