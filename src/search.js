const MAX_QUERY_LENGTH = 100;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

export function normalizeSearchTerm(value) {
  return String(value ?? '')
    .trim()
    .slice(0, MAX_QUERY_LENGTH)
    .toLocaleLowerCase('en-US')
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim();
}

export function parseLimit(value) {
  const parsed = Number.parseInt(String(value ?? ''), 10);
  if (!Number.isFinite(parsed) || parsed < 1) return DEFAULT_LIMIT;
  return Math.min(parsed, MAX_LIMIT);
}

export function searchCatalog(items, query, limit) {
  const normalizedQuery = normalizeSearchTerm(query);
  const tokens = normalizedQuery ? normalizedQuery.split(' ') : [];

  return items
    .filter((item) => {
      if (tokens.length === 0) return true;
      const searchable = normalizeSearchTerm(
        [item.name, item.manufacturer, item.partNumber, item.category].join(' '),
      );
      return tokens.every((token) => searchable.includes(token));
    })
    .slice(0, parseLimit(limit));
}
