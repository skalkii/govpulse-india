import { ToolCard } from "@/components/ToolCard";
import { getDict } from "@/lib/i18n/server";

export default async function Home() {
  const t = await getDict();

  const modules = [
    {
      href: "/aqi",
      title: t.modules.aqi.title,
      description: t.modules.aqi.description,
      icon: "🌬️",
    },
    {
      href: "/rivers",
      title: t.modules.rivers.title,
      description: t.modules.rivers.description,
      icon: "🌊",
    },
    {
      href: "/rainfall",
      title: t.modules.rainfall.title,
      description: t.modules.rainfall.description,
      icon: "🌧️",
    },
    {
      href: "/solar",
      title: t.modules.solar.title,
      description: t.modules.solar.description,
      icon: "☀️",
    },
  ];

  return (
    <div className="space-y-14">
      <section className="space-y-4">
        <h1 className="font-heading text-[2.25rem] leading-[1.05] tracking-tight sm:text-6xl">
          {t.landing.titlePrefix}{" "}
          <span className="italic text-primary">{t.landing.titleAccent}</span>.
        </h1>
        <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
          {t.landing.tagline}
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
