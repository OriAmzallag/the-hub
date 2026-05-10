-- Migration: Create bookings table
-- Description: Booking transactions between businesses and influencer services

-- Create enum for booking status
CREATE TYPE booking_status AS ENUM (
    'pending',
    'confirmed',
    'completed',
    'cancelled',
    'disputed'
);

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
    business_id UUID NOT NULL REFERENCES business_profiles(id) ON DELETE RESTRICT,
    status booking_status NOT NULL DEFAULT 'pending',
    total_cents INTEGER NOT NULL CHECK (total_cents >= 0),
    currency TEXT NOT NULL DEFAULT 'ILS',
    scheduled_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    notes TEXT,
    stripe_payment_intent_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_bookings_service_id ON bookings(service_id);
CREATE INDEX idx_bookings_business_id ON bookings(business_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_created_at ON bookings(created_at DESC);

-- Composite index for common query patterns
CREATE INDEX idx_bookings_business_status ON bookings(business_id, status);

-- Updated_at trigger
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Businesses can view their own bookings
CREATE POLICY "Businesses can view own bookings"
    ON bookings FOR SELECT
    USING (
        business_id IN (
            SELECT id FROM business_profiles WHERE user_id = auth.uid()
        )
    );

-- Influencer can view bookings for their services
CREATE POLICY "Influencer can view bookings for own services"
    ON bookings FOR SELECT
    USING (
        service_id IN (
            SELECT s.id FROM services s
            JOIN influencer_profiles tp ON s.influencer_id = tp.id
            WHERE tp.user_id = auth.uid()
        )
    );

-- Businesses can create bookings
CREATE POLICY "Businesses can create bookings"
    ON bookings FOR INSERT
    WITH CHECK (
        business_id IN (
            SELECT id FROM business_profiles WHERE user_id = auth.uid()
        )
    );

-- Participants can update bookings (for status changes)
CREATE POLICY "Participants can update bookings"
    ON bookings FOR UPDATE
    USING (
        business_id IN (
            SELECT id FROM business_profiles WHERE user_id = auth.uid()
        )
        OR
        service_id IN (
            SELECT s.id FROM services s
            JOIN influencer_profiles tp ON s.influencer_id = tp.id
            WHERE tp.user_id = auth.uid()
        )
    );
