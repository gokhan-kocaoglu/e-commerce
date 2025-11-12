import { getPrimaryNav } from "./siteConfig";

function flatten(items, parentId = null, acc = []) {
  for (const it of items) {
    acc.push({ ...it, parentId });
    if (Array.isArray(it.children)) flatten(it.children, it.id, acc);
  }
  return acc;
}

const NAV_FLAT = flatten(getPrimaryNav());
const byId = Object.fromEntries(NAV_FLAT.map((x) => [x.id, x]));
const byPath = Object.fromEntries(NAV_FLAT.map((x) => [x.path, x]));

/** /shop | /shop/:key -> key döndürür; yoksa null */
export function getCategoryKeyFromPath(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  // [/shop] → null, [/shop, men] → "men"
  return parts.length >= 2 ? parts[1] : null;
}

export function getCategoryMetaByKey(key) {
  return key ? byId[key] : null;
}

export function getCategoryIdByKey(key) {
  return getCategoryMetaByKey(key)?.categoryId || null;
}

export function getMetaByPath(path) {
  return byPath[path] || null;
}
