-- Create these functions in your Supabase SQL editor

-- Function to create users table
CREATE OR REPLACE FUNCTION create_users_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL DEFAULT 'guest',
    status TEXT NOT NULL DEFAULT 'active',
    last_login TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Insert a default admin user
  INSERT INTO users (name, email, role, status)
  VALUES ('Admin User', 'admin@example.com', 'admin', 'active')
  ON CONFLICT (email) DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Function to create houses table
CREATE OR REPLACE FUNCTION create_houses_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS houses (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    capacity INTEGER NOT NULL,
    price NUMERIC NOT NULL,
    image_url TEXT,
    dogs_allowed BOOLEAN DEFAULT FALSE,
    sea_view BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Insert sample house data
  INSERT INTO houses (name, description, capacity, price, dogs_allowed, sea_view)
  VALUES 
    ('Deluxe Cottage', 'A beautiful cozy accommodation with 2 bedrooms and modern amenities.', 2, 150, true, false),
    ('Premium Villa', 'A spacious villa with 3 bedrooms and a private garden.', 3, 250, false, true)
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Function to create amenities tables
CREATE OR REPLACE FUNCTION create_amenities_tables()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS amenities (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    icon TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  CREATE TABLE IF NOT EXISTS house_amenities (
    id SERIAL PRIMARY KEY,
    house_id INTEGER REFERENCES houses(id) ON DELETE CASCADE,
    amenity_id INTEGER REFERENCES amenities(id) ON DELETE CASCADE,
    UNIQUE(house_id, amenity_id)
  );
  
  -- Insert sample amenities
  INSERT INTO amenities (name, icon)
  VALUES 
    ('WiFi', 'wifi'),
    ('Coffee Machine', 'coffee'),
    ('TV', 'tv'),
    ('Fireplace', 'flame'),
    ('Private Garden', 'tree'),
    ('Balcony', 'home')
  ON CONFLICT (name) DO NOTHING;
  
  -- Link amenities to houses
  INSERT INTO house_amenities (house_id, amenity_id)
  SELECT 1, id FROM amenities WHERE name IN ('WiFi', 'Coffee Machine', 'TV')
  ON CONFLICT DO NOTHING;
  
  INSERT INTO house_amenities (house_id, amenity_id)
  SELECT 2, id FROM amenities WHERE name IN ('WiFi', 'TV', 'Balcony', 'Private Garden')
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Function to create bookings table
CREATE OR REPLACE FUNCTION create_bookings_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    house_id INTEGER REFERENCES houses(id) ON DELETE CASCADE,
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    guests INTEGER NOT NULL,
    total_price NUMERIC NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    payment_status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
END;
$$ LANGUAGE plpgsql;

-- Function to create menu tables
CREATE OR REPLACE FUNCTION create_menu_tables()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS menu_categories (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  CREATE TABLE IF NOT EXISTS menu_items (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES menu_categories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    price TEXT NOT NULL,
    is_vegan BOOLEAN DEFAULT FALSE,
    is_lactose_free BOOLEAN DEFAULT FALSE,
    is_gluten_free BOOLEAN DEFAULT FALSE,
    image TEXT,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Insert sample menu categories
  INSERT INTO menu_categories (name, description, order_index)
  VALUES 
    ('Vorspeisen', 'Unsere köstlichen Vorspeisen', 0),
    ('Hauptgerichte', 'Traditionelle Hauptgerichte', 1),
    ('Desserts', 'Süße Versuchungen', 2)
  ON CONFLICT DO NOTHING;
  
  -- Insert sample menu items
  INSERT INTO menu_items (category_id, name, description, price, is_vegan, is_lactose_free, is_gluten_free, order_index)
  VALUES 
    (1, 'Gemischter Salat', 'Frischer Salat mit Hausdressing', '€6.90', true, true, true, 0),
    (1, 'Tomatensuppe', 'Cremige Tomatensuppe mit Basilikum', '€5.50', true, false, true, 1),
    (2, 'Wiener Schnitzel', 'Klassisches Wiener Schnitzel mit Kartoffelsalat', '€18.90', false, false, false, 0),
    (2, 'Gemüsepfanne', 'Saisonales Gemüse aus der Region', '€14.50', true, true, true, 1),
    (3, 'Apfelstrudel', 'Hausgemachter Apfelstrudel mit Vanilleeis', '€7.90', false, false, false, 0)
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Function to create events tables
CREATE OR REPLACE FUNCTION create_events_tables()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    price TEXT,
    image TEXT,
    capacity INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  CREATE TABLE IF NOT EXISTS event_reservations (
    id SERIAL PRIMARY KEY,
    event_id INTEGER REFERENCES events(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    contact_info TEXT NOT NULL,
    attendees INTEGER NOT NULL,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Insert sample event
  INSERT INTO events (title, description, date, time, price, capacity)
  VALUES (
    'Weinprobe im Mühlenkeller',
    'Erleben Sie einen Abend mit ausgewählten Weinen aus der Region und passenden Häppchen in unserem historischen Mühlenkeller.',
    (CURRENT_DATE + INTERVAL '30 days')::DATE,
    '19:00 - 22:00',
    '€45 pro Person',
    20
  )
  ON CONFLICT DO NOTHING;
END;
$$ LANGUAGE plpgsql;

-- Function to create table reservations table
CREATE OR REPLACE FUNCTION create_table_reservations_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS table_reservations (
    id SERIAL PRIMARY KEY,
    customer_name TEXT NOT NULL,
    contact_info TEXT NOT NULL,
    reservation_date DATE NOT NULL,
    reservation_time TEXT NOT NULL,
    guests INTEGER NOT NULL,
    special_requests TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
END;
$$ LANGUAGE plpgsql;

