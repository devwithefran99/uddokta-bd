

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Linkedin, Mail, MapPin } from "lucide-react";

// Evaluate once per server start instead of during render; `new Date()` inside
// a component blocks prerendering when cacheComponents is enabled.
const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">

          {/* Brand */}
          <div>
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

            <p className="mt-4 max-w-sm text-sm leading-7 text-gray-400">
              Connecting people, creating opportunities, and building
              stronger communities through meaningful social events.
            </p>

            <div className="mt-5 flex gap-4">
              <a href="#" aria-label="Facebook" className="transition hover:text-[#14A06F]">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="transition hover:text-[#14A06F]">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="LinkedIn" className="transition hover:text-[#14A06F]">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="transition hover:text-[#14A06F]">Home</Link></li>
              <li><Link href="/upcoming-events" className="transition hover:text-[#14A06F]">Upcoming Events</Link></li>
              <li><Link href="/login" className="transition hover:text-[#14A06F]">Sign In</Link></li>
              <li><Link href="/register" className="transition hover:text-[#14A06F]">Get Started</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-lg font-semibold text-white">
              Contact Us
            </h3>

            <div className="space-y-4 text-sm">
              <p className="flex items-center gap-3">
                <Mail size={18} className="shrink-0 text-[#14A06F]" />
                info@uddoktabd.com
              </p>

              <p className="flex items-center gap-3">
                <MapPin size={18} className="shrink-0 text-[#14A06F]" />
                Bangladesh
              </p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
          © {currentYear} Uddokta-BD. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
