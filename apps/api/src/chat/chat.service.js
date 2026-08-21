"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
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
exports.ChatService = void 0;
var common_1 = require("@nestjs/common");
var ChatService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var ChatService = _classThis = /** @class */ (function () {
        function ChatService_1(prisma) {
            this.prisma = prisma;
        }
        ChatService_1.prototype.getChannels = function (companyId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var channels;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.chatChannel.findMany({
                                            where: {
                                                companyId: companyId,
                                                archivedAt: null,
                                                OR: [{ isPrivate: false }, { members: { some: { userId: userId } } }],
                                            },
                                            include: {
                                                members: { select: { userId: true, lastReadAt: true } },
                                                _count: { select: { messages: true } },
                                            },
                                            orderBy: { createdAt: 'asc' },
                                        })];
                                });
                            }); })];
                        case 1:
                            channels = _a.sent();
                            // Add unread count per channel for this user
                            return [2 /*return*/, channels.map(function (ch) {
                                    var myMembership = ch.members.find(function (m) { return m.userId === userId; });
                                    return __assign(__assign({}, ch), { isMember: !!myMembership, lastReadAt: myMembership === null || myMembership === void 0 ? void 0 : myMembership.lastReadAt });
                                })];
                    }
                });
            });
        };
        ChatService_1.prototype.createChannel = function (companyId, userId, data) {
            return __awaiter(this, void 0, void 0, function () {
                var channel;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.chatChannel.create({
                                            data: {
                                                companyId: companyId,
                                                name: data.name,
                                                description: data.description,
                                                type: data.type || 'CHANNEL',
                                                isPrivate: data.isPrivate || false,
                                                createdById: userId,
                                                members: {
                                                    create: __spreadArray([
                                                        { userId: userId, role: 'ADMIN' }
                                                    ], (data.memberIds || [])
                                                        .filter(function (id) { return id !== userId; })
                                                        .map(function (id) { return ({ userId: id, role: 'MEMBER' }); }), true),
                                                },
                                            },
                                            include: { members: true },
                                        })];
                                });
                            }); })];
                        case 1:
                            channel = _a.sent();
                            return [2 /*return*/, channel];
                    }
                });
            });
        };
        ChatService_1.prototype.getMessages = function (companyId_1, userId_1, channelId_1, cursor_1) {
            return __awaiter(this, arguments, void 0, function (companyId, userId, channelId, cursor, limit) {
                var channel, isMember, messages;
                var _this = this;
                if (limit === void 0) { limit = 50; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.chatChannel.findFirst({
                                            where: { id: channelId, companyId: companyId },
                                        })];
                                });
                            }); })];
                        case 1:
                            channel = _a.sent();
                            if (!channel)
                                throw new common_1.NotFoundException('Channel not found');
                            if (!channel.isPrivate) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.chatChannelMember.findUnique({
                                                where: { channelId_userId: { channelId: channelId, userId: userId } },
                                            })];
                                    });
                                }); })];
                        case 2:
                            isMember = _a.sent();
                            if (!isMember)
                                throw new common_1.ForbiddenException('Not a member of this channel');
                            _a.label = 3;
                        case 3: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.chatMessage.findMany({
                                            where: __assign({ channelId: channelId }, (cursor ? { createdAt: { lt: new Date(cursor) } } : {})),
                                            include: {
                                                sender: {
                                                    select: { id: true, firstName: true, lastName: true, avatar: true },
                                                },
                                                reactions: {
                                                    include: {
                                                        user: { select: { id: true, firstName: true, lastName: true } },
                                                    },
                                                },
                                            },
                                            orderBy: { createdAt: 'desc' },
                                            take: limit,
                                        })];
                                });
                            }); })];
                        case 4:
                            messages = _a.sent();
                            // Update last read
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.chatChannelMember.upsert({
                                                where: { channelId_userId: { channelId: channelId, userId: userId } },
                                                update: { lastReadAt: new Date() },
                                                create: { channelId: channelId, userId: userId, lastReadAt: new Date() },
                                            })];
                                    });
                                }); })];
                        case 5:
                            // Update last read
                            _a.sent();
                            return [2 /*return*/, messages.reverse()];
                    }
                });
            });
        };
        ChatService_1.prototype.sendMessage = function (companyId_1, userId_1, channelId_1, content_1) {
            return __awaiter(this, arguments, void 0, function (companyId, userId, channelId, content, attachments, mentions) {
                var channel, message;
                var _this = this;
                if (attachments === void 0) { attachments = []; }
                if (mentions === void 0) { mentions = []; }
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.chatChannel.findFirst({
                                            where: { id: channelId, companyId: companyId },
                                        })];
                                });
                            }); })];
                        case 1:
                            channel = _a.sent();
                            if (!channel)
                                throw new common_1.NotFoundException('Channel not found');
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.chatMessage.create({
                                                data: { channelId: channelId, senderId: userId, content: content, attachments: attachments, mentions: mentions },
                                                include: {
                                                    sender: {
                                                        select: { id: true, firstName: true, lastName: true, avatar: true },
                                                    },
                                                    reactions: true,
                                                },
                                            })];
                                    });
                                }); })];
                        case 2:
                            message = _a.sent();
                            if (!(mentions.length > 0)) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.notification.createMany({
                                                data: mentions.map(function (mentionedUserId) { return ({
                                                    companyId: companyId,
                                                    userId: mentionedUserId,
                                                    type: 'CHAT',
                                                    title: "You were mentioned",
                                                    body: "".concat(content.substring(0, 100), "..."),
                                                    entityType: 'ChatMessage',
                                                    entityId: message.id,
                                                    actionUrl: "/chat?channel=".concat(channelId),
                                                }); }),
                                                skipDuplicates: true,
                                            })];
                                    });
                                }); })];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4: return [2 /*return*/, message];
                    }
                });
            });
        };
        ChatService_1.prototype.editMessage = function (companyId, userId, messageId, content) {
            return __awaiter(this, void 0, void 0, function () {
                var message;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.chatMessage.findUnique({
                                            where: { id: messageId },
                                        })];
                                });
                            }); })];
                        case 1:
                            message = _a.sent();
                            if (!message)
                                throw new common_1.NotFoundException('Message not found');
                            if (message.senderId !== userId)
                                throw new common_1.ForbiddenException("Cannot edit another user's message");
                            return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.chatMessage.update({
                                                where: { id: messageId },
                                                data: { content: content, editedAt: new Date() },
                                                include: {
                                                    sender: { select: { id: true, firstName: true, lastName: true } },
                                                    reactions: true,
                                                },
                                            })];
                                    });
                                }); })];
                    }
                });
            });
        };
        ChatService_1.prototype.deleteMessage = function (companyId, userId, messageId) {
            return __awaiter(this, void 0, void 0, function () {
                var message;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.chatMessage.findUnique({
                                            where: { id: messageId },
                                        })];
                                });
                            }); })];
                        case 1:
                            message = _a.sent();
                            if (!message)
                                throw new common_1.NotFoundException('Message not found');
                            if (message.senderId !== userId)
                                throw new common_1.ForbiddenException("Cannot delete another user's message");
                            return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.chatMessage.update({
                                                where: { id: messageId },
                                                data: { deletedAt: new Date(), content: 'This message was deleted.' },
                                            })];
                                    });
                                }); })];
                    }
                });
            });
        };
        ChatService_1.prototype.addReaction = function (userId, messageId, emoji) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.messageReaction.upsert({
                                        where: { messageId_userId_emoji: { messageId: messageId, userId: userId, emoji: emoji } },
                                        update: {},
                                        create: { messageId: messageId, userId: userId, emoji: emoji },
                                    })];
                            });
                        }); })];
                });
            });
        };
        ChatService_1.prototype.removeReaction = function (userId, messageId, emoji) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.messageReaction.deleteMany({
                                        where: { messageId: messageId, userId: userId, emoji: emoji },
                                    })];
                            });
                        }); })];
                });
            });
        };
        ChatService_1.prototype.joinChannel = function (userId, channelId) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.chatChannelMember.upsert({
                                        where: { channelId_userId: { channelId: channelId, userId: userId } },
                                        update: {},
                                        create: { channelId: channelId, userId: userId },
                                    })];
                            });
                        }); })];
                });
            });
        };
        ChatService_1.prototype.getOrCreateDm = function (companyId, userId, otherUserId) {
            return __awaiter(this, void 0, void 0, function () {
                var existing;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.chatChannel.findFirst({
                                            where: {
                                                companyId: companyId,
                                                type: 'DIRECT',
                                                members: { every: { userId: { in: [userId, otherUserId] } } },
                                            },
                                        })];
                                });
                            }); })];
                        case 1:
                            existing = _a.sent();
                            if (existing)
                                return [2 /*return*/, existing];
                            return [2 /*return*/, this.createChannel(companyId, userId, {
                                    name: "DM",
                                    type: 'DIRECT',
                                    isPrivate: true,
                                    memberIds: [otherUserId],
                                })];
                    }
                });
            });
        };
        return ChatService_1;
    }());
    __setFunctionName(_classThis, "ChatService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ChatService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ChatService = _classThis;
}();
exports.ChatService = ChatService;
