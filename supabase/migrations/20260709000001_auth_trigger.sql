-- Seed roles
INSERT INTO public.roles (name) VALUES ('super_admin'), ('clerk'), ('institute'), ('student') ON CONFLICT (name) DO NOTHING;

-- Make full_name and other fields nullable for initial signup
ALTER TABLE public.user_profiles ALTER COLUMN full_name DROP NOT NULL;

-- Trigger Function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_role_id BIGINT;
  v_role_name VARCHAR;
  v_cnic VARCHAR;
BEGIN
  v_role_name := NEW.raw_user_meta_data->>'role';
  v_cnic := NEW.raw_user_meta_data->>'cnic';
  
  -- If role is not provided, default to 'student'
  IF v_role_name IS NULL THEN
    v_role_name := 'student';
  END IF;

  SELECT id INTO v_role_id FROM public.roles WHERE name = v_role_name;

  INSERT INTO public.user_profiles (id, cnic, full_name, role_id)
  VALUES (
    NEW.id,
    v_cnic,
    NEW.raw_user_meta_data->>'full_name',
    v_role_id
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
