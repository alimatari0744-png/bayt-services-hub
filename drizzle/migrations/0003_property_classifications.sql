CREATE TABLE public.property_classifications (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 kind text NOT NULL CHECK (kind IN ('city','type','purpose')),
 label text NOT NULL CHECK (length(trim(label)) BETWEEN 1 AND 100),
 created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(kind,label)
);
GRANT SELECT ON public.property_classifications TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.property_classifications TO authenticated;
GRANT ALL ON public.property_classifications TO service_role;
ALTER TABLE public.property_classifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public classification reads" ON public.property_classifications FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admin classification inserts" ON public.property_classifications FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin classification updates" ON public.property_classifications FOR UPDATE TO authenticated USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE POLICY "admin classification deletes" ON public.property_classifications FOR DELETE TO authenticated USING (public.has_role(auth.uid(),'admin'));
ALTER TABLE public.services ADD COLUMN city_id uuid REFERENCES public.property_classifications(id) ON DELETE RESTRICT;
ALTER TABLE public.services ADD COLUMN property_type_id uuid REFERENCES public.property_classifications(id) ON DELETE RESTRICT;
ALTER TABLE public.services ADD COLUMN purpose_id uuid REFERENCES public.property_classifications(id) ON DELETE RESTRICT;
CREATE FUNCTION public.validate_property_classification() RETURNS trigger LANGUAGE plpgsql SET search_path=public AS $$
BEGIN
 IF NEW.city_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM public.property_classifications WHERE id=NEW.city_id AND kind='city') THEN RAISE EXCEPTION 'Invalid city classification'; END IF;
 IF NEW.property_type_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM public.property_classifications WHERE id=NEW.property_type_id AND kind='type') THEN RAISE EXCEPTION 'Invalid type classification'; END IF;
 IF NEW.purpose_id IS NOT NULL AND NOT EXISTS(SELECT 1 FROM public.property_classifications WHERE id=NEW.purpose_id AND kind='purpose') THEN RAISE EXCEPTION 'Invalid purpose classification'; END IF;
 RETURN NEW;
END;
$$;
CREATE TRIGGER validate_property_classification BEFORE INSERT OR UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.validate_property_classification();