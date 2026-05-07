-- Migration: Create services table
-- Description: Services offered by talent for booking

CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    talent_id UUID NOT NULL REFERENCES talent_profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
    currency TEXT NOT NULL DEFAULT 'ILS',
    duration_minutes INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    max_revisions INTEGER NOT NULL DEFAULT 1,
    delivery_days INTEGER NOT NULL DEFAULT 7,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_services_talent_id ON services(talent_id);
CREATE INDEX idx_services_active ON services(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_services_price ON services(price_cents);

-- Updated_at trigger
CREATE TRIGGER update_services_updated_at
    BEFORE UPDATE ON services
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public read for browsing services
CREATE POLICY "Services are publicly readable"
    ON services FOR SELECT
    USING (TRUE);

-- Talent can manage their own services
CREATE POLICY "Talent can insert own services"
    ON services FOR INSERT
    WITH CHECK (
        talent_id IN (
            SELECT id FROM talent_profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Talent can update own services"
    ON services FOR UPDATE
    USING (
        talent_id IN (
            SELECT id FROM talent_profiles WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Talent can delete own services"
    ON services FOR DELETE
    USING (
        talent_id IN (
            SELECT id FROM talent_profiles WHERE user_id = auth.uid()
        )
    );
