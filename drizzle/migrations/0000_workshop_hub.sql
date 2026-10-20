
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

CREATE TABLE public.workshop_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  city text NOT NULL DEFAULT '',
  country text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  hero_eyebrow text,
  headline text,
  intro text,
  credentials jsonb NOT NULL DEFAULT '[]'::jsonb,
  instructor_heading text,
  instructor_bio text,
  hosting_heading text,
  hosting_text text,
  currency text NOT NULL DEFAULT 'EUR',
  timezone text NOT NULL DEFAULT 'Europe/Athens',
  locale text NOT NULL DEFAULT 'en-GB',
  languages text[] NOT NULL DEFAULT '{en}',
  translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workshop_pages TO authenticated;
GRANT ALL ON public.workshop_pages TO service_role;
ALTER TABLE public.workshop_pages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage workshop pages" ON public.workshop_pages FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER workshop_pages_touch BEFORE UPDATE ON public.workshop_pages FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.workshops (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid REFERENCES public.workshop_pages(id) ON DELETE SET NULL,
  category text NOT NULL DEFAULT 'acrobatic' CHECK (category IN ('acrobatic','spinning','other')),
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  booking_open boolean NOT NULL DEFAULT false,
  title text NOT NULL,
  tagline text,
  description text,
  skill_level text,
  prerequisites text,
  learning_objectives text,
  duration text,
  capacity integer,
  requirements text,
  dates text,
  booking_deadline text,
  venue text,
  location text,
  price_amount numeric(10,2),
  currency text NOT NULL DEFAULT 'EUR',
  price_note text,
  video_url text,
  booking_url text,
  contact_email text,
  published_fields text[] NOT NULL DEFAULT '{}',
  translations jsonb NOT NULL DEFAULT '{}'::jsonb,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workshops TO authenticated;
GRANT ALL ON public.workshops TO service_role;
ALTER TABLE public.workshops ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage workshops" ON public.workshops FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER workshops_touch BEFORE UPDATE ON public.workshops FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.workshop_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id uuid REFERENCES public.workshops(id) ON DELETE SET NULL,
  category text NOT NULL DEFAULT 'general' CHECK (category IN ('acrobatic','spinning','general')),
  asset_type text NOT NULL DEFAULT 'other',
  title text NOT NULL,
  description text,
  instructions text,
  language text NOT NULL DEFAULT 'en',
  storage_path text,
  file_name text,
  mime_type text,
  size_bytes bigint,
  width integer,
  height integer,
  preview_path text,
  text_content text,
  visibility text NOT NULL DEFAULT 'restricted' CHECK (visibility IN ('public','restricted')),
  published boolean NOT NULL DEFAULT false,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.workshop_assets TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workshop_assets TO authenticated;
GRANT ALL ON public.workshop_assets TO service_role;
ALTER TABLE public.workshop_assets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone reads public published assets" ON public.workshop_assets FOR SELECT TO anon, authenticated
  USING (visibility = 'public' AND published = true);
CREATE POLICY "Admins manage assets" ON public.workshop_assets FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER workshop_assets_touch BEFORE UPDATE ON public.workshop_assets FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.studio_access (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_name text NOT NULL,
  contact_name text,
  contact_email text,
  token text NOT NULL UNIQUE,
  code_hash text NOT NULL,
  categories text[] NOT NULL DEFAULT '{}',
  asset_ids uuid[] NOT NULL DEFAULT '{}',
  expires_at timestamptz,
  revoked_at timestamptz,
  last_opened_at timestamptz,
  open_count integer NOT NULL DEFAULT 0,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.studio_access TO authenticated;
GRANT ALL ON public.studio_access TO service_role;
ALTER TABLE public.studio_access ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage studio access" ON public.studio_access FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER studio_access_touch BEFORE UPDATE ON public.studio_access FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.workshop_inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_slug text,
  studio_name text NOT NULL,
  contact_name text NOT NULL,
  email text NOT NULL,
  phone text,
  workshop_type text NOT NULL,
  participants text,
  preferred_dates text,
  message text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','confirmed','closed')),
  emailed boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.workshop_inquiries TO authenticated;
GRANT ALL ON public.workshop_inquiries TO service_role;
ALTER TABLE public.workshop_inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins read inquiries" ON public.workshop_inquiries FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins update inquiries" ON public.workshop_inquiries FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete inquiries" ON public.workshop_inquiries FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage settings" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER site_settings_touch BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE OR REPLACE FUNCTION public.workshop_public_json(w public.workshops)
RETURNS jsonb LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object('id', w.id, 'category', w.category, 'booking_open', w.booking_open, 'currency', w.currency, 'sort_order', w.sort_order, 'title', w.title)
    || COALESCE((SELECT jsonb_object_agg(e.key, e.value) FROM jsonb_each(to_jsonb(w)) e
                 WHERE e.key = ANY(w.published_fields)
                   AND e.key NOT IN ('id','page_id','status','published_fields','translations','created_at','updated_at')), '{}'::jsonb)
    || jsonb_build_object('translations', COALESCE((
         SELECT jsonb_object_agg(t.key, COALESCE((SELECT jsonb_object_agg(f.key, f.value) FROM jsonb_each(t.value) f WHERE f.key = ANY(w.published_fields) OR f.key = 'title'), '{}'::jsonb))
         FROM jsonb_each(CASE WHEN jsonb_typeof(w.translations) = 'object' THEN w.translations ELSE '{}'::jsonb END) t
         WHERE jsonb_typeof(t.value) = 'object'), '{}'::jsonb));
$$;
REVOKE EXECUTE ON FUNCTION public.workshop_public_json(public.workshops) FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.get_public_workshop_page(_slug text)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
DECLARE p public.workshop_pages;
BEGIN
  SELECT * INTO p FROM public.workshop_pages WHERE slug = _slug AND status = 'published';
  IF NOT FOUND THEN RETURN NULL; END IF;
  RETURN jsonb_build_object(
    'page', to_jsonb(p) - 'status',
    'workshops', COALESCE((SELECT jsonb_agg(public.workshop_public_json(w) ORDER BY w.sort_order, w.created_at)
                           FROM public.workshops w WHERE w.page_id = p.id AND w.status = 'published'), '[]'::jsonb)
  );
END $$;
GRANT EXECUTE ON FUNCTION public.get_public_workshop_page(text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.is_public_asset_object(_name text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.workshop_assets a
                 WHERE a.visibility = 'public' AND a.published = true
                   AND (a.storage_path = _name OR a.preview_path = _name));
$$;
GRANT EXECUTE ON FUNCTION public.is_public_asset_object(text) TO anon, authenticated;

CREATE POLICY "Workshop assets: public objects readable" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'workshop-assets' AND public.is_public_asset_object(name));
CREATE POLICY "Workshop assets: admins read" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'workshop-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Workshop assets: admins upload" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'workshop-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Workshop assets: admins update" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'workshop-assets' AND public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Workshop assets: admins delete" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'workshop-assets' AND public.has_role(auth.uid(), 'admin'));

INSERT INTO public.workshop_pages (slug, city, country, status, hero_eyebrow, headline, intro, credentials, instructor_heading, instructor_bio, hosting_heading, hosting_text, currency, timezone, locale, languages)
VALUES ('athens', 'Athens', 'Greece', 'published',
  'International Workshops · Athens, Greece',
  'Train with a European Champion.',
  'Dorottya Litkei is bringing two specialist pole sport workshops to Athens — one dedicated to acrobatic pole tricks, one to the spinning pole — organised in collaboration with local studios.',
  '["European Champion","Six-time Hungarian Champion","Over 10 years of coaching experience","International competitor, instructor and judge"]'::jsonb,
  'The instructor',
  'Dorottya Litkei is a European Champion and six-time Hungarian Champion who has competed, taught and judged internationally. With more than ten years of coaching experience, she brings the precision of a competitive athlete and the patience of an experienced teacher to every workshop — breaking complex movement down into clear, safe, achievable steps.',
  'Host a workshop at your studio',
  'Workshops are organised in collaboration with local studios. Tell us about your studio and your students, and Dorottya''s management will come back to you with availability, formats and the next steps. Partner studios receive a ready-to-publish Studio Marketing Kit to promote the workshop on their own channels.',
  'EUR', 'Europe/Athens', 'en-GB', '{en}');

INSERT INTO public.workshops (page_id, category, status, title, tagline, description, learning_objectives, published_fields, sort_order)
SELECT id, 'acrobatic', 'published', 'Acrobatic Pole Tricks',
  'Strength · Technique · Controlled execution',
  'A specialist workshop dedicated to pole acrobatics — the strength, technique and transitions behind tricks, with a constant focus on clean, controlled execution. Taught from the perspective of an experienced competitive athlete and instructor.',
  E'Pole acrobatics and tricks\nStrength for acrobatic work\nTechnique and body positioning\nTransitions between elements\nControlled, safe execution',
  '{tagline,description,learning_objectives}', 1
FROM public.workshop_pages WHERE slug = 'athens';

INSERT INTO public.workshops (page_id, category, status, title, tagline, description, learning_objectives, published_fields, sort_order)
SELECT id, 'spinning', 'published', 'Spinning Pole',
  'Control · Flow · Musicality',
  'A workshop devoted to the spinning pole — movement control, dynamic combinations, transitions and fluidity. An opportunity to develop technique, musicality and confidence on a spinning pole.',
  E'Spinning-pole technique\nMovement and momentum control\nDynamic combinations\nTransitions and fluidity\nMusicality and confidence',
  '{tagline,description,learning_objectives}', 2
FROM public.workshop_pages WHERE slug = 'athens';
