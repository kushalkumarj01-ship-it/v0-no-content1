-- Enable RLS on equipment table if not already enabled
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all equipment" ON equipment;
DROP POLICY IF EXISTS "Users can insert their own equipment" ON equipment;
DROP POLICY IF EXISTS "Users can update their own equipment" ON equipment;
DROP POLICY IF EXISTS "Users can delete their own equipment" ON equipment;

-- Allow all users to view equipment (for marketplace)
CREATE POLICY "Users can view all equipment" ON equipment
    FOR SELECT USING (true);

-- Allow authenticated users to insert their own equipment
CREATE POLICY "Users can insert their own equipment" ON equipment
    FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- Allow users to update their own equipment
CREATE POLICY "Users can update their own equipment" ON equipment
    FOR UPDATE USING (auth.uid() = owner_id);

-- Allow users to delete their own equipment
CREATE POLICY "Users can delete their own equipment" ON equipment
    FOR DELETE USING (auth.uid() = owner_id);
