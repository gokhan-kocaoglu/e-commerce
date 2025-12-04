import FieldError from "./FieldError";
import { requiredMsg } from "../../pages/CheckoutPaymentPage";

export default function Step2Payment({
  form,
  submitting,
  summary, // şu an sadece buton visibility için gerekebilir
  onBack,
  onSubmit,
}) {
  const {
    register,
    formState: { errors },
    setValue,
  } = form;

  const handleCardNumberChange = (e) => {
    const raw = e.target.value || "";
    const digits = raw.replace(/\D/g, "").slice(0, 16);
    const spaced = digits.replace(/(\d{4})(?=\d)/g, "$1 ");
    setValue("cardNumber", spaced);
  };

  const handleExpiryChange = (e) => {
    const raw = e.target.value || "";
    const digits = raw.replace(/\D/g, "").slice(0, 4);
    let formatted = digits;
    if (digits.length >= 3) {
      formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    }
    setValue("expiry", formatted);
  };

  return (
    <div className="rounded-[4px] border border-[#E4E4E4] bg-white p-6">
      <h2 className="text-xl font-semibold text-[#252B42] mb-6">
        Payment details
      </h2>

      <form onSubmit={onSubmit} className="grid gap-8" noValidate>
        <div>
          {/* payment methods */}
          <div className="grid gap-4 lg:grid-cols-2">
            <label className="bg-gray-100 p-4 rounded-md border border-gray-300 cursor-pointer">
              <div className="flex items-center">
                <input
                  type="radio"
                  value="card"
                  {...register("method")}
                  className="w-5 h-5 cursor-pointer"
                  defaultChecked
                />
                <span className="ml-4 flex gap-2">
                  <img
                    src="https://readymadeui.com/images/visa.webp"
                    className="w-12"
                    alt="visa"
                  />
                  <img
                    src="https://readymadeui.com/images/american-express.webp"
                    className="w-12"
                    alt="amex"
                  />
                  <img
                    src="https://readymadeui.com/images/master.webp"
                    className="w-12"
                    alt="mastercard"
                  />
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-500 font-medium">
                Pay with your debit or credit card
              </p>
            </label>

            <label className="bg-gray-100 p-4 rounded-md border border-gray-300 cursor-not-allowed opacity-60">
              <div className="flex items-center">
                <input
                  type="radio"
                  value="paypal"
                  disabled
                  className="w-5 h-5"
                />
                <span className="ml-4 flex gap-2">
                  <img
                    src="https://readymadeui.com/images/paypal.webp"
                    className="w-20"
                    alt="paypal"
                  />
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-500 font-medium">
                PayPal integration is not enabled
              </p>
            </label>
          </div>

          {/* card fields */}
          <div className="grid md:grid-cols-2 gap-y-6 gap-x-4 mt-8">
            <div className="max-lg:col-span-full">
              <label className="text-sm text-[#252B42] font-medium block mb-2">
                Cardholder&apos;s Name
              </label>
              <input
                type="text"
                placeholder="Enter Cardholder's Name"
                className="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-[#23A6F0]"
                {...register("cardHolder", {
                  required: requiredMsg("Cardholder's Name"),
                  minLength: { value: 3, message: "Min 3 characters" },
                })}
              />
              <FieldError error={errors.cardHolder?.message} />
            </div>

            <div className="max-lg:col-span-full">
              <label className="text-sm text-[#252B42] font-medium block mb-2">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                autoComplete="cc-number"
                inputMode="numeric"
                maxLength={19}
                className="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-[#23A6F0]"
                {...register("cardNumber", {
                  required: requiredMsg("Card Number"),
                  validate: {
                    digits: (v) =>
                      /^\d{16}$/.test((v || "").replace(/\D/g, "")) ||
                      "Enter 16 digit card number",
                  },
                })}
                onChange={handleCardNumberChange}
              />
              <FieldError error={errors.cardNumber?.message} />
            </div>

            <div>
              <label className="text-sm text-[#252B42] font-medium block mb-2">
                Expiry (MM/YY)
              </label>
              <input
                type="text"
                placeholder="MM/YY"
                autoComplete="cc-exp"
                inputMode="numeric"
                maxLength={5}
                className="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-[#23A6F0]"
                {...register("expiry", {
                  required: requiredMsg("Expiry"),
                  validate: {
                    pattern: (v) =>
                      /^(0[1-9]|1[0-2])\/\d{2}$/.test(v || "") ||
                      "Use MM/YY format",
                    notPast: (v) => {
                      if (!v) return true;
                      const [mm, yy] = v.split("/");
                      const month = parseInt(mm, 10);
                      const year = 2000 + parseInt(yy, 10);
                      const now = new Date();
                      const thisMonth = now.getMonth() + 1;
                      const thisYear = now.getFullYear();
                      if (year < thisYear) return "Card expired";
                      if (year === thisYear && month < thisMonth)
                        return "Card expired";
                      return true;
                    },
                  },
                })}
                onChange={handleExpiryChange}
              />
              <FieldError error={errors.expiry?.message} />
            </div>

            <div>
              <label className="text-sm text-[#252B42] font-medium block mb-2">
                CVV
              </label>
              <input
                type="password"
                placeholder="CVV"
                autoComplete="cc-csc"
                inputMode="numeric"
                maxLength={4}
                className="px-4 py-2.5 bg-white border border-gray-400 text-slate-900 w-full text-sm rounded-md focus:outline-[#23A6F0]"
                {...register("cvv", {
                  required: requiredMsg("CVV"),
                  validate: {
                    len: (v) =>
                      /^\d{3,4}$/.test(v || "") || "CVV must be 3 or 4 digits",
                  },
                })}
              />
              <FieldError error={errors.cvv?.message} />
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={onBack}
              className="rounded-[4px] border border-[#E4E4E4] px-6 py-2.5 text-sm font-semibold text-[#737373] hover:bg-zinc-50"
            >
              Back to steps
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="cursor-pointer rounded-md px-4 py-2.5 min-w-[180px] text-sm font-medium tracking-wide bg-[#23A6F0] hover:bg-[#1d8dd0] text-white disabled:bg-[#9CCEF5] disabled:cursor-not-allowed"
            >
              {submitting ? "Processing..." : "Pay now"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
