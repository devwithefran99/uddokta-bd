
"use client";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";


const myEvents = [
  {
    id: 1,
    title: "Community Tree Plantation",
    category: "Tree Plantation",
    date: "November 15, 2026",
    location: "Dhaka, Bangladesh",
    image:
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800",
  },
  {
    id: 2,
    title: "Clean Our Neighborhood",
    category: "Cleanup",
    date: "November 20, 2026",
    location: "Chattogram, Bangladesh",
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800",
  },
  {
    id: 3,
    title: "Winter Clothes Distribution",
    category: "Donation",
    date: "November 25, 2026",
    location: "Sylhet, Bangladesh",
    image:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800",
  },
];

export default function ManageEventsPage() {
    type Event = {
  id: number;
  title: string;
  category: string;
  date: string;
  location: string;
  image: string;
};

const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Page Heading */}
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="mb-2 text-sm font-semibold text-[#14A06F]">
              MY DASHBOARD
            </p>

            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Manage Events
            </h1>

            <p className="mt-3 text-gray-500">
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
        <div className="mb-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-gray-500">
            Total Events Created
          </p>

          <h2 className="mt-2 text-3xl font-bold text-[#14A06F]">
            {myEvents.length}
          </h2>
        </div>

        {/* Event Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {myEvents.map((event) => (
            <div
              key={event.id}
              className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
            >
              {/* Event Image */}
              <div className="relative h-52 w-full">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Event Information */}
              <div className="p-5">
                <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-[#14A06F]">
                  {event.category}
                </span>

                <h2 className="mt-4 text-xl font-bold text-gray-900">
                  {event.title}
                </h2>

                <div className="mt-4 space-y-3 text-sm text-gray-500">
                  <p className="flex items-center gap-2">
                    <CalendarDays size={17} className="text-[#14A06F]" />
                    {event.date}
                  </p>

                  <p className="flex items-center gap-2">
                    <MapPin size={17} className="text-[#14A06F]" />
                    {event.location}
                  </p>
                </div>

                {/* Edit and Delete Buttons */}
                <div className="mt-6 flex gap-3 border-t border-gray-100 pt-4">
                 <button
  onClick={() => setSelectedEvent(event)}
  className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-[#14A06F] py-2.5 text-sm font-semibold text-[#14A06F] transition hover:bg-green-50"
>
  <Pencil size={16} />
  Edit
</button>

                  <button className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 py-2.5 text-sm font-semibold text-red-500 transition hover:bg-red-50">
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
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
      <form className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">
            Event Title
          </label>
          <Input
            name="title"
            defaultValue={selectedEvent.title}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Category
          </label>
          <Input
            name="category"
            defaultValue={selectedEvent.category}
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
            name="image"
            defaultValue={selectedEvent.image}
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

      </div>
    </main>
  );
}
