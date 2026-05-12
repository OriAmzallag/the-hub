/**
 * Auth Service
 * Device-token authentication service with mock implementation.
 *
 * The mock implementation enables development without a real backend.
 * Swap to SupabaseAuthService when Supabase auth is wired.
 */

import * as SecureStore from 'expo-secure-store';
import type {
  AuthService,
  AuthUser,
  TokenValidationResponse,
  OtpVerifyResponse,
} from '@/types/auth';
import { DEVICE_TOKEN_KEY } from '@/types/auth';

/**
 * Mock user profiles for development.
 */
const MOCK_USERS: Record<string, AuthUser> = {
  // Maya - returning influencer (phone ends in 0)
  maya: {
    id: 'maya-001',
    firstName: 'Maya',
    photoUri:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    persona: 'influencer',
  },
  // Avi - returning business owner (phone ends in 5)
  avi: {
    id: 'avi-001',
    firstName: 'Avi',
    photoUri: null,
    persona: 'business',
  },
};

/**
 * Simulate network delay for realistic UX.
 */
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Mock auth service for development.
 *
 * Token validation:
 * - Any token starting with 'valid_' returns Maya's profile
 * - Any token starting with 'valid_business_' returns Avi's profile
 * - All other tokens are invalid
 *
 * OTP verification:
 * - Phone numbers ending in '0' return accountExists=true with Maya
 * - Phone numbers ending in '5' return accountExists=true with Avi
 * - All other phone numbers return accountExists=false (new user)
 * - Any 6-digit OTP code is accepted
 */
class MockAuthService implements AuthService {
  async validateToken(token: string): Promise<TokenValidationResponse> {
    // Simulate network delay (fast - token check should be quick)
    await delay(150);

    if (token.startsWith('valid_business_')) {
      return { valid: true, user: MOCK_USERS.avi };
    }

    if (token.startsWith('valid_')) {
      return { valid: true, user: MOCK_USERS.maya };
    }

    return { valid: false };
  }

  async verifyOtp(phone: string, code: string): Promise<OtpVerifyResponse> {
    // Simulate network delay
    await delay(300);

    // Validate OTP format (any 6 digits accepted in mock)
    if (!/^\d{6}$/.test(code)) {
      return { success: false, accountExists: false };
    }

    // Determine if this is a returning user based on phone number
    const lastDigit = phone.slice(-1);

    if (lastDigit === '0') {
      // Returning influencer (Maya)
      return {
        success: true,
        accountExists: true,
        user: MOCK_USERS.maya,
        token: 'valid_maya_' + Date.now(),
      };
    }

    if (lastDigit === '5') {
      // Returning business owner (Avi)
      return {
        success: true,
        accountExists: true,
        user: MOCK_USERS.avi,
        token: 'valid_business_avi_' + Date.now(),
      };
    }

    // New user - no existing account
    return {
      success: true,
      accountExists: false,
      token: 'valid_new_' + Date.now(),
    };
  }

  async signOut(): Promise<void> {
    await SecureStore.deleteItemAsync(DEVICE_TOKEN_KEY);
  }
}

/**
 * Singleton auth service instance.
 * Currently uses mock implementation; swap to real impl when backend is ready.
 */
export const authService: AuthService = new MockAuthService();

/**
 * Helper to get the stored device token.
 */
export async function getDeviceToken(): Promise<string | null> {
  return SecureStore.getItemAsync(DEVICE_TOKEN_KEY);
}

/**
 * Helper to store the device token.
 */
export async function setDeviceToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(DEVICE_TOKEN_KEY, token);
}

/**
 * Helper to clear the device token.
 */
export async function clearDeviceToken(): Promise<void> {
  await SecureStore.deleteItemAsync(DEVICE_TOKEN_KEY);
}
