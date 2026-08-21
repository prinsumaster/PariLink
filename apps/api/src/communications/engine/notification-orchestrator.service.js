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
exports.NotificationOrchestratorService = void 0;
var common_1 = require("@nestjs/common");
var notification_dto_1 = require("../dto/notification.dto");
var NotificationOrchestratorService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var NotificationOrchestratorService = _classThis = /** @class */ (function () {
        function NotificationOrchestratorService_1(prisma, audit, eventStore, templateService, sseService, deliveryQueue) {
            this.prisma = prisma;
            this.audit = audit;
            this.eventStore = eventStore;
            this.templateService = templateService;
            this.sseService = sseService;
            this.deliveryQueue = deliveryQueue;
            this.logger = new common_1.Logger(NotificationOrchestratorService.name);
        }
        // 1. Template Management
        NotificationOrchestratorService_1.prototype.createTemplate = function (companyId, userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var existing, template;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.notificationTemplate.findFirst({
                                            where: { companyId: companyId, eventType: dto.eventType, channel: dto.channel },
                                        })];
                                });
                            }); })];
                        case 1:
                            existing = _a.sent();
                            if (existing) {
                                throw new common_1.BadRequestException("Template already exists for event ".concat(dto.eventType, " on channel ").concat(dto.channel));
                            }
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.notificationTemplate.create({
                                                data: {
                                                    companyId: companyId,
                                                    name: dto.name,
                                                    eventType: dto.eventType,
                                                    channel: dto.channel,
                                                    subject: dto.subject || null,
                                                    body: dto.body,
                                                    isActive: dto.isActive !== undefined ? dto.isActive : true,
                                                },
                                            })];
                                    });
                                }); })];
                        case 2:
                            template = _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'notification:template:create',
                                    entity: 'NotificationTemplate',
                                    entityId: template.id,
                                    userId: userId,
                                    companyId: companyId,
                                    details: {
                                        name: template.name,
                                        eventType: template.eventType,
                                        channel: template.channel,
                                    },
                                })];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.eventStore.append({
                                    tenantId: companyId,
                                    streamType: 'NOTIFICATION_TEMPLATE',
                                    streamId: template.id,
                                    eventType: 'TemplateCreated',
                                    payload: {
                                        name: template.name,
                                        eventType: template.eventType,
                                        channel: template.channel,
                                    },
                                    userId: userId,
                                })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, template];
                    }
                });
            });
        };
        NotificationOrchestratorService_1.prototype.getTemplates = function (companyId, eventType) {
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, tx.notificationTemplate.findMany({
                                        where: {
                                            OR: [{ companyId: companyId }, { companyId: null }],
                                            eventType: eventType || undefined,
                                        },
                                        orderBy: { createdAt: 'desc' },
                                    })];
                            });
                        }); })];
                });
            });
        };
        NotificationOrchestratorService_1.prototype.updateTemplate = function (companyId, id, userId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var template, updated;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, tx.notificationTemplate.findFirst({ where: { id: id, companyId: companyId } })];
                            }); }); })];
                        case 1:
                            template = _a.sent();
                            if (!template ||
                                (template.companyId !== companyId && template.companyId !== null)) {
                                throw new common_1.NotFoundException('Template not found');
                            }
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.notificationTemplate.updateMany({
                                                where: { id: id, companyId: companyId },
                                                data: {
                                                    name: dto.name,
                                                    subject: dto.subject,
                                                    body: dto.body,
                                                    isActive: dto.isActive,
                                                },
                                            })];
                                    });
                                }); })];
                        case 2:
                            updated = _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'notification:template:update',
                                    entity: 'NotificationTemplate',
                                    entityId: id,
                                    userId: userId,
                                    companyId: companyId,
                                    details: { updates: dto },
                                })];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.eventStore.append({
                                    tenantId: companyId,
                                    streamType: 'NOTIFICATION_TEMPLATE',
                                    streamId: id,
                                    eventType: 'TemplateUpdated',
                                    payload: { updates: dto },
                                    userId: userId,
                                })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, updated];
                    }
                });
            });
        };
        NotificationOrchestratorService_1.prototype.deleteTemplate = function (companyId, id, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var template;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, tx.notificationTemplate.findFirst({ where: { id: id, companyId: companyId } })];
                            }); }); })];
                        case 1:
                            template = _a.sent();
                            if (!template || template.companyId !== companyId) {
                                throw new common_1.NotFoundException('Template not found or global template cannot be deleted');
                            }
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.notificationTemplate.deleteMany({
                                                where: { id: id, companyId: companyId },
                                            })];
                                    });
                                }); })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'notification:template:delete',
                                    entity: 'NotificationTemplate',
                                    entityId: id,
                                    userId: userId,
                                    companyId: companyId,
                                    details: { name: template.name },
                                })];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.eventStore.append({
                                    tenantId: companyId,
                                    streamType: 'NOTIFICATION_TEMPLATE',
                                    streamId: id,
                                    eventType: 'TemplateDeleted',
                                    payload: { name: template.name },
                                    userId: userId,
                                })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, { success: true, id: id }];
                    }
                });
            });
        };
        // 2. Quiet Hours & Rate Limiting Heuristics
        NotificationOrchestratorService_1.prototype.isInQuietHours = function (prefs) {
            if (!prefs || !prefs.quietHoursStart || !prefs.quietHoursEnd) {
                return false;
            }
            try {
                var now = new Date();
                // Simple parse HH:mm in UTC/local
                var currentMinutes = now.getHours() * 60 + now.getMinutes();
                var _a = prefs.quietHoursStart.split(':').map(Number), startH = _a[0], startM = _a[1];
                var _b = prefs.quietHoursEnd.split(':').map(Number), endH = _b[0], endM = _b[1];
                var startMinutes = startH * 60 + startM;
                var endMinutes = endH * 60 + endM;
                if (startMinutes < endMinutes) {
                    return currentMinutes >= startMinutes && currentMinutes < endMinutes;
                }
                else {
                    // Crosses midnight (e.g. 22:00 to 08:00)
                    return currentMinutes >= startMinutes || currentMinutes < endMinutes;
                }
            }
            catch (e) {
                this.logger.warn('Failed to parse quiet hours, skipping quiet hours check');
                return false;
            }
        };
        NotificationOrchestratorService_1.prototype.checkRateLimit = function (userId, channel) {
            return __awaiter(this, void 0, void 0, function () {
                var oneHourAgo, count;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            oneHourAgo = new Date(Date.now() - 3600000);
                            return [4 /*yield*/, this.prisma.runAsSystem('System operation or legacy bypass', function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.notificationDelivery.count({
                                                where: {
                                                    userId: userId,
                                                    channel: channel,
                                                    createdAt: { gte: oneHourAgo },
                                                },
                                            })];
                                    });
                                }); })];
                        case 1:
                            count = _a.sent();
                            if (channel === 'SMS' && count >= 15) {
                                this.logger.warn("Rate limit exceeded for user ".concat(userId, " on SMS channel (").concat(count, "/hour)"));
                                return [2 /*return*/, false]; // Rate limited
                            }
                            if (channel === 'EMAIL' && count >= 50) {
                                this.logger.warn("Rate limit exceeded for user ".concat(userId, " on EMAIL channel (").concat(count, "/hour)"));
                                return [2 /*return*/, false]; // Rate limited
                            }
                            return [2 /*return*/, true];
                    }
                });
            });
        };
        // 3. Multi-Channel Dispatch & Orchestration
        NotificationOrchestratorService_1.prototype.dispatchNotification = function (companyId, senderId, dto) {
            return __awaiter(this, void 0, void 0, function () {
                var targetUser, prefs, priority, isQuiet, shouldDeferForQuietHours, targetChannels, prefChannels, results, inAppNotificationId, title_1, body_1, notification, _loop_1, this_1, _i, targetChannels_1, channel;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                return [2 /*return*/, tx.user.findUnique({ where: { id: dto.targetUserId } })];
                            }); }); })];
                        case 1:
                            targetUser = _a.sent();
                            if (!targetUser || targetUser.companyId !== companyId) {
                                throw new common_1.NotFoundException('Target user not found in tenant');
                            }
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.notificationPreference.findUnique({
                                                where: { userId: targetUser.id },
                                            })];
                                    });
                                }); })];
                        case 2:
                            prefs = _a.sent();
                            if (!!prefs) return [3 /*break*/, 4];
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.notificationPreference.create({
                                                data: {
                                                    userId: targetUser.id,
                                                    companyId: companyId,
                                                    channels: { email: true, inApp: true, sms: false },
                                                },
                                            })];
                                    });
                                }); })];
                        case 3:
                            prefs = _a.sent();
                            _a.label = 4;
                        case 4:
                            priority = dto.priority || notification_dto_1.NotificationPriority.NORMAL;
                            isQuiet = this.isInQuietHours(prefs);
                            shouldDeferForQuietHours = isQuiet &&
                                priority !== notification_dto_1.NotificationPriority.URGENT &&
                                priority !== notification_dto_1.NotificationPriority.HIGH;
                            targetChannels = dto.channels;
                            if (!targetChannels || targetChannels.length === 0) {
                                prefChannels = prefs.channels;
                                targetChannels = [];
                                if ((prefChannels === null || prefChannels === void 0 ? void 0 : prefChannels.inApp) !== false)
                                    targetChannels.push('IN_APP');
                                if (prefChannels === null || prefChannels === void 0 ? void 0 : prefChannels.email)
                                    targetChannels.push('EMAIL');
                                if ((prefChannels === null || prefChannels === void 0 ? void 0 : prefChannels.sms) || priority === notification_dto_1.NotificationPriority.URGENT)
                                    targetChannels.push('SMS');
                            }
                            results = [];
                            inAppNotificationId = null;
                            if (!targetChannels.includes('IN_APP')) return [3 /*break*/, 6];
                            title_1 = dto.title || "Notification: ".concat(dto.eventType);
                            body_1 = dto.body || "New event ".concat(dto.eventType, " occurred.");
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.notification.create({
                                                data: {
                                                    companyId: companyId,
                                                    userId: targetUser.id,
                                                    type: dto.eventType,
                                                    priority: priority,
                                                    title: title_1,
                                                    body: body_1,
                                                    entityType: dto.entityType || null,
                                                    entityId: dto.entityId || null,
                                                    actionUrl: dto.actionUrl || null,
                                                },
                                            })];
                                    });
                                }); })];
                        case 5:
                            notification = _a.sent();
                            inAppNotificationId = notification.id;
                            if (!shouldDeferForQuietHours) {
                                this.sseService.emitToUser(targetUser.id, {
                                    type: 'NEW_NOTIFICATION',
                                    notification: notification,
                                });
                            }
                            results.push({
                                channel: 'IN_APP',
                                status: 'DELIVERED',
                                id: notification.id,
                            });
                            _a.label = 6;
                        case 6:
                            _loop_1 = function (channel) {
                                var rateLimitOk, template, subject, body, recipient, status_1, delivery;
                                return __generator(this, function (_b) {
                                    switch (_b.label) {
                                        case 0:
                                            if (channel === 'IN_APP')
                                                return [2 /*return*/, "continue"];
                                            return [4 /*yield*/, this_1.checkRateLimit(targetUser.id, channel)];
                                        case 1:
                                            rateLimitOk = _b.sent();
                                            if (!rateLimitOk) {
                                                results.push({ channel: channel, status: 'SKIPPED_RATE_LIMIT' });
                                                return [2 /*return*/, "continue"];
                                            }
                                            return [4 /*yield*/, this_1.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        return [2 /*return*/, tx.notificationTemplate.findFirst({
                                                                where: {
                                                                    OR: [{ companyId: companyId }, { companyId: null }],
                                                                    eventType: dto.eventType,
                                                                    channel: channel,
                                                                    isActive: true,
                                                                },
                                                            })];
                                                    });
                                                }); })];
                                        case 2:
                                            template = _b.sent();
                                            subject = dto.title || "Alert: ".concat(dto.eventType);
                                            body = dto.body || "An event ".concat(dto.eventType, " occurred in PariLink.");
                                            if (template) {
                                                if (template.subject)
                                                    subject = this_1.templateService.render(template.subject, dto.templateData || {});
                                                body = this_1.templateService.render(template.body, dto.templateData || {});
                                            }
                                            recipient = channel === 'EMAIL'
                                                ? targetUser.email
                                                : targetUser.phoneNumber || targetUser.email;
                                            status_1 = shouldDeferForQuietHours ? 'PENDING' : 'PENDING';
                                            return [4 /*yield*/, this_1.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                                    return __generator(this, function (_a) {
                                                        return [2 /*return*/, tx.notificationDelivery.create({
                                                                data: {
                                                                    companyId: companyId,
                                                                    userId: targetUser.id,
                                                                    recipient: recipient,
                                                                    channel: channel,
                                                                    eventType: dto.eventType,
                                                                    payload: { subject: subject, body: body, priority: priority, actionUrl: dto.actionUrl },
                                                                    status: status_1,
                                                                },
                                                            })];
                                                    });
                                                }); })];
                                        case 3:
                                            delivery = _b.sent();
                                            if (!!shouldDeferForQuietHours) return [3 /*break*/, 5];
                                            return [4 /*yield*/, this_1.deliveryQueue
                                                    .add('deliver-notification', { deliveryId: delivery.id }, {
                                                    attempts: 3,
                                                    backoff: { type: 'exponential', delay: 2000 },
                                                    priority: priority === notification_dto_1.NotificationPriority.URGENT ? 1 : 5,
                                                })
                                                    .catch(function (err) {
                                                    _this.logger.error("Failed to queue BullMQ job for delivery ".concat(delivery.id, ": ").concat(err.message));
                                                })];
                                        case 4:
                                            _b.sent();
                                            _b.label = 5;
                                        case 5:
                                            results.push({
                                                channel: channel,
                                                deliveryId: delivery.id,
                                                status: shouldDeferForQuietHours ? 'DEFERRED_QUIET_HOURS' : 'QUEUED',
                                            });
                                            return [2 /*return*/];
                                    }
                                });
                            };
                            this_1 = this;
                            _i = 0, targetChannels_1 = targetChannels;
                            _a.label = 7;
                        case 7:
                            if (!(_i < targetChannels_1.length)) return [3 /*break*/, 10];
                            channel = targetChannels_1[_i];
                            return [5 /*yield**/, _loop_1(channel)];
                        case 8:
                            _a.sent();
                            _a.label = 9;
                        case 9:
                            _i++;
                            return [3 /*break*/, 7];
                        case 10: return [4 /*yield*/, this.audit.logEvent({
                                action: 'notification:dispatch',
                                entity: 'Notification',
                                entityId: inAppNotificationId || targetUser.id,
                                userId: senderId,
                                companyId: companyId,
                                details: {
                                    targetUserId: targetUser.id,
                                    eventType: dto.eventType,
                                    priority: priority,
                                    results: results,
                                },
                            })];
                        case 11:
                            _a.sent();
                            return [4 /*yield*/, this.eventStore.append({
                                    tenantId: companyId,
                                    streamType: 'NOTIFICATION_DISPATCH',
                                    streamId: targetUser.id,
                                    eventType: 'NotificationDispatched',
                                    payload: { eventType: dto.eventType, results: results },
                                    userId: senderId,
                                })];
                        case 12:
                            _a.sent();
                            return [2 /*return*/, {
                                    success: true,
                                    targetUserId: targetUser.id,
                                    eventType: dto.eventType,
                                    priority: priority,
                                    deferredForQuietHours: shouldDeferForQuietHours,
                                    results: results,
                                }];
                    }
                });
            });
        };
        NotificationOrchestratorService_1.prototype.getDeliveryMetrics = function (companyId) {
            return __awaiter(this, void 0, void 0, function () {
                var _a, delivered, pending, failed, total, channelBreakdown;
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, Promise.all([
                                this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.notificationDelivery.count({
                                                where: { companyId: companyId, status: 'DELIVERED' },
                                            })];
                                    });
                                }); }),
                                this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.notificationDelivery.count({
                                                where: { companyId: companyId, status: 'PENDING' },
                                            })];
                                    });
                                }); }),
                                this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.notificationDelivery.count({
                                                where: { companyId: companyId, status: 'FAILED' },
                                            })];
                                    });
                                }); }),
                                this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.notificationDelivery.count({ where: { companyId: companyId } })];
                                }); }); }),
                            ])];
                        case 1:
                            _a = _b.sent(), delivered = _a[0], pending = _a[1], failed = _a[2], total = _a[3];
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.notificationDelivery.groupBy({
                                                by: ['channel', 'status'],
                                                where: { companyId: companyId },
                                                _count: true,
                                            })];
                                    });
                                }); })];
                        case 2:
                            channelBreakdown = _b.sent();
                            return [2 /*return*/, {
                                    companyId: companyId,
                                    summary: { total: total, delivered: delivered, pending: pending, failed: failed },
                                    channelBreakdown: channelBreakdown.map(function (item) { return ({
                                        channel: item.channel,
                                        status: item.status,
                                        count: item._count,
                                    }); }),
                                    timestamp: new Date().toISOString(),
                                }];
                    }
                });
            });
        };
        NotificationOrchestratorService_1.prototype.retryFailedDeliveries = function (companyId, userId) {
            return __awaiter(this, void 0, void 0, function () {
                var failedDeliveries, jobs, requeuedCount;
                var _this = this;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/, tx.notificationDelivery.findMany({
                                            where: { companyId: companyId, status: 'FAILED' },
                                            take: 100,
                                        })];
                                });
                            }); })];
                        case 1:
                            failedDeliveries = _a.sent();
                            if (failedDeliveries.length === 0)
                                return [2 /*return*/, { message: 'No failed deliveries found', requeuedCount: 0 }];
                            return [4 /*yield*/, this.prisma.runAsTenant(companyId, function (tx) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        return [2 /*return*/, tx.notificationDelivery.updateMany({
                                                where: { id: { in: failedDeliveries.map(function (d) { return d.id; }) }, companyId: companyId },
                                                data: { status: 'PENDING', retryCount: 0, errorMessage: null },
                                            })];
                                    });
                                }); })];
                        case 2:
                            _a.sent();
                            jobs = failedDeliveries.map(function (deliv) { return ({
                                name: 'deliver-notification',
                                data: { deliveryId: deliv.id },
                                opts: { attempts: 3, backoff: { type: 'exponential', delay: 2000 } },
                            }); });
                            return [4 /*yield*/, this.deliveryQueue.addBulk(jobs)];
                        case 3:
                            _a.sent();
                            requeuedCount = failedDeliveries.length;
                            return [4 /*yield*/, this.audit.logEvent({
                                    action: 'notification:retry_failed',
                                    entity: 'NotificationDelivery',
                                    entityId: 'batch-retry',
                                    userId: userId,
                                    companyId: companyId,
                                    details: { requeuedCount: requeuedCount },
                                })];
                        case 4:
                            _a.sent();
                            return [2 /*return*/, { success: true, requeuedCount: requeuedCount }];
                    }
                });
            });
        };
        return NotificationOrchestratorService_1;
    }());
    __setFunctionName(_classThis, "NotificationOrchestratorService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        NotificationOrchestratorService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return NotificationOrchestratorService = _classThis;
}();
exports.NotificationOrchestratorService = NotificationOrchestratorService;
