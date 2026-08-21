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
exports.TenantGuard = void 0;
var common_1 = require("@nestjs/common");
var public_decorator_1 = require("../decorators/public.decorator");
// ---------------------------------------------------------------------------
// TenantGuard — Zero Trust Tenant Isolation
//
// When a route includes a :companyId path parameter, this guard automatically
// compares it against the authenticated user's JWT companyId.
//
// Design:
//   - Applied globally (after JwtAuthGuard) or per-controller via @UseGuards
//   - Fail-closed: if the route has :companyId, the JWT companyId MUST match
//   - Public routes (@Public decorator) are skipped
//   - Routes without :companyId are skipped (guard is a no-op)
//   - Super-admin override: users with platform:admin permission bypass this
//     check (managed via the separate PermissionsGuard / IAM engine)
//
// Usage:
//   @UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
//   @Controller('companies/:companyId/idps')
//   export class AdminSsoController { ... }
// ---------------------------------------------------------------------------
var TenantGuard = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var TenantGuard = _classThis = /** @class */ (function () {
        function TenantGuard_1(reflector) {
            this.reflector = reflector;
            this.logger = new common_1.Logger(TenantGuard.name);
        }
        TenantGuard_1.prototype.canActivate = function (context) {
            var _a;
            // Skip for @Public routes
            var isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
                context.getHandler(),
                context.getClass(),
            ]);
            if (isPublic)
                return true;
            var request = context.switchToHttp().getRequest();
            var params = (_a = request.params) !== null && _a !== void 0 ? _a : {};
            // If no :companyId param on this route, guard is a no-op
            if (!('companyId' in params))
                return true;
            var routeCompanyId = params.companyId;
            var user = request.user;
            if (!user) {
                // JwtAuthGuard should have caught this first, but fail-safe
                throw new common_1.ForbiddenException('Authentication required');
            }
            var jwtCompanyId = user.companyId;
            if (!jwtCompanyId || jwtCompanyId !== routeCompanyId) {
                this.logger.warn("[TENANT_GUARD] Cross-tenant access blocked: user=".concat(user.id, " ") +
                    "jwtTenant=".concat(jwtCompanyId, " routeTenant=").concat(routeCompanyId, " ") +
                    "path=".concat(request.url, " method=").concat(request.method));
                throw new common_1.ForbiddenException('Access to this tenant is not permitted.');
            }
            return true;
        };
        return TenantGuard_1;
    }());
    __setFunctionName(_classThis, "TenantGuard");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        TenantGuard = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return TenantGuard = _classThis;
}();
exports.TenantGuard = TenantGuard;
