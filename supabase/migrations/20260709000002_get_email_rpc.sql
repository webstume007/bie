CREATE OR REPLACE FUNCTION public.get_email_by_cnic(p_cnic VARCHAR)
RETURNS VARCHAR AS $$
DECLARE
  v_email VARCHAR;
BEGIN
  SELECT u.email INTO v_email
  FROM auth.users u
  JOIN public.user_profiles p ON u.id = p.id
  WHERE p.cnic = p_cnic;
  
  RETURN v_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
