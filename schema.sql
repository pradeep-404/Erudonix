-- Supabase Database Schema for Cortex

-- 1. Enums and Types
CREATE TYPE user_role AS ENUM ('student', 'specialist', 'admin');
CREATE TYPE request_status AS ENUM ('Submitted', 'Matched', 'In progress', 'Ready', 'Delivered');
CREATE TYPE service_line_type AS ENUM ('academic_support', 'small_language_models', 'app_studio');

-- 2. Tables
-- Profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  role user_role DEFAULT 'student'::user_role NOT NULL,
  university TEXT,
  course TEXT,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Specialists profile details
CREATE TABLE public.specialists (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  bio TEXT DEFAULT '' NOT NULL,
  subject_specialties TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  is_available BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Pricing configurations (Admin only can edit)
CREATE TABLE public.pricing_config (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  base_rate_usd NUMERIC DEFAULT 20.00 NOT NULL,
  base_rate_eur NUMERIC DEFAULT 20.00 NOT NULL,
  base_rate_aud NUMERIC DEFAULT 20.00 NOT NULL,
  academic_support_multiplier NUMERIC DEFAULT 1.00 NOT NULL,
  slm_multiplier NUMERIC DEFAULT 1.50 NOT NULL,
  app_studio_multiplier NUMERIC DEFAULT 2.00 NOT NULL,
  price_per_word_usd NUMERIC DEFAULT 0.05 NOT NULL,
  price_per_word_eur NUMERIC DEFAULT 0.05 NOT NULL,
  price_per_word_aud NUMERIC DEFAULT 0.05 NOT NULL,
  price_per_page_usd NUMERIC DEFAULT 15.00 NOT NULL,
  price_per_page_eur NUMERIC DEFAULT 15.00 NOT NULL,
  price_per_page_aud NUMERIC DEFAULT 15.00 NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Requests table
CREATE TABLE public.requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  specialist_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  service_line service_line_type NOT NULL,
  service_type TEXT NOT NULL,
  subject_code TEXT,
  deadline TIMESTAMPTZ NOT NULL,
  estimated_length TEXT,
  description TEXT NOT NULL,
  coupon_code TEXT,
  currency TEXT CHECK (currency IN ('USD', 'EUR', 'AUD')) NOT NULL,
  price NUMERIC NOT NULL,
  price_approved BOOLEAN DEFAULT FALSE NOT NULL,
  status request_status DEFAULT 'Submitted'::request_status NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Request Files table
CREATE TABLE public.request_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE NOT NULL,
  uploader_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Storage path
  file_size INT NOT NULL,
  file_type TEXT,
  is_delivery BOOLEAN DEFAULT FALSE NOT NULL, -- True if specialist's upload of work
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Messages table
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  message_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Insert default pricing
INSERT INTO public.pricing_config (id) VALUES (1) ON CONFLICT DO NOTHING;

-- 3. Security Helper Functions (security definer to avoid RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'admin'::user_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.is_specialist(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = user_id AND role = 'specialist'::user_role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.can_access_request(request_id UUID, user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.requests
    WHERE id = request_id
      AND (student_id = user_id OR specialist_id = user_id OR public.is_admin(user_id))
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Triggers
-- Auth signup trigger to automatically build profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  assigned_role user_role := 'student'::user_role;
BEGIN
  -- Promote a designated email as admin for ease of setup
  IF new.email = 'admin@cortex.com' THEN
    assigned_role := 'admin'::user_role;
  ELSIF new.email = 'tutor@cortex.com' THEN
    assigned_role := 'specialist'::user_role;
  ELSIF new.email = 'student@cortex.com' THEN
    assigned_role := 'student'::user_role;
  ELSIF new.email LIKE '%@cortex.com' THEN
    -- Automatically make employees specialists
    assigned_role := 'specialist'::user_role;
  END IF;

  INSERT INTO public.profiles (id, full_name, role, university, course)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'New Member'),
    assigned_role,
    NULL,
    NULL
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Profile update trigger to sync specialist details
CREATE OR REPLACE FUNCTION public.sync_specialist_profile()
RETURNS TRIGGER AS $$
BEGIN
  IF new.role = 'specialist'::user_role AND old.role != 'specialist'::user_role THEN
    INSERT INTO public.specialists (id, bio, subject_specialties, is_available)
    VALUES (new.id, 'Cortex Specialist', '{}'::TEXT[], TRUE)
    ON CONFLICT (id) DO NOTHING;
  ELSIF new.role != 'specialist'::user_role AND old.role = 'specialist'::user_role THEN
    DELETE FROM public.specialists WHERE id = new.id;
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_sync_specialist_profile
  AFTER UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.sync_specialist_profile();

-- Automatic specialist assignment (free-slot queue with lowest active requests load)
CREATE OR REPLACE FUNCTION public.assign_specialist_to_request()
RETURNS TRIGGER AS $$
DECLARE
  assigned_specialist_id UUID;
BEGIN
  IF new.specialist_id IS NULL THEN
    -- Find available specialist with the lowest active request count
    SELECT s.id INTO assigned_specialist_id
    from public.specialists s
    left join public.requests r on r.specialist_id = s.id and r.status != 'Delivered'::request_status
    where s.is_available = true
    group by s.id
    order by count(r.id) asc, s.created_at asc
    limit 1;

    IF assigned_specialist_id IS NOT NULL THEN
      new.specialist_id := assigned_specialist_id;
      new.status := 'Matched'::request_status;
    ELSE
      -- Remains 'Submitted' if no specialists are free
      new.status := 'Submitted'::request_status;
    END IF;
  END IF;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_assign_specialist_to_request
  BEFORE INSERT ON public.requests
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_specialist_to_request();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  new.updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

CREATE TRIGGER tr_update_requests_updated_at
  BEFORE UPDATE ON public.requests
  FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();

-- 5. Row-Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.specialists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pricing_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.request_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Profiles are selectable by authenticated users"
  ON public.profiles FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "Profiles are editable by owners or admins"
  ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id OR public.is_admin(auth.uid()));

-- Specialists Policies
CREATE POLICY "Specialist details are readable by all authenticated users"
  ON public.specialists FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "Specialist details are editable by owner or admin"
  ON public.specialists FOR UPDATE TO authenticated USING (id = auth.uid() OR public.is_admin(auth.uid()));

-- Pricing Config Policies
CREATE POLICY "Pricing config is readable by everyone"
  ON public.pricing_config FOR SELECT TO authenticated USING (TRUE);

CREATE POLICY "Pricing config is editable by admins only"
  ON public.pricing_config FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Requests Policies
CREATE POLICY "Requests are viewable by owner, assigned specialist, or admin"
  ON public.requests FOR SELECT TO authenticated
  USING (student_id = auth.uid() OR specialist_id = auth.uid() OR public.is_admin(auth.uid()));

CREATE POLICY "Students can insert their own requests"
  ON public.requests FOR INSERT TO authenticated
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Requests can be updated by student (own), specialist (assigned), or admin"
  ON public.requests FOR UPDATE TO authenticated
  USING (student_id = auth.uid() OR specialist_id = auth.uid() OR public.is_admin(auth.uid()));

-- Request Files Policies
CREATE POLICY "Request files are viewable by student, assigned specialist, or admin"
  ON public.request_files FOR SELECT TO authenticated
  USING (public.can_access_request(request_id, auth.uid()));

CREATE POLICY "Request files are uploadable by student, assigned specialist, or admin"
  ON public.request_files FOR INSERT TO authenticated
  WITH CHECK (public.can_access_request(request_id, auth.uid()));

CREATE POLICY "Request files are deletable by uploader or admin"
  ON public.request_files FOR DELETE TO authenticated
  USING (uploader_id = auth.uid() OR public.is_admin(auth.uid()));

-- Messages Policies
CREATE POLICY "Messages are viewable by student, assigned specialist, or admin"
  ON public.messages FOR SELECT TO authenticated
  USING (public.can_access_request(request_id, auth.uid()));

CREATE POLICY "Messages are sendable by student, assigned specialist, or admin"
  ON public.messages FOR INSERT TO authenticated
  WITH CHECK (public.can_access_request(request_id, auth.uid()) AND sender_id = auth.uid());

-- 6. Storage Configuration & Policies
-- Note: Make sure to create a bucket named 'request-files' in Supabase Storage.
CREATE POLICY "Files are accessible only by authorized participants"
  ON storage.objects FOR ALL TO authenticated
  USING (
    bucket_id = 'request-files' AND
    public.can_access_request(split_part(name, '/', 1)::UUID, auth.uid())
  );
