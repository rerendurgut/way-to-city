-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Countries Table
CREATE TABLE IF NOT EXISTS countries (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  continent TEXT,
  currency TEXT,
  currency_short TEXT,
  euro_conversion TEXT,
  esim_link TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Cities Table
CREATE TABLE IF NOT EXISTS cities (
  id TEXT PRIMARY KEY,
  country TEXT NOT NULL,
  name TEXT NOT NULL,
  "desc" TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Arrivals (ToCity) Table
CREATE TABLE IF NOT EXISTS tocity (
  id TEXT PRIMARY KEY,
  city TEXT NOT NULL,
  type TEXT NOT NULL,
  name TEXT,
  "desc" TEXT,
  link TEXT,
  note TEXT,
  note_link TEXT,
  status TEXT DEFAULT 'approved',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Transport Table
CREATE TABLE IF NOT EXISTS transport (
  id TEXT PRIMARY KEY,
  city TEXT NOT NULL,
  card_name TEXT,
  card_fee TEXT,
  fare TEXT,
  exceptions TEXT,
  where_to_buy TEXT,
  mobile_app TEXT,
  taxi_app TEXT,
  car_share_app TEXT,
  car_rental TEXT,
  contactless BOOLEAN DEFAULT false,
  qr BOOLEAN DEFAULT false,
  top_up TEXT,
  passes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. POIs (Places of Interest) Table
CREATE TABLE IF NOT EXISTS pois (
  id TEXT PRIMARY KEY,
  city TEXT NOT NULL,
  name TEXT NOT NULL,
  "desc" TEXT,
  link TEXT,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  status TEXT DEFAULT 'approved',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Stays Table
CREATE TABLE IF NOT EXISTS stays (
  id TEXT PRIMARY KEY,
  city TEXT NOT NULL,
  "where" TEXT NOT NULL,
  "desc" TEXT,
  link TEXT,
  status TEXT DEFAULT 'approved',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Foods Table
CREATE TABLE IF NOT EXISTS foods (
  id TEXT PRIMARY KEY,
  city TEXT NOT NULL,
  name TEXT NOT NULL,
  "desc" TEXT,
  is_meat BOOLEAN DEFAULT false,
  is_spicy BOOLEAN DEFAULT false,
  is_vegan BOOLEAN DEFAULT false,
  is_vegetarian BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'approved',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Submissions (Community Moderation Queue) Table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  category TEXT NOT NULL,
  country TEXT NOT NULL,
  city TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  link TEXT,
  extra_info JSONB DEFAULT '{}'::jsonb,
  status TEXT DEFAULT 'pending',
  submitted_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Events Table
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  city TEXT NOT NULL,
  name TEXT NOT NULL,
  "desc" TEXT,
  event_date TEXT,
  end_date TEXT,
  location TEXT,
  price TEXT,
  link TEXT,
  status TEXT DEFAULT 'approved',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS and public policies
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE tocity ENABLE ROW LEVEL SECURITY;
ALTER TABLE transport ENABLE ROW LEVEL SECURITY;
ALTER TABLE pois ENABLE ROW LEVEL SECURITY;
ALTER TABLE stays ENABLE ROW LEVEL SECURITY;
ALTER TABLE foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read countries" ON countries;
CREATE POLICY "Allow public read countries" ON countries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read cities" ON cities;
CREATE POLICY "Allow public read cities" ON cities FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read tocity" ON tocity;
CREATE POLICY "Allow public read tocity" ON tocity FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read transport" ON transport;
CREATE POLICY "Allow public read transport" ON transport FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read pois" ON pois;
CREATE POLICY "Allow public read pois" ON pois FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read stays" ON stays;
CREATE POLICY "Allow public read stays" ON stays FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read foods" ON foods;
CREATE POLICY "Allow public read foods" ON foods FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public read events" ON events;
CREATE POLICY "Allow public read events" ON events FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert submissions" ON submissions;
CREATE POLICY "Allow public insert submissions" ON submissions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read submissions" ON submissions;
CREATE POLICY "Allow public read submissions" ON submissions FOR SELECT USING (true);
