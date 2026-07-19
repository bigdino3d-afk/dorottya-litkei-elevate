
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text,
  rating smallint NOT NULL DEFAULT 5,
  quote text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.testimonials TO anon, authenticated;
GRANT ALL ON public.testimonials TO service_role;

ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone can read testimonials"
  ON public.testimonials FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "anyone can submit a testimonial"
  ON public.testimonials FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    char_length(trim(name)) BETWEEN 1 AND 80
    AND char_length(trim(quote)) BETWEEN 5 AND 1000
    AND (location IS NULL OR char_length(location) <= 80)
    AND rating BETWEEN 1 AND 5
  );

CREATE POLICY "admins update testimonials"
  ON public.testimonials FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "admins delete testimonials"
  ON public.testimonials FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));
