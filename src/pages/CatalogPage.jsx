// src/pages/CatalogPage.jsx
import { useLocation } from "react-router-dom";
import ShopContainer from "../components/shop/ShopContainer";
import { getRouteMetaByPath } from "../data/navMeta";

function fallbackTitleFromPath(pathname) {
  const seg = pathname.split("/").filter(Boolean).pop() || "Shop";
  return seg.replace(/[-_]+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function CatalogPage() {
  // <-- DEFAULT EXPORT
  const { pathname } = useLocation();
  const meta = getRouteMetaByPath(pathname);
  const title = meta?.title ?? fallbackTitleFromPath(pathname);

  return (
    <>
      <ShopContainer />
    </>
  );
}
