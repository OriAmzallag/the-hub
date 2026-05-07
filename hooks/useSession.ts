/**
 * useSession Hook
 *
 * Provides reactive auth session state by subscribing to
 * Supabase auth state changes.
 */

import { useEffect, useState } from "react";
import type { Session, AuthChangeEvent } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

interface UseSessionReturn {
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

/**
 * Hook to subscribe to Supabase auth session changes
 *
 * @returns Object containing session state, loading state, and auth status
 *
 * @example
 * ```tsx
 * const { session, isLoading, isAuthenticated } = useSession();
 *
 * if (isLoading) return <LoadingScreen />;
 * if (!isAuthenticated) return <Redirect href="/sign-in" />;
 * ```
 */
export function useSession(): UseSessionReturn {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initSession = async () => {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();
        setSession(initialSession);
      } catch (error) {
        console.error("Error fetching initial session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initSession();

    // Subscribe to auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, newSession: Session | null) => {
        setSession(newSession);
        setIsLoading(false);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return {
    session,
    isLoading,
    isAuthenticated: !!session,
  };
}
