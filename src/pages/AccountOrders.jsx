import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import { toast } from "react-toastify";

import { selectAuth } from "../store/authSlice";
import { fetchMyOrders } from "../services/orderService";

import OrdersHeader from "../components/orders/OrdersHeader";
import OrdersList from "../components/orders/OrdersList";
import OrdersEmptyState from "../components/orders/OrdersEmptyState";
import OrdersPagination from "../components/orders/OrdersPagination";

export default function AccountOrders() {
  const history = useHistory();
  const { isAuthenticated } = useSelector(selectAuth) ?? {};

  const [orders, setOrders] = useState([]);
  const [pageMeta, setPageMeta] = useState({
    page: 0,
    size: 5,
    totalPages: 0,
    totalElements: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Guard: unauthenticated → login
  useEffect(() => {
    if (!isAuthenticated) {
      history.replace("/login?redirect=/account/orders");
    }
  }, [isAuthenticated, history]);

  const loadOrders = useCallback(
    async (pageIndex = 0) => {
      if (!isAuthenticated) return;
      try {
        setLoading(true);
        setError(null);
        const data = await fetchMyOrders({
          page: pageIndex,
          size: pageMeta.size,
        });

        setOrders(data.content);
        setPageMeta({
          page: data.page,
          size: data.size,
          totalPages: data.totalPages,
          totalElements: data.totalElements,
        });
      } catch (e) {
        setError("Failed to load your orders.");
        toast.error("Unable to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, pageMeta.size]
  );

  useEffect(() => {
    if (isAuthenticated) {
      loadOrders(0);
    }
  }, [isAuthenticated, loadOrders]);

  if (!isAuthenticated) return null;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <OrdersHeader
        totalOrders={pageMeta.totalElements}
        loading={loading && !orders.length}
      />

      {loading && !orders.length && (
        <div className="mt-6 rounded-[4px] border border-[#E4E4E4] bg-white p-6 text-sm text-[#737373]">
          Loading your orders…
        </div>
      )}

      {error && !loading && (
        <div className="mt-6 rounded-[4px] border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && orders.length === 0 && <OrdersEmptyState />}

      {!loading && !error && orders.length > 0 && (
        <>
          <OrdersList orders={orders} />

          <OrdersPagination
            page={pageMeta.page}
            totalPages={pageMeta.totalPages}
            onPageChange={(nextPage) => {
              if (nextPage < 0 || nextPage >= pageMeta.totalPages) return;
              loadOrders(nextPage);
            }}
          />
        </>
      )}

      {/* küçük bir geri linki*/}
      <div className="mt-8 text-sm text-[#737373]">
        <Link to="/shop" className="text-[#23A6F0] hover:underline">
          &larr; Back to shop
        </Link>
      </div>
    </main>
  );
}
