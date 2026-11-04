"use client";

import { useEffect, useState, type FormEvent } from "react";
import { CalendarDays, ImagePlus, MapPin, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

type EventErrors = {
  title?: string;
  description?: string;
  eventType?: string;
  thumbnail?: string;
  location?: string;
  eventDate?: string;
};

const isValidUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export default function CreateEventPage() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [eventDate, setEventDate] = useState("");

  // Today's date for preventing past dates. Computed after mount so the
  // current time isn't read during prerender (Next.js blocking-route guard).
  const [today, setToday] = useState("");

  useEffect(() => {
    setToday(new Date().toLocaleDateString("en-CA"));
  }, []);

  const [eventType, setEventType] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<EventErrors>({});

  const validate = (eventData: {
    title: string;
    description: string;
    eventType: string;
    thumbnail: string;
    location: string;
    eventDate: string;
  }): EventErrors => {
    const nextErrors: EventErrors = {};

    if (!eventData.title) {
      nextErrors.title = "Event title is required.";
    } else if (eventData.title.length < 3) {
      nextErrors.title = "Title must be at least 3 characters.";
    }

    if (!eventData.description) {
      nextErrors.description = "Event description is required.";
    } else if (eventData.description.length < 10) {
      nextErrors.description = "Description must be at least 10 characters.";
    }

    if (!eventData.eventType) {
      nextErrors.eventType = "Please select an event type.";
    }

    if (eventData.thumbnail && !isValidUrl(eventData.thumbnail)) {
      nextErrors.thumbnail = "Please enter a valid http(s) image URL.";
    }

    if (!eventData.location) {
      nextErrors.location = "Event location is required.";
    }

    if (!eventData.eventDate) {
      nextErrors.eventDate = "Event date is required.";
    } else if (eventData.eventDate < today) {
      nextErrors.eventDate = "Event date cannot be in the past.";
    }

    return nextErrors;
  };

  const clearError = (field: keyof EventErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleCreateEvent = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);

    const eventData = {
      title: String(formData.get("title") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim(),
      eventType: eventType,
      thumbnail: String(formData.get("thumbnail") ?? "").trim(),
      location: String(formData.get("location") ?? "").trim(),
      eventDate: eventDate,
    };

    const nextErrors = validate(eventData);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    try {
      setLoading(true);

      // Get JWT Token
      const jwttoken = await authClient.token();

      if (jwttoken.error || !jwttoken.data?.token) {
        toast.error("Please login first!");
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
        toast.success("Event created successfully!");
        form.reset();
        setEventDate("");
        setEventType("");
        setErrors({});
        router.push("/manage-events");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!");
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
          <form onSubmit={handleCreateEvent} className="space-y-6" noValidate>

            {/* Event Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Event Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter your event title"
                aria-invalid={Boolean(errors.title)}
                aria-describedby={errors.title ? "title-error" : undefined}
                onChange={() => clearError("title")}
                className="h-12"
              />
              {errors.title && (
                <p id="title-error" className="text-xs text-red-500">
                  {errors.title}
                </p>
              )}
            </div>

            {/* Event Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Event Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your event and its purpose..."
                rows={5}
                aria-invalid={Boolean(errors.description)}
                aria-describedby={errors.description ? "description-error" : undefined}
                onChange={() => clearError("description")}
                className="resize-none"
              />
              {errors.description && (
                <p id="description-error" className="text-xs text-red-500">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Event Type */}
            <div className="space-y-2">
              <Label htmlFor="eventType">Event Type</Label>

              <Select
                value={eventType}
                onValueChange={(value) => {
                  setEventType(value ?? "");
                  clearError("eventType");
                }}
              >
                <SelectTrigger
                  id="eventType"
                  className="h-12 w-full"
                  aria-invalid={Boolean(errors.eventType)}
                  aria-describedby={errors.eventType ? "eventType-error" : undefined}
                >
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
              {errors.eventType && (
                <p id="eventType-error" className="text-xs text-red-500">
                  {errors.eventType}
                </p>
              )}
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
                  aria-invalid={Boolean(errors.thumbnail)}
                  aria-describedby={errors.thumbnail ? "thumbnail-error" : undefined}
                  onChange={() => clearError("thumbnail")}
                  className="h-12 pl-10"
                />
              </div>

              {errors.thumbnail ? (
                <p id="thumbnail-error" className="text-xs text-red-500">
                  {errors.thumbnail}
                </p>
              ) : (
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Provide a valid image URL for your event.
                </p>
              )}
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
                  aria-invalid={Boolean(errors.location)}
                  aria-describedby={errors.location ? "location-error" : undefined}
                  onChange={() => clearError("location")}
                  className="h-12 pl-10"
                />
              </div>
              {errors.location && (
                <p id="location-error" className="text-xs text-red-500">
                  {errors.location}
                </p>
              )}
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
                  aria-invalid={Boolean(errors.eventDate)}
                  aria-describedby={errors.eventDate ? "eventDate-error" : undefined}
                  onChange={(e) => {
                    setEventDate(e.target.value);
                    clearError("eventDate");
                  }}
                  className="h-12 pl-10"
                />
              </div>

              {errors.eventDate ? (
                <p id="eventDate-error" className="text-xs text-red-500">
                  {errors.eventDate}
                </p>
              ) : (
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Select a future date for your event.
                </p>
              )}
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
