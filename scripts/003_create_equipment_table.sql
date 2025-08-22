-- Create equipment table for rental listings
CREATE TABLE IF NOT EXISTS public.equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
  equipment_name TEXT NOT NULL,
  equipment_type TEXT NOT NULL CHECK (equipment_type IN ('tractor', 'harvester', 'plough', 'seeder', 'sprayer', 'other')),
  brand TEXT,
  model TEXT,
  year_manufactured INTEGER,
  condition TEXT CHECK (condition IN ('excellent', 'good', 'fair', 'poor')),
  rental_price_per_day DECIMAL(10,2) NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  available BOOLEAN DEFAULT TRUE,
  maintenance_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;

-- RLS Policies for equipment
CREATE POLICY "equipment_select_all" ON public.equipment 
  FOR SELECT USING (true); -- Public read for rental marketplace

CREATE POLICY "equipment_insert_own" ON public.equipment 
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "equipment_update_own" ON public.equipment 
  FOR UPDATE USING (auth.uid() = owner_id);

CREATE POLICY "equipment_delete_own" ON public.equipment 
  FOR DELETE USING (auth.uid() = owner_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_equipment_owner_id ON public.equipment(owner_id);
CREATE INDEX IF NOT EXISTS idx_equipment_available ON public.equipment(available);
CREATE INDEX IF NOT EXISTS idx_equipment_type ON public.equipment(equipment_type);
CREATE INDEX IF NOT EXISTS idx_equipment_location ON public.equipment(location);
