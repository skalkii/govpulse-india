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
    href: "/solar",
    title: "Solar ROI Calculator",
    description: "Rooftop solar payback period by pincode.",
    icon: "☀️",
  },
];

export default function Home() {
  return (
    <div className="space-y-14">
      <section className="space-y-4">
        <h1 className="font-heading text-4xl leading-[1.05] tracking-tight sm:text-6xl">
          Public data,{" "}
          <span className="italic text-primary">made useful</span>.
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
          Free tools built on India&apos;s open government data. No login, no
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
    </div>
  );
}
