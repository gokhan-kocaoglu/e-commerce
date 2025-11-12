import { useLocation } from "react-router-dom";
import ShopContainer from "../components/shop/ShopContainer";
import CollectionsGrid from "../components/shop/CollectionsGrid";
import FilterBar from "../components/shop/FilterBar";
import ProductGrid from "../components/shop/ProductGrid";
import { useProductsQuery } from "../queries/catalogQueries";
import { getCategoryKeyFromPath } from "../data/siteConfig.helpers";

function useParamsFromUrl() {
  const { pathname, search } = useLocation();
  const usp = new URLSearchParams(search);
  const size = Number(usp.get("size") || 12);
  const page = Number(usp.get("page") || 1);
  const categoryKey = getCategoryKeyFromPath(pathname);
  return { categoryKey, page, size };
}

export default function CatalogPage() {
  const { categoryKey, page, size } = useParamsFromUrl();
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
        view="grid"
        sort="popularity"
        onChangeView={() => {}}
        onChangeSort={() => {}}
        onOpenFilter={() => {}}
      />

      <ProductGrid
        data={data}
        isLoading={isLoading}
        isError={isError}
        page={page}
        size={size}
      />
    </>
  );
}
