ALTER TABLE public.students 
ADD COLUMN IF NOT EXISTS name_urdu VARCHAR,
ADD COLUMN IF NOT EXISTS father_name_urdu VARCHAR,
ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR,
ADD COLUMN IF NOT EXISTS email VARCHAR,
ADD COLUMN IF NOT EXISTS current_institute_name VARCHAR,
ADD COLUMN IF NOT EXISTS institute_address TEXT,
ADD COLUMN IF NOT EXISTS near_examination_center VARCHAR;

ALTER TABLE public.exam_applications
ADD COLUMN IF NOT EXISTS attestation_status VARCHAR DEFAULT 'not_required',
ADD COLUMN IF NOT EXISTS attestation_notes TEXT;
