"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { ImageIcon, Mail, Pencil, Save, User, X } from "lucide-react";
import { toast } from "react-toastify";

import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProfileErrors = {
  name?: string;
  email?: string;
  photoURL?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const urlPattern = /^https?:\/\/\S+$/i;

export default function ProfilePage() {
  const { data: session, isPending, refetch } = authClient.useSession();

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [errors, setErrors] = useState<ProfileErrors>({});

  const user = session?.user;

  // While editing, the preview follows the input; otherwise it follows the session.
  const previewPhoto = isEditing ? photoURL.trim() : (user?.image ?? "");
  const initial = user?.name?.charAt(0).toUpperCase() || "U";

  const validate = (values: {
    name: string;
    email: string;
    photoURL: string;
  }): ProfileErrors => {
    const nextErrors: ProfileErrors = {};

    if (!values.name) {
      nextErrors.name = "Full name is required.";
    } else if (values.name.length < 2) {
      nextErrors.name = "Name must be at least 2 characters.";
    }

    if (!values.email) {
      nextErrors.email = "Email is required.";
    } else if (!emailPattern.test(values.email)) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (values.photoURL && !urlPattern.test(values.photoURL)) {
      nextErrors.photoURL = "Please enter a valid image URL (http or https).";
    }

    return nextErrors;
  };

  const clearError = (field: keyof ProfileErrors) => {
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const startEditing = () => {
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setPhotoURL(user?.image ?? "");
    setErrors({});
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setErrors({});
    setIsEditing(false);
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const values = {
      name: name.trim(),
      email: email.trim(),
      photoURL: photoURL.trim(),
    };

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    if (!user) return;

    const nameChanged = values.name !== (user.name ?? "");
    const imageChanged = values.photoURL !== (user.image ?? "");
    const emailChanged =
      values.email.toLowerCase() !== (user.email ?? "").toLowerCase();

    if (!nameChanged && !imageChanged && !emailChanged) {
      setIsEditing(false);
      return;
    }

    setSaving(true);
    try {
      if (nameChanged || imageChanged) {
        const { error } = await authClient.updateUser({
          ...(nameChanged ? { name: values.name } : {}),
          ...(imageChanged ? { image: values.photoURL || null } : {}),
        });

        if (error) {
          toast.error(error.message || "Failed to update your profile.");
          return;
        }
      }

      if (emailChanged) {
        const { error } = await authClient.changeEmail({
          newEmail: values.email,
        });

        if (error) {
          toast.error(error.message || "Failed to update your email.");
          return;
        }
      }

      await refetch();

      // changeEmail answers with success even when the address is taken, so
      // confirm the change against the database before reporting success.
      if (emailChanged) {
        const { data: fresh } = await authClient.getSession({
          query: { disableCookieCache: true },
        });

        if (fresh?.user?.email?.toLowerCase() !== values.email.toLowerCase()) {
          toast.error(
            "That email address is already in use. Your other changes were saved."
          );
          setIsEditing(false);
          return;
        }
      }

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong!";

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  if (isPending) {
    return (
      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 py-12">
        <p className="text-gray-500 dark:text-gray-400">Loading profile...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-[calc(100vh-80px)] flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-gray-950 px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Please sign in
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          You need an account to view your profile.
        </p>
        <Link
          href="/signin"
          className="rounded-lg bg-[#14A06F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#10875E]"
        >
          Go to Sign In
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-[calc(100vh-80px)] bg-gray-50 px-4 py-12 dark:bg-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8">
          <span className="inline-block rounded-full bg-[#14A06F]/10 px-4 py-2 text-sm font-semibold text-[#14A06F]">
            My Account
          </span>

          <h1 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-3 text-gray-500 dark:text-gray-400">
            View your account details and keep your information up to date.
          </p>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900 sm:p-8">
          <div className="flex flex-col items-center gap-4 border-b border-gray-100 pb-6 text-center dark:border-gray-800 sm:flex-row sm:text-left">
            <Avatar className="h-24 w-24 border-4 border-[#14A06F]/20">
              {previewPhoto ? (
                <AvatarImage src={previewPhoto} alt={user.name} />
              ) : null}
              <AvatarFallback className="bg-[#14A06F] text-2xl text-white">
                {initial}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {user.name}
              </h2>
              <p className="truncate text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </p>
            </div>
          </div>

          {isEditing ? (
            <form className="mt-6 space-y-5" onSubmit={handleSave} noValidate>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    clearError("name");
                  }}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  className="h-12"
                />
                {errors.name && (
                  <p id="name-error" className="text-xs text-red-500">
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    clearError("email");
                  }}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className="h-12"
                />
                {errors.email && (
                  <p id="email-error" className="text-xs text-red-500">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="photoURL">
                  Profile Photo URL{" "}
                  <span className="text-gray-400 dark:text-gray-500">
                    (optional)
                  </span>
                </Label>
                <div className="relative">
                  <ImageIcon
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  />
                  <Input
                    id="photoURL"
                    name="photoURL"
                    type="url"
                    value={photoURL}
                    placeholder="https://example.com/photo.jpg"
                    onChange={(event) => {
                      setPhotoURL(event.target.value);
                      clearError("photoURL");
                    }}
                    aria-invalid={Boolean(errors.photoURL)}
                    aria-describedby={
                      errors.photoURL ? "photoURL-error" : "photoURL-hint"
                    }
                    className="h-12 pl-10"
                  />
                </div>
                {errors.photoURL ? (
                  <p id="photoURL-error" className="text-xs text-red-500">
                    {errors.photoURL}
                  </p>
                ) : (
                  <p id="photoURL-hint" className="text-xs text-gray-400 dark:text-gray-500">
                    Leave blank to use the default avatar.
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 border-t border-gray-100 pt-6 dark:border-gray-800 sm:flex-row">
                <Button
                  type="submit"
                  disabled={saving}
                  className="h-12 flex-1 bg-[#14A06F] text-base font-semibold text-white hover:bg-[#10875E]"
                >
                  <Save size={18} className="mr-2" />
                  {saving ? "Saving..." : "Save Changes"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  disabled={saving}
                  onClick={cancelEditing}
                  className="h-12 flex-1 text-base font-semibold"
                >
                  <X size={18} className="mr-2" />
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                <User size={18} className="shrink-0 text-[#14A06F]" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Full Name
                  </p>
                  <p className="truncate font-medium text-gray-900 dark:text-white">
                    {user.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                <Mail size={18} className="shrink-0 text-[#14A06F]" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Email Address
                  </p>
                  <p className="truncate font-medium text-gray-900 dark:text-white">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-gray-100 p-4 dark:border-gray-800">
                <ImageIcon size={18} className="shrink-0 text-[#14A06F]" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Profile Photo URL
                  </p>
                  <p className="truncate font-medium text-gray-900 dark:text-white">
                    {user.image || "Not set"}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                onClick={startEditing}
                className="mt-2 h-12 w-full bg-[#14A06F] text-base font-semibold text-white hover:bg-[#10875E]"
              >
                <Pencil size={18} className="mr-2" />
                Edit Profile
              </Button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
