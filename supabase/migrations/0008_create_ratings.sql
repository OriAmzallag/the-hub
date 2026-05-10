-- Migration: Create ratings table
-- Description: Reviews and ratings for completed bookings

CREATE TABLE ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewee_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 1 AND score <= 5),
    comment TEXT,
    is_public BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Prevent duplicate reviews for same booking by same user
    CONSTRAINT unique_booking_review UNIQUE (booking_id, reviewer_id)
);

-- Indexes
CREATE INDEX idx_ratings_booking_id ON ratings(booking_id);
CREATE INDEX idx_ratings_reviewer_id ON ratings(reviewer_id);
CREATE INDEX idx_ratings_reviewee_id ON ratings(reviewee_id);
CREATE INDEX idx_ratings_score ON ratings(score);
CREATE INDEX idx_ratings_public ON ratings(is_public) WHERE is_public = TRUE;

-- Updated_at trigger
CREATE TRIGGER update_ratings_updated_at
    BEFORE UPDATE ON ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to update influencer average rating
CREATE OR REPLACE FUNCTION update_influencer_rating()
RETURNS TRIGGER AS $$
DECLARE
    influencer_user_id UUID;
    new_avg DECIMAL(2, 1);
    new_count INTEGER;
BEGIN
    -- Get the influencer's user_id from the reviewee
    influencer_user_id := COALESCE(NEW.reviewee_id, OLD.reviewee_id);

    -- Calculate new average and count
    SELECT
        COALESCE(AVG(score)::DECIMAL(2,1), 0),
        COUNT(*)
    INTO new_avg, new_count
    FROM ratings
    WHERE reviewee_id = influencer_user_id
    AND is_public = TRUE;

    -- Update the influencer profile
    UPDATE influencer_profiles
    SET avg_rating = new_avg, total_reviews = new_count
    WHERE user_id = influencer_user_id;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers for rating changes
CREATE TRIGGER after_rating_insert
    AFTER INSERT ON ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_influencer_rating();

CREATE TRIGGER after_rating_update
    AFTER UPDATE ON ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_influencer_rating();

CREATE TRIGGER after_rating_delete
    AFTER DELETE ON ratings
    FOR EACH ROW
    EXECUTE FUNCTION update_influencer_rating();

-- Enable RLS
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public ratings are viewable by everyone
CREATE POLICY "Public ratings are viewable"
    ON ratings FOR SELECT
    USING (is_public = TRUE);

-- Users can view their own ratings (including private)
CREATE POLICY "Users can view own ratings"
    ON ratings FOR SELECT
    USING (auth.uid() = reviewer_id OR auth.uid() = reviewee_id);

-- Users can create ratings for completed bookings they participated in
CREATE POLICY "Participants can rate completed bookings"
    ON ratings FOR INSERT
    WITH CHECK (
        auth.uid() = reviewer_id
        AND EXISTS (
            SELECT 1 FROM bookings b
            WHERE b.id = booking_id
            AND b.status = 'completed'
            AND (
                -- Business reviewing influencer
                (b.business_id IN (SELECT id FROM business_profiles WHERE user_id = auth.uid()))
                OR
                -- Influencer reviewing business
                (b.service_id IN (
                    SELECT s.id FROM services s
                    JOIN influencer_profiles tp ON s.influencer_id = tp.id
                    WHERE tp.user_id = auth.uid()
                ))
            )
        )
    );

-- Users can update their own ratings
CREATE POLICY "Users can update own ratings"
    ON ratings FOR UPDATE
    USING (auth.uid() = reviewer_id);
