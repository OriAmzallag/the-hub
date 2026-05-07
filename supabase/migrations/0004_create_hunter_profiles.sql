-- Migration: Create hunter_profiles table
-- Description: Extended profile for users with role 'hunter' (SMBs/brands)

CREATE TABLE hunter_profiles (
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
CREATE INDEX idx_hunter_profiles_user_id ON hunter_profiles(user_id);
CREATE INDEX idx_hunter_profiles_industry ON hunter_profiles(industry);

-- Updated_at trigger
CREATE TRIGGER update_hunter_profiles_updated_at
    BEFORE UPDATE ON hunter_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE hunter_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Hunters can view their own profile
CREATE POLICY "Hunters can view own profile"
    ON hunter_profiles FOR SELECT
    USING (auth.uid() = user_id);

-- Talent can view hunter profiles (for booking context)
CREATE POLICY "Talent can view hunter profiles for bookings"
    ON hunter_profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM users WHERE id = auth.uid() AND role = 'talent'
        )
    );

-- Hunters can update their own profile
CREATE POLICY "Hunters can update own profile"
    ON hunter_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- Hunters can insert their own profile
CREATE POLICY "Hunters can insert own profile"
    ON hunter_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);
