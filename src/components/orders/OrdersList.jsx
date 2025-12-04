import OrderCard from "./OrderCard";

export default function OrdersList({ orders }) {
  return (
    <section className="mt-6 flex flex-col gap-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </section>
  );
}
