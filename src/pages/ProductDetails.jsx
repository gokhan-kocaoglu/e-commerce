import ShopContainer from "../components/shop/ShopContainer";
import ProductOverview from "../components/product/ProductOverview";
import { ProductPageProvider } from "../components/product/ProductPageContext";
import ProductDescriptionTabs from "../components/product/ProductDescriptionTabs";
import ProductCategoryBestSellers from "../components/product/ProductCategoryBestSellers";
import ClientsStrip from "../components/common/ClientsStrip";
import { useParams, useLocation } from "react-router-dom";

export default function ProductDetails() {
  const { categorySlug, productSlug } = useParams();
  const location = useLocation();

  const search = new URLSearchParams(location.search);
  const productId = search.get("id");

  const categoryLabel = categorySlug
    ? categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)
    : "Category";

  const productLabel = productSlug
    ? decodeURIComponent(productSlug).replace(/-/g, " ")
    : "Product";

  const trail = [
    { label: "Shop", path: "/shop" },
    { label: categoryLabel, path: `/shop/${categorySlug}` },
    {
      label: productLabel,
      path: `/product/${categorySlug}/${productSlug}`,
    },
  ];

  return (
    <main className="bg-white">
      <ShopContainer heading={categoryLabel} customTrail={trail} />

      <ProductPageProvider productId={productId}>
        <ProductOverview />
        <ProductDescriptionTabs />
        <ProductCategoryBestSellers limit={8} />
      </ProductPageProvider>
      <ClientsStrip className="mt-12" size="lg" />
    </main>
  );
}
