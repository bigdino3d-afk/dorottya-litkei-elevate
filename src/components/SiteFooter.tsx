import { Link } from "@tanstack/react-router";
import { Instagram, Music2, Facebook, Mail } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-white/80 mt-32">
      <div className="container-luxe py-24">
        <div className="grid gap-14 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <div className="font-serif text-3xl text-white leading-tight">
              Dorottya <span className="italic text-gold">Litkei</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              Elite Pole Sport coaching in Cyprus. Six-time Hungarian Champion.
              Coach of the Year 2024.
            </p>
            <p className="mt-8 eyebrow text-white/50">Master Yourself.</p>
          </div>

          <div>
            <p className="eyebrow text-white/50 mb-5">Explore</p>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about" className="link-underline">About</Link></li>
              <li><Link to="/services" className="link-underline">Services</Link></li>
              <li><Link to="/booking" className="link-underline">Booking</Link></li>
              <li><Link to="/gallery" className="link-underline">Gallery</Link></li>
              <li><Link to="/blog" className="link-underline">Journal</Link></li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-white/50 mb-5">Studio</p>
            <ul className="space-y-3 text-sm">
              <li><Link to="/projects" className="link-underline">Projects</Link></li>
              <li><Link to="/video-classes" className="link-underline">Video Classes</Link></li>
              <li><Link to="/media-kit" className="link-underline">Media Kit</Link></li>
              <li><Link to="/testimonials" className="link-underline">Testimonials</Link></li>
              <li><Link to="/faq" className="link-underline">FAQ</Link></li>
              <li><Link to="/contact" className="link-underline">Contact</Link></li>
            </ul>
          </div>

          <div>
            <p className="eyebrow text-white/50 mb-5">Contact</p>
            <ul className="space-y-3 text-sm text-white/70">
              <li>MGold Studio</li>
              <li>13–15 Tassou Papadopoulou, 1st floor</li>
              <li>6042 Larnaca, Cyprus</li>
              <li>studio@dorottyalitkei.com</li>
              <li>+36 30 180 5589</li>
            </ul>
            <div className="mt-6 flex items-center gap-4">
              <a href="https://www.instagram.com/_dotti_poleanddance" target="_blank" rel="noreferrer" aria-label="Instagram" className="text-white/60 hover:text-gold transition-colors"><Instagram className="h-4 w-4" /></a>
              <a href="https://www.tiktok.com/@dorottya.23" target="_blank" rel="noreferrer" aria-label="TikTok" className="text-white/60 hover:text-gold transition-colors"><Music2 className="h-4 w-4" /></a>
              <a href="https://www.facebook.com/share/19YCdHhhcJ/" target="_blank" rel="noreferrer" aria-label="Facebook" className="text-white/60 hover:text-gold transition-colors"><Facebook className="h-4 w-4" /></a>
              <a href="mailto:studio@dorottyalitkei.com" aria-label="Email" className="text-white/60 hover:text-gold transition-colors"><Mail className="h-4 w-4" /></a>
            </div>
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between text-xs text-white/40">
          <p>© {new Date().getFullYear()} Dorottya Litkei. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-gold">Privacy</Link>
            <Link to="/terms" className="hover:text-gold">Terms</Link>
            <Link to="/cookies" className="hover:text-gold">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
