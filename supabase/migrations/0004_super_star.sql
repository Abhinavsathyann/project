/*
  # Add reply support to messages table

  1. Changes
    - Add `reply_to` column to store the ID of the message being replied to
    - Add `reply_to_content` to store a snapshot of the replied message content
    - Add `reply_to_username` to store the username of the replied message author

  2. Security
    - No changes to RLS policies needed as the existing ones cover the new columns
*/

DO $$ 
BEGIN
  -- Add reply_to column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'messages' AND column_name = 'reply_to'
  ) THEN
    ALTER TABLE messages 
    ADD COLUMN reply_to uuid REFERENCES messages(id),
    ADD COLUMN reply_to_content text,
    ADD COLUMN reply_to_username text;
  END IF;
END $$;