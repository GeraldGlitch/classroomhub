-- Add resource_type to resources table
ALTER TABLE resources ADD COLUMN IF NOT EXISTS resource_type TEXT DEFAULT 'LINK';
