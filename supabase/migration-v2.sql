-- Words Vault: general word bank per teacher (visible to all students)
CREATE TABLE words_vault (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
  word TEXT NOT NULL,
  pronunciation TEXT,
  meaning TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE words_vault ENABLE ROW LEVEL SECURITY;

CREATE POLICY "vault_teacher_all" ON words_vault
  FOR ALL USING (auth.uid() = teacher_id);

CREATE POLICY "vault_public_read" ON words_vault
  FOR SELECT USING (true);
