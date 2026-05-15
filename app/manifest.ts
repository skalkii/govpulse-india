import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "GovPulse India",
    short_name: "GovPulse",
    description:
      "Free civic-tech tools built on India's open government data.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6efe6",
    theme_color: "#e58a5a",
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.svg", sizes: "180x180", type: "image/svg+xml" },
    ],
  };
}
