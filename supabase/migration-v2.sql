-- Add fail_count to difficult_words
ALTER TABLE difficult_words ADD COLUMN IF NOT EXISTS fail_count INTEGER DEFAULT 1;
