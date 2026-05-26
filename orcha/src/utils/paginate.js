const parsePagination = (query, defaultLimit = 20, maxLimit = 100) => {
  const page = Math.max(1, parseInt(query.page || '1', 10) || 1);
  const limit = Math.min(maxLimit, Math.max(1, parseInt(query.limit || String(defaultLimit), 10) || defaultLimit));
  return { page, limit, skip: (page - 1) * limit };
};

const buildMeta = (total, page, limit) => ({
  total, page, limit, totalPages: Math.ceil(total / limit) || 1,
});

module.exports = { parsePagination, buildMeta };
