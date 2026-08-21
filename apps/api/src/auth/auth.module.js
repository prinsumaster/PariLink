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
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
exports.getJwtPublicKey = getJwtPublicKey;
exports.getJwtPrivateKey = getJwtPrivateKey;
var common_1 = require("@nestjs/common");
var auth_service_1 = require("./auth.service");
var auth_controller_1 = require("./auth.controller");
var jwt_1 = require("@nestjs/jwt");
var passport_1 = require("@nestjs/passport");
var jwt_strategy_1 = require("./strategies/jwt.strategy");
var brute_force_protection_service_1 = require("../platform/security/brute-force/brute-force-protection.service");
var mfa_service_1 = require("./mfa.service");
var integrations_module_1 = require("../integrations/integrations.module");
var crypto = __importStar(require("crypto"));
var ephemeralPrivateKey = null;
var ephemeralPublicKey = null;
function resolveJwtKeys() {
    if (process.env.JWT_PRIVATE_KEY && process.env.JWT_PUBLIC_KEY) {
        var privateKey = process.env.JWT_PRIVATE_KEY;
        var publicKey = process.env.JWT_PUBLIC_KEY;
        if (!privateKey.includes('-----BEGIN')) {
            privateKey = Buffer.from(privateKey, 'base64').toString('utf8');
        }
        if (!publicKey.includes('-----BEGIN')) {
            publicKey = Buffer.from(publicKey, 'base64').toString('utf8');
        }
        return {
            privateKey: privateKey,
            publicKey: publicKey,
        };
    }
    // Abort unconditionally unless ALLOW_EPHEMERAL_JWT_KEYS=true is set explicitly.
    // This catches staging/preview envs that omit NODE_ENV=production but still
    // run multiple replicas — intermittent 401s from key mismatch are hard to debug.
    if (process.env.ALLOW_EPHEMERAL_JWT_KEYS !== 'true') {
        throw new Error('[AUTH] CRITICAL: JWT_PRIVATE_KEY and JWT_PUBLIC_KEY are missing. ' +
            'Set ALLOW_EPHEMERAL_JWT_KEYS=true to allow ephemeral keys in development, ' +
            'or provide real keys via environment variables.');
    }
    if (!ephemeralPrivateKey || !ephemeralPublicKey) {
        var _a = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: { type: 'spki', format: 'pem' },
            privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
        }), privateKey = _a.privateKey, publicKey = _a.publicKey;
        ephemeralPrivateKey = privateKey;
        ephemeralPublicKey = publicKey;
        var fingerprint = crypto
            .createHash('sha256')
            .update(ephemeralPublicKey)
            .digest('hex')
            .substring(0, 8);
        console.warn("[AUTH] WARN: Using EPHEMERAL RS256 keypair (fingerprint: ".concat(fingerprint, "). ") +
            'Tokens will be invalidated on restart. ' +
            'Multi-replica deployments will have intermittent 401s. ' +
            'Set JWT_PRIVATE_KEY and JWT_PUBLIC_KEY for stable operation.');
    }
    return {
        privateKey: ephemeralPrivateKey,
        publicKey: ephemeralPublicKey,
    };
}
function getJwtPublicKey() {
    return resolveJwtKeys().publicKey;
}
function getJwtPrivateKey() {
    return resolveJwtKeys().privateKey;
}
var AuthModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [
                passport_1.PassportModule,
                integrations_module_1.IntegrationsModule,
                jwt_1.JwtModule.registerAsync({
                    useFactory: function () {
                        var keys = resolveJwtKeys();
                        return {
                            privateKey: keys.privateKey,
                            publicKey: keys.publicKey,
                            signOptions: {
                                expiresIn: '15m',
                                algorithm: 'RS256',
                            },
                        };
                    },
                }),
            ],
            controllers: [auth_controller_1.AuthController],
            providers: [
                auth_service_1.AuthService,
                jwt_strategy_1.JwtStrategy,
                brute_force_protection_service_1.BruteForceProtectionService,
                mfa_service_1.MfaService,
            ],
            exports: [auth_service_1.AuthService, mfa_service_1.MfaService],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AuthModule = _classThis = /** @class */ (function () {
        function AuthModule_1() {
        }
        return AuthModule_1;
    }());
    __setFunctionName(_classThis, "AuthModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthModule = _classThis;
}();
exports.AuthModule = AuthModule;
