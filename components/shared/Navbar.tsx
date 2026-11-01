
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import {
  Menu,
  X,
  ArrowUpRight,
  User,
  LogOut,
  PlusCircle,
  CalendarDays,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { toast } from "react-toastify";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Upcoming Events", href: "/upcoming-events" },
  { name: "About Us", href: "/about" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();

  // Logout Function
  const handleLogout = async () => {
    const { error } = await authClient.signOut();

    if (error) {
      toast.error("Logout failed!");
    } else {
      toast.success("Logged out successfully!");
      setIsOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image
            src="/Image/uddokta-logo.png"
            alt="Uddokta-BD Logo"
            width={180}
            height={60}
            priority
            className="h-12 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-gray-600 transition-colors duration-200 hover:text-[#14532d]"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Desktop Authentication */}
        <div className="hidden items-center gap-3 md:flex">

          {!isPending && (
            session ? (
              <div className="group relative">

                {/* Profile Avatar */}
                <button
                  type="button"
                  className="flex items-center gap-2 rounded-full outline-none"
                  title={session.user.name}
                >
                  <Avatar className="h-10 w-10 border-2 border-[#14532d]">
                    <AvatarImage
                      src={session.user.image || ""}
                      alt={session.user.name}
                    />

                    <AvatarFallback className="bg-[#14532d] text-white">
                      {session.user.name?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <span className="text-sm font-semibold text-gray-700">
                    {session.user.name}
                  </span>
                </button>

                {/* Hover Dropdown */}
                <div className="invisible absolute right-0 top-full z-50 w-52 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">

                  <div className="rounded-xl border border-gray-100 bg-white p-2 shadow-lg">

                    <p className="px-3 py-2 text-sm font-semibold text-gray-800">
                      {session.user.name}
                    </p>

                    <hr className="my-1" />

                    <Link
                      href="/create-event"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-green-50"
                    >
                      <PlusCircle size={16} />
                      Create Event
                    </Link>

                    <Link
                      href="/manage-events"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-green-50"
                    >
                      <CalendarDays size={16} />
                      Manage Events
                    </Link>

                    <Link
                      href="/joined-events"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-green-50"
                    >
                      <User size={16} />
                      Joined Events
                    </Link>

                    <hr className="my-1" />

                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>

                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#14532d] transition hover:bg-green-50"
                >
                  Sign In
                </Link>

                <Link
                  href="/signup"
                  className="flex items-center gap-2 rounded-full bg-[#14532d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#166534]"
                >
                  Sign Up
                  <ArrowUpRight size={16} />
                </Link>
              </>
            )
          )}

        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-lg p-2 text-[#14532d] transition hover:bg-green-50 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={25} /> : <Menu size={25} />}
        </button>

      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-gray-100 bg-white px-5 py-5 shadow-lg md:hidden">

          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-green-50 hover:text-[#14532d]"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4">

            {!isPending && (
              session ? (
                <>
                  {/* Mobile User Profile */}
                  <div className="flex items-center gap-3 px-3 py-2">
                    <Avatar className="h-10 w-10 border-2 border-[#14532d]">
                      <AvatarImage
                        src={session.user.image || ""}
                        alt={session.user.name}
                      />
                      <AvatarFallback className="bg-[#14532d] text-white">
                        {session.user.name?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <span className="text-sm font-semibold text-gray-700">
                      {session.user.name}
                    </span>
                    
                  </div>

                  <Link
                    href="/create-event"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-green-50"
                  >
                    <PlusCircle size={17} />
                    Create Event
                  </Link>

                  <Link
                    href="/manage-events"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-green-50"
                  >
                    <CalendarDays size={17} />
                    Manage Events
                  </Link>

                  <Link
                    href="/joined-events"
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-green-50"
                  >
                    <User size={17} />
                    Joined Events
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 rounded-full border border-red-200 py-3 text-sm font-semibold text-red-500 hover:bg-red-50"
                  >
                    <LogOut size={17} />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/signin"
                    onClick={() => setIsOpen(false)}
                    className="rounded-full border border-[#14532d] py-3 text-center text-sm font-semibold text-[#14532d]"
                  >
                    Sign In
                  </Link>

                  <Link
                    href="/signup"
                    onClick={() => setIsOpen(false)}
                    className="rounded-full bg-[#14532d] py-3 text-center text-sm font-semibold text-white"
                  >
                    Get Started
                  </Link>
                </>
              )
            )}

          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
