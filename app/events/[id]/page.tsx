
"use client";

import { Suspense, useEffect, useState, use } from "react";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Tag,
  Clock,
  Users,
} from "lucide-react";

type Event = {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
  createdAt?: string;
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function EventDetailsLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-gray-500 dark:text-gray-400">
        Loading event details...
      </p>
    </div>
  );
}

export default function EventDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // `params` is a runtime API. Under Cache Components it must be read inside a
  // Suspense boundary, otherwise the route can't prerender its static shell.
  return (
    <Suspense fallback={<EventDetailsLoading />}>
      <EventDetails params={params} />
    </Suspense>
  );
}

function EventDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { data: session, isPending: sessionPending } = authClient.useSession();

  const { id } = use(params);

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [joining, setJoining] = useState(false);
  const [joinMessage, setJoinMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function getEvent() {
      setLoading(true);
      setError("");
      setNotFound(false);

      try {
        // Event details is a public API - no token needed here.
        const response = await fetch(`http://localhost:5000/events/${id}`, {
          cache: "no-store",
        });

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          if (response.status === 404) {
            if (!cancelled) setNotFound(true);
            throw new Error(data?.message || "This event does not exist.");
          }

          throw new Error(data?.message || "Failed to fetch event details.");
        }

        if (!cancelled) setEvent(data);
      } catch (err) {
        if (!cancelled) {
          console.log(err);
          setError(
            err instanceof Error ? err.message : "Failed to fetch event details."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    getEvent();

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleJoin = async () => {
    if (!event) return;

    if (!session) {
      setJoinMessage({
        type: "error",
        text: "Please sign in before joining an event.",
      });
      return;
    }

    setJoining(true);
    setJoinMessage(null);

    try {
      const { data: tokenData, error: tokenError } = await authClient.token();

      if (tokenError || !tokenData?.token) {
        setJoinMessage({
          type: "error",
          text: "Could not get your session token. Please sign in again.",
        });
        return;
      }

      const response = await fetch("http://localhost:5000/join-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify({ eventId: event._id }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setJoinMessage({
          type: "error",
          text: data.message || "Failed to join this event.",
        });
        return;
      }

      setJoinMessage({ type: "success", text: data.message });
    } catch (err) {
      console.log(err);
      setJoinMessage({
        type: "error",
        text: "Failed to join this event. Please try again.",
      });
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return <EventDetailsLoading />;
  }

  if (!event) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {notFound ? "Event Not Found" : "Could Not Load Event"}
        </h2>

        <p className="max-w-md text-gray-500 dark:text-gray-400">
          {error ||
            "The event may have been deleted, or the API server is not reachable."}
        </p>

        <Link
          href="/upcoming-events"
          className="rounded-lg bg-[#14A06F] px-5 py-3 text-white"
        >
          Back to Events
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#F9FAFB] dark:bg-gray-950 px-4 py-10">
      <div className="mx-auto max-w-6xl">

        <Link
          href="/upcoming-events"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-[#14A06F]"
        >
          <ArrowLeft size={18} />
          Back to Upcoming Events
        </Link>

        {/* Event Image */}
        <div className="relative h-[250px] overflow-hidden rounded-2xl sm:h-[400px]">
          <Image
            src={event.thumbnail}
            alt={event.title}
            fill
            priority
            className="object-cover"
            unoptimized
          />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-3">

          {/* Event Information */}
          <div className="space-y-6 lg:col-span-2">

            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-green-100 dark:bg-green-900/40 px-4 py-2 text-sm font-semibold text-[#14A06F]">
                <Tag size={15} />
                {event.eventType}
              </span>

              <h1 className="mt-5 text-3xl font-bold text-[#1F2937] dark:text-white sm:text-4xl">
                {event.title}
              </h1>
            </div>

            {/* Description */}
            <div className="rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">
                About This Event
              </h2>

              <p className="whitespace-pre-line leading-8 text-gray-600 dark:text-gray-400">
                {event.description}
              </p>
            </div>

            {/* Event Details */}
            <div className="rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold text-gray-800 dark:text-gray-100">
                Event Information
              </h2>

              <div className="grid gap-6 sm:grid-cols-2">

                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-green-50 dark:bg-green-950/40 p-3 text-[#14A06F]">
                    <CalendarDays size={22} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Event Date
                    </p>

                    <p className="mt-1 font-semibold text-gray-800 dark:text-gray-100">
                      {formatDate(event.eventDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-orange-50 dark:bg-orange-950/40 p-3 text-[#F0562F]">
                    <Clock size={22} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Event Time
                    </p>

                    <p className="mt-1 font-semibold text-gray-800 dark:text-gray-100">
                      {formatTime(event.eventDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:col-span-2">
                  <div className="rounded-lg bg-green-50 dark:bg-green-950/40 p-3 text-[#14A06F]">
                    <MapPin size={22} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Event Location
                    </p>

                    <p className="mt-1 font-semibold text-gray-800 dark:text-gray-100">
                      {event.location}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 sm:col-span-2">
                  <div className="rounded-lg bg-orange-50 dark:bg-orange-950/40 p-3 text-[#F0562F]">
                    <Users size={22} />
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Event ID
                    </p>

                    <p className="mt-1 break-all font-semibold text-gray-800 dark:text-gray-100">
                      {event._id}
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Join Event Card */}
          <div>
            <div className="sticky top-24 rounded-2xl bg-white dark:bg-gray-900 p-6 shadow-sm">

              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                Interested in Joining?
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-500 dark:text-gray-400">
                Be part of this event and connect with people who share
                your interests.
              </p>

              <button
                onClick={handleJoin}
                disabled={joining || sessionPending}
                className="mt-6 w-full rounded-xl bg-[#14A06F] px-5 py-3 font-semibold text-white hover:bg-[#10875e] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {joining ? "Joining..." : "Join Event"}
              </button>

              {joinMessage && (
                <p
                  className={`mt-3 text-center text-sm font-medium ${
                    joinMessage.type === "success"
                      ? "text-[#14A06F]"
                      : "text-red-500"
                  }`}
                >
                  {joinMessage.text}
                </p>
              )}

              {!sessionPending && !session && (
                <p className="mt-3 text-center text-xs text-gray-400 dark:text-gray-500">
                  <Link href="/signin" className="font-semibold text-[#14A06F] underline">
                    Sign in
                  </Link>{" "}
                  to join this event.
                </p>
              )}

              <p className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
                Join this event and make a difference!
              </p>

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
