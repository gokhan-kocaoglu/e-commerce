import { Link } from "react-router-dom";

export default function OrdersEmptyState() {
  return (
    <section className="mt-6 flex flex-col items-center justify-center rounded-[4px] border border-dashed border-[#E4E4E4] bg-white px-6 py-10 text-center">
      <h2 className="font-['Montserrat'] text-[18px] font-bold leading-[24px] tracking-[0.2px] text-[#252B42]">
        You don&apos;t have any orders yet
      </h2>
      <p className="mt-2 max-w-md text-sm text-[#737373]">
        When you place an order, it will appear here and you&apos;ll be able to
        track its status from this page.
      </p>

      <Link
        to="/shop"
        className="mt-6 inline-flex items-center justify-center rounded-[4px] bg-[#23A6F0] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1d8dd0] transition"
      >
        Start shopping
      </Link>
    </section>
  );
}
