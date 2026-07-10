-- Rename degree_subjects table to course_subjects
ALTER TABLE IF EXISTS public.degree_subjects RENAME TO course_subjects;

-- Rename column in course_subjects
ALTER TABLE IF EXISTS public.course_subjects RENAME COLUMN degree_id TO course_id;

-- Rename column in enrollments
ALTER TABLE IF EXISTS public.enrollments RENAME COLUMN degree_id TO course_id;
