ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS affiliation_fee DECIMAL;
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS affiliation_renew_fee DECIMAL;
ALTER TABLE public.institutes ADD COLUMN IF NOT EXISTS affiliation_expiry_date DATE;
