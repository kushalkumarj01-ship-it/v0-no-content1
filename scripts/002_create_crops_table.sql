-- Create crops table for marketplace listings
CREATE TABLE IF NOT EXISTS public.crops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  farmer_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
  crop_name TEXT NOT NULL,
  variety TEXT,
  quantity DECIMAL(10,2) NOT NULL, -- in kg or tons
  unit TEXT NOT NULL DEFAULT 'kg' CHECK (unit IN ('kg', 'tons', 'quintals')),
  price_per_unit DECIMAL(10,2) NOT NULL,
  harvest_date DATE,
  expiry_date DATE,
  location TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  quality_grade TEXT CHECK (quality_grade IN ('A', 'B', 'C')),
  organic BOOLEAN DEFAULT FALSE,
  available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.crops ENABLE ROW LEVEL SECURITY;

-- RLS Policies for crops
CREATE POLICY "crops_select_all" ON public.crops 
  FOR SELECT USING (true); -- Public read for marketplace

CREATE POLICY "crops_insert_own" ON public.crops 
  FOR INSERT WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "crops_update_own" ON public.crops 
  FOR UPDATE USING (auth.uid() = farmer_id);

CREATE POLICY "crops_delete_own" ON public.crops 
  FOR DELETE USING (auth.uid() = farmer_id);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_crops_farmer_id ON public.crops(farmer_id);
CREATE INDEX IF NOT EXISTS idx_crops_available ON public.crops(available);
CREATE INDEX IF NOT EXISTS idx_crops_location ON public.crops(location);
