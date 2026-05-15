import { ToolCard } from "@/components/ToolCard";

const modules = [
  {
    href: "/aqi",
    title: "AQI Now & Next 24h",
    description: "Live air quality + simple forecast for any Indian city.",
    icon: "🌬️",
  },
  {
    href: "/rivers",
    title: "River Health Check",
    description: "Water quality at CPCB monitoring stations near you.",
    icon: "🌊",
  },
  {
    href: "/rainfall",
    title: "Rainfall Anomaly",
    description: "Is this monsoon unusual? Compare to district history.",
    icon: "🌧️",
  },
  {
    href: "/tolls",
    title: "Highway Toll Calculator",
    description: "Estimate toll cost for a route, by vehicle class.",
    icon: "🚗",
  },
  {
    href: "/black-spots",
    title: "Accident Black-Spots",
    description: "Dangerous stretches on national highways, mapped.",
    icon: "⚠️",
  },
  {
    href: "/solar",
    title: "Solar ROI Calculator",
    description: "Rooftop solar payback period by pincode.",
    icon: "☀️",
  },
];

const external = [
  {
    href: "https://mandibazar-jade.vercel.app/",
    title: "Mandi Prices",
    description: "Real-time agricultural mandi prices across India.",
    icon: "🌾",
    external: true,
  },
  {
    href: "https://spraypredict.vercel.app/",
    title: "Spray Window Predictor",
    description: "Optimal pesticide spraying schedule by weather.",
    icon: "💧",
    external: true,
  },
];

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Public data, made useful.
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
          Six free tools built on India&apos;s open government data. No login, no
          tracking, no fluff — just answers.
        </p>
      </section>

      <section>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((m) => (
            <ToolCard key={m.href} {...m} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-medium tracking-wide text-muted-foreground uppercase">
            More tools from this builder
          </h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {external.map((m) => (
            <ToolCard key={m.href} {...m} />
          ))}
        </div>
      </section>
    </div>
  );
}
