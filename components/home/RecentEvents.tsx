
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  ArrowRight,
} from "lucide-react";

type Event = {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
};

const RecentEvents = () => {
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
    <section className="bg-gray-50 px-4 py-16 md:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mb-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-[#14A06F]/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#14A06F]">
              Make A Difference
            </span>

            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
              Upcoming
              <span className="text-[#14A06F]"> Events</span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-500 sm:text-base">
              Discover meaningful events happening around
              your community and become a part of positive change.
            </p>
          </div>

          <Link
            href="/upcoming-events"
            className="inline-flex w-fit items-center gap-2 text-sm font-bold text-[#14A06F] transition hover:text-[#F0562F]"
          >
            View All Events
            <ArrowRight size={18} />
          </Link>
        </div>

        {/* Event Cards */}
        {loading ? (
          <p className="py-10 text-center text-gray-500">
            Loading events...
          </p>
        ) : events.length === 0 ? (
          <p className="py-10 text-center text-gray-500">
            No upcoming events found.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.slice(0, 6).map((event) => (
              <div
                key={event._id}
                className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                {/* Event Image */}
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={event.thumbnail}
                    alt={event.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />

                  {/* Category */}
                  <span className="absolute left-4 top-4 rounded-full bg-[#14A06F] px-3 py-1.5 text-xs font-bold text-white">
                    {event.eventType}
                  </span>
                </div>

                {/* Card Content */}
                <div className="flex flex-col p-5">

                  <h3 className="min-h-[52px] text-lg font-bold leading-7 text-gray-900 transition group-hover:text-[#14A06F]">
                    {event.title}
                  </h3>

                  {/* Location */}
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <MapPin size={17} className="shrink-0 text-[#F0562F]" />
                    <span>{event.location}</span>
                  </div>

                  {/* Date */}
                  <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                    <CalendarDays
                      size={17}
                      className="shrink-0 text-[#14A06F]"
                    />
                    <span>
                      {new Date(event.eventDate).toLocaleDateString(
                        "en-US",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>

                  {/* Details Button */}
                  <Link
                    href={`/events/${event._id}`}
                    className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-[#14A06F] py-3 text-sm font-bold text-[#14A06F] transition hover:bg-[#14A06F] hover:text-white"
                  >
                    View Details
                    <ArrowRight size={16} />
                  </Link>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bottom Button */}
        <div className="mt-10 text-center sm:hidden">
          <Link
            href="/upcoming-events"
            className="inline-flex items-center gap-2 rounded-full bg-[#14A06F] px-7 py-3 font-semibold text-white transition hover:bg-[#10865D]"
          >
            Explore All Events
            <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </section>
  );
};

export default RecentEvents;
