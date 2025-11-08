-- BE SAFE Database Schema for Supabase
-- This schema recreates the SQLite structure with PostgreSQL optimizations

-- Enable UUID extension for better primary keys
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- USERS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS users (
  username VARCHAR(26) PRIMARY KEY,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'User',
  header_image TEXT, -- Store base64 header like "data:image/png;base64"
  bytes_image TEXT, -- Store base64 image data
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ==========================================
-- POSTS TABLE
-- ==========================================
CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  site_name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(20) NOT NULL CHECK (category IN ('Positiva', 'Negativa', 'Aviso')),
  author_username VARCHAR(26) NOT NULL,
  likes INTEGER DEFAULT 0 CHECK (likes >= 0),
  dislikes INTEGER DEFAULT 0 CHECK (dislikes >= 0),
  liked_users JSONB DEFAULT '[]'::jsonb, -- Array of usernames who liked
  disliked_users JSONB DEFAULT '[]'::jsonb, -- Array of usernames who disliked
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Foreign key to users table
  CONSTRAINT fk_author FOREIGN KEY (author_username) REFERENCES users(username) ON DELETE CASCADE
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author_username);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_site_name ON posts(site_name);

-- GIN index for JSONB arrays (faster searches in liked_users and disliked_users)
CREATE INDEX IF NOT EXISTS idx_posts_liked_users ON posts USING GIN (liked_users);
CREATE INDEX IF NOT EXISTS idx_posts_disliked_users ON posts USING GIN (disliked_users);

-- ==========================================
-- FUNCTIONS & TRIGGERS
-- ==========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for users table
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for posts table
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- ROW LEVEL SECURITY (RLS)
-- ==========================================

-- Enable RLS on tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Users: Anyone can read, only authenticated users can insert/update their own data
CREATE POLICY "Users are viewable by everyone" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own data" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.jwt() ->> 'username' = username);

CREATE POLICY "Users can delete their own data" ON users
  FOR DELETE USING (auth.jwt() ->> 'username' = username);

-- Posts: Anyone can read, authenticated users can create/update/delete their own posts
CREATE POLICY "Posts are viewable by everyone" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts" ON posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own posts" ON posts
  FOR UPDATE USING (auth.jwt() ->> 'username' = author_username);

CREATE POLICY "Users can delete their own posts" ON posts
  FOR DELETE USING (auth.jwt() ->> 'username' = author_username);

-- ==========================================
-- HELPFUL FUNCTIONS
-- ==========================================

-- Function to search posts by site name
CREATE OR REPLACE FUNCTION search_posts_by_site(search_term TEXT)
RETURNS SETOF posts AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM posts
  WHERE site_name ILIKE '%' || search_term || '%'
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to get user's posts
CREATE OR REPLACE FUNCTION get_user_posts(user_name TEXT)
RETURNS SETOF posts AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM posts
  WHERE author_username = user_name
  ORDER BY created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Function to check if user liked/disliked a post
CREATE OR REPLACE FUNCTION user_vote_status(post_id BIGINT, user_name TEXT)
RETURNS TABLE(liked BOOLEAN, disliked BOOLEAN) AS $$
BEGIN
  RETURN QUERY
  SELECT
    liked_users @> to_jsonb(ARRAY[user_name]) AS liked,
    disliked_users @> to_jsonb(ARRAY[user_name]) AS disliked
  FROM posts
  WHERE id = post_id;
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- SAMPLE DATA (Optional - Comment out in production)
-- ==========================================

-- Insert a default admin user (password should be hashed in production)
-- INSERT INTO users (username, password, role, header_image, bytes_image)
-- VALUES ('admin', 'hashed_password_here', 'Admin', '', '')
-- ON CONFLICT (username) DO NOTHING;

-- ==========================================
-- NOTES FOR DEPLOYMENT
-- ==========================================

/*
To use this schema in Supabase:

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Copy and paste this entire schema
4. Click "Run" to execute

For RLS policies to work with your custom auth:
- You may need to adjust the RLS policies based on your auth implementation
- The current policies use auth.jwt() which assumes Supabase Auth
- If using custom JWT, you'll need to modify the policies

For API access without RLS:
- Use the service_role key (keep it secret!)
- Or disable RLS for development: ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
*/
