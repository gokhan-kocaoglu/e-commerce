import { createContext, useContext, useEffect, useState } from "react";
import { fetchProductPageBundle } from "../../services/productService";

const ProductPageContext = createContext(null);

export function ProductPageProvider({ productId, children }) {
  const [state, setState] = useState({
    status: "idle", // idle | loading | succeeded | failed
    product: null,
    detail: null,
    variants: [],
  });

  useEffect(() => {
    if (!productId) {
      setState((s) => ({ ...s, status: "failed" }));
      return;
    }

    let cancelled = false;

    (async () => {
      setState((s) => ({ ...s, status: "loading" }));
      try {
        const data = await fetchProductPageBundle(productId);
        if (cancelled) return;

        setState({
          status: "succeeded",
          product: data.product,
          detail: data.detail,
          variants: data.variants,
        });
      } catch {
        if (cancelled) return;
        setState((s) => ({ ...s, status: "failed" }));
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [productId]);

  const value = {
    productId,
    ...state,
  };

  return (
    <ProductPageContext.Provider value={value}>
      {children}
    </ProductPageContext.Provider>
  );
}

export function useProductPage() {
  const ctx = useContext(ProductPageContext);
  if (!ctx) {
    throw new Error(
      "useProductPage sadece <ProductPageProvider> içinde kullanılabilir."
    );
  }
  return ctx;
}
