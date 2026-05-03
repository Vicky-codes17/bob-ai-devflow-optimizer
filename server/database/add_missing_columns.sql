-- Migration: Add missing columns to tasks table
-- This script adds description and priority columns if they don't exist

-- Add description column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tasks' AND column_name = 'description'
    ) THEN
        ALTER TABLE tasks ADD COLUMN description TEXT;
        RAISE NOTICE 'Added description column';
    END IF;
END $$;

-- Add priority column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tasks' AND column_name = 'priority'
    ) THEN
        ALTER TABLE tasks ADD COLUMN priority VARCHAR(20) DEFAULT 'medium';
        RAISE NOTICE 'Added priority column';
    END IF;
END $$;

-- Update duration column type if needed (from INTEGER to DECIMAL)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'tasks' 
        AND column_name = 'duration' 
        AND data_type = 'integer'
    ) THEN
        ALTER TABLE tasks ALTER COLUMN duration TYPE DECIMAL(5,2);
        RAISE NOTICE 'Updated duration column type to DECIMAL';
    END IF;
END $$;

-- Verify the changes
SELECT 
    column_name, 
    data_type, 
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'tasks'
ORDER BY ordinal_position;

-- Made with Bob
