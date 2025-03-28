-- Create table for fitness course registrations
CREATE TABLE IF NOT EXISTS fitness_course_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL REFERENCES fitness_courses(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'confirmed', -- 'confirmed', 'cancelled', 'attended'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_fitness_course_registrations_course_id ON fitness_course_registrations(course_id);

