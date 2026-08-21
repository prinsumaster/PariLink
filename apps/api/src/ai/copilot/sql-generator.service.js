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
exports.SqlGeneratorService = void 0;
var common_1 = require("@nestjs/common");
var openai_1 = require("@langchain/openai");
var prompts_1 = require("@langchain/core/prompts");
var SqlGeneratorService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var SqlGeneratorService = _classThis = /** @class */ (function () {
        function SqlGeneratorService_1(prisma) {
            this.prisma = prisma;
            this.logger = new common_1.Logger(SqlGeneratorService.name);
            // Define allowed tables to prevent accidental or malicious queries against sensitive data like users/passwords.
            this.ALLOWED_TABLES = [
                'Trip',
                'Load',
                'Invoice',
                'Vehicle',
                'Driver',
                'Customer',
                'Expense',
            ];
            this.model = new openai_1.ChatOpenAI({
                modelName: 'gpt-4-turbo-preview',
                temperature: 0,
                openAIApiKey: process.env.OPENAI_API_KEY || 'dummy-key-to-allow-boot',
            });
        }
        SqlGeneratorService_1.prototype.generateAndExecuteSafeSql = function (companyId, prompt) {
            return __awaiter(this, void 0, void 0, function () {
                var sqlQuery, sanitizedQuery_1, result, error_1;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            this.logger.log("Generating SQL for company ".concat(companyId, " based on prompt: \"").concat(prompt, "\""));
                            return [4 /*yield*/, this.generateSql(prompt)];
                        case 1:
                            sqlQuery = _a.sent();
                            // 2. Validate Safety (ABAC & SQL Injection Protection)
                            this.validateSqlSafety(sqlQuery, companyId);
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 4, , 5]);
                            sanitizedQuery_1 = this.injectCompanyId(sqlQuery);
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.$queryRawUnsafe(sanitizedQuery_1, companyId)];
                                }); }); })];
                        case 3:
                            result = _a.sent();
                            return [2 /*return*/, result];
                        case 4:
                            error_1 = _a.sent();
                            this.logger.error("Failed to execute generated SQL: ".concat(error_1.message));
                            throw new common_1.BadRequestException('The generated query failed to execute safely.');
                        case 5: return [2 /*return*/];
                    }
                });
            });
        };
        SqlGeneratorService_1.prototype.generateSql = function (prompt) {
            return __awaiter(this, void 0, void 0, function () {
                var template, promptTemplate, formattedPrompt, response;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            template = "\n    You are an expert PostgreSQL data analyst for a logistics operating system.\n    Generate a highly optimized, read-only (SELECT) PostgreSQL query to answer the user's question.\n    \n    CRITICAL RULES:\n    1. Only return the raw SQL query string. Do not include markdown formatting like ```sql.\n    2. You MUST include a WHERE clause that filters by \"companyId\" = '{{COMPANY_ID_PLACEHOLDER}}' in every query.\n    3. You may only query the following tables: ".concat(this.ALLOWED_TABLES.join(', '), ".\n    4. Never write UPDATE, DELETE, DROP, INSERT, or ALTER queries.\n\n    User Question: {question}\n    ");
                            promptTemplate = prompts_1.PromptTemplate.fromTemplate(template);
                            return [4 /*yield*/, promptTemplate.format({
                                    question: prompt,
                                })];
                        case 1:
                            formattedPrompt = _a.sent();
                            return [4 /*yield*/, this.model.invoke(formattedPrompt)];
                        case 2:
                            response = _a.sent();
                            return [2 /*return*/, typeof response.content === 'string'
                                    ? response.content.trim()
                                    : JSON.stringify(response.content).trim()];
                    }
                });
            });
        };
        SqlGeneratorService_1.prototype.validateSqlSafety = function (query, companyId) {
            var upperQuery = query.toUpperCase();
            // Check for destructive operations
            if (upperQuery.includes('UPDATE ') ||
                upperQuery.includes('DELETE ') ||
                upperQuery.includes('INSERT ') ||
                upperQuery.includes('DROP ') ||
                upperQuery.includes('ALTER ') ||
                upperQuery.includes('TRUNCATE ')) {
                throw new common_1.ForbiddenException('Only SELECT queries are allowed.');
            }
            // Ensure companyId isolation is injected or present.
            // In a robust implementation, we would parse the AST or use parameterized queries.
            // For this sprint implementation, we replace the placeholder.
            if (!query.includes('{{COMPANY_ID_PLACEHOLDER}}')) {
                // Just as an extra precaution if the LLM failed to include it.
                throw new common_1.ForbiddenException('Tenant isolation validation failed.');
            }
            // Replace the placeholder with the actual companyId (parameterization is better, but this works for demo)
            // Note: We use string replacement here, but ideally we extract the query structure and pass companyId as a param to prisma.$queryRaw.
        };
        // Helper method to prepare parameterized query
        SqlGeneratorService_1.prototype.injectCompanyId = function (query) {
            // Replace the placeholder with the parameter marker $1
            return query.replace(/'\{\{COMPANY_ID_PLACEHOLDER\}\}'|\{\{COMPANY_ID_PLACEHOLDER\}\}/g, '$1');
        };
        return SqlGeneratorService_1;
    }());
    __setFunctionName(_classThis, "SqlGeneratorService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        SqlGeneratorService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return SqlGeneratorService = _classThis;
}();
exports.SqlGeneratorService = SqlGeneratorService;
