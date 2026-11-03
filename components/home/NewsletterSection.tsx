"use client";

import { useState, type FormEvent } from "react";
import { Mail, ArrowRight, CheckCircle2, BellRing } from "lucide-react";

type Status = "idle" | "success" | "error";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = email.trim();
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

    if (!isValid) {
      setStatus("error");
      return;
    }

    // TODO: POST the email to the newsletter endpoint once the API is available.
    setStatus("success");
    setEmail("");
  };

  return (
    <section className="bg-white px-4 pb-16 dark:bg-gray-950 md:px-8 lg:px-12 lg:pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-3xl bg-[#064E3B] px-6 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
          {/* Decorative background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div className="absolute -right-16 -top-24 h-64 w-64 rounded-full bg-[#14A06F]/30 blur-3xl" />
            <div className="absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-[#F0562F]/20 blur-3xl" />
          </div>

          <div className="relative grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
            {/* Copy */}
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur-sm">
                <BellRing size={14} />
                Stay in the Loop
              </span>

              <h2 className="mt-5 text-2xl font-bold leading-tight text-white sm:text-3xl lg:text-4xl">
                Never Miss a Chance to
                <span className="text-[#F0562F]"> Make a Difference.</span>
              </h2>

              <p className="mt-4 max-w-lg text-sm leading-7 text-white/75 sm:text-base">
                Get a short, thoughtful email whenever new community events are
                announced. Real opportunities, no noise — just ways to show up
                for your community.
              </p>
            </div>

            {/* Form */}
            <div className="w-full lg:max-w-lg lg:justify-self-end">
              <form onSubmit={handleSubmit} noValidate className="w-full">
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative flex-1">
                    <Mail
                      size={18}
                      aria-hidden="true"
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                    <input
                      id="newsletter-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        setStatus("idle");
                      }}
                      placeholder="you@example.com"
                      aria-invalid={status === "error"}
                      aria-describedby="newsletter-note"
                      className={`h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-500 focus:ring-2 ${
                        status === "error"
                          ? "border-[#F0562F] focus:border-[#F0562F] focus:ring-[#F0562F]/25"
                          : "border-transparent focus:border-[#14A06F] focus:ring-[#14A06F]/25"
                      }`}
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#F0562F] px-6 font-semibold text-white transition hover:bg-[#D9481F] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#064E3B]"
                  >
                    Subscribe
                    <ArrowRight size={18} />
                  </button>
                </div>

                <div id="newsletter-note" aria-live="polite" className="mt-3">
                  {status === "success" ? (
                    <p className="flex items-center gap-2 text-sm font-medium text-[#8BE8C3]">
                      <CheckCircle2 size={16} aria-hidden="true" />
                      You&apos;re on the list — thanks for joining in!
                    </p>
                  ) : status === "error" ? (
                    <p className="text-sm font-medium text-[#FFB199]">
                      Please enter a valid email address.
                    </p>
                  ) : (
                    <p className="text-xs leading-5 text-white/60">
                      No spam, ever. Unsubscribe anytime with one click.
                    </p>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
