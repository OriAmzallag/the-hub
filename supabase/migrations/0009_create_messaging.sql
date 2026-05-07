-- Migration: Create messaging tables
-- Description: Inquiry threads and messages between talent and hunters

-- Create enum for message sender type
CREATE TYPE message_sender AS ENUM ('talent', 'hunter');

-- Inquiry threads table
CREATE TABLE inquiry_threads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    talent_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hunter_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    subject TEXT NOT NULL,
    is_archived BOOLEAN NOT NULL DEFAULT FALSE,
    last_message_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Prevent duplicate threads for same pair
    CONSTRAINT unique_thread_participants UNIQUE (talent_user_id, hunter_user_id, service_id)
);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    thread_id UUID NOT NULL REFERENCES inquiry_threads(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sender_type message_sender NOT NULL,
    content TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for inquiry_threads
CREATE INDEX idx_inquiry_threads_talent ON inquiry_threads(talent_user_id);
CREATE INDEX idx_inquiry_threads_hunter ON inquiry_threads(hunter_user_id);
CREATE INDEX idx_inquiry_threads_service ON inquiry_threads(service_id);
CREATE INDEX idx_inquiry_threads_archived ON inquiry_threads(is_archived);
CREATE INDEX idx_inquiry_threads_last_message ON inquiry_threads(last_message_at DESC);

-- Indexes for messages
CREATE INDEX idx_messages_thread_id ON messages(thread_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_messages_unread ON messages(is_read) WHERE is_read = FALSE;

-- Updated_at triggers
CREATE TRIGGER update_inquiry_threads_updated_at
    BEFORE UPDATE ON inquiry_threads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at
    BEFORE UPDATE ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to update last_message_at on thread
CREATE OR REPLACE FUNCTION update_thread_last_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE inquiry_threads
    SET last_message_at = NEW.created_at
    WHERE id = NEW.thread_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_message_insert
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION update_thread_last_message();

-- Enable RLS
ALTER TABLE inquiry_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for inquiry_threads
-- Participants can view their threads
CREATE POLICY "Participants can view own threads"
    ON inquiry_threads FOR SELECT
    USING (
        auth.uid() = talent_user_id
        OR auth.uid() = hunter_user_id
    );

-- Hunters can create threads
CREATE POLICY "Hunters can create threads"
    ON inquiry_threads FOR INSERT
    WITH CHECK (auth.uid() = hunter_user_id);

-- Participants can update threads (archive, etc)
CREATE POLICY "Participants can update own threads"
    ON inquiry_threads FOR UPDATE
    USING (
        auth.uid() = talent_user_id
        OR auth.uid() = hunter_user_id
    );

-- RLS Policies for messages
-- Participants can view messages in their threads
CREATE POLICY "Participants can view thread messages"
    ON messages FOR SELECT
    USING (
        thread_id IN (
            SELECT id FROM inquiry_threads
            WHERE talent_user_id = auth.uid()
            OR hunter_user_id = auth.uid()
        )
    );

-- Participants can send messages
CREATE POLICY "Participants can send messages"
    ON messages FOR INSERT
    WITH CHECK (
        auth.uid() = sender_id
        AND thread_id IN (
            SELECT id FROM inquiry_threads
            WHERE talent_user_id = auth.uid()
            OR hunter_user_id = auth.uid()
        )
    );

-- Participants can mark messages as read
CREATE POLICY "Participants can update messages"
    ON messages FOR UPDATE
    USING (
        thread_id IN (
            SELECT id FROM inquiry_threads
            WHERE talent_user_id = auth.uid()
            OR hunter_user_id = auth.uid()
        )
    );
