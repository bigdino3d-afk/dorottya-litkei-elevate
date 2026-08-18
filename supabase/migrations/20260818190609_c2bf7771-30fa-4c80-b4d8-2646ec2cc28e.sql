CREATE TABLE public.videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  thumbnail_url text,
  video_url text,
  preview_url text,
  duration_label text,
  level text,
  price_cents integer NOT NULL DEFAULT 500,
  currency text NOT NULL DEFAULT 'EUR',
  sort_order integer NOT NULL DEFAULT 0,
  published boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.videos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.videos TO authenticated;
GRANT ALL ON public.videos TO service_role;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view published videos" ON public.videos FOR SELECT USING (published = true OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins manage videos" ON public.videos FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER videos_set_updated_at BEFORE UPDATE ON public.videos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.availability_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  weekday smallint NOT NULL UNIQUE CHECK (weekday BETWEEN 0 AND 6),
  open_minute integer NOT NULL DEFAULT 540 CHECK (open_minute BETWEEN 0 AND 1440),
  close_minute integer NOT NULL DEFAULT 1200 CHECK (close_minute BETWEEN 0 AND 1440),
  closed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.availability_rules TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.availability_rules TO authenticated;
GRANT ALL ON public.availability_rules TO service_role;
ALTER TABLE public.availability_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view hours" ON public.availability_rules FOR SELECT USING (true);
CREATE POLICY "Admins manage hours" ON public.availability_rules FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER availability_rules_set_updated_at BEFORE UPDATE ON public.availability_rules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.availability_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  starts_at timestamptz NOT NULL,
  ends_at timestamptz NOT NULL,
  reason text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.availability_blocks TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.availability_blocks TO authenticated;
GRANT ALL ON public.availability_blocks TO service_role;
ALTER TABLE public.availability_blocks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view blocked times" ON public.availability_blocks FOR SELECT USING (true);
CREATE POLICY "Admins manage blocked times" ON public.availability_blocks FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER availability_blocks_set_updated_at BEFORE UPDATE ON public.availability_blocks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.availability_rules (weekday, open_minute, close_minute, closed) VALUES
  (0, 540, 1200, true),
  (1, 540, 1200, false),
  (2, 540, 1200, false),
  (3, 540, 1200, false),
  (4, 540, 1200, false),
  (5, 540, 1200, false),
  (6, 600, 1080, false);