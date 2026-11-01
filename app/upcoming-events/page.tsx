
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";

const events = [
  {
    id: "1",
    title: "Community Tree Plantation",
    category: "Environment",
    description:
      "Join us to make our community greener by planting trees and spreading environmental awareness.",
    location: "Dhaka, Bangladesh",
    date: "2026-11-15",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
  },
  {
    id: "2",
    title: "Winter Clothes Distribution",
    category: "Social Welfare",
    description:
      "Help us bring warmth to underprivileged families by distributing winter clothes.",
    location: "Chattogram, Bangladesh",
    date: "2026-11-20",
    image:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800",
  },
  {
    id: "3",
    title: "Free Educational Workshop",
    category: "Education",
    description:
      "A learning opportunity for students to develop practical skills and explore new ideas.",
    location: "Sylhet, Bangladesh",
    date: "2026-11-25",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
  },
  {
    id: "4",
    title: "Community Clean-up Campaign",
    category: "Environment",
    description:
      "Let's work together to create a cleaner and healthier environment for everyone.",
    location: "Dhaka, Bangladesh",
    date: "2026-12-02",
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800",
  },
  {
    id: "5",
    title: "Free Medical Awareness Camp",
    category: "Healthcare",
    description:
      "Join our community health awareness program and help spread important health information.",
    location: "Rajshahi, Bangladesh",
    date: "2026-12-10",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
  },
  {
    id: "6",
    title: "Youth Leadership Meetup",
    category: "Community",
    description:
      "Connect with young leaders, share ideas, and discover opportunities to make a difference.",
    location: "Khulna, Bangladesh",
    date: "2026-12-18",
    image:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800",
  },
];

function formatDate(date: string) {
  return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function UpcomingEventsPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="bg-white border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-[#14A06F]">
            Discover & Participate
          </p>

          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            Upcoming Events
          </h1>

          <p className="mt-4 max-w-2xl text-gray-500">
            Find meaningful events around you, connect with your community,
            and become part of something positive.
          </p>
        </div>
      </section>

      {/* Events Section */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Explore Events
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Find an event and join the community.
            </p>
          </div>

          <span className="rounded-full bg-[#14A06F]/10 px-4 py-2 text-sm font-semibold text-[#14A06F]">
            {events.length} Events
          </span>
        </div>

        <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <article
              key={event.id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              {/* Event Image */}
              <div className="relative h-56 overflow-hidden">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition duration-500 hover:scale-105"
                />

                <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#14A06F] shadow-sm">
                  {event.category}
                </span>
              </div>

              {/* Event Information */}
              <div className="p-5">
                <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
                  <CalendarDays size={16} className="text-[#14A06F]" />
                  <span>{formatDate(event.date)}</span>
                </div>

                <h3 className="mb-2 text-xl font-bold text-gray-900">
                  {event.title}
                </h3>

                <p className="mb-4 text-sm leading-6 text-gray-500">
                  {event.description}
                </p>

                <div className="mb-5 flex items-center gap-2 text-sm text-gray-500">
                  <MapPin size={16} className="shrink-0 text-[#F0562F]" />
                  <span>{event.location}</span>
                </div>

                <Link
                  href={`/events/${event.id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#14A06F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#10875E]"
                >
                  View Details
                  <ArrowRight size={17} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
