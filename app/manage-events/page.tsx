"use client";

import { useState, useEffect, type FormEvent } from "react";
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

type Event = {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnail: string;
  location: string;
  eventDate: string;
};

export default function ManageEventsPage() {

  const { data: session } = authClient.useSession();
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  // Page open hole automatic data fetch
  useEffect(() => {
    async function getEvents() {
      try {
        const response = await fetch(  `http://localhost:5000/my-events?email=${session?.user?.email}`);
        const data = await response.json();
        setMyEvents(data);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load events!");
      } finally {
        setLoading(false);
      }
    }

    getEvents();
  }, [session]);

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
    eventDate: selectedEvent.eventDate,
  };

  try {
    const response = await fetch(
      `http://localhost:5000/events/${selectedEvent._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedEvent),
      }
    );

    const data = await response.json();

    if (response.ok) {
      toast.success("Event updated successfully!");
      setSelectedEvent(null);

      const res = await fetch("http://localhost:5000/events");
      const events = await res.json();
      setMyEvents(events);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.log(error);
    toast.error("Failed to update event!");
  }
};

const handleDeleteEvent = async (id: string) => {
  const result = await fetch(`http://localhost:5000/events/${id}`, {
    method: "DELETE",
  });

  const data = await result.json();

  console.log(data);

  if (data.deletedCount > 0) {
    alert("Event deleted successfully!");

    const res = await fetch("http://localhost:5000/events");
    const events = await res.json();
    setMyEvents(events);
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
        {loading ? (
          <p className="py-10 text-center text-gray-500 dark:text-gray-400">Loading events...</p>
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