-- Migration: Create influencer_profiles table
-- Description: Extended profile for users with role 'influencer' (influencers)

CREATE TABLE influencer_profiles (
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
CREATE INDEX idx_influencer_profiles_user_id ON influencer_profiles(user_id);
CREATE INDEX idx_influencer_profiles_category ON influencer_profiles(category);
CREATE INDEX idx_influencer_profiles_location ON influencer_profiles(location_city);
CREATE INDEX idx_influencer_profiles_featured ON influencer_profiles(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_influencer_profiles_rating ON influencer_profiles(avg_rating DESC);

-- GiST index for location-based queries (if PostGIS is enabled)
-- CREATE INDEX idx_influencer_profiles_geo ON influencer_profiles USING GIST (
--     ST_SetSRID(ST_MakePoint(location_lng, location_lat), 4326)
-- );

-- Updated_at trigger
CREATE TRIGGER update_influencer_profiles_updated_at
    BEFORE UPDATE ON influencer_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE influencer_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public read for discovery (anyone can browse influencer)
CREATE POLICY "Influencer profiles are publicly readable"
    ON influencer_profiles FOR SELECT
    USING (TRUE);

-- Influencer can update their own profile
CREATE POLICY "Influencer can update own profile"
    ON influencer_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- Influencer can insert their own profile
CREATE POLICY "Influencer can insert own profile"
    ON influencer_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Influencer can delete their own profile
CREATE POLICY "Influencer can delete own profile"
    ON influencer_profiles FOR DELETE
    USING (auth.uid() = user_id);
