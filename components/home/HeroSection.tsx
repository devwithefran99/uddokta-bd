"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "Small Acts,",
    highlight: "Big Changes.",
    description:
      "Together, we can make our communities stronger. Join hands with people who believe in making a difference.",
    image:
      "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Be The Reason",
    highlight: "Someone Smiles.",
    description:
      "From helping the needy to protecting nature, every little effort can create a better tomorrow.",
    image:
      "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1600&q=80",
  },
  {
    title: "Together We Can",
    highlight: "Change Lives.",
    description:
      "Discover meaningful community events and become part of something bigger than yourself.",
    image:
      "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=1600&q=80",
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const slide = slides[currentSlide];

  return (
    <main>
      {/* Hero Section */}
      <section className="px-4 pt-5 md:px-8 lg:px-12">
        <div
          className="relative mx-auto flex min-h-[480px] max-w-7xl items-center overflow-hidden rounded-3xl bg-cover bg-center md:min-h-[550px] lg:min-h-[600px]"
          style={{
            backgroundImage: `url('${slide.image}')`,
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#064E3B]/90 via-[#14A06F]/50 to-[#F0562F]/30" />

          {/* Hero Content */}
          <div className="relative z-10 max-w-3xl px-6 py-20 text-white sm:px-10 md:px-16">
            <span className="mb-5 inline-block rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-semibold tracking-widest backdrop-blur-sm sm:text-sm">
              TOGETHER FOR A BETTER TOMORROW
            </span>

            <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              {slide.title}
              <br />
              <span >{slide.highlight}</span>
            </h1>

            <p className="mt-5 max-w-xl text-sm leading-7 text-gray-200 sm:text-base md:text-lg">
              {slide.description}
            </p>

            <Link
              href="/upcoming-events"
              className="mt-8 inline-flex items-center gap-3 rounded-full bg-[#14A06F] px-7 py-3.5 text-sm font-bold text-white transition hover:bg-[#10865D] sm:text-base"
            >
              Explore Events
              <ArrowRight size={18} />
            </Link>
          </div>

          {/* Previous Button */}
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white transition hover:bg-[#14A06F] sm:left-6 sm:h-12 sm:w-12"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/20 text-white transition hover:bg-[#14A06F] sm:right-6 sm:h-12 sm:w-12"
          >
            <ChevronRight size={24} />
          </button>

          {/* Slide Indicators */}
          <div className="absolute bottom-7 left-1/2 z-20 flex -translate-x-1/2 gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index
                    ? "w-9 bg-[#F0562F]"
                    : "w-2 bg-white/60"
                }`}
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}