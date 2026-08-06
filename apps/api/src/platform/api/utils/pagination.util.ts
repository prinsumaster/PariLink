export function createPaginationResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
) {
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export function getPaginationParams(page: number = 1, limit: number = 10) {
  const skip = (page - 1) * limit;
  return { skip, take: limit };
}
