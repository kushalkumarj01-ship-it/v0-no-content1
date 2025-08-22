-- Create farmers profile table
CREATE TABLE IF NOT EXISTS public.farmers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  location TEXT NOT NULL,
  farm_size DECIMAL(10,2), -- in acres
  farming_experience INTEGER, -- years
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'hi')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;

-- RLS Policies for farmers
CREATE POLICY "farmers_select_own" ON public.farmers 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "farmers_insert_own" ON public.farmers 
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "farmers_update_own" ON public.farmers 
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "farmers_delete_own" ON public.farmers 
  FOR DELETE USING (auth.uid() = id);

-- Allow public read access for marketplace browsing
CREATE POLICY "farmers_public_read" ON public.farmers 
  FOR SELECT USING (true);
