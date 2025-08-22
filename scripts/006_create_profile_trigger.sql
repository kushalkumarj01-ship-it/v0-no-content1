-- Auto-create farmer profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.farmers (id, full_name, phone, location, preferred_language)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'full_name', 'New Farmer'),
    COALESCE(new.raw_user_meta_data ->> 'phone', null),
    COALESCE(new.raw_user_meta_data ->> 'location', 'India'),
    COALESCE(new.raw_user_meta_data ->> 'preferred_language', 'en')
  )
  ON CONFLICT (id) DO NOTHING;

  RETURN new;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
