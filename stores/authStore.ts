/**
 * Auth Store (Zustand)
 *
 * Global state for authentication and user data.
 * Works alongside useSession hook for reactive auth state.
 */

import { create } from "zustand";
import type { Session, User as AuthUser } from "@supabase/supabase-js";
import type { User, UserRole } from "@/types/models";

interface AuthState {
  // Supabase auth user (from auth.users)
  authUser: AuthUser | null;

  // App user profile (from public.users)
  user: User | null;

  // Current session
  session: Session | null;

  // Loading states
  isInitializing: boolean;
  isSigningIn: boolean;
  isSigningOut: boolean;

  // Actions
  setAuthUser: (authUser: AuthUser | null) => void;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  setIsInitializing: (isInitializing: boolean) => void;
  setIsSigningIn: (isSigningIn: boolean) => void;
  setIsSigningOut: (isSigningOut: boolean) => void;
  reset: () => void;
}

const initialState = {
  authUser: null,
  user: null,
  session: null,
  isInitializing: true,
  isSigningIn: false,
  isSigningOut: false,
};

export const useAuthStore = create<AuthState>((set) => ({
  ...initialState,

  setAuthUser: (authUser) => set({ authUser }),
  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setIsInitializing: (isInitializing) => set({ isInitializing }),
  setIsSigningIn: (isSigningIn) => set({ isSigningIn }),
  setIsSigningOut: (isSigningOut) => set({ isSigningOut }),

  reset: () => set(initialState),
}));

// Selectors for common patterns
export const selectIsAuthenticated = (state: AuthState) => !!state.session;
export const selectUserRole = (state: AuthState): UserRole | null =>
  state.user?.role ?? null;
export const selectIsInfluencer = (state: AuthState) =>
  state.user?.role === "influencer";
export const selectIsBusiness = (state: AuthState) =>
  state.user?.role === "business";
