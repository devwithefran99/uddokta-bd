"use client";
import Link from "next/link";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { FormEvent } from "react";
import { toast } from "react-toastify";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";

export default function SignInPage() {

  const handleSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const user = Object.fromEntries(formData.entries()) as {
      email: string; 
      password: string;
    };
    // console.log("User data:", user);
    const { data, error } = await authClient.signIn.email({
      ...user,
    });

    if(data) {
      // console.log("User signed in successfully:", data);
      toast.success("Signed in successfully!");
      redirect ("/")
    }
    if (error) {
      // console.error("Error signing in:", error);
      toast.error(error.message || "An error occurred during sign in.");
    }
  };


  return (
    <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome <span className="text-[#14A06F]">Back!</span>
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to continue to your Uddokta-BD account.
          </p>
        </div>

        {/* Google Sign In */}
        <button
          type="button"
          className="flex w-full items-center justify-center gap-3 rounded-lg border border-gray-200 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50"
        >
          <span className="text-xl font-bold text-[#4285F4]">G</span>
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-4">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">OR SIGN IN WITH EMAIL</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {/* Sign In Form */}
        <form className="space-y-5" onSubmit={handleSignIn}>
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                id="email"
                type="email"
                  name="email"
                placeholder="Enter your email"
                className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#14A06F] focus:ring-2 focus:ring-[#14A06F]/10"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <Lock
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                id="password"
                type="password"
                  name="password"
                placeholder="Enter your password"
                className="w-full rounded-lg border border-gray-200 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#14A06F] focus:ring-2 focus:ring-[#14A06F]/10"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#14A06F] py-3 font-semibold text-white transition hover:bg-[#10875E]"
          >
            Sign In
            <ArrowRight size={18} />
          </button>
        </form>

        <p className="mt-7 text-center text-sm text-gray-500">
          Don't have an account?{" "}
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