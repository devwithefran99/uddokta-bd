"use client";

import { useState, type FormEvent } from "react";
import { CalendarDays, ImagePlus, MapPin, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CreateEventPage() {
  const { data: session } = authClient.useSession();
  const [eventDate, setEventDate] = useState("");

  // Today's date for preventing past dates
  const today = new Date().toLocaleDateString("en-CA");

  const [eventType, setEventType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateEvent = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const eventData = {
      title: formData.get("title"),
      description: formData.get("description"),
      eventType: eventType,
      thumbnail: formData.get("thumbnail"),
      location: formData.get("location"),
      eventDate: eventDate,
    };

    if (!eventType) {
      alert("Please select an event type!");
      return;
    }

    try {
      setLoading(true);

      // Get JWT Token
      const jwttoken = await authClient.token();

      if (jwttoken.error || !jwttoken.data?.token) {
        alert("Please login first!");
        return;
      }

      // Send event data with JWT Token
      const response = await fetch("http://localhost:5000/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${jwttoken.data.token}`,
        },
        body: JSON.stringify(eventData),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Event created successfully!");
        form.reset();
        setEventDate("");
        setEventType("");
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">

        {/* Page Heading */}
        <div className="mb-8">
          <span className="inline-block rounded-full bg-[#14A06F]/10 px-4 py-2 text-sm font-semibold text-[#14A06F]">
            Share an Opportunity
          </span>

          <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Create an Event
          </h1>

          <p className="mt-3 text-gray-500 dark:text-gray-400">
            Organize a meaningful event and bring your community together.
          </p>
        </div>

        {/* Event Form */}
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm sm:p-8">
          <form onSubmit={handleCreateEvent} className="space-y-6">

            {/* Event Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter your event title"
                className="h-12"
              />
            </div>

            {/* Event Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Event Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your event and its purpose..."
                rows={5}
                className="resize-none"
              />
            </div>

            {/* Event Type */}
            <div className="space-y-2">
              <Label htmlFor="eventType">Event Type</Label>

              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger id="eventType" className="h-12 w-full">
                  <SelectValue placeholder="Select event type" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="cleanup">Cleanup</SelectItem>
                  <SelectItem value="plantation">Plantation</SelectItem>
                  <SelectItem value="donation">Donation</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="community">
                    Community Development
                  </SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Thumbnail Image URL */}
            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail Image URL</Label>

              <div className="relative">
                <ImagePlus
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                />

                <Input
                  id="thumbnail"
                  name="thumbnail"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  className="h-12 pl-10"
                />
              </div>

              <p className="text-xs text-gray-400 dark:text-gray-500">
                Provide a valid image URL for your event.
              </p>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Event Location</Label>

              <div className="relative">
                <MapPin
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                />

                <Input
                  id="location"
                  name="location"
                  placeholder="Enter event location"
                  className="h-12 pl-10"
                />
              </div>
            </div>

            {/* Event Date */}
            <div className="space-y-2">
              <Label htmlFor="eventDate">Event Date</Label>

              <div className="relative">
                <CalendarDays
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                />

                <Input
                  id="eventDate"
                  name="eventDate"
                  type="date"
                  min={today}
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="h-12 pl-10"
                />
              </div>

              <p className="text-xs text-gray-400 dark:text-gray-500">
                Select a future date for your event.
              </p>
            </div>

            {/* Submit Button */}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
              <Button
                type="submit"
                disabled={loading}
                className="h-12 w-full bg-[#14A06F] text-base font-semibold hover:bg-[#10875E]"
              >
                <Plus size={19} className="mr-2" />
                {loading ? "Creating Event..." : "Create Event"}
              </Button>
            </div>

          </form>
        </div>
      </div>
    </main>
  );
}