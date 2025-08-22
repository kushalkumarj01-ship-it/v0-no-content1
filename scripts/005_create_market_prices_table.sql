-- Create market prices table for analytics
CREATE TABLE IF NOT EXISTS public.market_prices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  crop_name TEXT NOT NULL,
  location TEXT NOT NULL,
  price_per_unit DECIMAL(10,2) NOT NULL,
  unit TEXT NOT NULL DEFAULT 'kg',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  source TEXT DEFAULT 'user_reported',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS - public read for market data
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "market_prices_select_all" ON public.market_prices 
  FOR SELECT USING (true);

CREATE POLICY "market_prices_insert_authenticated" ON public.market_prices 
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Create indexes for analytics queries
CREATE INDEX IF NOT EXISTS idx_market_prices_crop_location ON public.market_prices(crop_name, location);
CREATE INDEX IF NOT EXISTS idx_market_prices_date ON public.market_prices(date);
