import { getPrimaryNav } from "./siteConfig";

/** Nav ağacını düzleştir → {id, path, label, parentId} listesi */
function flattenNav(items, parentId = null, acc = []) {
  for (const it of items) {
    acc.push({
      id: it.id,
      path: it.path,
      label: it.label,
      parentId, // çocuklarda zaten dolu gelecek
      title: it.label,
      breadcrumb: it.label,
    });
    if (Array.isArray(it.children) && it.children.length > 0) {
      flattenNav(it.children, it.id, acc);
    }
  }
  return acc;
}

// 1) Düzleştir
const raw = flattenNav(getPrimaryNav());

// 2) Home’u bul
const home = raw.find((r) => r.path === "/" || r.id === "home");

// 3) Normalize: parentId boş olan (ve kendisi home olmayan) kökleri home’a bağla
const routes = raw.map((r) => {
  if (!r.parentId && home && r.id !== home.id) {
    return { ...r, parentId: home.id };
  }
  return r;
});

// 4) Indexler
const routeByPath = Object.fromEntries(routes.map((r) => [r.path, r]));
const routeById = Object.fromEntries(routes.map((r) => [r.id, r]));

/** id zincirinden breadcrumb trail üret */
export function buildTrailById(id) {
  const trail = [];
  let cur = routeById[id];
  while (cur) {
    trail.unshift(cur);
    cur = cur.parentId ? routeById[cur.parentId] : null;
  }
  return trail;
}

/** path’ten meta ve trail için meta getir */
export function getRouteMetaByPath(path) {
  return routeByPath[path];
}
