-- PostgreSQL Database Schema for Clyno
-- Smart Deadline & Stress Manager

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS tasks CASCADE;

-- Create tasks table
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT '',
  priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  deadline TIMESTAMP NOT NULL,
  duration INTEGER DEFAULT 2,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_tasks_deadline ON tasks(deadline);
CREATE INDEX idx_tasks_completed ON tasks(completed);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);
CREATE INDEX idx_tasks_priority ON tasks(priority);

-- Add comments for documentation
COMMENT ON TABLE tasks IS 'Stores user tasks with deadlines and completion status';
COMMENT ON COLUMN tasks.id IS 'Unique task identifier';
COMMENT ON COLUMN tasks.title IS 'Task title/description';
COMMENT ON COLUMN tasks.description IS 'Detailed task description';
COMMENT ON COLUMN tasks.priority IS 'Task priority level (low, medium, high)';
COMMENT ON COLUMN tasks.deadline IS 'Task deadline timestamp';
COMMENT ON COLUMN tasks.duration IS 'Estimated duration in hours';
COMMENT ON COLUMN tasks.completed IS 'Task completion status';
COMMENT ON COLUMN tasks.created_at IS 'Task creation timestamp';

-- Made with Bob
