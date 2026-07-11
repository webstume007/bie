-- Add admission_close_date to sessions table
ALTER TABLE sessions 
ADD COLUMN admission_close_date DATE;

-- Add have_single_fee_till_close to session_courses table
ALTER TABLE session_courses
ADD COLUMN have_single_fee_till_close BOOLEAN DEFAULT false;
