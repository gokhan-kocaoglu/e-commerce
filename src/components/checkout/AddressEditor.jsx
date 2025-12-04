import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { toast } from "react-toastify";
import { http } from "../../lib/http";
import FieldError from "./FieldError";
import { requiredMsg } from "../../pages/CheckoutPaymentPage";

export default function AddressEditor({ initial, onClose, onSaved }) {
  const isEdit = !!initial;
  const methods = useForm({
    mode: "onTouched",
    defaultValues: {
      fullName: initial?.fullName || "",
      line1: initial?.line1 || "",
      line2: initial?.line2 || "",
      city: initial?.city || "",
      state: initial?.state || "",
      postalCode: initial?.postalCode || "",
      countryCode: initial?.countryCode || "",
      defaultShipping: initial?.defaultShipping || false,
      defaultBilling: initial?.defaultBilling || false,
    },
  });

  const submit = methods.handleSubmit(async (vals) => {
    try {
      if (isEdit) {
        await http.put(`/api/account/addresses/${initial.id}`, vals);
        toast.success("Address updated");
        await onSaved?.(initial.id);
      } else {
        const res = await http.post(`/api/account/addresses`, vals);
        const newId = res?.data?.data?.id;
        toast.success("Address added");
        await onSaved?.(newId);
      }
    } catch {
      // interceptor will show error
    }
  });

  return (
    <div className="fixed inset-0 z-40 bg-black/30 flex items-end md:items-center md:justify-center">
      <div className="w-full md:max-w-2xl md:rounded-2xl bg-white border border-zinc-200 p-6">
        <div className="flex items-center justify-between">
          <h4 className="font-['Montserrat'] font-bold text-[18px] leading-[28px] tracking-[0.1px] text-[#252B42]">
            {isEdit ? "Edit Address" : "Add Address"}
          </h4>
          <button
            onClick={onClose}
            className="text-sm text-zinc-600 hover:text-zinc-900"
          >
            Close
          </button>
        </div>

        <FormProvider {...methods}>
          <form
            className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={submit}
            noValidate
          >
            <AF name="fullName" label="Full name" />
            <AF name="line1" label="Address line 1" />
            <AF name="line2" label="Address line 2" required={false} />
            <AF name="city" label="City" />
            <AF name="state" label="State" />
            <AF name="postalCode" label="Postal code" />
            <AF name="countryCode" label="Country code" />

            <div className="md:col-span-2 grid grid-cols-2 gap-4 pt-2">
              <Chk name="defaultShipping" label="Default shipping" />
              <Chk name="defaultBilling" label="Default billing" />
            </div>

            <div className="md:col-span-2 flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="inline-flex items-center justify-center rounded-full border border-zinc-200 px-5 h-11 text-sm font-semibold hover:bg-zinc-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-full bg-[#23A6F0] px-6 h-11 text-white font-semibold tracking-wide hover:opacity-90 transition"
              >
                {isEdit ? "Save changes" : "Add address"}
              </button>
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}

function AF({ name, label, required = true }) {
  const { register, formState } = useFormContext();
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700">{label}</label>
      <input
        className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
        type="text"
        {...register(name, required ? { required: requiredMsg(label) } : {})}
      />
      <FieldError error={formState.errors?.[name]?.message} />
    </div>
  );
}

function Chk({ name, label }) {
  const { register } = useFormContext();
  return (
    <label className="inline-flex items-center gap-2 text-sm text-zinc-800">
      <input type="checkbox" className="h-4 w-4" {...register(name)} />
      {label}
    </label>
  );
}
