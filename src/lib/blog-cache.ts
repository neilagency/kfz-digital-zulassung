/**
 * Shared in-memory cache for admin blog list API.
 * Both blog/route.ts (GET/POST) and blog/[id]/route.ts (PUT/DELETE)
 * import from here so mutations always invalidate the list cache.
 */

export const blogListCache = new Map<string, { data: unknown; ts: number }>();
export const blogTotalCache = new Map<string, { total: number; ts: number }>();

export const BLOG_CACHE_TTL = 30_000;
export const BLOG_TOTAL_TTL = 30_000;

export function clearBlogCache(): void {
  blogListCache.clear();
  blogTotalCache.clear();
}

export function getFreshBlogTotal(cacheKey: string): number | null {
  const cached = blogTotalCache.get(cacheKey);
  if (cached && Date.now() - cached.ts < BLOG_TOTAL_TTL) {
    return cached.total;
  }
  return null;
}

export function storeBlogTotal(cacheKey: string, total: number): void {
  blogTotalCache.set(cacheKey, { total, ts: Date.now() });
  if (blogTotalCache.size > 30) {
    const now = Date.now();
    for (const [key, value] of blogTotalCache) {
      if (now - value.ts > BLOG_TOTAL_TTL) blogTotalCache.delete(key);
    }
  }
}
