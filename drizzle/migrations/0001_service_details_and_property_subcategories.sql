ALTER TABLE public.services ADD COLUMN subcategory text NOT NULL DEFAULT '', ADD COLUMN specifications text NOT NULL DEFAULT '', ADD COLUMN map_url text;
COMMENT ON COLUMN public.services.subcategory IS 'Owner-entered subcategory within the four real estate primary categories';
COMMENT ON COLUMN public.services.specifications IS 'Full service specifications displayed on the detail page';