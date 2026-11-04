
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, ArrowRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";

type JoinedEvent = {
  _id: string;
  eventId: string;
  eventTitle: string;
  eventImage: string;
  eventDate: string;
  location: string;
  userEmail: string;
  joinedAt: string;
};

export default function JoinedEventsPage() {
  const { data: session, isPending } = authClient.useSession();

  const [events, setEvents] = useState<JoinedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const signedIn = Boolean(session?.user?.email);
  const showLoading = isPending || (signedIn && loading);

  useEffect(() => {
    if (isPending || !session?.user?.email) return;

    let cancelled = false;

    async function getJoinedEvents() {
      try {
       
        const { data: token, error: tokenError } = await authClient.token();

        if (tokenError || !token?.token) {
          throw new Error("Your session expired. Please sign in again.");
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/joined-events`, {
          headers: { authorization: `Bearer ${token.token}` },
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to load joined events");
        }

        if (!cancelled) setEvents(Array.isArray(data) ? data : []);
      } catch (error) {
        if (cancelled) return;

        const message =
          error instanceof Error
            ? error.message
            : "Failed to load joined events";

        setLoadError(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    getJoinedEvents();

    return () => {
      cancelled = true;
    };
  }, [isPending, session?.user?.email]);

  if (showLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Loading joined events...</p>
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Please Sign In
        </h2>
        <Link
          href="/signin"
          className="rounded-lg bg-[#14A06F] px-5 py-3 text-white"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] dark:bg-gray-950 px-4 py-12">
      <div className="mx-auto max-w-6xl">

        <div className="mb-10">
          <p className="font-semibold text-[#14A06F]">
            YOUR ACTIVITIES
          </p>

          <h1 className="mt-2 text-3xl font-bold text-[#1F2937] dark:text-white sm:text-4xl">
            Joined Events
          </h1>

          <p className="mt-3 text-gray-500 dark:text-gray-400">
            All the events you have joined in one place.
          </p>

          <p className="mt-4 font-medium text-gray-700 dark:text-gray-300">
            Total Joined Events: {events.length}
          </p>
        </div>

        {loadError ? (
          <div className="rounded-2xl bg-white dark:bg-gray-900 py-16 text-center shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              Could Not Load Joined Events
            </h2>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {loadError}
            </p>
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-2xl bg-white dark:bg-gray-900 py-16 text-center shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              You haven&apos;t joined any events yet!
            </h2>

            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Explore upcoming events and join one.
            </p>

            <Link
              href="/upcoming-events"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#14A06F] px-5 py-3 font-semibold text-white"
            >
              Explore Events
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div
                key={event._id}
                className="overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-sm transition hover:shadow-md"
              >
                <div className="relative h-52">
                  <Image
                    src={event.eventImage}
                    alt={event.eventTitle}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

                <div className="p-5">
                  <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    {event.eventTitle}
                  </h2>

                  <div className="mt-4 space-y-3 text-sm text-gray-500 dark:text-gray-400">
                    <p className="flex items-center gap-2">
                      <CalendarDays size={17} className="text-[#14A06F]" />
                      {new Date(event.eventDate).toLocaleDateString()}
                    </p>

                    <p className="flex items-center gap-2">
                      <MapPin size={17} className="text-[#14A06F]" />
                      {event.location}
                    </p>
                  </div>

                  <Link
                    href={`/events/${event.eventId}`}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#14A06F] py-3 font-semibold text-white hover:bg-[#10875e]"
                  >
                    View Event
                    <ArrowRight size={17} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
