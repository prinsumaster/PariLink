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
Object.defineProperty(exports, "__esModule", { value: true });
exports.DispatchNotificationDto = exports.UpdateNotificationTemplateDto = exports.CreateNotificationTemplateDto = exports.NotificationChannel = exports.NotificationPriority = void 0;
var class_validator_1 = require("class-validator");
var swagger_1 = require("@nestjs/swagger");
var NotificationPriority;
(function (NotificationPriority) {
    NotificationPriority["LOW"] = "LOW";
    NotificationPriority["NORMAL"] = "NORMAL";
    NotificationPriority["HIGH"] = "HIGH";
    NotificationPriority["URGENT"] = "URGENT";
})(NotificationPriority || (exports.NotificationPriority = NotificationPriority = {}));
var NotificationChannel;
(function (NotificationChannel) {
    NotificationChannel["IN_APP"] = "IN_APP";
    NotificationChannel["EMAIL"] = "EMAIL";
    NotificationChannel["SMS"] = "SMS";
    NotificationChannel["SLACK"] = "SLACK";
    NotificationChannel["PUSH"] = "PUSH";
})(NotificationChannel || (exports.NotificationChannel = NotificationChannel = {}));
var CreateNotificationTemplateDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _eventType_decorators;
    var _eventType_initializers = [];
    var _eventType_extraInitializers = [];
    var _channel_decorators;
    var _channel_initializers = [];
    var _channel_extraInitializers = [];
    var _subject_decorators;
    var _subject_initializers = [];
    var _subject_extraInitializers = [];
    var _body_decorators;
    var _body_initializers = [];
    var _body_extraInitializers = [];
    var _isActive_decorators;
    var _isActive_initializers = [];
    var _isActive_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateNotificationTemplateDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.eventType = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _eventType_initializers, void 0));
                this.channel = (__runInitializers(this, _eventType_extraInitializers), __runInitializers(this, _channel_initializers, void 0));
                this.subject = (__runInitializers(this, _channel_extraInitializers), __runInitializers(this, _subject_initializers, void 0));
                this.body = (__runInitializers(this, _subject_extraInitializers), __runInitializers(this, _body_initializers, void 0));
                this.isActive = (__runInitializers(this, _body_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
                __runInitializers(this, _isActive_extraInitializers);
            }
            return CreateNotificationTemplateDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiProperty)({ example: 'Invoice Created Template' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _eventType_decorators = [(0, swagger_1.ApiProperty)({ example: 'invoice.created' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _channel_decorators = [(0, swagger_1.ApiProperty)({
                    enum: NotificationChannel,
                    example: NotificationChannel.EMAIL,
                }), (0, class_validator_1.IsEnum)(NotificationChannel)];
            _subject_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: 'New Invoice {{invoiceNumber}} from PariLink',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _body_decorators = [(0, swagger_1.ApiProperty)({
                    example: 'Hello {{customerName}}, your invoice #{{invoiceNumber}} for ${{amount}} has been generated.',
                }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _isActive_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: true }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _eventType_decorators, { kind: "field", name: "eventType", static: false, private: false, access: { has: function (obj) { return "eventType" in obj; }, get: function (obj) { return obj.eventType; }, set: function (obj, value) { obj.eventType = value; } }, metadata: _metadata }, _eventType_initializers, _eventType_extraInitializers);
            __esDecorate(null, null, _channel_decorators, { kind: "field", name: "channel", static: false, private: false, access: { has: function (obj) { return "channel" in obj; }, get: function (obj) { return obj.channel; }, set: function (obj, value) { obj.channel = value; } }, metadata: _metadata }, _channel_initializers, _channel_extraInitializers);
            __esDecorate(null, null, _subject_decorators, { kind: "field", name: "subject", static: false, private: false, access: { has: function (obj) { return "subject" in obj; }, get: function (obj) { return obj.subject; }, set: function (obj, value) { obj.subject = value; } }, metadata: _metadata }, _subject_initializers, _subject_extraInitializers);
            __esDecorate(null, null, _body_decorators, { kind: "field", name: "body", static: false, private: false, access: { has: function (obj) { return "body" in obj; }, get: function (obj) { return obj.body; }, set: function (obj, value) { obj.body = value; } }, metadata: _metadata }, _body_initializers, _body_extraInitializers);
            __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: function (obj) { return "isActive" in obj; }, get: function (obj) { return obj.isActive; }, set: function (obj, value) { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateNotificationTemplateDto = CreateNotificationTemplateDto;
var UpdateNotificationTemplateDto = function () {
    var _a;
    var _name_decorators;
    var _name_initializers = [];
    var _name_extraInitializers = [];
    var _subject_decorators;
    var _subject_initializers = [];
    var _subject_extraInitializers = [];
    var _body_decorators;
    var _body_initializers = [];
    var _body_extraInitializers = [];
    var _isActive_decorators;
    var _isActive_initializers = [];
    var _isActive_extraInitializers = [];
    return _a = /** @class */ (function () {
            function UpdateNotificationTemplateDto() {
                this.name = __runInitializers(this, _name_initializers, void 0);
                this.subject = (__runInitializers(this, _name_extraInitializers), __runInitializers(this, _subject_initializers, void 0));
                this.body = (__runInitializers(this, _subject_extraInitializers), __runInitializers(this, _body_initializers, void 0));
                this.isActive = (__runInitializers(this, _body_extraInitializers), __runInitializers(this, _isActive_initializers, void 0));
                __runInitializers(this, _isActive_extraInitializers);
            }
            return UpdateNotificationTemplateDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _name_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Updated Template Name' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _subject_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Updated subject {{invoiceNumber}}' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _body_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Updated body text with {{amount}}' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _isActive_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: false }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsBoolean)()];
            __esDecorate(null, null, _name_decorators, { kind: "field", name: "name", static: false, private: false, access: { has: function (obj) { return "name" in obj; }, get: function (obj) { return obj.name; }, set: function (obj, value) { obj.name = value; } }, metadata: _metadata }, _name_initializers, _name_extraInitializers);
            __esDecorate(null, null, _subject_decorators, { kind: "field", name: "subject", static: false, private: false, access: { has: function (obj) { return "subject" in obj; }, get: function (obj) { return obj.subject; }, set: function (obj, value) { obj.subject = value; } }, metadata: _metadata }, _subject_initializers, _subject_extraInitializers);
            __esDecorate(null, null, _body_decorators, { kind: "field", name: "body", static: false, private: false, access: { has: function (obj) { return "body" in obj; }, get: function (obj) { return obj.body; }, set: function (obj, value) { obj.body = value; } }, metadata: _metadata }, _body_initializers, _body_extraInitializers);
            __esDecorate(null, null, _isActive_decorators, { kind: "field", name: "isActive", static: false, private: false, access: { has: function (obj) { return "isActive" in obj; }, get: function (obj) { return obj.isActive; }, set: function (obj, value) { obj.isActive = value; } }, metadata: _metadata }, _isActive_initializers, _isActive_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.UpdateNotificationTemplateDto = UpdateNotificationTemplateDto;
var DispatchNotificationDto = function () {
    var _a;
    var _targetUserId_decorators;
    var _targetUserId_initializers = [];
    var _targetUserId_extraInitializers = [];
    var _eventType_decorators;
    var _eventType_initializers = [];
    var _eventType_extraInitializers = [];
    var _priority_decorators;
    var _priority_initializers = [];
    var _priority_extraInitializers = [];
    var _title_decorators;
    var _title_initializers = [];
    var _title_extraInitializers = [];
    var _body_decorators;
    var _body_initializers = [];
    var _body_extraInitializers = [];
    var _entityType_decorators;
    var _entityType_initializers = [];
    var _entityType_extraInitializers = [];
    var _entityId_decorators;
    var _entityId_initializers = [];
    var _entityId_extraInitializers = [];
    var _actionUrl_decorators;
    var _actionUrl_initializers = [];
    var _actionUrl_extraInitializers = [];
    var _templateData_decorators;
    var _templateData_initializers = [];
    var _templateData_extraInitializers = [];
    var _channels_decorators;
    var _channels_initializers = [];
    var _channels_extraInitializers = [];
    return _a = /** @class */ (function () {
            function DispatchNotificationDto() {
                this.targetUserId = __runInitializers(this, _targetUserId_initializers, void 0);
                this.eventType = (__runInitializers(this, _targetUserId_extraInitializers), __runInitializers(this, _eventType_initializers, void 0));
                this.priority = (__runInitializers(this, _eventType_extraInitializers), __runInitializers(this, _priority_initializers, void 0));
                this.title = (__runInitializers(this, _priority_extraInitializers), __runInitializers(this, _title_initializers, void 0));
                this.body = (__runInitializers(this, _title_extraInitializers), __runInitializers(this, _body_initializers, void 0));
                this.entityType = (__runInitializers(this, _body_extraInitializers), __runInitializers(this, _entityType_initializers, void 0));
                this.entityId = (__runInitializers(this, _entityType_extraInitializers), __runInitializers(this, _entityId_initializers, void 0));
                this.actionUrl = (__runInitializers(this, _entityId_extraInitializers), __runInitializers(this, _actionUrl_initializers, void 0));
                this.templateData = (__runInitializers(this, _actionUrl_extraInitializers), __runInitializers(this, _templateData_initializers, void 0));
                this.channels = (__runInitializers(this, _templateData_extraInitializers), __runInitializers(this, _channels_initializers, void 0));
                __runInitializers(this, _channels_extraInitializers);
            }
            return DispatchNotificationDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _targetUserId_decorators = [(0, swagger_1.ApiProperty)({ example: 'user-uuid-here' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _eventType_decorators = [(0, swagger_1.ApiProperty)({ example: 'invoice.created' }), (0, class_validator_1.IsString)(), (0, class_validator_1.IsNotEmpty)()];
            _priority_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    enum: NotificationPriority,
                    example: NotificationPriority.NORMAL,
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsEnum)(NotificationPriority)];
            _title_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'New Invoice Generated' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _body_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: 'Invoice #INV-1001 for $1,250.00 is ready for review.',
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _entityType_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'Invoice' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _entityId_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: 'inv-uuid-1001' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _actionUrl_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: '/invoices/inv-uuid-1001' }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsString)()];
            _templateData_decorators = [(0, swagger_1.ApiPropertyOptional)({
                    example: {
                        invoiceNumber: 'INV-1001',
                        amount: '1,250.00',
                        customerName: 'Acme Logistics',
                    },
                }), (0, class_validator_1.IsOptional)(), (0, class_validator_1.IsObject)()];
            _channels_decorators = [(0, swagger_1.ApiPropertyOptional)({ example: ['EMAIL', 'IN_APP'] }), (0, class_validator_1.IsOptional)()];
            __esDecorate(null, null, _targetUserId_decorators, { kind: "field", name: "targetUserId", static: false, private: false, access: { has: function (obj) { return "targetUserId" in obj; }, get: function (obj) { return obj.targetUserId; }, set: function (obj, value) { obj.targetUserId = value; } }, metadata: _metadata }, _targetUserId_initializers, _targetUserId_extraInitializers);
            __esDecorate(null, null, _eventType_decorators, { kind: "field", name: "eventType", static: false, private: false, access: { has: function (obj) { return "eventType" in obj; }, get: function (obj) { return obj.eventType; }, set: function (obj, value) { obj.eventType = value; } }, metadata: _metadata }, _eventType_initializers, _eventType_extraInitializers);
            __esDecorate(null, null, _priority_decorators, { kind: "field", name: "priority", static: false, private: false, access: { has: function (obj) { return "priority" in obj; }, get: function (obj) { return obj.priority; }, set: function (obj, value) { obj.priority = value; } }, metadata: _metadata }, _priority_initializers, _priority_extraInitializers);
            __esDecorate(null, null, _title_decorators, { kind: "field", name: "title", static: false, private: false, access: { has: function (obj) { return "title" in obj; }, get: function (obj) { return obj.title; }, set: function (obj, value) { obj.title = value; } }, metadata: _metadata }, _title_initializers, _title_extraInitializers);
            __esDecorate(null, null, _body_decorators, { kind: "field", name: "body", static: false, private: false, access: { has: function (obj) { return "body" in obj; }, get: function (obj) { return obj.body; }, set: function (obj, value) { obj.body = value; } }, metadata: _metadata }, _body_initializers, _body_extraInitializers);
            __esDecorate(null, null, _entityType_decorators, { kind: "field", name: "entityType", static: false, private: false, access: { has: function (obj) { return "entityType" in obj; }, get: function (obj) { return obj.entityType; }, set: function (obj, value) { obj.entityType = value; } }, metadata: _metadata }, _entityType_initializers, _entityType_extraInitializers);
            __esDecorate(null, null, _entityId_decorators, { kind: "field", name: "entityId", static: false, private: false, access: { has: function (obj) { return "entityId" in obj; }, get: function (obj) { return obj.entityId; }, set: function (obj, value) { obj.entityId = value; } }, metadata: _metadata }, _entityId_initializers, _entityId_extraInitializers);
            __esDecorate(null, null, _actionUrl_decorators, { kind: "field", name: "actionUrl", static: false, private: false, access: { has: function (obj) { return "actionUrl" in obj; }, get: function (obj) { return obj.actionUrl; }, set: function (obj, value) { obj.actionUrl = value; } }, metadata: _metadata }, _actionUrl_initializers, _actionUrl_extraInitializers);
            __esDecorate(null, null, _templateData_decorators, { kind: "field", name: "templateData", static: false, private: false, access: { has: function (obj) { return "templateData" in obj; }, get: function (obj) { return obj.templateData; }, set: function (obj, value) { obj.templateData = value; } }, metadata: _metadata }, _templateData_initializers, _templateData_extraInitializers);
            __esDecorate(null, null, _channels_decorators, { kind: "field", name: "channels", static: false, private: false, access: { has: function (obj) { return "channels" in obj; }, get: function (obj) { return obj.channels; }, set: function (obj, value) { obj.channels = value; } }, metadata: _metadata }, _channels_initializers, _channels_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.DispatchNotificationDto = DispatchNotificationDto;
