-- Add prerequisite_course_id to courses table
ALTER TABLE public.courses 
ADD COLUMN prerequisite_course_id bigint REFERENCES public.courses(id);

-- Optional: Create an index for faster lookups when checking prerequisites
CREATE INDEX idx_courses_prerequisite_course_id ON public.courses(prerequisite_course_id);
