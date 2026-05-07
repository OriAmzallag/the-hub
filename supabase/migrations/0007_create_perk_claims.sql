-- Migration: Create perk_claims table
-- Description: Tracks which users have claimed which perks

CREATE TABLE perk_claims (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    perk_id UUID NOT NULL REFERENCES perks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    claimed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    redeemed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Each user can only claim each perk once
    CONSTRAINT unique_perk_claim UNIQUE (perk_id, user_id)
);

-- Indexes
CREATE INDEX idx_perk_claims_perk_id ON perk_claims(perk_id);
CREATE INDEX idx_perk_claims_user_id ON perk_claims(user_id);
CREATE INDEX idx_perk_claims_redeemed ON perk_claims(redeemed_at) WHERE redeemed_at IS NULL;

-- Updated_at trigger
CREATE TRIGGER update_perk_claims_updated_at
    BEFORE UPDATE ON perk_claims
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to increment perk claim count
CREATE OR REPLACE FUNCTION increment_perk_claims()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE perks
    SET current_claims = current_claims + 1
    WHERE id = NEW.perk_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-increment claim count
CREATE TRIGGER after_perk_claim_insert
    AFTER INSERT ON perk_claims
    FOR EACH ROW
    EXECUTE FUNCTION increment_perk_claims();

-- Enable RLS
ALTER TABLE perk_claims ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can view their own claims
CREATE POLICY "Users can view own perk claims"
    ON perk_claims FOR SELECT
    USING (auth.uid() = user_id);

-- Users can claim perks
CREATE POLICY "Users can claim perks"
    ON perk_claims FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        AND EXISTS (
            SELECT 1 FROM perks
            WHERE id = perk_id
            AND is_active = TRUE
            AND NOW() BETWEEN valid_from AND valid_until
            AND (max_claims IS NULL OR current_claims < max_claims)
        )
    );

-- Users can update their own claims (for redemption)
CREATE POLICY "Users can update own claims"
    ON perk_claims FOR UPDATE
    USING (auth.uid() = user_id);
