const cache = new Map();

export function getMemoryCacheEntry(key) {
  return cache.get(key) ?? null;
}

export function setMemoryCacheEntry(key, value) {
  cache.set(key, value);
  return value;
}

export function clearMemoryCache() {
  cache.clear();
}
