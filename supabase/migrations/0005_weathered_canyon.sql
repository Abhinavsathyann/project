/*
  # Fix message reactions schema

  1. Changes
    - Update reactions column to properly store user reactions
    - Add type definition for reaction structure
    
  2. Schema Details
    - reactions: JSONB column storing reaction data with user information
*/

-- Create a type for reaction user structure
CREATE TYPE reaction_user AS (
  id uuid,
  username text
);

-- Migrate existing reactions to new format
ALTER TABLE messages 
ALTER COLUMN reactions SET DEFAULT '{}'::jsonb;

-- Add policy to allow updating reactions
CREATE POLICY "Users can update message reactions"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);