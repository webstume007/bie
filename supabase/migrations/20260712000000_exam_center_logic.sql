ALTER TABLE public.institutes
ADD COLUMN IF NOT EXISTS is_exam_center BOOLEAN DEFAULT FALSE;

ALTER TABLE public.students
ADD COLUMN IF NOT EXISTS institute_id BIGINT REFERENCES public.institutes(id);
