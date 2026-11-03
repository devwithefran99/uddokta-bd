import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Compass,
  Home,
  Info,
  SearchX,
} from "lucide-react";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Uddokta-BD",
  description:
    "The page you are looking for does not exist or may have been moved.",
};

const quickLinks = [
  {
    href: "/",
    label: "Home",
    description: "Go back to the landing page.",
    icon: Home,
    accent: "green",
  },
  {
    href: "/upcoming-events",
    label: "Upcoming Events",
    description: "Discover events you can join.",
    icon: CalendarDays,
    accent: "orange",
  },
  {
    href: "/about",
    label: "About Us",
    description: "Learn more about Uddokta-BD.",
    icon: Info,
    accent: "green",
  },
] as const;

export default function NotFound() {
  return (
    <main className="relative flex flex-1 items-center overflow-hidden bg-white dark:bg-gray-950">
      {/* Decorative background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#14A06F]/10 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#F0562F]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        {/* Hero Card */}
        <section className="overflow-hidden rounded-3xl border border-gray-100 bg-[#F0FAF6] px-6 py-12 text-center shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:px-10 sm:py-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#14A06F] shadow-sm dark:bg-gray-950">
            <SearchX size={16} />
            Error 404
          </span>

          {/* 404 Artwork */}
          <div
            aria-hidden="true"
            className="mt-8 flex items-center justify-center gap-2 sm:gap-4"
          >
            <span className="text-7xl font-bold leading-none text-[#14A06F] sm:text-8xl lg:text-9xl">
              4
            </span>

            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#F0562F]/10 text-[#F0562F] sm:h-20 sm:w-20 lg:h-24 lg:w-24">
              <Compass
                size={44}
                className="animate-[spin_14s_linear_infinite] sm:h-12 sm:w-12 lg:h-14 lg:w-14"
              />
            </span>

            <span className="text-7xl font-bold leading-none text-[#14A06F] sm:text-8xl lg:text-9xl">
              4
            </span>
          </div>

          <h1 className="mt-8 text-2xl font-bold leading-tight text-gray-900 dark:text-white sm:text-3xl lg:text-4xl">
            Oops! This Page Could
            <span className="text-[#F0562F]"> Not Be Found.</span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-600 dark:text-gray-400 sm:text-base">
            The page you are looking for might have been removed, renamed, or is
            temporarily unavailable. Let&apos;s get you back to something
            meaningful.
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#14A06F] px-6 py-3 font-semibold text-white transition hover:bg-[#10875E] sm:w-auto"
            >
              Back to Home
              <ArrowRight size={18} />
            </Link>

            <Link
              href="/upcoming-events"
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:border-[#14A06F] hover:text-[#14A06F] dark:border-gray-700 dark:bg-gray-950 dark:text-gray-300 dark:hover:border-green-500 dark:hover:text-green-400 sm:w-auto"
            >
              <CalendarDays size={18} />
              Browse Events
            </Link>
          </div>
        </section>

        {/* Helpful Links */}
        <section className="mt-8">
          <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            You Might Be Looking For
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {quickLinks.map((link) => {
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group flex items-start gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[#14A06F]/30 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
                >
                  <span
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                      link.accent === "orange"
                        ? "bg-[#F0562F]/10 text-[#F0562F]"
                        : "bg-[#14A06F]/10 text-[#14A06F]"
                    }`}
                  >
                    <Icon size={22} />
                  </span>

                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 text-base font-bold text-gray-900 dark:text-white">
                      {link.label}
                      <ArrowRight
                        size={15}
                        className="text-gray-300 transition group-hover:translate-x-0.5 group-hover:text-[#14A06F] dark:text-gray-600"
                      />
                    </span>

                    <span className="mt-1 block text-sm leading-6 text-gray-500 dark:text-gray-400">
                      {link.description}
                    </span>
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
