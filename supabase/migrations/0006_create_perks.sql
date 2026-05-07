-- Migration: Create perks table
-- Description: Exclusive perks and discounts for platform users

-- Create enum for perk types
CREATE TYPE perk_type AS ENUM ('discount', 'freebie', 'exclusive');

CREATE TABLE perks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    perk_type perk_type NOT NULL,
    discount_percent INTEGER CHECK (discount_percent >= 0 AND discount_percent <= 100),
    code TEXT,
    valid_from TIMESTAMPTZ NOT NULL,
    valid_until TIMESTAMPTZ NOT NULL,
    max_claims INTEGER, -- NULL means unlimited
    current_claims INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    partner_name TEXT,
    partner_logo_url TEXT,
    terms_conditions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Ensure valid_until is after valid_from
    CONSTRAINT valid_date_range CHECK (valid_until > valid_from)
);

-- Indexes
CREATE INDEX idx_perks_active ON perks(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_perks_valid ON perks(valid_from, valid_until);
CREATE INDEX idx_perks_type ON perks(perk_type);

-- Updated_at trigger
CREATE TRIGGER update_perks_updated_at
    BEFORE UPDATE ON perks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE perks ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- All authenticated users can view active perks
CREATE POLICY "Authenticated users can view active perks"
    ON perks FOR SELECT
    USING (
        auth.role() = 'authenticated'
        AND is_active = TRUE
        AND NOW() BETWEEN valid_from AND valid_until
    );

-- Admin/service role can manage perks
CREATE POLICY "Service role can manage perks"
    ON perks
    USING (auth.jwt() ->> 'role' = 'service_role');
