
"use client";

import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
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

export default function EventDetailsPage() {
  const { data: session } = authClient.useSession();

  const params = useParams();
  const id = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getEvent() {
      try {
        // Event Details is a public API
        const response = await fetch(
          `http://localhost:5000/events/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch event");
        }

        const data = await response.json();
        setEvent(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }

    getEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">
          Loading event details...
        </p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Event Not Found
        </h2>

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
                onClick={async () => {
                  if (!session) {
                    alert("Please sign in first!");
                    return;
                  }

                  try {
                    // Get JWT token
                    const jwttoken = await authClient.token();

                    const response = await fetch(
                      "http://localhost:5000/join-event",
                      {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          authorization: `Bearer ${jwttoken.data?.token}`,
                        },
                        body: JSON.stringify({
                          eventId: event._id,
                          eventTitle: event.title,
                          eventImage: event.thumbnail,
                          eventDate: event.eventDate,
                          location: event.location,
                          userEmail: session.user.email,
                        }),
                      }
                    );

                    const data = await response.json();
                    alert(data.message);
                  } catch (error) {
                    console.log(error);
                  }
                }}
                className="mt-6 w-full rounded-xl bg-[#14A06F] px-5 py-3 font-semibold text-white hover:bg-[#10875e]"
              >
                Join Event
              </button>

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
