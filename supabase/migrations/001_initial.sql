-- SnapWed Database Schema
-- Run this in Supabase SQL Editor

-- =====================================================
-- PROFILES (extends auth.users)
-- =====================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'starter', 'premium')),
  weddings_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- WEDDINGS
-- =====================================================
CREATE TABLE IF NOT EXISTS weddings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  date DATE NOT NULL,
  venue TEXT,
  greeting_text TEXT,
  tasks JSONB DEFAULT '[]',
  cover_image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  max_photos_per_guest INTEGER DEFAULT 15,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- GUEST SESSIONS
-- =====================================================
CREATE TABLE IF NOT EXISTS guest_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE NOT NULL,
  guest_name TEXT,
  photos_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PHOTOS
-- =====================================================
CREATE TABLE IF NOT EXISTS photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE NOT NULL,
  guest_session_id UUID REFERENCES guest_sessions(id) ON DELETE SET NULL,
  storage_path TEXT NOT NULL,
  thumbnail_path TEXT,
  task_id TEXT,
  is_approved BOOLEAN DEFAULT true,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_photos_wedding_id ON photos(wedding_id);
CREATE INDEX IF NOT EXISTS idx_photos_guest_session ON photos(guest_session_id);
CREATE INDEX IF NOT EXISTS idx_weddings_slug ON weddings(slug);
CREATE INDEX IF NOT EXISTS idx_weddings_owner ON weddings(owner_id);
CREATE INDEX IF NOT EXISTS idx_guest_sessions_wedding ON guest_sessions(wedding_id);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE weddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE guest_sessions ENABLE ROW LEVEL SECURITY;

-- Profiles: Users own their profile
CREATE POLICY "Users own their profile" ON profiles
  FOR ALL USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Weddings: Owners can do everything
CREATE POLICY "Users manage their weddings" ON weddings
  FOR ALL USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);

-- Weddings: Anyone can view active weddings (for guest pages)
CREATE POLICY "Anyone can view active wedding" ON weddings
  FOR SELECT USING (is_active = true);

-- Guest sessions: Anyone can create (for guest registration)
CREATE POLICY "Anyone can create guest session" ON guest_sessions
  FOR INSERT WITH CHECK (true);

-- Guest sessions: Owners can view
CREATE POLICY "Owners view guest sessions" ON guest_sessions
  FOR SELECT USING (
    wedding_id IN (SELECT id FROM weddings WHERE owner_id = auth.uid())
  );

-- Guest sessions: Users can update their own session
CREATE POLICY "Users update own session" ON guest_sessions
  FOR UPDATE USING (true);

-- Photos: Anyone can insert (guests upload)
CREATE POLICY "Anyone can upload photos" ON photos
  FOR INSERT WITH CHECK (true);

-- Photos: Owners can view their wedding photos
CREATE POLICY "Owners view photos" ON photos
  FOR SELECT USING (
    wedding_id IN (SELECT id FROM weddings WHERE owner_id = auth.uid())
  );

-- Photos: Owners can update photos
CREATE POLICY "Owners update photos" ON photos
  FOR UPDATE USING (
    wedding_id IN (SELECT id FROM weddings WHERE owner_id = auth.uid())
  );

-- Photos: Guests can view their own
CREATE POLICY "Guests view own photos" ON photos
  FOR SELECT USING (true);

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('photos', 'photos', false, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('covers', 'covers', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage policies for photos bucket
CREATE POLICY "Anyone can upload to photos bucket" ON storage.objects
  FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'photos');

CREATE POLICY "Anyone can read from photos bucket" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'photos');

CREATE POLICY "Users delete own photos" ON storage.objects
  FOR DELETE TO authenticated USING (
    bucket_id = 'photos' AND 
    (storage.foldername(name))[1] IN (
      SELECT slug FROM weddings WHERE owner_id = auth.uid()
    )
  );

-- Storage policies for covers bucket
CREATE POLICY "Anyone can read covers" ON storage.objects
  FOR SELECT TO anon, authenticated USING (bucket_id = 'covers');

CREATE POLICY "Authenticated can upload covers" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'covers');

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update wedding count
CREATE OR REPLACE FUNCTION public.update_wedding_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE profiles SET weddings_count = weddings_count + 1 WHERE id = NEW.owner_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE profiles SET weddings_count = weddings_count - 1 WHERE id = OLD.owner_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for wedding count
DROP TRIGGER IF EXISTS on_wedding_change ON weddings;
CREATE TRIGGER on_wedding_change
  AFTER INSERT OR DELETE ON weddings
  FOR EACH ROW EXECUTE FUNCTION public.update_wedding_count();

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON TABLE profiles IS 'Wedding owners profile extending auth.users';
COMMENT ON TABLE weddings IS 'Wedding events';
COMMENT ON TABLE guest_sessions IS 'Guest sessions for photo uploads';
COMMENT ON TABLE photos IS 'Uploaded photos from guests';
