import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Atlas — Personal Intelligence Feed",
    short_name: "Atlas",
    description: "Everything the web knows, ranked for you",
    start_url: "/feed",
    display: "standalone",
    background_color: "hsl(220, 22%, 4%)",
    theme_color: "hsl(220, 22%, 4%)",
    orientation: "portrait-primary",
    categories: ["news", "productivity", "education"],
    icons: [
      {
        src: "/icons/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
      },
      {
        src: "/icons/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
    shortcuts: [
      {
        name: "Feed",
        url: "/feed",
      },
      {
        name: "Explore",
        url: "/explore",
      },
      {
        name: "Library",
        url: "/library",
      },
    ],
  };
}
