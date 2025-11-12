import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { toast } from "react-toastify";
import { http } from "../lib/http";
import { useHistory } from "react-router-dom";
import { Edit3, Trash2, PackageCheck, ShieldCheck, Plus } from "lucide-react";
import { useDispatch } from "react-redux";
import { logoutThunk } from "../store/authSlice";

/* -------------------------------------------------------
   Helpers
------------------------------------------------------- */
const requiredMsg = (f) => `${f} is required`;

const useAborter = () => {
  const ref = useRef(null);
  useEffect(() => () => ref.current?.abort?.(), []);
  return () => {
    ref.current?.abort?.();
    ref.current = new AbortController();
    return ref.current.signal;
  };
};

/* -------------------------------------------------------
   Profile Settings Page
------------------------------------------------------- */
export default function AccountProfile() {
  const history = useHistory();
  const makeSignal = useAborter();

  const dispatch = useDispatch();

  // Email/Password başarıdan sonra tek noktadan çıkış + yönlendirme
  const handleSensitiveUpdateSuccess = async (
    msg = "Please sign in again."
  ) => {
    toast.success(msg); // kullanıcıya bilgi
    await dispatch(logoutThunk()).unwrap(); // BE /logout + storage temizliği + state reset
    history.replace("/login"); // login sayfasına
  };

  // ---- PROFILE FORM ----
  const profileForm = useForm({
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      avatarUrl: "",
      email: "", // read-only göstereceğiz
    },
  });

  // ---- EMAIL & PASSWORD FORMS ----
  const emailForm = useForm({
    mode: "onTouched",
    defaultValues: { newEmail: "", currentPassword: "" },
  });

  const passwordForm = useForm({
    mode: "onTouched",
    defaultValues: { currentPassword: "", newPassword: "", confirm: "" },
  });

  // ---- ADDRESSES ----
  const [addresses, setAddresses] = useState([]);
  const [addrEditing, setAddrEditing] = useState(null); // null | "new" | address obj
  const [loading, setLoading] = useState(true);

  /* ---------------------------------------------
     Bootstrap: me + addresses
  --------------------------------------------- */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const signal = makeSignal();

        // 1) Me
        const meRes = await http.get("/api/account/me", { signal });
        const me = meRes?.data?.data;
        if (!me) throw new Error("Unable to load profile");
        profileForm.reset({
          firstName: me.firstName ?? "",
          lastName: me.lastName ?? "",
          phone: me.phone ?? "",
          avatarUrl: me.avatarUrl ?? "",
          email: me.email ?? "",
        });

        // 2) Addresses
        const addrRes = await http.get("/api/account/addresses", { signal });
        setAddresses(
          Array.isArray(addrRes?.data?.data) ? addrRes.data.data : []
        );
      } catch (e) {
        // interceptor zaten toast basıyor
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------------------------------------
     Submit handlers
  --------------------------------------------- */
  const onSubmitProfile = profileForm.handleSubmit(async (vals) => {
    try {
      const payload = {
        firstName: vals.firstName?.trim(),
        lastName: vals.lastName?.trim(),
        phone: vals.phone?.trim() || null,
        avatarUrl: vals.avatarUrl?.trim() || null,
      };
      await http.put("/api/account/profile", payload);
      toast.success("Profile updated");
    } catch {}
  });

  const onSubmitEmail = emailForm.handleSubmit(async (vals) => {
    try {
      await http.put("/api/account/email", {
        newEmail: vals.newEmail?.trim(),
        currentPassword: vals.currentPassword,
      });

      // Not: bazı sistemlerde email değişikliği link onayı gerektirir.
      // güvenlik gereği tekrar login isteyelim:
      await handleSensitiveUpdateSuccess(
        "Email updated. Please sign in again."
      );
    } catch (e) {
      // interceptor zaten toast ediyor olabilir; isterseniz alan hatası da düşebilirsiniz
      emailForm.setError("newEmail", { type: "server", message: e.msg });
    }
  });

  // Password rules (senin login/register ile aynı mantık)
  const hasMinLen = (v) => (v || "").length >= 8;
  const hasLower = (v) => /[a-z]/.test(v || "");
  const hasUpper = (v) => /[A-Z]/.test(v || "");
  const hasSpecial = (v) => /[^A-Za-z0-9]/.test(v || "");
  const hasDigit = (v) => /\d/.test(v || "");
  const pwd = passwordForm.watch("newPassword") || "";
  const pwdState = useMemo(
    () => ({
      min: hasMinLen(pwd),
      lower: hasLower(pwd),
      upper: hasUpper(pwd),
      special: hasSpecial(pwd),
      digit: hasDigit(pwd),
    }),
    [pwd]
  );

  const onSubmitPassword = passwordForm.handleSubmit(async (vals) => {
    try {
      await http.put("/api/account/password", {
        currentPassword: vals.currentPassword,
        newPassword: vals.newPassword,
      });

      await handleSensitiveUpdateSuccess(
        "Password changed. Please sign in again."
      );
    } catch (e) {
      // passForm.setError("currentPassword", { type: "server", message: "..." });
    }
  });

  /* ---------------------------------------------
     Address list actions
  --------------------------------------------- */
  const reloadAddresses = async () => {
    try {
      const res = await http.get("/api/account/addresses");
      setAddresses(Array.isArray(res?.data?.data) ? res.data.data : []);
    } catch {}
  };

  const handleDeleteAddress = async (id) => {
    if (!id) return;
    try {
      await http.delete(`/api/account/addresses/${id}`);
      toast.success("Address deleted");
      setAddresses((prev) => prev.filter((a) => a.id !== id));
    } catch {}
  };

  const handleMakeDefault = async (id, type) => {
    try {
      await http.post(`/api/account/addresses/${id}/make-default`, null, {
        params: { type }, // shipping | billing
      });
      toast.success(`Default ${type} address set`);
      await reloadAddresses();
    } catch {}
  };

  /* ---------------------------------------------
     UI
  --------------------------------------------- */
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8">
      <h1 className="h3 text-zinc-900">Profile Settings</h1>

      {loading ? (
        <div className="mt-6 text-sm text-zinc-500">Loading...</div>
      ) : (
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ================= LEFT: Profile ================= */}
          <section className="lg:col-span-1 border border-zinc-100 rounded-2xl p-6">
            <h2 className="font-['Montserrat'] font-bold text-[18px] leading-[28px] tracking-[0.1px] text-zinc-900">
              Personal Info
            </h2>

            <form
              className="mt-5 space-y-4"
              onSubmit={onSubmitProfile}
              noValidate
            >
              {/* Email (readonly) */}
              <div>
                <label className="block text-sm font-medium text-zinc-700">
                  Email
                </label>
                <input
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-800 bg-zinc-50"
                  type="email"
                  readOnly
                  {...profileForm.register("email")}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField
                  name="firstName"
                  label="First name"
                  form={profileForm}
                />
                <TextField
                  name="lastName"
                  label="Last name"
                  form={profileForm}
                />
              </div>

              <TextField name="phone" label="Phone" form={profileForm} />
              <TextField
                name="avatarUrl"
                label="Avatar URL"
                form={profileForm}
              />

              <div className="pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full bg-[#23A6F0] px-6 h-11 text-white font-semibold tracking-wide hover:opacity-90 transition"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </section>

          {/* ================= RIGHT: Email + Password + Addresses ================= */}
          <div className="lg:col-span-2 space-y-8">
            {/* Change Email */}
            <section className="border border-zinc-100 rounded-2xl p-6">
              <h3 className="font-['Montserrat'] font-bold text-[18px] leading-[28px] tracking-[0.1px] text-zinc-900">
                Change Email
              </h3>
              <form
                className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4"
                onSubmit={emailForm.handleSubmit(onSubmitEmail)}
                noValidate
              >
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-zinc-700">
                    New email
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
                    type="email"
                    {...emailForm.register("newEmail", {
                      required: requiredMsg("New email"),
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Please enter a valid email",
                      },
                    })}
                  />
                  <FieldError
                    error={emailForm.formState.errors.newEmail?.message}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-700">
                    Current password
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
                    type="password"
                    {...emailForm.register("currentPassword", {
                      required: requiredMsg("Current password"),
                    })}
                  />
                  <FieldError
                    error={emailForm.formState.errors.currentPassword?.message}
                  />
                </div>
                <div className="md:col-span-3">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-[#23A6F0] px-6 h-11 text-white font-semibold tracking-wide hover:opacity-90 transition"
                  >
                    Update Email
                  </button>
                </div>
              </form>
            </section>

            {/* Change Password */}
            <section className="border border-zinc-100 rounded-2xl p-6">
              <h3 className="font-['Montserrat'] font-bold text-[18px] leading-[28px] tracking-[0.1px] text-zinc-900">
                Change Password
              </h3>
              <form
                className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-4"
                onSubmit={onSubmitPassword}
                noValidate
              >
                <div>
                  <label className="block text-sm font-medium text-zinc-700">
                    Current password
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
                    type="password"
                    {...passwordForm.register("currentPassword", {
                      required: requiredMsg("Current password"),
                    })}
                  />
                  <FieldError
                    error={
                      passwordForm.formState.errors.currentPassword?.message
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700">
                    New password
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
                    type="password"
                    {...passwordForm.register("newPassword", {
                      required: requiredMsg("New password"),
                      validate: {
                        min: (v) => hasMinLen(v) || "Min 8 characters",
                        lower: (v) => hasLower(v) || "Needs a lowercase letter",
                        upper: (v) =>
                          hasUpper(v) || "Needs an uppercase letter",
                        special: (v) =>
                          hasSpecial(v) || "Needs a special character",
                        digit: (v) => hasDigit(v) || "Needs a number",
                      },
                    })}
                  />
                  <PasswordChecklist state={pwdState} />
                  <FieldError
                    error={passwordForm.formState.errors.newPassword?.message}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-700">
                    Confirm new password
                  </label>
                  <input
                    className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
                    type="password"
                    {...passwordForm.register("confirm", {
                      required: requiredMsg("Confirm password"),
                    })}
                  />
                  <FieldError
                    error={passwordForm.formState.errors.confirm?.message}
                  />
                </div>

                <div className="md:col-span-3">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-[#23A6F0] px-6 h-11 text-white font-semibold tracking-wide hover:opacity-90 transition"
                  >
                    Update Password
                  </button>
                </div>
              </form>
            </section>

            {/* Addresses */}
            <section className="border border-zinc-100 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-['Montserrat'] font-bold text-[18px] leading-[28px] tracking-[0.1px] text-zinc-900">
                  Addresses
                </h3>
                <button
                  type="button"
                  onClick={() => setAddrEditing("new")}
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 h-10 text-sm font-semibold hover:bg-zinc-50"
                >
                  <Plus className="h-4 w-4" /> Add address
                </button>
              </div>

              {addresses.length === 0 ? (
                <p className="mt-4 text-sm text-zinc-600">
                  No address yet. Add your first one.
                </p>
              ) : (
                <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((a) => (
                    <li
                      key={a.id}
                      className="rounded-xl border border-zinc-200 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-semibold text-zinc-900">
                            {a.fullName}
                          </div>
                          <div className="text-sm text-zinc-600">
                            {a.line1}
                            {a.line2 ? `, ${a.line2}` : ""}
                          </div>
                          <div className="text-sm text-zinc-600">
                            {a.city}, {a.state} {a.postalCode}
                          </div>
                          <div className="text-sm text-zinc-600">
                            {a.countryCode}
                          </div>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {a.defaultShipping && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 h-7 text-xs font-semibold text-emerald-700">
                                <PackageCheck className="h-3.5 w-3.5" /> Default
                                Shipping
                              </span>
                            )}
                            {a.defaultBilling && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 h-7 text-xs font-semibold text-indigo-700">
                                <ShieldCheck className="h-3.5 w-3.5" /> Default
                                Billing
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setAddrEditing(a)}
                              className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-3 h-9 text-xs font-semibold hover:bg-zinc-50"
                            >
                              <Edit3 className="h-4 w-4" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(a.id)}
                              className="inline-flex items-center gap-1 rounded-full border border-red-200 px-3 h-9 text-xs font-semibold text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" /> Delete
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            {!a.defaultShipping && (
                              <button
                                onClick={() =>
                                  handleMakeDefault(a.id, "shipping")
                                }
                                className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-3 h-9 text-[9px] font-semibold hover:bg-zinc-50"
                              >
                                Set default shipping
                              </button>
                            )}
                            {!a.defaultBilling && (
                              <button
                                onClick={() =>
                                  handleMakeDefault(a.id, "billing")
                                }
                                className="inline-flex items-center gap-1 rounded-full border border-zinc-200 px-3 h-9 text-[9px] font-semibold hover:bg-zinc-50"
                              >
                                Set default billing
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* Address Drawer / Modal (basit overlay) */}
              {addrEditing && (
                <AddressEditor
                  initial={addrEditing === "new" ? null : addrEditing}
                  onClose={() => setAddrEditing(null)}
                  onSaved={async () => {
                    setAddrEditing(null);
                    await reloadAddresses();
                  }}
                />
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------
   Reusable inputs
------------------------------------------------------- */
function TextField({ name, label, form, type = "text" }) {
  const {
    register,
    formState: { errors },
  } = form;
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700">{label}</label>
      <input
        className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2"
        type={type}
        {...register(name, { required: requiredMsg(label) })}
      />
      <FieldError error={errors?.[name]?.message} />
    </div>
  );
}

function FieldError({ error }) {
  if (!error) return null;
  return <div className="mt-1 text-xs text-red-500">{error}</div>;
}

function PasswordChecklist({ state }) {
  const Rule = ({ ok, children }) => (
    <li className={`text-xs mt-1 ${ok ? "text-emerald-600" : "text-zinc-500"}`}>
      • {children}
    </li>
  );
  return (
    <ul className="w-full mt-2">
      <Rule ok={state.min}>At least 8 characters</Rule>
      <Rule ok={state.lower}>One lowercase letter</Rule>
      <Rule ok={state.upper}>One uppercase letter</Rule>
      <Rule ok={state.special}>One special character</Rule>
      <Rule ok={state.digit}>One number</Rule>
    </ul>
  );
}

/* -------------------------------------------------------
   Address Editor (create/update)
------------------------------------------------------- */
function AddressEditor({ initial, onClose, onSaved }) {
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
      } else {
        await http.post(`/api/account/addresses`, vals);
        toast.success("Address added");
      }
      await onSaved?.();
    } catch {}
  });

  return (
    <div className="fixed inset-0 z-40 bg-black/30 flex items-end md:items-center md:justify-center">
      <div className="w-full md:max-w-2xl md:rounded-2xl bg-white border border-zinc-200 p-6">
        <div className="flex items-center justify-between">
          <h4 className="font-['Montserrat'] font-bold text-[18px] leading-[28px] tracking-[0.1px] text-zinc-900">
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
