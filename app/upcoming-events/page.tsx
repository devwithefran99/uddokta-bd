
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";

type Event = {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function UpcomingEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch upcoming events from database
  useEffect(() => {
    async function getEvents() {
      try {
        const response = await fetch(
          "http://localhost:5000/upcoming-events"
        );

        const data = await response.json();

        setEvents(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    getEvents();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="border-b border-gray-100 bg-white">
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

        {/* Loading State */}
        {loading ? (
          <p className="py-10 text-center text-gray-500">
            Loading events...
          </p>
        ) : events.length === 0 ? (
          /* Empty State */
          <div className="rounded-xl bg-white py-16 text-center">
            <h2 className="text-xl font-semibold text-gray-800">
              No Upcoming Events Found
            </h2>

            <p className="mt-2 text-gray-500">
              There are no upcoming events at the moment.
            </p>
          </div>
        ) : (
          /* Event Cards */
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <article
                key={event._id}
                className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Event Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={event.thumbnail}
                    alt={event.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 hover:scale-105"
                  />

                  <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#14A06F] shadow-sm">
                    {event.eventType}
                  </span>
                </div>

                {/* Event Information */}
                <div className="p-5">
                  <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
                    <CalendarDays
                      size={16}
                      className="text-[#14A06F]"
                    />

                    <span>{formatDate(event.eventDate)}</span>
                  </div>

                  <h3 className="mb-2 text-xl font-bold text-gray-900">
                    {event.title}
                  </h3>

                  <p className="mb-4 text-sm leading-6 text-gray-500">
                    {event.description}
                  </p>

                  <div className="mb-5 flex items-center gap-2 text-sm text-gray-500">
                    <MapPin
                      size={16}
                      className="shrink-0 text-[#F0562F]"
                    />

                    <span>{event.location}</span>
                  </div>

                  <Link
                    href={`/events/${event._id}`}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#14A06F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#10875E]"
                  >
                    View Details
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
