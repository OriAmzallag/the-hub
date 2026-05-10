/**
 * Supabase Database Types
 *
 * This is a placeholder file. After creating your Supabase project and
 * running migrations, generate actual types with:
 *
 *   npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts
 *
 * Or if using Supabase CLI locally:
 *
 *   npx supabase gen types typescript --local > types/database.ts
 */

import type {
  User,
  InfluencerProfile,
  Service,
  BusinessProfile,
  Booking,
  Perk,
  PerkClaim,
  Rating,
  InquiryThread,
  Message,
  TrendingCard,
} from "./models";

// Placeholder types until Supabase codegen is run
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<User, "id" | "created_at" | "updated_at">>;
      };
      influencer_profiles: {
        Row: InfluencerProfile;
        Insert: Omit<InfluencerProfile, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<InfluencerProfile, "id" | "created_at" | "updated_at">>;
      };
      services: {
        Row: Service;
        Insert: Omit<Service, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Service, "id" | "created_at" | "updated_at">>;
      };
      business_profiles: {
        Row: BusinessProfile;
        Insert: Omit<BusinessProfile, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<BusinessProfile, "id" | "created_at" | "updated_at">>;
      };
      bookings: {
        Row: Booking;
        Insert: Omit<Booking, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Booking, "id" | "created_at" | "updated_at">>;
      };
      perks: {
        Row: Perk;
        Insert: Omit<Perk, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Perk, "id" | "created_at" | "updated_at">>;
      };
      perk_claims: {
        Row: PerkClaim;
        Insert: Omit<PerkClaim, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<PerkClaim, "id" | "created_at" | "updated_at">>;
      };
      ratings: {
        Row: Rating;
        Insert: Omit<Rating, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Rating, "id" | "created_at" | "updated_at">>;
      };
      inquiry_threads: {
        Row: InquiryThread;
        Insert: Omit<InquiryThread, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<InquiryThread, "id" | "created_at" | "updated_at">>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<Message, "id" | "created_at" | "updated_at">>;
      };
      trending_cards: {
        Row: TrendingCard;
        Insert: Omit<TrendingCard, "id" | "created_at" | "updated_at">;
        Update: Partial<Omit<TrendingCard, "id" | "created_at" | "updated_at">>;
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      user_role: "influencer" | "business";
      booking_status:
        | "pending"
        | "confirmed"
        | "completed"
        | "cancelled"
        | "disputed";
      perk_type: "discount" | "freebie" | "exclusive";
      message_sender: "influencer" | "business";
      trending_card_type: "rising_star" | "hot_deal" | "new_arrival";
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type Enums<T extends keyof Database["public"]["Enums"]> =
  Database["public"]["Enums"][T];
