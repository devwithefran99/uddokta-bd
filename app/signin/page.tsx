"use client";
import Link from "next/link";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { type FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { authClient, signIn } from "@/lib/auth-client";
import { redirect } from "next/navigation";

type SignInErrors = {
  email?: string;
  password?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignInPage() {
  const [errors, setErrors] = useState<SignInErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleGoogleSignIn = async () => {
    const resData = await signIn.social({
      provider: "google",
    })
    console.log("Google sign-in response:", resData);
  }

  const validate = (user: { email: string; password: string }): SignInErrors => {
    const nextErrors: SignInErrors = {};

    if (!user.email) {
      nextErrors.email = "Email is required.";
    } else if (!emailPattern.test(user.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!user.password) {
      nextErrors.password = "Password is required.";
    }

    return nextErrors;
  };

  const clearError = (field: keyof SignInErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const user = {
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
    };

    const nextErrors = validate(user);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await authClient.signIn.email({
        ...user,
      });

      if (data) {
        // console.log("User signed in successfully:", data);
        toast.success("Signed in successfully!");
        redirect ("/")
      }
      if (error) {
        // console.error("Error signing in:", error);
        toast.error(error.message || "An error occurred during sign in.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm sm:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome <span className="text-[#14A06F]">Back!</span>
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Sign in to continue to your Uddokta-BD account.
          </p>
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3 font-medium text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <span className="text-xl font-bold text-[#4285F4]">G</span>
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          <span className="text-xs text-gray-400 dark:text-gray-500">OR SIGN IN WITH EMAIL</span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* Sign In Form */}
        <form className="space-y-5" onSubmit={handleSignIn} noValidate>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
              />
              <input
                id="email"
                type="email"
                  name="email"
                placeholder="Enter your email"
                required
                autoComplete="email"
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                onChange={() => clearError("email")}
                className={`w-full rounded-lg border py-3 pl-10 pr-4 text-sm outline-none transition focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                    : "border-gray-200 dark:border-gray-700 focus:border-[#14A06F] focus:ring-[#14A06F]/10"
                }`}
              />
            </div>
            {errors.email && (
              <p id="email-error" className="mt-1.5 text-xs text-red-500">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
              />
              <input
                id="password"
                type="password"
                  name="password"
                placeholder="Enter your password"
                required
                autoComplete="current-password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : undefined}
                onChange={() => clearError("password")}
                className={`w-full rounded-lg border py-3 pl-10 pr-4 text-sm outline-none transition focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                    : "border-gray-200 dark:border-gray-700 focus:border-[#14A06F] focus:ring-[#14A06F]/10"
                }`}
              />
            </div>
            {errors.password && (
              <p id="password-error" className="mt-1.5 text-xs text-red-500">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#14A06F] py-3 font-semibold text-white transition hover:bg-[#10875E] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
            <ArrowRight size={18} />
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-gray-500 dark:text-gray-400">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#14A06F] hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}
