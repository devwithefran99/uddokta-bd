
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const galleryImages = [
  {
    id: 1,
    title: "Community Development",
    category: "Community",
    image:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800",
  },
  {
    id: 2,
    title: "Tree Plantation",
    category: "Environment",
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
  },
  {
    id: 3,
    title: "Helping People",
    category: "Volunteering",
    image:
      "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800",
  },
  {
    id: 4,
    title: "Educational Program",
    category: "Education",
    image:
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800",
  },
  {
    id: 5,
    title: "Clean Environment",
    category: "Environment",
    image:
      "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800",
  },
  {
    id: 6,
    title: "Medical Support",
    category: "Healthcare",
    image:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
  },
];

export default function GallerySection() {
  return (
    <section className="bg-white py-16 md:py-20 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <span className="mb-3 inline-block rounded-full bg-[#14A06F]/10 px-4 py-2 text-sm font-semibold text-[#14A06F]">
              Our Memories
            </span>

            <h2 className="text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
              Moments That <span className="text-[#14A06F]">Matter</span>
            </h2>

            <p className="mt-3 max-w-xl text-gray-500 dark:text-gray-400">
              Explore the moments, people, and stories that make our community
              stronger and more meaningful.
            </p>
          </div>

          <Link
            href="/upcoming-events"
            className="inline-flex items-center gap-2 font-semibold text-[#14A06F] transition hover:gap-3"
          >
            Explore Events
            <ArrowUpRight size={18} />
          </Link>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {galleryImages.map((item) => (
            <div
              key={item.id}
              className="group relative h-64 overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800 sm:h-72"
            >
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-110"
              />

              {/* Image Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

              {/* Image Information */}
              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="mb-2 inline-block rounded-full bg-[#F0562F] px-3 py-1 text-xs font-semibold text-white">
                  {item.category}
                </span>

                <h3 className="text-xl font-bold text-white">
                  {item.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
