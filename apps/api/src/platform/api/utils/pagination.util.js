"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaginationResponse = createPaginationResponse;
exports.getPaginationParams = getPaginationParams;
function createPaginationResponse(data, total, page, limit) {
    return {
        data: data,
        meta: {
            total: total,
            page: page,
            limit: limit,
            totalPages: Math.ceil(total / limit),
        },
    };
}
function getPaginationParams(page, limit) {
    if (page === void 0) { page = 1; }
    if (limit === void 0) { limit = 10; }
    var skip = (page - 1) * limit;
    return { skip: skip, take: limit };
}
