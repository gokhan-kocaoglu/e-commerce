import { useHistory, useLocation } from "react-router-dom";
import ShopContainer from "../components/shop/ShopContainer";
import CollectionsGrid from "../components/shop/CollectionsGrid";
import FilterBar from "../components/shop/FilterBar";
import ProductGrid from "../components/shop/ProductGrid";
import { useProductsQuery } from "../queries/catalogQueries";
import { getCategoryKeyFromPath } from "../data/siteConfig.helpers";
import ClientsStrip from "../components/common/ClientsStrip";

// URL <-> state yardımcıları
function useUrlState() {
  const history = useHistory();
  const location = useLocation();
  const { pathname, search } = location;
  const usp = new URLSearchParams(search);

  const size = Number(usp.get("size") || 4);
  const page = Number(usp.get("page") || 1); // UI 1-based
  const sort = usp.get("sort") || "popularity";
  const view = usp.get("view") || "grid";
  const categoryKey = getCategoryKeyFromPath(pathname);

  const patch = (updates) => {
    const next = new URLSearchParams(search);
    Object.entries(updates).forEach(([k, v]) => {
      if (v == null || v === "") next.delete(k);
      else next.set(k, String(v));
    });
    // sort değişince UX için sayfayı 1'e çek
    if (updates.sort) next.set("page", "1");
    history.replace({ pathname, search: next.toString() });
  };

  return { categoryKey, page, size, sort, view, patch };
}

export default function CatalogPage() {
  const { categoryKey, page, size, sort, view, patch } = useUrlState();

  const { data, isLoading, isError } = useProductsQuery({
    categoryKey,
    page,
    size,
  });

  const totalText = `Showing all ${data?.total ?? 0} results`;

  return (
    <>
      <ShopContainer />
      <CollectionsGrid className="mt-0" size="sm" />

      <FilterBar
        totalText={totalText}
        view={view}
        sort={sort}
        onChangeView={(v) => patch({ view: v })}
        onApplySort={(v) => patch({ sort: v })}
      />

      <ProductGrid
        data={data}
        isLoading={isLoading}
        isError={isError}
        page={page}
        size={size}
        sort={sort}
        view={view}
      />
      <ClientsStrip className="mt-12" size="lg" />
    </>
  );
}
