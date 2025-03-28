// Simple in-memory cache
const cache = new Map<string, { data: any; expiry: number }>()

// Default cache duration in milliseconds (5 minutes)
const DEFAULT_CACHE_DURATION = 5 * 60 * 1000

export function getCachedData<T>(key: string): T | null {
  const item = cache.get(key)

  if (!item) return null

  // Check if the cache has expired
  if (Date.now() > item.expiry) {
    cache.delete(key)
    return null
  }

  return item.data as T
}

export function setCachedData<T>(key: string, data: T, duration = DEFAULT_CACHE_DURATION): void {
  const expiry = Date.now() + duration
  cache.set(key, { data, expiry })
}

export function clearCache(keyPrefix?: string): void {
  if (keyPrefix) {
    // Clear only keys that start with the prefix
    for (const key of cache.keys()) {
      if (key.startsWith(keyPrefix)) {
        cache.delete(key)
      }
    }
  } else {
    // Clear the entire cache
    cache.clear()
  }
}

