-- Rename degrees table to courses
ALTER TABLE IF EXISTS public.degrees RENAME TO courses;

-- Rename session_degrees to session_courses
ALTER TABLE IF EXISTS public.session_degrees RENAME TO session_courses;

-- Rename session_degree_subjects to session_course_subjects
ALTER TABLE IF EXISTS public.session_degree_subjects RENAME TO session_course_subjects;

-- Rename columns in session_courses
ALTER TABLE IF EXISTS public.session_courses RENAME COLUMN degree_id TO course_id;

-- Rename columns in session_course_subjects
ALTER TABLE IF EXISTS public.session_course_subjects RENAME COLUMN session_degree_id TO session_course_id;
