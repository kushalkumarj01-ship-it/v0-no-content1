-- Create bookings table for equipment rentals
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id UUID NOT NULL REFERENCES public.equipment(id) ON DELETE CASCADE,
  renter_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INTEGER NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bookings
CREATE POLICY "bookings_select_involved" ON public.bookings 
  FOR SELECT USING (auth.uid() = renter_id OR auth.uid() = owner_id);

CREATE POLICY "bookings_insert_renter" ON public.bookings 
  FOR INSERT WITH CHECK (auth.uid() = renter_id);

CREATE POLICY "bookings_update_involved" ON public.bookings 
  FOR UPDATE USING (auth.uid() = renter_id OR auth.uid() = owner_id);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bookings_equipment_id ON public.bookings(equipment_id);
CREATE INDEX IF NOT EXISTS idx_bookings_renter_id ON public.bookings(renter_id);
CREATE INDEX IF NOT EXISTS idx_bookings_owner_id ON public.bookings(owner_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
