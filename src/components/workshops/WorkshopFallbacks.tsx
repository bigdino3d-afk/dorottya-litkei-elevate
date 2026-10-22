import { Link, useRouter, type ErrorComponentProps } from "@tanstack/react-router";

export function WorkshopMissing() {
  return (
    <section className="min-h-[70vh] grid place-items-center bg-cream px-6 pt-24">
      <div className="max-w-md text-center">
        <p className="eyebrow">Workshops</p>
        <h1 className="mt-6 font-serif text-4xl md:text-5xl">This workshop page isn't available yet.</h1>
        <p className="mt-5 text-sm text-muted-foreground">It may not have been published. Get in touch to hear about upcoming workshops.</p>
        <Link to="/contact" className="btn-luxe btn-luxe-hover mt-10">Contact</Link>
      </div>
    </section>
  );
}

export function WorkshopLoadError({ reset }: ErrorComponentProps) {
  const router = useRouter();
  return (
    <section className="min-h-[70vh] grid place-items-center bg-cream px-6 pt-24">
      <div className="max-w-md text-center">
        <p className="eyebrow">Workshops</p>
        <h1 className="mt-6 font-serif text-4xl">The page didn't load.</h1>
        <button onClick={() => { router.invalidate(); reset(); }} className="btn-luxe btn-luxe-hover mt-10">Try again</button>
      </div>
    </section>
  );
}
