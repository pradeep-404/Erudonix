-- Local PostgreSQL Schema for Cortex

-- 0. Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Enums and Types
-- Drop existing types if they exist to allow clean redeploys
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS request_status CASCADE;
DROP TYPE IF EXISTS service_line_type CASCADE;

CREATE TYPE user_role AS ENUM ('student', 'specialist', 'admin');
CREATE TYPE request_status AS ENUM ('Submitted', 'Matched', 'In progress', 'Ready', 'Delivered');
CREATE TYPE service_line_type AS ENUM ('academic_support', 'small_language_models', 'app_studio');

-- 2. Tables
-- Users credentials table (local auth replacement)
CREATE TABLE public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Email verifications table for OTP signup flow
CREATE TABLE public.email_verifications (
  email VARCHAR(255) PRIMARY KEY,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Profiles table (extends users)
CREATE TABLE public.profiles (
  id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT NOT NULL,
  role user_role DEFAULT 'student'::user_role NOT NULL,
  university TEXT,
  course TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Specialists profile details
CREATE TABLE public.specialists (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  bio TEXT DEFAULT '' NOT NULL,
  subject_specialties TEXT[] DEFAULT '{}'::TEXT[] NOT NULL,
  is_available BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Pricing configurations
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
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
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
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Request Files table
CREATE TABLE public.request_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE NOT NULL,
  uploader_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Directory path relative to public/
  file_size INT NOT NULL,
  file_type TEXT,
  is_delivery BOOLEAN DEFAULT FALSE NOT NULL, -- True if specialist's upload of work
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Messages table
CREATE TABLE public.messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id UUID REFERENCES public.requests(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  message_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Insert default pricing rules
INSERT INTO public.pricing_config (id) VALUES (1) ON CONFLICT DO NOTHING;

-- 3. Triggers and automation
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
$$ LANGUAGE plpgsql;

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
$$ LANGUAGE plpgsql;

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
