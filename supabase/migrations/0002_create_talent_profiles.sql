-- Migration: Create talent_profiles table
-- Description: Extended profile for users with role 'talent' (influencers)

CREATE TABLE talent_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    bio TEXT,
    category TEXT NOT NULL,
    subcategories TEXT[] DEFAULT '{}',
    instagram_handle TEXT,
    tiktok_handle TEXT,
    youtube_handle TEXT,
    follower_count INTEGER NOT NULL DEFAULT 0,
    engagement_rate DECIMAL(5, 2),
    location_city TEXT,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    portfolio_urls TEXT[] DEFAULT '{}',
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    avg_rating DECIMAL(2, 1) NOT NULL DEFAULT 0,
    total_reviews INTEGER NOT NULL DEFAULT 0,
    response_time_hours INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for discovery queries
CREATE INDEX idx_talent_profiles_user_id ON talent_profiles(user_id);
CREATE INDEX idx_talent_profiles_category ON talent_profiles(category);
CREATE INDEX idx_talent_profiles_location ON talent_profiles(location_city);
CREATE INDEX idx_talent_profiles_featured ON talent_profiles(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_talent_profiles_rating ON talent_profiles(avg_rating DESC);

-- GiST index for location-based queries (if PostGIS is enabled)
-- CREATE INDEX idx_talent_profiles_geo ON talent_profiles USING GIST (
--     ST_SetSRID(ST_MakePoint(location_lng, location_lat), 4326)
-- );

-- Updated_at trigger
CREATE TRIGGER update_talent_profiles_updated_at
    BEFORE UPDATE ON talent_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE talent_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public read for discovery (anyone can browse talent)
CREATE POLICY "Talent profiles are publicly readable"
    ON talent_profiles FOR SELECT
    USING (TRUE);

-- Talent can update their own profile
CREATE POLICY "Talent can update own profile"
    ON talent_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- Talent can insert their own profile
CREATE POLICY "Talent can insert own profile"
    ON talent_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Talent can delete their own profile
CREATE POLICY "Talent can delete own profile"
    ON talent_profiles FOR DELETE
    USING (auth.uid() = user_id);
