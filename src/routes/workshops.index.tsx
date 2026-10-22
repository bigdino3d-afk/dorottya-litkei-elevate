import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/workshops/")({
  beforeLoad: () => {
    throw redirect({ to: "/workshops/$slug", params: { slug: "athens" }, statusCode: 302 });
  },
  head: () => ({
    meta: [
      { title: "International Pole Workshops — Dorottya Litkei" },
      { name: "description", content: "International pole sport workshops with European Champion Dorottya Litkei." },
      { property: "og:title", content: "International Pole Workshops — Dorottya Litkei" },
      { property: "og:description", content: "Acrobatic Pole Tricks and Spinning Pole workshops with Dorottya Litkei." },
    ],
  }),
});
