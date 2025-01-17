ALTER TABLE messages
ADD COLUMN IF NOT EXISTS file_attachment jsonb,
ADD COLUMN IF NOT EXISTS voice_attachment jsonb;

CREATE POLICY "Users can update their own messages"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);