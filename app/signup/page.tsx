
"use client";

import Link from "next/link";
import { User, Mail, Lock, ArrowRight } from "lucide-react";
import { type FormEvent, useState } from "react";
import { authClient, signIn } from "@/lib/auth-client";
import { toast } from "react-toastify";
import { redirect } from "next/navigation";

type SignUpErrors = {
  name?: string;
  email?: string;
  password?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export default function SignUpPage() {
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlegoogleSignUp = async () => {
    const resData = await signIn.social({
      provider: "google",
    })
    console.log("Google sign-in response:", resData);
  }

  const validate = (user: {
    name: string;
    email: string;
    password: string;
  }): SignUpErrors => {
    const nextErrors: SignUpErrors = {};

    if (!user.name) {
      nextErrors.name = "Full name is required.";
    } else if (user.name.length < 2) {
      nextErrors.name = "Name must be at least 2 characters.";
    }

    if (!user.email) {
      nextErrors.email = "Email is required.";
    } else if (!emailPattern.test(user.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!user.password) {
      nextErrors.password = "Password is required.";
    } else if (user.password.length < MIN_PASSWORD_LENGTH) {
      nextErrors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }

    return nextErrors;
  };

  const clearError = (field: keyof SignUpErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSignUp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const user = {
      name: String(formData.get("name") ?? "").trim(),
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
      const {data , error} = await authClient.signUp.email({
        ...user,
      })
      if (error) {
        // console.error("Error signing up:", error);
        toast.error(error.message || "An error occurred during sign up.");
      } else {
        // console.log("User signed up successfully:", data);
        toast.success("Account created successfully!");
        redirect ("/")
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
            Create an <span className="text-[#14A06F]">Account</span>
          </h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Join Uddokta-BD and become part of a positive community.
          </p>
        </div>

        <button
          type="button"
          onClick={handlegoogleSignUp}
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-3 font-medium text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <span className="text-xl font-bold text-[#4285F4]">G</span>
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
          <span className="text-xs text-gray-400 dark:text-gray-500">OR SIGN UP WITH EMAIL</span>
          <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
        </div>

        <form className="space-y-4" onSubmit={handleSignUp} noValidate>

          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                required
                autoComplete="name"
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
                onChange={() => clearError("name")}
                className={`w-full rounded-lg border py-3 pl-10 pr-4 text-sm outline-none transition focus:ring-2 ${
                  errors.name
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                    : "border-gray-200 dark:border-gray-700 focus:border-[#14A06F] focus:ring-[#14A06F]/10"
                }`}
              />
            </div>
            {errors.name && (
              <p id="name-error" className="mt-1.5 text-xs text-red-500">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                id="email"
                name="email"
                type="email"
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
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password"
                required
                autoComplete="new-password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={errors.password ? "password-error" : "password-hint"}
                onChange={() => clearError("password")}
                className={`w-full rounded-lg border py-3 pl-10 pr-4 text-sm outline-none transition focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                    : "border-gray-200 dark:border-gray-700 focus:border-[#14A06F] focus:ring-[#14A06F]/10"
                }`}
              />
            </div>
            {errors.password ? (
              <p id="password-error" className="mt-1.5 text-xs text-red-500">
                {errors.password}
              </p>
            ) : (
              <p id="password-hint" className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                Use at least {MIN_PASSWORD_LENGTH} characters.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#14A06F] py-3 font-semibold text-white transition hover:bg-[#10875E] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Creating account..." : "Create Account"}
            <ArrowRight size={18} />
          </button>

        </form>

        <p className="mt-7 text-center text-sm text-gray-500 dark:text-gray-400">
          Already have an account?{" "}
          <Link href="/signin" className="font-semibold text-[#14A06F] hover:underline">
            Sign In
          </Link>
        </p>

      </div>
    </main>
  );
}
