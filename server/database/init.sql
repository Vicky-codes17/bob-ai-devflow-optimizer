-- Clyno Database Initialization Script
-- PostgreSQL Database Setup

-- Create database (run this separately if needed)
-- CREATE DATABASE clyno_db;

-- Connect to the database
\c clyno_db;

-- Drop existing tables if they exist
DROP TABLE IF EXISTS tasks CASCADE;

-- Create tasks table
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  deadline TIMESTAMP NOT NULL,
  duration DECIMAL(5,2) DEFAULT 2,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);
CREATE INDEX idx_tasks_priority ON tasks(priority);

-- Add sample data for testing (optional)
INSERT INTO tasks (title, description, priority, deadline, duration, completed) VALUES
  ('Complete project documentation', 'Write comprehensive documentation for the project', 'high', NOW() + INTERVAL '2 days', 3, FALSE),
  ('Review code changes', 'Review and approve pending pull requests', 'medium', NOW() + INTERVAL '1 day', 2, FALSE),
  ('Prepare presentation', 'Create slides for the upcoming demo', 'medium', NOW() + INTERVAL '3 days', 4, FALSE);

-- Display created tables
\dt

-- Display sample data
SELECT * FROM tasks;

-- Made with Bob