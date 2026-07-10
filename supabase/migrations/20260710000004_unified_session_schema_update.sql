DROP TRIGGER IF EXISTS on_session_degree_deadline_update ON public.session_courses;
DROP FUNCTION IF EXISTS public.update_unpaid_challans_on_deadline_change();

-- Move deadlines to sessions
ALTER TABLE public.sessions
  ADD COLUMN IF NOT EXISTS single_fee_date DATE,
  ADD COLUMN IF NOT EXISTS double_fee_date DATE,
  ADD COLUMN IF NOT EXISTS triple_fee_date DATE;

-- Update session_courses to drop deadlines and add fees, plus mandatory count
ALTER TABLE public.session_courses
  DROP COLUMN IF EXISTS single_fee_deadline CASCADE,
  DROP COLUMN IF EXISTS double_fee_deadline CASCADE,
  DROP COLUMN IF EXISTS triple_fee_deadline CASCADE,
  DROP COLUMN IF EXISTS base_fee CASCADE,
  ADD COLUMN IF NOT EXISTS single_fee DECIMAL,
  ADD COLUMN IF NOT EXISTS double_fee DECIMAL,
  ADD COLUMN IF NOT EXISTS triple_fee DECIMAL,
  ADD COLUMN IF NOT EXISTS mandatory_electives_count INT DEFAULT 0;
