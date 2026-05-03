-- Migration: Add description and priority fields to tasks table
-- Run this to update existing database

\c clyno_db;

-- Add description column
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS description TEXT DEFAULT '';

-- Add priority column
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS priority VARCHAR(20) DEFAULT 'medium' 
CHECK (priority IN ('low', 'medium', 'high'));

-- Create index on priority for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);

-- Display updated table structure
\d tasks;

-- Made with Bob