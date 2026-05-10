-- Migration: Create business_profiles table
-- Description: Extended profile for users with role 'business' (SMBs/brands)

CREATE TABLE business_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    company_name TEXT,
    company_website TEXT,
    industry TEXT,
    company_size TEXT, -- e.g., '1-10', '11-50', '51-200', '201+'
    total_spent_cents INTEGER NOT NULL DEFAULT 0,
    total_bookings INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_business_profiles_user_id ON business_profiles(user_id);
CREATE INDEX idx_business_profiles_industry ON business_profiles(industry);

-- Updated_at trigger
CREATE TRIGGER update_business_profiles_updated_at
    BEFORE UPDATE ON business_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE business_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Businesses can view their own profile
CREATE POLICY "Businesses can view own profile"
    ON business_profiles FOR SELECT
    USING (auth.uid() = user_id);

-- Influencer can view business profiles (for booking context)
CREATE POLICY "Influencer can view business profiles for bookings"
    ON business_profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role = 'influencer'
        )
    );

-- Businesses can update their own profile
CREATE POLICY "Businesses can update own profile"
    ON business_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- Businesses can insert their own profile
CREATE POLICY "Businesses can insert own profile"
    ON business_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);
