-- Migration: Create trending_cards table
-- Description: Featured cards for homepage discovery (rising stars, hot deals, etc.)

-- Create enum for trending card types
CREATE TYPE trending_card_type AS ENUM ('rising_star', 'hot_deal', 'new_arrival');

CREATE TABLE trending_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    influencer_id UUID NOT NULL REFERENCES influencer_profiles(id) ON DELETE CASCADE,
    card_type trending_card_type NOT NULL,
    headline TEXT NOT NULL,
    subheadline TEXT,
    cta_text TEXT NOT NULL DEFAULT 'View Profile',
    background_image_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    starts_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ends_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_trending_cards_influencer_id ON trending_cards(influencer_id);
CREATE INDEX idx_trending_cards_type ON trending_cards(card_type);
CREATE INDEX idx_trending_cards_active ON trending_cards(is_active, starts_at, ends_at);
CREATE INDEX idx_trending_cards_order ON trending_cards(display_order);

-- Updated_at trigger
CREATE TRIGGER update_trending_cards_updated_at
    BEFORE UPDATE ON trending_cards
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE trending_cards ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Everyone can view active trending cards
CREATE POLICY "Active trending cards are publicly readable"
    ON trending_cards FOR SELECT
    USING (
        is_active = TRUE
        AND NOW() >= starts_at
        AND (ends_at IS NULL OR NOW() <= ends_at)
    );

-- Only admins can manage trending cards (via service role)
CREATE POLICY "Service role can manage trending cards"
    ON trending_cards
    USING (auth.jwt() ->> 'role' = 'service_role');
