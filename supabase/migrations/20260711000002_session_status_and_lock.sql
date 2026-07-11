ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'upcoming';
ALTER TABLE public.sessions ADD COLUMN IF NOT EXISTS is_locked BOOLEAN DEFAULT false;
UPDATE public.sessions SET status = 'active' WHERE is_active = true;
UPDATE public.sessions SET status = 'closed' WHERE is_active = false;
ALTER TABLE public.sessions DROP COLUMN IF EXISTS is_active;
