/**
 * The Hub - Data Models
 * TypeScript types matching the database schema in architecture section 3.
 */

// ============================================================================
// Enums
// ============================================================================

export type UserRole = "talent" | "hunter";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "disputed";

export type PerkType = "discount" | "freebie" | "exclusive";

export type MessageSender = "talent" | "hunter";

export type TrendingCardType = "rising_star" | "hot_deal" | "new_arrival";

// ============================================================================
// Base Entity
// ============================================================================

interface BaseEntity {
  id: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// Users
// ============================================================================

export interface User extends BaseEntity {
  email: string;
  full_name: string;
  avatar_url: string | null;
  role: UserRole;
  phone: string | null;
  is_verified: boolean;
  last_login_at: string | null;
}

export type UserInsert = Omit<User, "id" | "created_at" | "updated_at">;
export type UserUpdate = Partial<UserInsert>;

// ============================================================================
// Talent Profiles
// ============================================================================

export interface TalentProfile extends BaseEntity {
  user_id: string;
  display_name: string;
  bio: string | null;
  category: string;
  subcategories: string[];
  instagram_handle: string | null;
  tiktok_handle: string | null;
  youtube_handle: string | null;
  follower_count: number;
  engagement_rate: number | null;
  location_city: string | null;
  location_lat: number | null;
  location_lng: number | null;
  portfolio_urls: string[];
  is_featured: boolean;
  avg_rating: number;
  total_reviews: number;
  response_time_hours: number | null;
}

export type TalentProfileInsert = Omit<
  TalentProfile,
  "id" | "created_at" | "updated_at" | "avg_rating" | "total_reviews"
>;
export type TalentProfileUpdate = Partial<TalentProfileInsert>;

// ============================================================================
// Services
// ============================================================================

export interface Service extends BaseEntity {
  talent_id: string;
  title: string;
  description: string;
  price_cents: number;
  currency: string;
  duration_minutes: number | null;
  is_active: boolean;
  max_revisions: number;
  delivery_days: number;
}

export type ServiceInsert = Omit<Service, "id" | "created_at" | "updated_at">;
export type ServiceUpdate = Partial<ServiceInsert>;

// ============================================================================
// Hunter Profiles
// ============================================================================

export interface HunterProfile extends BaseEntity {
  user_id: string;
  company_name: string | null;
  company_website: string | null;
  industry: string | null;
  company_size: string | null;
  total_spent_cents: number;
  total_bookings: number;
}

export type HunterProfileInsert = Omit<
  HunterProfile,
  "id" | "created_at" | "updated_at" | "total_spent_cents" | "total_bookings"
>;
export type HunterProfileUpdate = Partial<HunterProfileInsert>;

// ============================================================================
// Bookings
// ============================================================================

export interface Booking extends BaseEntity {
  service_id: string;
  hunter_id: string;
  status: BookingStatus;
  total_cents: number;
  currency: string;
  scheduled_at: string | null;
  completed_at: string | null;
  cancelled_at: string | null;
  cancellation_reason: string | null;
  notes: string | null;
  stripe_payment_intent_id: string | null;
}

export type BookingInsert = Omit<Booking, "id" | "created_at" | "updated_at">;
export type BookingUpdate = Partial<BookingInsert>;

// ============================================================================
// Perks
// ============================================================================

export interface Perk extends BaseEntity {
  title: string;
  description: string;
  perk_type: PerkType;
  discount_percent: number | null;
  code: string | null;
  valid_from: string;
  valid_until: string;
  max_claims: number | null;
  current_claims: number;
  is_active: boolean;
  partner_name: string | null;
  partner_logo_url: string | null;
  terms_conditions: string | null;
}

export type PerkInsert = Omit<
  Perk,
  "id" | "created_at" | "updated_at" | "current_claims"
>;
export type PerkUpdate = Partial<PerkInsert>;

// ============================================================================
// Perk Claims
// ============================================================================

export interface PerkClaim extends BaseEntity {
  perk_id: string;
  user_id: string;
  claimed_at: string;
  redeemed_at: string | null;
}

export type PerkClaimInsert = Omit<
  PerkClaim,
  "id" | "created_at" | "updated_at"
>;
export type PerkClaimUpdate = Partial<PerkClaimInsert>;

// ============================================================================
// Ratings
// ============================================================================

export interface Rating extends BaseEntity {
  booking_id: string;
  reviewer_id: string;
  reviewee_id: string;
  score: number; // 1-5
  comment: string | null;
  is_public: boolean;
}

export type RatingInsert = Omit<Rating, "id" | "created_at" | "updated_at">;
export type RatingUpdate = Partial<RatingInsert>;

// ============================================================================
// Messaging
// ============================================================================

export interface InquiryThread extends BaseEntity {
  talent_user_id: string;
  hunter_user_id: string;
  service_id: string | null;
  subject: string;
  is_archived: boolean;
  last_message_at: string | null;
}

export type InquiryThreadInsert = Omit<
  InquiryThread,
  "id" | "created_at" | "updated_at"
>;
export type InquiryThreadUpdate = Partial<InquiryThreadInsert>;

export interface Message extends BaseEntity {
  thread_id: string;
  sender_id: string;
  sender_type: MessageSender;
  content: string;
  is_read: boolean;
  read_at: string | null;
}

export type MessageInsert = Omit<Message, "id" | "created_at" | "updated_at">;
export type MessageUpdate = Partial<MessageInsert>;

// ============================================================================
// Trending Cards
// ============================================================================

export interface TrendingCard extends BaseEntity {
  talent_id: string;
  card_type: TrendingCardType;
  headline: string;
  subheadline: string | null;
  cta_text: string;
  background_image_url: string | null;
  display_order: number;
  is_active: boolean;
  starts_at: string;
  ends_at: string | null;
}

export type TrendingCardInsert = Omit<
  TrendingCard,
  "id" | "created_at" | "updated_at"
>;
export type TrendingCardUpdate = Partial<TrendingCardInsert>;

// ============================================================================
// Relationships (for joins)
// ============================================================================

export interface TalentProfileWithUser extends TalentProfile {
  user: User;
}

export interface ServiceWithTalent extends Service {
  talent: TalentProfileWithUser;
}

export interface BookingWithDetails extends Booking {
  service: ServiceWithTalent;
  hunter: HunterProfile;
}

export interface MessageWithSender extends Message {
  sender: User;
}

export interface InquiryThreadWithMessages extends InquiryThread {
  messages: Message[];
  talent: User;
  hunter: User;
}
