import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Revo — Suivi clients pour coachs sportifs",
    short_name: "Revo",
    description:
      "Gérez vos clients, séances, programmes et performances. Pour coachs sportifs et personal trainers.",
    start_url: "/dashboard",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#4f46e5",
    lang: "fr",
    categories: ["fitness", "health", "productivity"],
    icons: [
      {
        src: "/revoLogo.png",
        sizes: "any",
        type: "image/png",
        purpose: "any",
      },
    ],
  }
}
