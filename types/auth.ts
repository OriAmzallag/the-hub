/**
 * Auth Types
 * Type definitions for the device-token authentication model.
 */

/**
 * Authenticated user profile returned from token validation or OTP verify.
 */
export interface AuthUser {
  id: string;
  firstName: string;
  photoUri: string | null;
  persona: 'business' | 'influencer';
}

/**
 * Response from token validation endpoint.
 */
export interface TokenValidationResponse {
  valid: boolean;
  user?: AuthUser;
}

/**
 * Response from OTP verification endpoint.
 */
export interface OtpVerifyResponse {
  success: boolean;
  accountExists: boolean;
  user?: AuthUser;
  token?: string;
}

/**
 * Auth service interface. Implemented by MockAuthService for development;
 * swap to SupabaseAuthService when real backend is wired.
 */
export interface AuthService {
  validateToken(token: string): Promise<TokenValidationResponse>;
  verifyOtp(phone: string, code: string): Promise<OtpVerifyResponse>;
  signOut(): Promise<void>;
}

/**
 * SecureStore key for device token.
 */
export const DEVICE_TOKEN_KEY = 'hub_device_token';
