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
exports.ChatController = void 0;
var common_1 = require("@nestjs/common");
var jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
var swagger_1 = require("@nestjs/swagger");
var ChatController = function () {
    var _classDecorators = [(0, swagger_1.ApiTags)('Chat'), (0, swagger_1.ApiBearerAuth)(), (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard), (0, common_1.Controller)('chat')];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var _instanceExtraInitializers = [];
    var _getChannels_decorators;
    var _createChannel_decorators;
    var _getMessages_decorators;
    var _sendMessage_decorators;
    var _editMessage_decorators;
    var _deleteMessage_decorators;
    var _addReaction_decorators;
    var _removeReaction_decorators;
    var _joinChannel_decorators;
    var _getOrCreateDm_decorators;
    var ChatController = _classThis = /** @class */ (function () {
        function ChatController_1(chatService) {
            this.chatService = (__runInitializers(this, _instanceExtraInitializers), chatService);
        }
        ChatController_1.prototype.getChannels = function (user) {
            return this.chatService.getChannels(user.companyId, user.userId);
        };
        ChatController_1.prototype.createChannel = function (user, body) {
            return this.chatService.createChannel(user.companyId, user.userId, body);
        };
        ChatController_1.prototype.getMessages = function (user, channelId, cursor, limit) {
            return this.chatService.getMessages(user.companyId, user.userId, channelId, cursor, limit ? parseInt(limit) : 50);
        };
        ChatController_1.prototype.sendMessage = function (user, channelId, body) {
            return this.chatService.sendMessage(user.companyId, user.userId, channelId, body.content, body.attachments, body.mentions);
        };
        ChatController_1.prototype.editMessage = function (user, messageId, body) {
            return this.chatService.editMessage(user.companyId, user.userId, messageId, body.content);
        };
        ChatController_1.prototype.deleteMessage = function (user, messageId) {
            return this.chatService.deleteMessage(user.companyId, user.userId, messageId);
        };
        ChatController_1.prototype.addReaction = function (user, messageId, body) {
            return this.chatService.addReaction(user.userId, messageId, body.emoji);
        };
        ChatController_1.prototype.removeReaction = function (user, messageId, emoji) {
            return this.chatService.removeReaction(user.userId, messageId, emoji);
        };
        ChatController_1.prototype.joinChannel = function (user, channelId) {
            return this.chatService.joinChannel(user.userId, channelId);
        };
        ChatController_1.prototype.getOrCreateDm = function (user, otherUserId) {
            return this.chatService.getOrCreateDm(user.companyId, user.userId, otherUserId);
        };
        return ChatController_1;
    }());
    __setFunctionName(_classThis, "ChatController");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _getChannels_decorators = [(0, common_1.Get)('channels'), (0, swagger_1.ApiOperation)({ summary: 'Get all channels for the current user' })];
        _createChannel_decorators = [(0, common_1.Post)('channels'), (0, swagger_1.ApiOperation)({ summary: 'Create a new channel' })];
        _getMessages_decorators = [(0, common_1.Get)('channels/:channelId/messages'), (0, swagger_1.ApiOperation)({ summary: 'Get messages in a channel' })];
        _sendMessage_decorators = [(0, common_1.Post)('channels/:channelId/messages'), (0, swagger_1.ApiOperation)({ summary: 'Send a message to a channel' })];
        _editMessage_decorators = [(0, common_1.Put)('messages/:messageId'), (0, swagger_1.ApiOperation)({ summary: 'Edit a message' })];
        _deleteMessage_decorators = [(0, common_1.Delete)('messages/:messageId'), (0, swagger_1.ApiOperation)({ summary: 'Delete a message' }), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT)];
        _addReaction_decorators = [(0, common_1.Post)('messages/:messageId/reactions'), (0, swagger_1.ApiOperation)({ summary: 'Add a reaction to a message' })];
        _removeReaction_decorators = [(0, common_1.Delete)('messages/:messageId/reactions/:emoji'), (0, swagger_1.ApiOperation)({ summary: 'Remove a reaction from a message' }), (0, common_1.HttpCode)(common_1.HttpStatus.NO_CONTENT)];
        _joinChannel_decorators = [(0, common_1.Post)('channels/:channelId/join'), (0, swagger_1.ApiOperation)({ summary: 'Join a public channel' })];
        _getOrCreateDm_decorators = [(0, common_1.Post)('dm/:otherUserId'), (0, swagger_1.ApiOperation)({ summary: 'Open or create a DM with a user' })];
        __esDecorate(_classThis, null, _getChannels_decorators, { kind: "method", name: "getChannels", static: false, private: false, access: { has: function (obj) { return "getChannels" in obj; }, get: function (obj) { return obj.getChannels; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _createChannel_decorators, { kind: "method", name: "createChannel", static: false, private: false, access: { has: function (obj) { return "createChannel" in obj; }, get: function (obj) { return obj.createChannel; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getMessages_decorators, { kind: "method", name: "getMessages", static: false, private: false, access: { has: function (obj) { return "getMessages" in obj; }, get: function (obj) { return obj.getMessages; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _sendMessage_decorators, { kind: "method", name: "sendMessage", static: false, private: false, access: { has: function (obj) { return "sendMessage" in obj; }, get: function (obj) { return obj.sendMessage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _editMessage_decorators, { kind: "method", name: "editMessage", static: false, private: false, access: { has: function (obj) { return "editMessage" in obj; }, get: function (obj) { return obj.editMessage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _deleteMessage_decorators, { kind: "method", name: "deleteMessage", static: false, private: false, access: { has: function (obj) { return "deleteMessage" in obj; }, get: function (obj) { return obj.deleteMessage; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _addReaction_decorators, { kind: "method", name: "addReaction", static: false, private: false, access: { has: function (obj) { return "addReaction" in obj; }, get: function (obj) { return obj.addReaction; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _removeReaction_decorators, { kind: "method", name: "removeReaction", static: false, private: false, access: { has: function (obj) { return "removeReaction" in obj; }, get: function (obj) { return obj.removeReaction; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _joinChannel_decorators, { kind: "method", name: "joinChannel", static: false, private: false, access: { has: function (obj) { return "joinChannel" in obj; }, get: function (obj) { return obj.joinChannel; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(_classThis, null, _getOrCreateDm_decorators, { kind: "method", name: "getOrCreateDm", static: false, private: false, access: { has: function (obj) { return "getOrCreateDm" in obj; }, get: function (obj) { return obj.getOrCreateDm; } }, metadata: _metadata }, null, _instanceExtraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ChatController = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ChatController = _classThis;
}();
exports.ChatController = ChatController;
