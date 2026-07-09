ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS location text NOT NULL DEFAULT 'studio_limassol';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS duration_minutes integer NOT NULL DEFAULT 60;
CREATE INDEX IF NOT EXISTS bookings_starts_at_idx ON public.bookings (starts_at);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON public.bookings (status);