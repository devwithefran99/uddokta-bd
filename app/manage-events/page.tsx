"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { authClient } from "@/lib/auth-client";

import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "react-toastify";

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

type Event = {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
};

// Protected routes on the API expect a JWT from better-auth as a Bearer token,
// not an email in the query string.
async function getAuthHeaders() {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Your session expired. Please sign in again.");
  }

  return {
    "Content-Type": "application/json",
    authorization: `Bearer ${data.token}`,
  };
}

async function fetchMyEvents(): Promise<Event[]> {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/my-events`, {
    headers,
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to load events");
  }

  return Array.isArray(data) ? data : [];
}

export default function ManageEventsPage() {

  const { data: session, isPending } = authClient.useSession();
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  const signedIn = Boolean(session?.user?.email);
  const showLoading = isPending || (signedIn && loading);

  // Wait for the session before calling a protected route.
  useEffect(() => {
    if (isPending || !session?.user?.email) return;

    let cancelled = false;

    async function load() {
      try {
        const events = await fetchMyEvents();

        if (cancelled) return;

        setMyEvents(events);
        setLoadError("");
      } catch (error) {
        if (cancelled) return;

        const message =
          error instanceof Error ? error.message : "Failed to load events";

        setLoadError(message);
        toast.error(message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [isPending, session?.user?.email, reloadKey]);

  const reloadMyEvents = () => {
    setLoading(true);
    setReloadKey((key) => key + 1);
  };

  const handleUpdateEvent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedEvent) return;

    const formData = new FormData(event.currentTarget);

    const updatedEvent = {
      title: formData.get("title"),
      description: formData.get("description"),
      eventType: formData.get("eventType"),
      location: formData.get("location"),
      thumbnail: formData.get("thumbnail"),
      eventDate: formData.get("eventDate") || selectedEvent.eventDate,
    };

    try {
      const headers = await getAuthHeaders();

      const response = await fetch(`${API_URL}/events/${selectedEvent._id}`, {
        method: "PATCH",
        headers,
        body: JSON.stringify(updatedEvent),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || "Event updated successfully!");
        setSelectedEvent(null);
        reloadMyEvents();
      } else {
        toast.error(data.message || "Failed to update event!");
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to update event!";

      toast.error(message);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    if (!window.confirm("Delete this event? This cannot be undone.")) return;

    try {
      const headers = await getAuthHeaders();

      const response = await fetch(`${API_URL}/events/${id}`, {
        method: "DELETE",
        headers,
      });

      const data = await response.json();

      // The API answers with { success, message } - there is no deletedCount.
      if (!response.ok || !data.success) {
        toast.error(data.message || "Failed to delete event!");
        return;
      }

      toast.success(data.message || "Event deleted successfully!");
      reloadMyEvents();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete event!";

      toast.error(message);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold text-[#14A06F]">
              MY DASHBOARD
            </p>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Manage Events
            </h1>
            <p className="mt-3 text-gray-500 dark:text-gray-400">
              Manage, update and organize the events you have created.
            </p>
          </div>

          <Link
            href="/create-event"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#14A06F] px-5 py-3 font-semibold text-white transition hover:bg-[#10865D]"
          >
            <Plus size={20} />
            Create New Event
          </Link>
        </div>

        {/* Total Events */}
        <div className="mb-8 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Events Created
          </p>
          <h2 className="mt-2 text-3xl font-bold text-[#14A06F]">
            {myEvents.length}
          </h2>
        </div>

        {/* Events */}
        {showLoading ? (
          <p className="py-10 text-center text-gray-500 dark:text-gray-400">Loading events...</p>
        ) : !signedIn ? (
          <div className="rounded-xl bg-white dark:bg-gray-900 py-16 text-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Please Sign In
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              You need to be signed in to manage your events.
            </p>
            <Link
              href="/signin"
              className="mt-5 inline-block rounded-lg bg-[#14A06F] px-5 py-3 font-semibold text-white"
            >
              Sign In
            </Link>
          </div>
        ) : loadError ? (
          <div className="rounded-xl bg-white dark:bg-gray-900 py-16 text-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              Could Not Load Your Events
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {loadError}
            </p>
            <button
              onClick={reloadMyEvents}
              className="mt-5 rounded-lg bg-[#14A06F] px-5 py-3 font-semibold text-white hover:bg-[#10865D]"
            >
              Try Again
            </button>
          </div>
        ) : myEvents.length === 0 ? (
          <div className="rounded-xl bg-white dark:bg-gray-900 py-16 text-center">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              No Events Found
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              You haven&apos;t created any events yet.
            </p>
            <Link
              href="/create-event"
              className="mt-5 inline-block rounded-lg bg-[#14A06F] px-5 py-3 font-semibold text-white"
            >
              Create Your First Event
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {myEvents.map((event) => (
              <div
                key={event._id}
                className="overflow-hidden rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm transition hover:shadow-md"
              >
                <div className="relative h-52 w-full">
                  <Image
                    src={event.thumbnail}
                    alt={event.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

                <div className="p-5">
                  <span className="rounded-full bg-green-50 dark:bg-green-950/40 px-3 py-1 text-xs font-semibold text-[#14A06F]">
                    {event.eventType}
                  </span>

                  <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white">
                    {event.title}
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

                  <div className="mt-6 flex gap-3 border-t border-gray-100 dark:border-gray-800 pt-4">
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#14A06F] py-2.5 text-sm font-semibold text-[#14A06F] hover:bg-green-50 dark:hover:bg-gray-800"
                    >
                      <Pencil size={16} />
                      Edit
                    </button>

                   <button
  onClick={() => handleDeleteEvent(event._id)}
  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 dark:border-red-900 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40"
>
  <Trash2 size={16} />
  Delete
</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Dialog */}
        <Dialog
          open={selectedEvent !== null}
          onOpenChange={(open) => {
            if (!open) setSelectedEvent(null);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Event</DialogTitle>
            </DialogHeader>

            {selectedEvent && (
              <form onSubmit={handleUpdateEvent} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Event Title
                  </label>
                  <Input name="title" defaultValue={selectedEvent.title} />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Description
                  </label>
                  <textarea
                    name="description"
                    defaultValue={selectedEvent.description}
                    className="w-full rounded-md border border-gray-200 dark:border-gray-700 p-3 text-sm"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Event Type
                  </label>
                  <Input
                    name="eventType"
                    defaultValue={selectedEvent.eventType}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Location
                  </label>
                  <Input
                    name="location"
                    defaultValue={selectedEvent.location}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Event Date
                  </label>
                  <Input
                    name="eventDate"
                    type="date"
                    defaultValue={selectedEvent.eventDate.slice(0, 10)}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Event Image URL
                  </label>
                  <Input
                    name="thumbnail"
                    defaultValue={selectedEvent.thumbnail}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#14A06F] py-3 font-semibold text-white hover:bg-[#10865D]"
                >
                  Update Event
                </button>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </main>
  );
}