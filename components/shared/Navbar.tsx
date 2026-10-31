
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Upcoming Events", href: "/upcoming-events" },
  { name: "About Us", href: "/about" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">

       {/* Logo */}
<Link href="/" className="flex items-center">
  <Image
    src="/Image/uddokta-logo.png"
    alt="Kindora Logo"
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

        {/* Desktop Auth Buttons */}
        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/login"
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-[#14532d] transition hover:bg-green-50"
          >
            Sign In
          </Link>

          <Link
            href="/register"
            className="flex items-center gap-2 rounded-full bg-[#14532d] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#166534]"
          >
            Get Started
            <ArrowUpRight size={16} />
          </Link>
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
            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="rounded-full border border-[#14532d] py-3 text-center text-sm font-semibold text-[#14532d]"
            >
              Sign In
            </Link>

            <Link
              href="/register"
              onClick={() => setIsOpen(false)}
              className="rounded-full bg-[#14532d] py-3 text-center text-sm font-semibold text-white"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
