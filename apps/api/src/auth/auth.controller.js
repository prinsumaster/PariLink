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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("./guards/jwt-auth.guard");
var swagger_1 = require("@nestjs/swagger");
var throttler_1 = require("@nestjs/throttler");
var AuthController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('auth'), (0, common_1.Controller)('auth')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _login_decorators;
    var _register_decorators;
    var _refresh_decorators;
    var _logout_decorators;
    var _logoutAll_decorators;
    var _generateRegistrationOptions_decorators;
    var _verifyRegistration_decorators;
    var _generateAuthenticationOptions_decorators;
    var _verifyAuthentication_decorators;
    var _getProfile_decorators;
    var _getSessions_decorators;
    var _revokeSession_decorators;
    var _setupMfa_decorators;
    var _verifyMfaSetup_decorators;
    var AuthController = _classThis = /** @class */ (function () {
        function AuthController_1(authService, mfaService) {
            this.authService = (__runInitializers(this, _instanceExtraInitializers), authService);
            this.mfaService = mfaService;
        }
        // Enterprise Security: Prevent Brute Force Attacks. Max 500 attempts per IP per minute.
        AuthController_1.prototype.login = function (loginDto, response, request) {
            return __awaiter(this, void 0, void 0, function () {
                var ip, userAgent, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            ip = request.ip || '0.0.0.0';
                            userAgent = request.headers['user-agent'] || 'Unknown Device';
                            return [4 /*yield*/, this.authService.login(loginDto, ip, userAgent)];
                        case 1:
                            result = _a.sent();
                            if ('requiresMfa' in result) {
                                return [2 /*return*/, result];
                            }
                            response.cookie('refresh_token', result.refresh_token, {
                                domain: process.env.COOKIE_DOMAIN || undefined,
                                httpOnly: true,
                                secure: process.env.NODE_ENV === 'production',
                                sameSite: 'lax',
                                maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
                            });
                            response.cookie('access_token', result.access_token, {
                                domain: process.env.COOKIE_DOMAIN || undefined,
                                httpOnly: true,
                                secure: process.env.NODE_ENV === 'production',
                                sameSite: 'lax',
                                maxAge: 15 * 60 * 1000, // 15 mins
                            });
                            response.cookie('logged_in', 'true', {
                                domain: process.env.COOKIE_DOMAIN || undefined,
                                httpOnly: false,
                                secure: process.env.NODE_ENV === 'production',
                                sameSite: 'lax',
                                maxAge: 7 * 24 * 60 * 60 * 1000,
                            });
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        // Enterprise Security: Rate limit registration endpoint
        AuthController_1.prototype.register = function (registerDto, response, request) {
            return __awaiter(this, void 0, void 0, function () {
                var ip, userAgent, result;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            ip = request.ip || '0.0.0.0';
                            userAgent = request.headers['user-agent'] || 'Unknown Device';
                            return [4 /*yield*/, this.authService.register(registerDto, ip, userAgent)];
                        case 1:
                            result = _a.sent();
                            if ('requiresMfa' in result) {
                                return [2 /*return*/, result];
                            }
                            response.cookie('refresh_token', result.refresh_token, {
                                domain: process.env.COOKIE_DOMAIN || undefined,
                                httpOnly: true,
                                secure: process.env.NODE_ENV === 'production',
                                sameSite: 'lax',
                                maxAge: 7 * 24 * 60 * 60 * 1000,
                            });
                            response.cookie('access_token', result.access_token, {
                                domain: process.env.COOKIE_DOMAIN || undefined,
                                httpOnly: true,
                                secure: process.env.NODE_ENV === 'production',
                                sameSite: 'lax',
                                maxAge: 15 * 60 * 1000,
                            });
                            response.cookie('logged_in', 'true', {
                                domain: process.env.COOKIE_DOMAIN || undefined,
                                httpOnly: false,
                                secure: process.env.NODE_ENV === 'production',
                                sameSite: 'lax',
                                maxAge: 7 * 24 * 60 * 60 * 1000,
                            });
                            return [2 /*return*/, result];
                    }
                });
            });
        };
        AuthController_1.prototype.refresh = function (request, refreshDto, response) {
            return __awaiter(this, void 0, void 0, function () {
                var refreshToken, ip, userAgent, result, refresh_token, access_token, safeResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            refreshToken = request.cookies['refresh_token'];
                            ip = request.ip || '0.0.0.0';
                            userAgent = request.headers['user-agent'] || 'Unknown Device';
                            return [4 /*yield*/, this.authService.refreshToken(refreshToken, ip, userAgent, refreshDto === null || refreshDto === void 0 ? void 0 : refreshDto.deviceFingerprint)];
                        case 1:
                            result = _a.sent();
                            response.cookie('refresh_token', result.refresh_token, {
                                domain: process.env.COOKIE_DOMAIN || undefined,
                                httpOnly: true,
                                secure: process.env.NODE_ENV === 'production',
                                sameSite: 'lax',
                                maxAge: 7 * 24 * 60 * 60 * 1000,
                            });
                            response.cookie('access_token', result.access_token, {
                                domain: process.env.COOKIE_DOMAIN || undefined,
                                httpOnly: true,
                                secure: process.env.NODE_ENV === 'production',
                                sameSite: 'lax',
                                maxAge: 15 * 60 * 1000, // 15 mins
                            });
                            response.cookie('logged_in', 'true', {
                                domain: process.env.COOKIE_DOMAIN || undefined,
                                httpOnly: false,
                                secure: process.env.NODE_ENV === 'production',
                                sameSite: 'lax',
                                maxAge: 7 * 24 * 60 * 60 * 1000,
                            });
                            refresh_token = result.refresh_token, access_token = result.access_token, safeResult = __rest(result, ["refresh_token", "access_token"]);
                            return [2 /*return*/, safeResult];
                    }
                });
            });
        };
        AuthController_1.prototype.logout = function (request, response) {
            return __awaiter(this, void 0, void 0, function () {
                var refreshToken;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            refreshToken = request.cookies['refresh_token'];
                            return [4 /*yield*/, this.authService.logout(refreshToken, request.user.id)];
                        case 1:
                            _a.sent();
                            response.clearCookie('refresh_token');
                            response.clearCookie('access_token');
                            response.clearCookie('logged_in');
                            return [2 /*return*/, { success: true }];
                    }
                });
            });
        };
        AuthController_1.prototype.logoutAll = function (request, response) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.authService.logoutAllSessions(request.user.id)];
                        case 1:
                            _a.sent();
                            response.clearCookie('refresh_token');
                            response.clearCookie('access_token');
                            response.clearCookie('logged_in');
                            return [2 /*return*/, { success: true }];
                    }
                });
            });
        };
        // -------------------------------------------------------------------------
        // WebAuthn / Passkeys
        // -------------------------------------------------------------------------
        AuthController_1.prototype.generateRegistrationOptions = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.generateWebAuthnRegistrationOptions(email)];
                });
            });
        };
        AuthController_1.prototype.verifyRegistration = function (email, response) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.verifyWebAuthnRegistration(email, response)];
                });
            });
        };
        AuthController_1.prototype.generateAuthenticationOptions = function (email) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.generateWebAuthnAuthenticationOptions(email)];
                });
            });
        };
        AuthController_1.prototype.verifyAuthentication = function (email, responseBody, deviceFingerprint, response, request) {
            return __awaiter(this, void 0, void 0, function () {
                var ip, userAgent, result, refresh_token, safeResult;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            ip = request.ip || '0.0.0.0';
                            userAgent = request.headers['user-agent'] || 'Unknown Device';
                            return [4 /*yield*/, this.authService.verifyWebAuthnAuthentication(email, responseBody, ip, userAgent, deviceFingerprint)];
                        case 1:
                            result = _a.sent();
                            response.cookie('refresh_token', result.refresh_token, {
                                domain: process.env.COOKIE_DOMAIN || undefined,
                                httpOnly: true,
                                secure: process.env.NODE_ENV === 'production',
                                sameSite: 'lax',
                                maxAge: 7 * 24 * 60 * 60 * 1000,
                            });
                            refresh_token = result.refresh_token, safeResult = __rest(result, ["refresh_token"]);
                            return [2 /*return*/, safeResult];
                    }
                });
            });
        };
        // -------------------------------------------------------------------------
        // Session Management
        // -------------------------------------------------------------------------
        AuthController_1.prototype.getProfile = function (req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, req.user];
                });
            });
        };
        AuthController_1.prototype.getSessions = function (req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.getActiveSessions(req.user.id)];
                });
            });
        };
        AuthController_1.prototype.revokeSession = function (req, sessionId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.authService.revokeSession(req.user.id, sessionId)];
                });
            });
        };
        // -------------------------------------------------------------------------
        // Multi-Factor Authentication
        // -------------------------------------------------------------------------
        AuthController_1.prototype.setupMfa = function (req) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.mfaService.generateTotpSecret(req.user.id, req.user.email)];
                });
            });
        };
        AuthController_1.prototype.verifyMfaSetup = function (req, token) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.mfaService.verifyTotpSetup(req.user.id, token)];
                });
            });
        };
        return AuthController_1;
    }());
    __setFunctionName(_classThis, "AuthController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _login_decorators = [(0, throttler_1.Throttle)({ default: { limit: process.env.NODE_ENV === 'test' ? 1000 : 5, ttl: 60000 } }), (0, common_1.HttpCode)(common_1.HttpStatus.OK), (0, common_1.Post)('login'), (0, swagger_1.ApiOperation)({ summary: 'User Login' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Return JWT access token.' }), (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials.' })];
        _register_decorators = [(0, throttler_1.Throttle)({ default: { limit: process.env.NODE_ENV === 'test' ? 1000 : 5, ttl: 60000 } }), (0, common_1.HttpCode)(common_1.HttpStatus.CREATED), (0, common_1.Post)('register'), (0, swagger_1.ApiOperation)({ summary: 'User Registration' }), (0, swagger_1.ApiResponse)({ status: 201, description: 'Return JWT access token.' }), (0, swagger_1.ApiResponse)({ status: 403, description: 'User already exists.' })];
        _refresh_decorators = [(0, common_1.Post)('refresh'), (0, swagger_1.ApiOperation)({ summary: 'Refresh access token using HttpOnly cookie' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Return new JWT access token.' }), (0, swagger_1.ApiResponse)({
                status: 401,
                description: 'Invalid or missing refresh token.',
            })];
        _logout_decorators = [(0, common_1.Post)('logout'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Logout and clear refresh token' }), (0, swagger_1.ApiResponse)({ status: 200, description: 'Successfully logged out.' })];
        _logoutAll_decorators = [(0, common_1.Post)('logout-all'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Logout from all active sessions' }), (0, swagger_1.ApiResponse)({
                status: 200,
                description: 'Successfully logged out of all sessions.',
            })];
        _generateRegistrationOptions_decorators = [(0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }), (0, common_1.Post)('webauthn/register/generate-options'), (0, swagger_1.ApiOperation)({ summary: 'Generate WebAuthn Registration Options' })];
        _verifyRegistration_decorators = [(0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }), (0, common_1.Post)('webauthn/register/verify'), (0, swagger_1.ApiOperation)({ summary: 'Verify WebAuthn Registration Response' })];
        _generateAuthenticationOptions_decorators = [(0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }), (0, common_1.Post)('webauthn/authenticate/generate-options'), (0, swagger_1.ApiOperation)({ summary: 'Generate WebAuthn Authentication Options' })];
        _verifyAuthentication_decorators = [(0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }), (0, common_1.Post)('webauthn/authenticate/verify'), (0, swagger_1.ApiOperation)({ summary: 'Verify WebAuthn Authentication Response' })];
        _getProfile_decorators = [(0, common_1.Get)('me'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Get current user profile' })];
        _getSessions_decorators = [(0, common_1.Get)('sessions'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Get active sessions for current user' })];
        _revokeSession_decorators = [(0, common_1.Post)('sessions/:id/revoke'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Revoke a specific session' })];
        _setupMfa_decorators = [(0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }), (0, common_1.Post)('mfa/setup'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Generate MFA Setup (TOTP)' })];
        _verifyMfaSetup_decorators = [(0, throttler_1.Throttle)({ default: { limit: 5, ttl: 60000 } }), (0, common_1.Post)('mfa/verify-setup'), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, swagger_1.ApiBearerAuth)(), (0, swagger_1.ApiOperation)({ summary: 'Verify and enable MFA' })];
        __esDecorate(_classThis, null, _login_decorators, { kind: "method", name: "login", static: false, private: false, access: { has: function (obj) { return "login" in obj; }, get: function (obj) { return obj.login; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _register_decorators, { kind: "method", name: "register", static: false, private: false, access: { has: function (obj) { return "register" in obj; }, get: function (obj) { return obj.register; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _refresh_decorators, { kind: "method", name: "refresh", static: false, private: false, access: { has: function (obj) { return "refresh" in obj; }, get: function (obj) { return obj.refresh; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _logout_decorators, { kind: "method", name: "logout", static: false, private: false, access: { has: function (obj) { return "logout" in obj; }, get: function (obj) { return obj.logout; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _logoutAll_decorators, { kind: "method", name: "logoutAll", static: false, private: false, access: { has: function (obj) { return "logoutAll" in obj; }, get: function (obj) { return obj.logoutAll; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateRegistrationOptions_decorators, { kind: "method", name: "generateRegistrationOptions", static: false, private: false, access: { has: function (obj) { return "generateRegistrationOptions" in obj; }, get: function (obj) { return obj.generateRegistrationOptions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _verifyRegistration_decorators, { kind: "method", name: "verifyRegistration", static: false, private: false, access: { has: function (obj) { return "verifyRegistration" in obj; }, get: function (obj) { return obj.verifyRegistration; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _generateAuthenticationOptions_decorators, { kind: "method", name: "generateAuthenticationOptions", static: false, private: false, access: { has: function (obj) { return "generateAuthenticationOptions" in obj; }, get: function (obj) { return obj.generateAuthenticationOptions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _verifyAuthentication_decorators, { kind: "method", name: "verifyAuthentication", static: false, private: false, access: { has: function (obj) { return "verifyAuthentication" in obj; }, get: function (obj) { return obj.verifyAuthentication; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getProfile_decorators, { kind: "method", name: "getProfile", static: false, private: false, access: { has: function (obj) { return "getProfile" in obj; }, get: function (obj) { return obj.getProfile; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getSessions_decorators, { kind: "method", name: "getSessions", static: false, private: false, access: { has: function (obj) { return "getSessions" in obj; }, get: function (obj) { return obj.getSessions; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _revokeSession_decorators, { kind: "method", name: "revokeSession", static: false, private: false, access: { has: function (obj) { return "revokeSession" in obj; }, get: function (obj) { return obj.revokeSession; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _setupMfa_decorators, { kind: "method", name: "setupMfa", static: false, private: false, access: { has: function (obj) { return "setupMfa" in obj; }, get: function (obj) { return obj.setupMfa; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _verifyMfaSetup_decorators, { kind: "method", name: "verifyMfaSetup", static: false, private: false, access: { has: function (obj) { return "verifyMfaSetup" in obj; }, get: function (obj) { return obj.verifyMfaSetup; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AuthController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AuthController = _classThis;
}();
exports.AuthController = AuthController;
