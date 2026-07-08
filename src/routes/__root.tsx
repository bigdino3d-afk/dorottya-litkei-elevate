import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader } from "../components/SiteHeader";
import { SiteFooter } from "../components/SiteFooter";
import { FloatingBook } from "../components/FloatingBook";

function NotFoundComponent() {
  return (
    <div className="min-h-screen grid place-items-center bg-cream px-6">
      <div className="max-w-md text-center">
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-6 font-serif text-6xl md:text-7xl">Lost in motion.</h1>
        <p className="mt-6 text-sm text-muted-foreground leading-relaxed">
          The page you're looking for has drifted off the mat. Let's guide you back.
        </p>
        <Link to="/" className="btn-luxe btn-luxe-hover mt-10">Return home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="min-h-screen grid place-items-center bg-background px-6">
      <div className="max-w-md text-center">
        <p className="eyebrow">Something broke</p>
        <h1 className="mt-6 font-serif text-4xl md:text-5xl">This page didn't load</h1>
        <p className="mt-4 text-sm text-muted-foreground">Try again or head back home.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="btn-luxe btn-luxe-hover"
          >
            Try again
          </button>
          <a href="/" className="btn-luxe btn-luxe-hover" style={{ background: "transparent", color: "var(--ink)" }}>
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Dorottya Litkei — Elite Pole Sport Coach" },
      {
        name: "description",
        content:
          "Master Strength. Master Control. Master Yourself. Elite Pole Sport coaching by six-time Hungarian Champion Dorottya Litkei — private lessons, workshops, and competition preparation in Cyprus.",
      },
      { name: "author", content: "Dorottya Litkei" },
      { name: "theme-color", content: "#ffffff" },
      { property: "og:site_name", content: "Dorottya Litkei" },
      { property: "og:title", content: "Dorottya Litkei — Elite Pole Sport Coach" },
      {
        property: "og:description",
        content: "Elite Pole Sport coaching in Cyprus. Private lessons, workshops, competition preparation.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Dorottya Litkei",
          jobTitle: "Professional Pole Sport Coach",
          address: { "@type": "PostalAddress", addressLocality: "Limassol", addressCountry: "CY" },
          knowsAbout: ["Pole Sport", "Strength Training", "Mobility", "Competition Preparation"],
          award: ["6x Hungarian Champion", "Coach of the Year 2024"],
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const transparentHeader = pathname === "/";

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col">
        <SiteHeader transparent={transparentHeader} />
        <main className="flex-1">
          <Outlet />
        </main>
        <SiteFooter />
        <FloatingBook />
      </div>
    </QueryClientProvider>
  );
}
