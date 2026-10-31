
import {
  CalendarDays,
  Users,
  MapPin,
  HeartHandshake,
} from "lucide-react";

const stats = [
  {
    id: 1,
    title: "Events Organized",
    value: "50+",
    description: "Meaningful events completed",
    icon: CalendarDays,
    color: "#14A06F",
    bg: "bg-[#14A06F]/10",
  },
  {
    id: 2,
    title: "Active Volunteers",
    value: "1,200+",
    description: "People making a difference",
    icon: Users,
    color: "#F0562F",
    bg: "bg-[#F0562F]/10",
  },
  {
    id: 3,
    title: "Communities",
    value: "24+",
    description: "Communities connected",
    icon: MapPin,
    color: "#14A06F",
    bg: "bg-[#14A06F]/10",
  },
  {
    id: 4,
    title: "Lives Impacted",
    value: "2,000+",
    description: "Lives touched by kindness",
    icon: HeartHandshake,
    color: "#F0562F",
    bg: "bg-[#F0562F]/10",
  },
];

const ImpactStats = () => {
  return (
    <section className="px-4 py-16 md:px-8 lg:px-12 lg:py-20">
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <span className="mb-3 inline-block rounded-full bg-[#14A06F]/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#14A06F]">
            Our Community Impact
          </span>

          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            Together, We Make
            <span className="text-[#14A06F]"> A Difference</span>
          </h2>

          <p className="mt-4 text-sm leading-7 text-gray-500 sm:text-base">
            Every small contribution creates a bigger change.
            See how our community is working together to build
            a better tomorrow.
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.id}
                className="group rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg sm:p-7"
              >
                {/* Icon */}
                <div
                  className={`mx-auto flex h-14 w-14 items-center justify-center rounded-2xl ${stat.bg} transition duration-300 group-hover:scale-110`}
                >
                  <Icon
                    size={27}
                    style={{ color: stat.color }}
                    strokeWidth={1.8}
                  />
                </div>

                {/* Number */}
                <h3
                  className="mt-5 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-4xl"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </h3>

                {/* Title */}
                <h4 className="mt-2 text-sm font-bold text-gray-800 sm:text-base">
                  {stat.title}
                </h4>

                {/* Description */}
                <p className="mt-2 text-xs leading-5 text-gray-500 sm:text-sm">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Message */}
        <div className="mt-8 rounded-2xl bg-gradient-to-r from-[#14A06F]/10 via-white to-[#F0562F]/10 px-5 py-5 text-center">
          <p className="text-sm font-semibold text-gray-700 sm:text-base">
            Be part of the change.{" "}
            <span className="text-[#14A06F]">
              Your contribution matters!
            </span>
          </p>
        </div>

      </div>
    </section>
  );
};

export default ImpactStats;
