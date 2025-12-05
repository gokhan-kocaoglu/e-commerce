import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useHistory, Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import { http } from "../lib/http";

const hasLower = (v) => /[a-z]/.test(v);
const hasUpper = (v) => /[A-Z]/.test(v);
const hasSpecial = (v) => /[^A-Za-z0-9]/.test(v);
const hasMinLen = (v) => (v?.length || 0) >= 8;
const hasDigit = (v) => /\d/.test(v);

function Rule({ ok, children }) {
  return (
    <li className={`text-xs ${ok ? "text-green-600" : "text-gray-500/90"}`}>
      {ok ? "✓" : "•"} {children}
    </li>
  );
}

export default function Register() {
  const history = useHistory();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
    setError,
    watch,
    trigger,
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
    mode: "onTouched",
  });

  const pwd = watch("password");
  const showChecklist = (pwd?.length || 0) > 0 || touchedFields.password;

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

  const onSubmit = async (values) => {
    const { firstName, lastName, email, password, passwordConfirm } = values;

    // client-side confirm
    if (password !== passwordConfirm) {
      setError("passwordConfirm", {
        type: "validate",
        message: "Passwords do not match",
      });
      return;
    }

    try {
      await http.post("/api/auth/register", {
        firstName,
        lastName,
        email,
        password,
      });

      toast.success("Your account has been created. Please sign in.");
      history.replace("/login");
    } catch (err) {
      // http interceptor toast ediyor; alan odaklı hata düşmek istersek:
      const apiMsg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Registration failed";
      // örnek: e-posta zaten kayıtlı
      if (/mail/i.test(apiMsg)) {
        setError("email", { type: "server", message: apiMsg });
      } else {
        setError("password", { type: "server", message: apiMsg });
      }
    }
  };

  // password değiştikçe confirm’i yeniden doğrula (eşleşme)
  useEffect(() => {
    if (touchedFields.passwordConfirm) trigger("passwordConfirm");
  }, [pwd, touchedFields.passwordConfirm, trigger]);

  return (
    <div className="flex h-[700px] w-full">
      {/* Left visual panel (same as Login) */}
      <div className="w-full hidden md:inline-block">
        <img
          className="h-full"
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png"
          alt="leftSideImage"
        />
      </div>

      {/* Form panel */}
      <div className="w-full flex flex-col items-center justify-center">
        <form
          className="md:w-96 w-80 flex flex-col items-center justify-center"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <h2 className="text-4xl text-gray-900 font-medium">Sign up</h2>
          <p className="text-sm text-gray-500/90 mt-3">
            Create your account to start shopping
          </p>

          {/* First Name */}
          <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 mt-8">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6Z"
                fill="#6B7280"
              />
            </svg>
            <input
              type="text"
              placeholder="First name"
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
              {...register("firstName", {
                required: "First name is required",
                minLength: { value: 2, message: "Min 2 characters" },
              })}
            />
          </div>
          {errors.firstName && (
            <span className="mt-1 w-full text-xs text-red-500">
              {errors.firstName.message}
            </span>
          )}

          {/* Last Name */}
          <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 mt-4">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6Z"
                fill="#6B7280"
              />
            </svg>
            <input
              type="text"
              placeholder="Last name"
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
              {...register("lastName", {
                required: "Last name is required",
                minLength: { value: 2, message: "Min 2 characters" },
              })}
            />
          </div>
          {errors.lastName && (
            <span className="mt-1 w-full text-xs text-red-500">
              {errors.lastName.message}
            </span>
          )}

          {/* Email */}
          <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 mt-4">
            <svg
              width="16"
              height="11"
              viewBox="0 0 16 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 .55.571 0H15.43l.57.55v9.9l-.571.55H.57L0 10.45zm1.143 1.138V9.9h13.714V1.69l-6.503 4.8h-.697zM13.749 1.1H2.25L8 5.356z"
                fill="#6B7280"
              />
            </svg>
            <input
              type="email"
              placeholder="Email"
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Please enter a valid email",
                },
              })}
            />
          </div>
          {errors.email && (
            <span className="mt-1 w-full text-xs text-red-500">
              {errors.email.message}
            </span>
          )}

          {/* Password */}
          <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 mt-6">
            <svg
              width="13"
              height="17"
              viewBox="0 0 13 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                fill="#6B7280"
              />
            </svg>
            <input
              type="password"
              placeholder="Password"
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
              {...register("password", {
                required: "Password is required",
                validate: {
                  min: (v) => hasMinLen(v) || "Min 8 characters",
                  lower: (v) => hasLower(v) || "Needs a lowercase letter",
                  upper: (v) => hasUpper(v) || "Needs an uppercase letter",
                  special: (v) => hasSpecial(v) || "Needs a special character",
                  number: (v) => hasDigit(v) || "Needs a number",
                },
              })}
            />
          </div>
          {/* canlı checklist */}
          {showChecklist && (
            <ul className="w-full mt-2 space-y-1">
              <Rule ok={pwdState.min}>At least 8 characters</Rule>
              <Rule ok={pwdState.lower}>One lowercase letter</Rule>
              <Rule ok={pwdState.upper}>One uppercase letter</Rule>
              <Rule ok={pwdState.special}>One special character</Rule>
              <Rule ok={pwdState.digit}>One number</Rule>
            </ul>
          )}
          {errors.password && (
            <span className="mt-1 w-full text-xs text-red-500">
              {errors.password.message}
            </span>
          )}

          {/* Password Confirm */}
          <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2 mt-4">
            <svg
              width="13"
              height="17"
              viewBox="0 0 13 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 8.5c0-.938-.729-1.7-1.625-1.7h-.812V4.25C10.563 1.907 8.74 0 6.5 0S2.438 1.907 2.438 4.25V6.8h-.813C.729 6.8 0 7.562 0 8.5v6.8c0 .938.729 1.7 1.625 1.7h9.75c.896 0 1.625-.762 1.625-1.7zM4.063 4.25c0-1.406 1.093-2.55 2.437-2.55s2.438 1.144 2.438 2.55V6.8H4.061z"
                fill="#6B7280"
              />
            </svg>
            <input
              type="password"
              placeholder="Confirm password"
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
              {...register("passwordConfirm", {
                required: "Please confirm your password",
                validate: (v) =>
                  v === watch("password") || "Passwords do not match",
              })}
            />
          </div>
          {errors.passwordConfirm && (
            <span className="mt-1 w-full text-xs text-red-500">
              {errors.passwordConfirm.message}
            </span>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 w-full h-11 rounded-full text-white bg-blue-800 hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>

          <p className="text-gray-500/90 text-sm mt-4">
            Already have an account?{" "}
            <RouterLink className="text-blue-800 hover:underline" to="/login">
              Sign in
            </RouterLink>
          </p>
        </form>
      </div>
    </div>
  );
}
