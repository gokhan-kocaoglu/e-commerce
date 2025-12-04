export default function CheckoutStepIndicator({ step }) {
  return (
    <div className="bg-white border-b border-[#E4E4E4]">
      <div className="mx-auto flex max-w-7xl px-4 py-4 text-sm font-semibold">
        <div
          className={`flex-1 border-b-2 pb-2 flex items-center gap-2 ${
            step === 1
              ? "border-[#23A6F0] text-[#23A6F0]"
              : "border-transparent text-[#737373]"
          }`}
        >
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
              step === 1
                ? "bg-[#23A6F0] text-white"
                : "bg-zinc-200 text-zinc-700"
            }`}
          >
            1
          </span>
          <span>Address Details</span>
        </div>
        <div
          className={`flex-1 border-b-2 pb-2 flex items-center gap-2 ${
            step === 2
              ? "border-[#23A6F0] text-[#23A6F0]"
              : "border-transparent text-[#737373]"
          }`}
        >
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs ${
              step === 2
                ? "bg-[#23A6F0] text-white"
                : "bg-zinc-200 text-zinc-700"
            }`}
          >
            2
          </span>
          <span>Payment Details</span>
        </div>
      </div>
    </div>
  );
}
