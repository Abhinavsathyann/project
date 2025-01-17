/*
  # Create storage bucket for chat files

  1. Storage
    - Create 'chat-files' bucket for storing uploaded files
    - Enable public access for file downloads
  
  2. Security
    - Allow authenticated users to upload files
    - Allow public access to read files
*/

-- Create the storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('chat-files', 'chat-files', true);

-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated users to upload files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'chat-files');

-- Allow public access to read files
CREATE POLICY "Allow public to read files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'chat-files');