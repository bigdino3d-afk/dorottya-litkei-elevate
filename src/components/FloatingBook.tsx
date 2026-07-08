import { Link } from "@tanstack/react-router";
import { Calendar } from "lucide-react";

export function FloatingBook() {
  return (
    <Link
      to="/booking"
      className="fixed bottom-6 right-6 z-40 md:bottom-8 md:right-8 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-[0.68rem] tracking-[0.22em] uppercase text-white shadow-luxe hover:bg-gold hover:text-ink transition-all duration-500 animate-fade-in-slow"
    >
      <Calendar className="h-3.5 w-3.5" />
      Book
    </Link>
  );
}
