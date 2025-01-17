/*
  # Add reactions column to messages table

  1. Changes
    - Add `reactions` column to `messages` table as JSONB with default empty object
    - This column will store message reactions (emoji -> user_ids[])

  2. Security
    - No additional security policies needed as the existing ones cover this column
*/

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' AND column_name = 'reactions'
  ) THEN
    ALTER TABLE messages ADD COLUMN reactions JSONB DEFAULT '{}'::jsonb;
  END IF;
END $$;