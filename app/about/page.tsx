
import Image from "next/image";
import Link from "next/link";
import {
  Target,
  Eye,
  HeartHandshake,
  Users,
  CalendarDays,
  ArrowRight,
} from "lucide-react";

export default function AboutPage() {
  return (
    <main className="bg-white dark:bg-gray-950">
      {/* Hero Section */}
      <section className="bg-[#F0FAF6] dark:bg-gray-900">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:py-20 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="mb-4 inline-block rounded-full bg-[#14A06F]/10 px-4 py-2 text-sm font-semibold text-[#14A06F]">
              About Uddokta-BD
            </span>

            <h1 className="text-3xl font-bold leading-tight text-gray-900 dark:text-white sm:text-4xl lg:text-5xl">
              Bringing People Together,
              <span className="text-[#14A06F]"> Creating Change.</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 dark:text-gray-400">
              Uddokta-BD is a community-driven platform that connects people
              with meaningful social events and opportunities to make a
              positive difference in society.
            </p>

            <Link
              href="/upcoming-events"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-[#14A06F] px-6 py-3 font-semibold text-white transition hover:bg-[#10875E]"
            >
              Explore Events
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="relative h-64 overflow-hidden rounded-2xl sm:h-80 lg:h-[400px]">
            <Image
              src="https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1000"
              alt="People working together in a community"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[#F0562F]">
            Who We Are
          </span>

          <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
            A Platform for Positive Change
          </h2>

          <p className="mt-5 leading-8 text-gray-600 dark:text-gray-400">
            We believe that small actions can create big changes. From
            educational programs and environmental campaigns to social welfare
            activities, Uddokta-BD helps people discover opportunities,
            participate in events, and work together for a better community.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-gray-50 dark:bg-gray-950 py-16 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-7 px-4 sm:px-6 md:grid-cols-2 lg:px-8">
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-7 shadow-sm sm:p-9">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#14A06F]/10 text-[#14A06F]">
              <Target size={28} />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h3>

            <p className="mt-4 leading-7 text-gray-600 dark:text-gray-400">
              Our mission is to make social participation easier by connecting
              individuals with meaningful events, encouraging volunteerism,
              and building stronger communities.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-7 shadow-sm sm:p-9">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-[#F0562F]/10 text-[#F0562F]">
              <Eye size={28} />
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Our Vision</h3>

            <p className="mt-4 leading-7 text-gray-600 dark:text-gray-400">
              We envision a connected society where everyone has the
              opportunity to contribute, participate, and create positive
              social impact together.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mb-10 text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-[#14A06F]">
            Why Uddokta-BD
          </span>

          <h2 className="mt-3 text-3xl font-bold text-gray-900 dark:text-white">
            What Makes Us Different?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-gray-500 dark:text-gray-400">
            We make it easier for people to connect, participate, and contribute
            to meaningful activities.
          </p>
        </div>

        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 p-7 transition hover:shadow-md">
            <Users size={32} className="text-[#14A06F]" />
            <h3 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
              Community Connection
            </h3>
            <p className="mt-3 text-sm leading-7 text-gray-500 dark:text-gray-400">
              Connect with people who share your interests and passion for
              positive change.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 p-7 transition hover:shadow-md">
            <CalendarDays size={32} className="text-[#F0562F]" />
            <h3 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
              Meaningful Events
            </h3>
            <p className="mt-3 text-sm leading-7 text-gray-500 dark:text-gray-400">
              Discover different social events and find opportunities to get
              involved.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 p-7 transition hover:shadow-md sm:col-span-2 lg:col-span-1">
            <HeartHandshake size={32} className="text-[#14A06F]" />
            <h3 className="mt-5 text-xl font-bold text-gray-900 dark:text-white">
              Positive Impact
            </h3>
            <p className="mt-3 text-sm leading-7 text-gray-500 dark:text-gray-400">
              Be part of activities that support people and create a better
              future for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20">
        <div className="mx-auto max-w-7xl rounded-2xl bg-[#14A06F] px-6 py-12 text-center sm:px-12">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Be Part of Something Meaningful
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/85">
            Discover upcoming events, connect with your community, and start
            making a positive difference today.
          </p>

          <Link
            href="/upcoming-events"
            className="mt-7 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-[#14A06F] transition hover:bg-gray-100"
          >
            Join Our Community
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
