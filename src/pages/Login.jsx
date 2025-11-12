// src/pages/Login.jsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { loginThunk, selectAuth } from "../store/authSlice";
import { useHistory } from "react-router-dom";

export default function Example() {
  const dispatch = useDispatch();
  const history = useHistory();
  const { status, isAuthenticated } = useSelector(selectAuth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    defaultValues: { email: "", password: "", remember: true },
    mode: "onTouched",
  });

  useEffect(() => {
    if (isAuthenticated) {
      // Login olduysa yönlendir (örn. /account veya /)
      history.replace("/");
    }
  }, [isAuthenticated, history]);

  const onSubmit = async (values) => {
    const { email, password, remember } = values;
    try {
      await dispatch(loginThunk({ email, password, remember })).unwrap();
      // unwrap success → history.replace("/") zaten effect’te
    } catch {
      setError("password", {
        type: "server",
        message: "E-mail veya şifre hatalı.",
      });
    }
  };

  return (
    <div className="flex h-[700px] w-full">
      <div className="w-full hidden md:inline-block">
        <img
          className="h-full"
          src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/leftSideImage.png"
          alt="leftSideImage"
        />
      </div>

      <div className="w-full flex flex-col items-center justify-center">
        <form
          className="md:w-96 w-80 flex flex-col items-center justify-center"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <h2 className="text-4xl text-gray-900 font-medium">Sign in</h2>
          <p className="text-sm text-gray-500/90 mt-3">
            Welcome back! Please sign in to continue
          </p>

          <button
            type="button"
            className="w-full mt-8 bg-gray-500/10 flex items-center justify-center h-12 rounded-full"
          >
            <img
              src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/login/googleLogo.svg"
              alt="googleLogo"
            />
          </button>

          <div className="flex items-center gap-4 w-full my-5">
            <div className="w-full h-px bg-gray-300/90"></div>
            <p className="w-full text-nowrap text-sm text-gray-500/90">
              or sign in with email
            </p>
            <div className="w-full h-px bg-gray-300/90"></div>
          </div>

          {/* Email */}
          <div className="flex items-center w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
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
              placeholder="Email id"
              className="bg-transparent text-gray-500/80 placeholder-gray-500/80 outline-none text-sm w-full h-full"
              required
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
          <div className="flex items-center mt-6 w-full bg-transparent border border-gray-300/60 h-12 rounded-full overflow-hidden pl-6 gap-2">
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
              required
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 characters" },
              })}
            />
          </div>
          {errors.password && (
            <span className="mt-1 w-full text-xs text-red-500">
              {errors.password.message}
            </span>
          )}

          {/* Remember + Forgot */}
          <div className="w-full flex items-center justify-between mt-8 text-gray-500/80">
            <div className="flex items-center gap-2">
              <input
                className="h-5"
                type="checkbox"
                id="checkbox"
                {...register("remember")}
              />
              <label className="text-sm" htmlFor="checkbox">
                Remember me
              </label>
            </div>
            <a className="text-sm underline" href="#">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || status === "loading"}
            className="mt-8 w-full h-11 rounded-full text-white bg-blue-800 hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {isSubmitting || status === "loading" ? "Signing in..." : "Login"}
          </button>

          <p className="text-gray-500/90 text-sm mt-4">
            Don’t have an account?{" "}
            <a className="text-blue-800 hover:underline" href="/register">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
