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
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@nestjs/core");
var app_module_1 = require("../src/app.module");
var api_keys_service_1 = require("../src/iam/services/api-keys.service");
var secrets_service_1 = require("../src/platform/security/secrets/secrets.service");
var prisma_service_1 = require("../src/prisma/prisma.service");
var crypto = __importStar(require("crypto"));
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var app, prisma, secretsService, apiKeyService, company, apiKeyStr, keyHash, secretStr, user, payload, payloadStr, validSig, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, core_1.NestFactory.createApplicationContext(app_module_1.AppModule, { logger: false })];
            case 1:
                app = _a.sent();
                prisma = app.get(prisma_service_1.PrismaService);
                secretsService = app.get(secrets_service_1.SecretsService);
                apiKeyService = app.get(api_keys_service_1.ApiKeyService);
                return [4 /*yield*/, prisma.company.findFirst()];
            case 2:
                company = _a.sent();
                apiKeyStr = 'test_iot_api_key_' + Date.now();
                keyHash = crypto.createHash('sha256').update(apiKeyStr).digest('hex');
                return [4 /*yield*/, prisma.runAsSystem('Seeding test API key', function (tx) { return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            return [2 /*return*/, tx.apiKey.create({
                                    data: {
                                        id: crypto.randomUUID(),
                                        name: 'IoT Test Key',
                                        keyHash: keyHash,
                                        scopes: [],
                                        companyId: company.id,
                                    }
                                })];
                        });
                    }); })];
            case 3:
                _a.sent();
                secretStr = 'iot_super_secret_' + Date.now();
                return [4 /*yield*/, prisma.user.findFirst()];
            case 4:
                user = _a.sent();
                return [4 /*yield*/, secretsService.storeIntegrationSecret('SYSTEM', 'IOT_PROVIDER', 'WEBHOOK_SECRET', secretStr, user.id)];
            case 5:
                _a.sent();
                payload = { vehicleId: 'V1', latitude: 12.3, longitude: 45.6 };
                payloadStr = JSON.stringify(payload);
                validSig = crypto.createHmac('sha256', secretStr).update(Buffer.from(payloadStr)).digest('hex');
                return [4 /*yield*/, fetch('http://localhost:8080/api/v1/fleet/iot/webhook/IOT_PROVIDER', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKeyStr },
                        body: payloadStr
                    })];
            case 6:
                res = _a.sent();
                console.log('Missing Signature Status:', res.status);
                return [4 /*yield*/, fetch('http://localhost:8080/api/v1/fleet/iot/webhook/IOT_PROVIDER', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKeyStr, 'x-provider-signature': 'invalid_signature_123' },
                        body: payloadStr
                    })];
            case 7:
                // Test Invalid Header
                res = _a.sent();
                console.log('Invalid Signature Status:', res.status);
                return [4 /*yield*/, fetch('http://localhost:8080/api/v1/fleet/iot/webhook/IOT_PROVIDER', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'x-api-key': apiKeyStr, 'x-provider-signature': validSig },
                        body: payloadStr
                    })];
            case 8:
                // Test Valid Header
                res = _a.sent();
                console.log('Valid Signature Status:', res.status);
                return [4 /*yield*/, app.close()];
            case 9:
                _a.sent();
                process.exit(0);
                return [2 /*return*/];
        }
    });
}); })();
