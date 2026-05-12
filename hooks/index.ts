/**
 * Hooks exports barrel file
 */

// NOTE: useFadeUpEntrance is intentionally NOT re-exported here.
// useSession (below) pulls in supabase.ts which throws on module load
// when env vars are missing, so anything imported via the @/hooks barrel
// also imports supabase. Until supabase.ts is made lazy, consumers of
// useFadeUpEntrance should import it directly from
// `@/hooks/useFadeUpEntrance` to avoid the transitive side effect.
export { useSession } from "./useSession";
