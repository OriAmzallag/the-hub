/**
 * see-all.reference.jsx
 * ---------------------------------------------------------------
 * Tom's web JSX prototype for the unified "See All" screen — the
 * destination when the user taps `See all →` on any curated row on
 * the Discover surfaces (Business viewing Talent, or Influencer
 * viewing Perks).
 *
 * WHAT TO TAKE (pixel-perfect):
 *   - Top bar: back button + display 20/800 page title (`All perks`
 *     or `All talent`) + mono caption subtitle `{SORT LABEL} · {N}
 *     PERKS|CREATORS` + circular filter button on the right with
 *     active-count badge (top-right, accent fill, 1.5px bg border).
 *   - Subtitle is LIVE: it reflects the current sort, not the entry
 *     point. Filters affect the count but NOT the label.
 *   - Filter badge count = filters_active + 1 if sort ≠ best_match.
 *     So entry points that pre-select a non-default sort show
 *     `1 active` from the moment the screen renders.
 *   - Pill-shaped search bar (radius 100), mag icon on left,
 *     persona-specific placeholder, clear-X chip when filled.
 *   - 2-up grid for BOTH personas with 12px gap. Same card components
 *     as Discover home (PerkCard, TalentCard).
 *   - Talent card: NO availability pulse-dot. Removed in production,
 *     do not reintroduce. Card shows badge, photo, rating chip,
 *     name, first category.
 *   - Empty state: mono `NOTHING MATCHES` + body explanation +
 *     outlined `Reset filters` CTA. Spans both grid columns.
 *   - Filter sheet chrome: drag handle, mono super-title (accent),
 *     `Filters` display 26/800, X dismiss button, body sections,
 *     footer with `Reset` only (no Apply — filters apply live, dismiss
 *     via X or pan-down).
 *   - Perk filter sections (in order): Categories → Value range →
 *     Reach → Urgency → Sort. Hint format: `{N} selected` for
 *     multi-pick, `₪{min} → ₪{max}` for ranges.
 *   - Talent filter sections (in order): Content type → Audience
 *     size → Platform → Price range → Availability → Min rating →
 *     Content language → Age bracket → Gender → Sort.
 *   - Sort section: full-width cards with check indicator on active.
 *   - Animations: fadeUp on screen mount, sheet-rise + overlayFade
 *     on filter open. Match the timing from mark-done.reference.jsx
 *     (320ms cubic-bezier 0.32 0.72 0 1 for sheet, 220ms ease-out
 *     for overlay).
 *
 * WHAT TO IGNORE:
 *   - The `T` design-token object — use `constants/theme.ts` tokens.
 *   - `@import url(...)` Google Fonts — already loaded in
 *     `app/_layout.tsx`.
 *   - Web-only props: `cursor`, `onMouseDown/Up/Leave`, `aria-*`,
 *     CSS keyframes via `<style>`, `backdropFilter`/`WebkitBackdropFilter`.
 *     Port to RN: Pressable + BlurView/expo-blur for backdrop blur,
 *     Reanimated for entrance animations.
 *   - The DEMO TOGGLES at the top of the screen (persona +
 *     entry-point chips) — prototype scaffolding only. The real
 *     screen is driven by route params from Discover.
 *   - `<input>` / `<input type="number">` → use `TextInput` with
 *     `keyboardType="numeric"` where relevant.
 *   - `<img>` → use `Image` from `react-native` (or `expo-image`
 *     if that's what Discover uses) — match the convention from
 *     `business-discover.reference.jsx`'s existing impl.
 *   - The `qualifiesFor` / `VIEWER_REACH` mock helpers in this file
 *     are duplicates of logic that already lives in the Discover
 *     mocks — wire to the real selector, do not redeclare.
 *   - All inline `padding: "Xpx Ypx"` strings are web syntax — RN
 *     uses numeric values.
 *
 * REUSE — DO NOT REINVENT:
 *   This is the most important rule. The user's brief is explicit:
 *   "every time you can use reusable component do it and dont invent
 *   yourself unless its necessary."
 *
 *   Components that MUST be reused from Discover (no rewrites):
 *     - PerkCard (Influencer side) — same component from §2.10B
 *     - TalentCard (Business side) — same component from §2.10
 *     - PerkFilterSheet — full reuse, same chrome, same sections
 *     - FilterSheet (talent) — full reuse, same chrome, same sections
 *     - Search bar primitive if one exists
 *     - The overlay + sheet-rise animation pattern (already used by
 *       Mark Done's MarkDoneSheet; consider extracting if it's the
 *       third occurrence)
 *
 *   Components that probably need to be new (verify first):
 *     - The grid wrapper (2-up) — likely a simple `FlatList numColumns={2}`
 *       or just a `View` with `flexDirection: row, flexWrap: wrap`.
 *       Look for existing 2-up grids before rolling one.
 *     - The top bar header — there's already a `ScreenHeader` recipe
 *       per memory; the See All header should fit that or extend it,
 *       not be a one-off.
 *
 *   Components that are SCREEN-LOCAL (likely new but small):
 *     - The route handler / hook reading entry-point params and
 *       deriving initial sort.
 *
 * INTEGRATION NOTES:
 *   - Both Discover surfaces (Business + Influencer) have multiple
 *     curated rows with `See all →` affordances. Wire each one to
 *     this screen with route params `?entry=<id>` so the initial
 *     sort can be derived from `ENTRY_POINTS[persona][entry].initialSort`.
 *   - The persona is implicit from the route segment
 *     (`app/(business)/...` vs `app/(influencer)/...`).
 *   - Sort options + entry-point mapping are LOCKED per
 *     `project_see_all_decisions.md` in memory. Do not invent new
 *     sort options without an explicit product decision.
 *   - The screen is read-only on data — no Mark Done equivalent
 *     here. Card taps route to the relevant detail screen (perk
 *     detail or talent storefront), same as Discover home.
 * ---------------------------------------------------------------
 */

import { useState } from "react";
import {
  ChevronLeft,
  Search,
  SlidersHorizontal,
  Star,
  Check,
  X,
  Instagram,
  Music2,
  Youtube,
  CalendarClock,
} from "lucide-react";

// =================================================================
// DESIGN TOKENS
// =================================================================
const T = {
  bg: "#1A1815",
  surface: "#2A2620",
  surfaceAlt: "#221F1A",
  border: "rgba(244,240,232,0.08)",
  borderStrong: "rgba(244,240,232,0.15)",
  ink: "#F4F0E8",
  inkMuted: "#8A7E6C",
  inkSubtle: "#5C5448",
  accent: "#FF7A29",
  accentSoft: "rgba(255,122,41,0.12)",
  accentBorder: "rgba(255,122,41,0.40)",
  accentShadow: "rgba(255,122,41,0.30)",
  decline: "#C4886B",
  fontDisplay: "'Inter Tight', system-ui, sans-serif",
  fontBody: "'Inter Tight', system-ui, sans-serif",
  fontMono: "'JetBrains Mono', monospace",
};

// =================================================================
// DATA
// =================================================================
const PERKS = [
  { id: "p-1", title: "Dinner for two", business: "Onza", value: 400, cover: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80", deliverables: [{ platform: "IG", action: "3 Stories", requiredFollowers: 10000 }], category: "Food", slotsLeft: 3, slotsTotal: 5, badge: "Top match", expiringSoon: false },
  { id: "p-2", title: "Pilates class pack", business: "Studio Movement", value: 580, cover: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80", deliverables: [{ platform: "IG", action: "1 Reel", requiredFollowers: 25000 }, { platform: "TikTok", action: "1 Reel", requiredFollowers: 30000 }], category: "Fitness", slotsLeft: 2, slotsTotal: 4, badge: null, expiringSoon: false },
  { id: "p-3", title: "Skincare bundle", business: "BeautyBar", value: 320, cover: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80", deliverables: [{ platform: "TikTok", action: "1 Review", requiredFollowers: 50000 }], category: "Beauty", slotsLeft: 1, slotsTotal: 5, badge: null, expiringSoon: true },
  { id: "p-4", title: "Cocktails at Bellboy", business: "Bellboy", value: 220, cover: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&q=80", deliverables: [{ platform: "IG", action: "2 Stories", requiredFollowers: 8000 }], category: "Food", slotsLeft: 4, slotsTotal: 6, badge: null, expiringSoon: false },
  { id: "p-5", title: "Coffee + brunch", business: "FitBar TLV", value: 180, cover: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80", deliverables: [{ platform: "IG", action: "1 Story", requiredFollowers: 5000 }], category: "Food", slotsLeft: 5, slotsTotal: 8, badge: "New", expiringSoon: false },
  { id: "p-6", title: "Sushi tasting", business: "Sushi Bar", value: 350, cover: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80", deliverables: [{ platform: "IG", action: "1 Reel", requiredFollowers: 15000 }], category: "Food", slotsLeft: 2, slotsTotal: 5, badge: null, expiringSoon: true },
  { id: "p-7", title: "Athleisure haul", business: "Studio Movement", value: 600, cover: "https://images.unsplash.com/photo-1483721310020-03333e577078?w=600&q=80", deliverables: [{ platform: "IG", action: "1 Reel", requiredFollowers: 20000 }], category: "Fashion", slotsLeft: 3, slotsTotal: 5, badge: null, expiringSoon: false },
  { id: "p-8", title: "Hair care set", business: "BeautyBar", value: 280, cover: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80", deliverables: [{ platform: "IG", action: "1 Story", requiredFollowers: 5000 }, { platform: "TikTok", action: "1 Reel", requiredFollowers: 10000 }], category: "Beauty", slotsLeft: 6, slotsTotal: 10, badge: null, expiringSoon: false },
];

const TALENT = [
  { id: "t-1", name: "Maya Cohen", photo: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80", rating: 4.9, badge: "Top match", available: true, categories: ["Fitness", "Lifestyle", "Wellness"] },
  { id: "t-2", name: "Noa Berman", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80", rating: 4.8, badge: null, available: true, categories: ["Lifestyle", "Fashion"] },
  { id: "t-3", name: "Daniel Levi", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80", rating: 4.7, badge: null, available: false, categories: ["Food", "Lifestyle"] },
  { id: "t-4", name: "Yael Mizrahi", photo: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80", rating: 5.0, badge: "Top rated", available: true, categories: ["Fashion", "Beauty"] },
  { id: "t-5", name: "Tomer Avraham", photo: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=600&q=80", rating: null, badge: "New", available: true, categories: ["Music", "Lifestyle"] },
  { id: "t-6", name: "Roni Kaplan", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80", rating: 4.9, badge: null, available: true, categories: ["Wellness", "Fitness"] },
  { id: "t-7", name: "Adi Shoham", photo: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80", rating: 4.6, badge: null, available: false, categories: ["Tech", "Lifestyle"] },
];

const VIEWER_REACH = { IG: 47200, TikTok: 82100, YouTube: 8400 };

function qualifiesFor(perk) {
  return perk.deliverables.every((d) => (VIEWER_REACH[d.platform] || 0) >= d.requiredFollowers);
}
function formatThreshold(followers) {
  if (followers >= 1000000) return `${(followers / 1000000).toFixed(0)}M`;
  if (followers >= 1000) return `${(followers / 1000).toFixed(0)}K`;
  return String(followers);
}
function getCardPlatformLine(perk) {
  if (perk.deliverables.length === 1) {
    const d = perk.deliverables[0];
    return `${formatThreshold(d.requiredFollowers)}+ on ${d.platform}`;
  }
  return perk.deliverables.map((d) => d.platform).join(" + ");
}

// =================================================================
// FILTER OPTIONS — match reference files exactly
// =================================================================
const PERK_CATEGORIES = ["Food", "Fitness", "Fashion", "Beauty", "Wellness", "Music", "Tech"];
const PERK_SORT = [
  { id: "best_match", label: "Best match" },
  { id: "expiring", label: "Expires soonest" },
  { id: "newest", label: "Newest" },
  { id: "value_high", label: "Value: high → low" },
  { id: "value_low", label: "Value: low → high" },
];

const CONTENT_TYPES = [
  { id: "lifestyle", label: "Lifestyle" }, { id: "food", label: "Food" }, { id: "fitness", label: "Fitness" },
  { id: "fashion", label: "Fashion" }, { id: "beauty", label: "Beauty" }, { id: "tech", label: "Tech" },
  { id: "music", label: "Music" }, { id: "wellness", label: "Wellness" },
];
const AUDIENCE_TIERS = [
  { id: "nano", label: "Nano", hint: "1K – 10K" },
  { id: "micro", label: "Micro", hint: "10K – 100K" },
  { id: "macro", label: "Macro", hint: "100K – 1M" },
  { id: "mega", label: "Mega", hint: "1M+" },
];
const PLATFORMS = [
  { id: "ig", label: "Instagram", Icon: Instagram },
  { id: "tt", label: "TikTok", Icon: Music2 },
  { id: "yt", label: "YouTube", Icon: Youtube },
];
const LANGUAGES = [
  { id: "hebrew", label: "Hebrew" }, { id: "english", label: "English" },
  { id: "arabic", label: "Arabic" }, { id: "russian", label: "Russian" },
];
const AGE_BRACKETS = [
  { id: "18_24", label: "18 – 24" }, { id: "25_34", label: "25 – 34" },
  { id: "35_44", label: "35 – 44" }, { id: "45_plus", label: "45+" },
];
const GENDERS = [
  { id: "female", label: "Female" }, { id: "male", label: "Male" },
  { id: "nonbinary", label: "Non-binary" },
];
const TALENT_SORT = [
  { id: "best_match", label: "Best match" },
  { id: "rating", label: "Highest rated" },
  { id: "newest", label: "Newest" },
  { id: "available", label: "Available first" },
];

// =================================================================
// ENTRY POINTS
// =================================================================
const ENTRY_POINTS = {
  perks: [
    { id: "best_match", label: "Best match", initialSort: "best_match" },
    { id: "expiring", label: "Expires soon", initialSort: "expiring" },
    { id: "new", label: "New perks", initialSort: "newest" },
    { id: "near_you", label: "Near you", initialSort: "best_match" },
  ],
  talent: [
    { id: "top_match", label: "Top match", initialSort: "best_match" },
    { id: "trending", label: "Trending", initialSort: "best_match" },
    { id: "top_rated", label: "Top rated", initialSort: "rating" },
    { id: "new", label: "New", initialSort: "newest" },
    { id: "available", label: "Available now", initialSort: "best_match" },
  ],
};

// =================================================================
// MAIN
// =================================================================
export default function SeeAll() {
  const [persona, setPersona] = useState("perks");
  const [entryId, setEntryId] = useState("best_match");

  const entry = ENTRY_POINTS[persona].find((e) => e.id === entryId) || ENTRY_POINTS[persona][0];

  return (
    <div
      style={{
        background: "#0a0a0a",
        minHeight: "100vh",
        padding: "20px 0 40px",
        fontFamily: T.fontBody,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        .scroll-container::-webkit-scrollbar { display: none; }
        .scroll-container { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes sheetRise {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes overlayFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .fade-up { animation: fadeUp 0.35s ease-out both; }
        .sheet-rise { animation: sheetRise 0.32s cubic-bezier(0.32, 0.72, 0, 1) both; }
        .overlay-fade { animation: overlayFade 0.22s ease-out both; }
        input::placeholder { color: ${T.inkSubtle}; font-weight: 400; }
      `}</style>

      {/* DEMO TOGGLES */}
      <div
        style={{
          maxWidth: 440,
          margin: "0 auto 12px",
          padding: "0 16px",
          display: "flex",
          flexDirection: "column",
          gap: 6,
        }}
      >
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { id: "perks", label: "Influencer ▸ Perks" },
            { id: "talent", label: "Business ▸ Talent" },
          ].map((opt) => {
            const isActive = persona === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  setPersona(opt.id);
                  setEntryId(ENTRY_POINTS[opt.id][0].id);
                }}
                style={demoToggleStyle(isActive)}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {ENTRY_POINTS[persona].map((opt) => {
            const isActive = entryId === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setEntryId(opt.id)}
                style={{ ...demoToggleStyle(isActive), fontSize: 9.5, padding: "6px 8px", minWidth: 80 }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        style={{
          background: T.bg,
          width: "100%",
          maxWidth: 440,
          margin: "0 auto",
          position: "relative",
          boxShadow: "0 0 60px rgba(0,0,0,0.5)",
          borderRadius: 14,
          overflow: "hidden",
          height: "calc(100vh - 150px)",
          maxHeight: 880,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <SeeAllScreen persona={persona} entry={entry} />
      </div>
    </div>
  );
}

function demoToggleStyle(isActive) {
  return {
    padding: "8px 8px",
    borderRadius: 10,
    border: isActive ? "1px solid rgba(255,255,255,0.4)" : "1px solid rgba(255,255,255,0.1)",
    background: isActive ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.02)",
    color: "#fff",
    fontSize: 10.5,
    fontFamily: "system-ui",
    fontWeight: 600,
    cursor: "pointer",
    textAlign: "center",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
    flex: 1,
  };
}

// =================================================================
// SEE ALL SCREEN
// =================================================================
function SeeAllScreen({ persona, entry }) {
  const isPerks = persona === "perks";
  const [search, setSearch] = useState("");

  // Perk filter state
  const [perkCategories, setPerkCategories] = useState([]);
  const [perkValueMin, setPerkValueMin] = useState(0);
  const [perkValueMax, setPerkValueMax] = useState(1000);
  const [perkQualifyOnly, setPerkQualifyOnly] = useState(false);
  const [perkExpiringOnly, setPerkExpiringOnly] = useState(false);
  const [perkSort, setPerkSort] = useState(entry.initialSort);

  // Talent filter state
  const [contentTypes, setContentTypes] = useState([]);
  const [audienceTiers, setAudienceTiers] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(2000);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [languages, setLanguages] = useState([]);
  const [ageBrackets, setAgeBrackets] = useState([]);
  const [genders, setGenders] = useState([]);
  const [talentSort, setTalentSort] = useState(entry.initialSort);

  const [showFilters, setShowFilters] = useState(false);

  // ACTIVE COUNT — sort counts as +1 whenever it's NOT the default `best_match`,
  // even on initial render via an entry point like "Expires soon"
  const perkActiveCount =
    perkCategories.length +
    (perkValueMin > 0 || perkValueMax < 1000 ? 1 : 0) +
    (perkQualifyOnly ? 1 : 0) +
    (perkExpiringOnly ? 1 : 0) +
    (perkSort !== "best_match" ? 1 : 0);

  const talentActiveCount =
    contentTypes.length +
    audienceTiers.length +
    platforms.length +
    (priceMin > 0 || priceMax < 2000 ? 1 : 0) +
    (availableOnly ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    languages.length +
    ageBrackets.length +
    genders.length +
    (talentSort !== "best_match" ? 1 : 0);

  const activeCount = isPerks ? perkActiveCount : talentActiveCount;

  // Filter + sort
  let visible = isPerks ? [...PERKS] : [...TALENT];

  if (isPerks) {
    visible = visible.filter((perk) => {
      if (search) {
        const term = search.toLowerCase();
        if (!perk.title.toLowerCase().includes(term) && !perk.business.toLowerCase().includes(term)) return false;
      }
      if (perkCategories.length > 0 && !perkCategories.includes(perk.category)) return false;
      if (perk.value < perkValueMin || perk.value > perkValueMax) return false;
      if (perkQualifyOnly && !qualifiesFor(perk)) return false;
      if (perkExpiringOnly && !perk.expiringSoon) return false;
      return true;
    });

    if (perkSort === "expiring") {
      visible.sort((a, b) => (b.expiringSoon ? 1 : 0) - (a.expiringSoon ? 1 : 0));
    } else if (perkSort === "value_high") {
      visible.sort((a, b) => b.value - a.value);
    } else if (perkSort === "value_low") {
      visible.sort((a, b) => a.value - b.value);
    }
  } else {
    visible = visible.filter((talent) => {
      if (search) {
        const term = search.toLowerCase();
        if (!talent.name.toLowerCase().includes(term) && !talent.categories.some(c => c.toLowerCase().includes(term))) return false;
      }
      if (contentTypes.length > 0) {
        const matches = contentTypes.some(ct => {
          const opt = CONTENT_TYPES.find(o => o.id === ct);
          return opt && talent.categories.includes(opt.label);
        });
        if (!matches) return false;
      }
      if (availableOnly && !talent.available) return false;
      if (minRating > 0 && (!talent.rating || talent.rating < minRating)) return false;
      return true;
    });

    if (talentSort === "rating") {
      visible.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (talentSort === "available") {
      visible.sort((a, b) => (b.available ? 1 : 0) - (a.available ? 1 : 0));
    }
  }

  const pageTitle = isPerks ? "All perks" : "All talent";
  const countLabel = isPerks
    ? `${visible.length} ${visible.length === 1 ? "perk" : "perks"}`
    : `${visible.length} ${visible.length === 1 ? "creator" : "creators"}`;

  // LIVE SORT SUBTITLE — reflects current sort, not entry label
  const currentSortOptions = isPerks ? PERK_SORT : TALENT_SORT;
  const currentSortId = isPerks ? perkSort : talentSort;
  const currentSortLabel = currentSortOptions.find(s => s.id === currentSortId)?.label || "Best match";

  const resetAll = () => {
    if (isPerks) {
      setPerkCategories([]);
      setPerkValueMin(0);
      setPerkValueMax(1000);
      setPerkQualifyOnly(false);
      setPerkExpiringOnly(false);
      setPerkSort("best_match");
    } else {
      setContentTypes([]);
      setAudienceTiers([]);
      setPlatforms([]);
      setPriceMin(0);
      setPriceMax(2000);
      setAvailableOnly(false);
      setMinRating(0);
      setLanguages([]);
      setAgeBrackets([]);
      setGenders([]);
      setTalentSort("best_match");
    }
    setSearch("");
  };

  return (
    <div
      key={`${persona}-${entry.id}`}
      className="fade-up"
      style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}
    >
      {/* TOP BAR */}
      <div style={{ padding: "14px 16px 10px", flexShrink: 0, background: T.bg }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <button
            aria-label="Back"
            style={{
              width: 36, height: 36, borderRadius: "50%",
              background: T.surface, border: `1px solid ${T.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: T.ink, flexShrink: 0,
            }}
          >
            <ChevronLeft size={18} strokeWidth={2.2} />
          </button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1
              style={{
                fontFamily: T.fontDisplay,
                fontSize: 20,
                fontWeight: 800,
                margin: 0,
                color: T.ink,
                letterSpacing: "-0.035em",
                lineHeight: 1.1,
              }}
            >
              {pageTitle}
            </h1>
            <div
              style={{
                fontFamily: T.fontMono,
                fontSize: 9.5,
                color: T.inkMuted,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 600,
                marginTop: 3,
              }}
            >
              {currentSortLabel} · {countLabel}
            </div>
          </div>
          <button
            onClick={() => setShowFilters(true)}
            aria-label="Filters"
            style={{
              position: "relative",
              width: 38, height: 38, borderRadius: "50%",
              background: activeCount > 0 ? T.accentSoft : T.surface,
              border: `1px solid ${activeCount > 0 ? T.accentBorder : T.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer",
              color: activeCount > 0 ? T.accent : T.ink,
              flexShrink: 0,
            }}
          >
            <SlidersHorizontal size={16} strokeWidth={2.2} />
            {activeCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -3, right: -3,
                  minWidth: 18, height: 18,
                  padding: "0 4px", borderRadius: 9,
                  background: T.accent, color: T.bg,
                  fontFamily: T.fontMono, fontSize: 9.5, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: `1.5px solid ${T.bg}`,
                }}
              >
                {activeCount}
              </span>
            )}
          </button>
        </div>

        {/* SEARCH BAR */}
        <div
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 14px",
            background: T.surface, border: `1px solid ${T.border}`,
            borderRadius: 100,
          }}
        >
          <Search size={15} strokeWidth={2.2} color={T.inkMuted} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={isPerks ? "Search perks or business…" : "Search talent or category…"}
            style={{
              flex: 1, background: "transparent", border: "none", outline: "none",
              color: T.ink, fontFamily: T.fontBody, fontSize: 14, fontWeight: 400,
            }}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              aria-label="Clear search"
              style={{
                width: 20, height: 20, borderRadius: "50%",
                background: T.surfaceAlt, border: "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: T.inkMuted,
              }}
            >
              <X size={12} strokeWidth={2.6} />
            </button>
          )}
        </div>
      </div>

      {/* RESULTS — 2-up grid both personas */}
      <div
        className="scroll-container"
        style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "12px 16px 30px" }}
      >
        {visible.length === 0 ? (
          <EmptyState isPerks={isPerks} onReset={resetAll} />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {isPerks
              ? visible.map((perk) => <PerkCard key={perk.id} perk={perk} />)
              : visible.map((talent) => <TalentCard key={talent.id} talent={talent} />)}
          </div>
        )}
      </div>

      {showFilters && (
        <>
          {isPerks ? (
            <PerkFilterSheet
              onClose={() => setShowFilters(false)}
              activeCount={perkActiveCount}
              categories={perkCategories} setCategories={setPerkCategories}
              valueMin={perkValueMin} setValueMin={setPerkValueMin}
              valueMax={perkValueMax} setValueMax={setPerkValueMax}
              qualifyOnly={perkQualifyOnly} setQualifyOnly={setPerkQualifyOnly}
              expiringOnly={perkExpiringOnly} setExpiringOnly={setPerkExpiringOnly}
              sort={perkSort} setSort={setPerkSort}
              onReset={resetAll}
            />
          ) : (
            <TalentFilterSheet
              onClose={() => setShowFilters(false)}
              activeCount={talentActiveCount}
              contentTypes={contentTypes} setContentTypes={setContentTypes}
              audienceTiers={audienceTiers} setAudienceTiers={setAudienceTiers}
              platforms={platforms} setPlatforms={setPlatforms}
              priceMin={priceMin} setPriceMin={setPriceMin}
              priceMax={priceMax} setPriceMax={setPriceMax}
              availableOnly={availableOnly} setAvailableOnly={setAvailableOnly}
              minRating={minRating} setMinRating={setMinRating}
              languages={languages} setLanguages={setLanguages}
              ageBrackets={ageBrackets} setAgeBrackets={setAgeBrackets}
              genders={genders} setGenders={setGenders}
              sort={talentSort} setSort={setTalentSort}
              onReset={resetAll}
            />
          )}
        </>
      )}
    </div>
  );
}

// =================================================================
// PERK CARD — grid
// =================================================================
function PerkCard({ perk }) {
  return (
    <button
      style={{
        background: "transparent", border: "none", padding: 0, cursor: "pointer",
        textAlign: "left", fontFamily: T.fontBody,
        display: "flex", flexDirection: "column", gap: 10,
      }}
    >
      <div
        style={{
          position: "relative", width: "100%", aspectRatio: "4/5",
          borderRadius: 14, overflow: "hidden", border: `1px solid ${T.borderStrong}`,
        }}
      >
        <img src={perk.cover} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />

        {(perk.badge || perk.expiringSoon) && (
          <div
            style={{
              position: "absolute", top: 10, left: 10,
              padding: "5px 10px", borderRadius: 100,
              background: "rgba(26, 24, 21, 0.85)",
              backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
              border: `1px solid ${T.accentBorder}`,
              fontFamily: T.fontMono, fontSize: 9, color: T.accent,
              letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600,
            }}
          >
            {perk.expiringSoon ? "Expiring" : perk.badge}
          </div>
        )}

        <div
          style={{
            position: "absolute", left: 0, right: 0, bottom: 0, height: 80,
            background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute", bottom: 10, left: 10,
            padding: "5px 10px", borderRadius: 100,
            background: "rgba(26, 24, 21, 0.85)",
            backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
            fontFamily: T.fontDisplay, fontSize: 13, fontWeight: 700,
            color: T.ink, letterSpacing: "-0.025em",
          }}
        >
          ₪{perk.value}
        </div>
      </div>

      <div style={{ padding: "0 2px" }}>
        <div
          style={{
            fontFamily: T.fontDisplay, fontSize: 14.5, fontWeight: 700,
            color: T.ink, letterSpacing: "-0.025em", lineHeight: 1.15,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            marginBottom: 4,
          }}
        >
          {perk.title}
        </div>
        <div
          style={{
            fontFamily: T.fontMono, fontSize: 9, color: T.inkMuted,
            letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 500,
            marginBottom: 6,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}
        >
          {perk.business}
        </div>
        <div
          style={{
            display: "flex", alignItems: "center", gap: 6,
            fontFamily: T.fontMono, fontSize: 9,
            letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 500,
            whiteSpace: "nowrap", overflow: "hidden",
          }}
        >
          <span style={{ color: T.inkMuted, flexShrink: 0 }}>{getCardPlatformLine(perk)}</span>
          <span style={{ width: 3, height: 3, borderRadius: "50%", background: T.inkSubtle, flexShrink: 0 }} />
          {qualifiesFor(perk) ? (
            <span style={{ color: T.accent, fontWeight: 600, display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
              You qualify <Check size={9} strokeWidth={3} />
            </span>
          ) : (
            <span style={{ color: T.decline, fontWeight: 600, flexShrink: 0 }}>Below threshold</span>
          )}
        </div>
      </div>
    </button>
  );
}

// =================================================================
// TALENT CARD — grid, NO pulse-dot (removed per production)
// =================================================================
function TalentCard({ talent }) {
  return (
    <button
      style={{
        background: "transparent", border: "none", padding: 0, cursor: "pointer",
        textAlign: "left", fontFamily: T.fontBody,
        display: "flex", flexDirection: "column", gap: 10,
      }}
    >
      <div
        style={{
          position: "relative", width: "100%", aspectRatio: "4/5",
          borderRadius: 14, overflow: "hidden", border: `1px solid ${T.borderStrong}`,
        }}
      >
        <img src={talent.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        {talent.badge && (
          <div
            style={{
              position: "absolute", top: 10, left: 10,
              padding: "5px 10px", borderRadius: 100,
              background: "rgba(26, 24, 21, 0.85)",
              backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
              border: `1px solid ${T.accentBorder}`,
              fontFamily: T.fontMono, fontSize: 9, color: T.accent,
              letterSpacing: "0.18em", textTransform: "uppercase", fontWeight: 600,
            }}
          >
            {talent.badge}
          </div>
        )}
        <div
          style={{
            position: "absolute", left: 0, right: 0, bottom: 0, height: 70,
            background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)",
            pointerEvents: "none",
          }}
        />
        {talent.rating && (
          <div
            style={{
              position: "absolute", bottom: 10, left: 10,
              display: "flex", alignItems: "center", gap: 4,
              padding: "4px 8px 4px 7px",
              background: "rgba(26, 24, 21, 0.85)",
              backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)",
              borderRadius: 100,
            }}
          >
            <Star size={10} fill={T.accent} color={T.accent} strokeWidth={0} />
            <span style={{
              fontFamily: T.fontDisplay, fontSize: 11.5, fontWeight: 700,
              color: T.ink, letterSpacing: "-0.02em", lineHeight: 1,
            }}>
              {talent.rating}
            </span>
          </div>
        )}
      </div>
      <div style={{ padding: "0 2px" }}>
        <div
          style={{
            fontFamily: T.fontDisplay, fontSize: 14.5, fontWeight: 700,
            color: T.ink, letterSpacing: "-0.025em", lineHeight: 1.15,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            marginBottom: 4,
          }}
        >
          {talent.name}
        </div>
        {talent.categories && talent.categories[0] && (
          <div
            style={{
              fontFamily: T.fontMono, fontSize: 9, color: T.inkMuted,
              letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 500,
              whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
            }}
          >
            {talent.categories[0]}
          </div>
        )}
      </div>
    </button>
  );
}

// =================================================================
// SHARED FILTER CHROME — matches reference exactly
// Header: super title (mono accent) + "Filters" display 800
// Footer: Reset only (filters apply live, dismiss via X or pan-down)
// =================================================================
function FilterSheetShell({ children, onClose, onReset, activeCount, refineLabel }) {
  return (
    <>
      <div
        className="overlay-fade"
        onClick={onClose}
        style={{
          position: "absolute", inset: 0,
          background: "rgba(0, 0, 0, 0.55)",
          backdropFilter: "blur(2px)", WebkitBackdropFilter: "blur(2px)",
          zIndex: 60,
        }}
      />
      <div
        className="sheet-rise"
        style={{
          position: "absolute", left: 0, right: 0, bottom: 0,
          background: T.bg,
          borderTopLeftRadius: 22, borderTopRightRadius: 22,
          boxShadow: "0 -20px 60px rgba(0,0,0,0.5)",
          zIndex: 70,
          height: "92%",
          display: "flex", flexDirection: "column",
          borderTop: `1px solid ${T.borderStrong}`,
          overflow: "hidden",
        }}
      >
        {/* Drag handle */}
        <div style={{ padding: "10px 0 6px", display: "flex", justifyContent: "center", flexShrink: 0 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: T.borderStrong }} />
        </div>

        {/* Header — super title + "Filters" */}
        <div
          style={{
            padding: "8px 22px 18px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            borderBottom: `1px solid ${T.border}`,
            flexShrink: 0,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: T.fontMono, fontSize: 10,
                color: T.accent,
                letterSpacing: "0.2em", textTransform: "uppercase",
                fontWeight: 500, marginBottom: 6,
              }}
            >
              {activeCount > 0 ? `${activeCount} ACTIVE` : refineLabel}
            </div>
            <h2
              style={{
                fontFamily: T.fontDisplay, fontSize: 26, fontWeight: 800,
                margin: 0, color: T.ink, letterSpacing: "-0.04em", lineHeight: 1,
              }}
            >
              Filters
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 38, height: 38, borderRadius: "50%",
              background: T.surface, border: `1px solid ${T.border}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: T.ink,
            }}
          >
            <X size={18} strokeWidth={2.2} />
          </button>
        </div>

        {/* Body */}
        <div className="scroll-container" style={{ overflowY: "auto", flex: 1, minHeight: 0, padding: "20px 22px 8px" }}>
          {children}
        </div>

        {/* Footer — Reset only */}
        <div
          style={{
            padding: "14px 16px 22px",
            background: T.bg,
            borderTop: `1px solid ${T.border}`,
            display: "flex", gap: 8,
            flexShrink: 0,
          }}
        >
          <button
            onClick={onReset}
            style={{
              flex: 1,
              background: "transparent", color: T.ink,
              border: `1px solid ${T.borderStrong}`,
              padding: "16px 22px", borderRadius: 100,
              fontSize: 14.5, fontWeight: 700,
              fontFamily: T.fontDisplay,
              cursor: "pointer", letterSpacing: "-0.015em",
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </>
  );
}

// Section wrapper — title + optional hint
function FilterSection({ title, hint, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
        <h3
          style={{
            fontFamily: T.fontDisplay, fontSize: 16, fontWeight: 700,
            margin: 0, color: T.ink, letterSpacing: "-0.025em",
          }}
        >
          {title}
        </h3>
        {hint && (
          <span
            style={{
              fontFamily: T.fontMono, fontSize: 9.5,
              color: T.accent,
              letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 600,
            }}
          >
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

// Pill grid (content type, language, gender, categories)
function PillGrid({ options, selected, onToggle }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
      {options.map((opt) => {
        const isActive = selected.includes(opt.id);
        return (
          <button
            key={opt.id}
            onClick={() => onToggle(opt.id)}
            style={{
              padding: "9px 14px", borderRadius: 100,
              background: isActive ? T.accentSoft : T.surface,
              border: `1px solid ${isActive ? T.accentBorder : T.border}`,
              cursor: "pointer",
              fontFamily: T.fontDisplay, fontSize: 13, fontWeight: 600,
              color: isActive ? T.accent : T.ink, letterSpacing: "-0.01em",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// Sort section — full-width cards with check indicator
function SortSection({ sort, setSort, options }) {
  return (
    <FilterSection title="Sort by">
      <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 4 }}>
        {options.map((opt) => {
          const isActive = sort === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setSort(opt.id)}
              style={{
                width: "100%", padding: "13px 16px",
                background: isActive ? T.accentSoft : T.surface,
                border: `1px solid ${isActive ? T.accentBorder : T.border}`,
                borderRadius: 12, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                fontFamily: T.fontDisplay, fontSize: 14, fontWeight: 600,
                color: T.ink, letterSpacing: "-0.02em", textAlign: "left",
              }}
            >
              {opt.label}
              {isActive && (
                <div
                  style={{
                    width: 18, height: 18, borderRadius: "50%",
                    background: T.accent,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Check size={11} strokeWidth={3} color={T.bg} />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </FilterSection>
  );
}

// =================================================================
// PERK FILTER SHEET — matches PerkFilterSheet.tsx reference (5 sections)
// 1. Categories  2. Value range  3. Reach  4. Urgency  5. Sort
// =================================================================
function PerkFilterSheet({
  onClose, activeCount,
  categories, setCategories,
  valueMin, setValueMin,
  valueMax, setValueMax,
  qualifyOnly, setQualifyOnly,
  expiringOnly, setExpiringOnly,
  sort, setSort,
  onReset,
}) {
  const toggleCategory = (cat) => {
    setCategories(categories.includes(cat) ? categories.filter((c) => c !== cat) : [...categories, cat]);
  };

  return (
    <FilterSheetShell onClose={onClose} onReset={onReset} activeCount={activeCount} refineLabel="REFINE PERKS">
      {/* 1. Categories */}
      <FilterSection title="Categories" hint={categories.length > 0 ? `${categories.length} selected` : null}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
          {PERK_CATEGORIES.map((cat) => {
            const isActive = categories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                style={{
                  padding: "9px 14px", borderRadius: 100,
                  background: isActive ? T.accentSoft : T.surface,
                  border: `1px solid ${isActive ? T.accentBorder : T.border}`,
                  cursor: "pointer",
                  fontFamily: T.fontDisplay, fontSize: 13, fontWeight: 600,
                  color: isActive ? T.accent : T.ink, letterSpacing: "-0.01em",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* 2. Value range — uses → arrow per reference */}
      <FilterSection title="Value range" hint={`₪${valueMin} → ₪${valueMax}`}>
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <NumberInput value={valueMin} onChange={setValueMin} label="MIN" />
          <NumberInput value={valueMax} onChange={setValueMax} label="MAX" />
        </div>
      </FilterSection>

      {/* 3. Reach */}
      <FilterSection title="Reach">
        <ToggleRow active={qualifyOnly} onToggle={() => setQualifyOnly(!qualifyOnly)} label="Show only perks I qualify for" />
      </FilterSection>

      {/* 4. Urgency */}
      <FilterSection title="Urgency">
        <ToggleRow active={expiringOnly} onToggle={() => setExpiringOnly(!expiringOnly)} label="Expiring soon only" />
      </FilterSection>

      {/* 5. Sort */}
      <SortSection sort={sort} setSort={setSort} options={PERK_SORT} />
    </FilterSheetShell>
  );
}

// =================================================================
// TALENT FILTER SHEET — matches FilterSheet.tsx reference (10 sections)
// 1. Content type  2. Audience size  3. Platform  4. Price range
// 5. Availability  6. Min rating  7. Language  8. Age bracket  9. Gender  10. Sort
// =================================================================
function TalentFilterSheet({
  onClose, activeCount,
  contentTypes, setContentTypes,
  audienceTiers, setAudienceTiers,
  platforms, setPlatforms,
  priceMin, setPriceMin,
  priceMax, setPriceMax,
  availableOnly, setAvailableOnly,
  minRating, setMinRating,
  languages, setLanguages,
  ageBrackets, setAgeBrackets,
  genders, setGenders,
  sort, setSort,
  onReset,
}) {
  const togglePill = (id, list, setList) => {
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  };

  return (
    <FilterSheetShell onClose={onClose} onReset={onReset} activeCount={activeCount} refineLabel="REFINE YOUR SEARCH">
      {/* 1. Content type */}
      <FilterSection title="Content type" hint={contentTypes.length > 0 ? `${contentTypes.length} selected` : null}>
        <PillGrid options={CONTENT_TYPES} selected={contentTypes} onToggle={(id) => togglePill(id, contentTypes, setContentTypes)} />
      </FilterSection>

      {/* 2. Audience size — 2-col grid with label + hint */}
      <FilterSection title="Audience size" hint={audienceTiers.length > 0 ? `${audienceTiers.length} selected` : null}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 4 }}>
          {AUDIENCE_TIERS.map((tier) => {
            const isActive = audienceTiers.includes(tier.id);
            return (
              <button
                key={tier.id}
                onClick={() => togglePill(tier.id, audienceTiers, setAudienceTiers)}
                style={{
                  padding: "12px 14px",
                  background: isActive ? T.accentSoft : T.surface,
                  border: `1px solid ${isActive ? T.accentBorder : T.border}`,
                  borderRadius: 14, cursor: "pointer",
                  textAlign: "left", fontFamily: T.fontBody,
                }}
              >
                <div style={{
                  fontFamily: T.fontDisplay, fontSize: 14, fontWeight: 700,
                  color: isActive ? T.accent : T.ink,
                  letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 4,
                }}>
                  {tier.label}
                </div>
                <div style={{
                  fontFamily: T.fontMono, fontSize: 9.5,
                  color: T.inkMuted, letterSpacing: "0.12em", fontWeight: 500,
                }}>
                  {tier.hint}
                </div>
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* 3. Platform — pill chips with icon */}
      <FilterSection title="Platform" hint={platforms.length > 0 ? `${platforms.length} selected` : null}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
          {PLATFORMS.map((p) => {
            const isActive = platforms.includes(p.id);
            const Icon = p.Icon;
            return (
              <button
                key={p.id}
                onClick={() => togglePill(p.id, platforms, setPlatforms)}
                style={{
                  padding: "9px 14px",
                  background: isActive ? T.accentSoft : T.surface,
                  border: `1px solid ${isActive ? T.accentBorder : T.border}`,
                  borderRadius: 100, cursor: "pointer",
                  fontFamily: T.fontDisplay, fontSize: 13, fontWeight: 600,
                  color: isActive ? T.accent : T.ink,
                  letterSpacing: "-0.01em",
                  display: "flex", alignItems: "center", gap: 7,
                }}
              >
                <Icon size={13} strokeWidth={2.2} />
                {p.label}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* 4. Price range — uses – (en dash) per reference */}
      <FilterSection title="Price range" hint={`₪${priceMin} – ₪${priceMax}`}>
        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <NumberInput value={priceMin} onChange={setPriceMin} label="MIN" />
          <NumberInput value={priceMax} onChange={setPriceMax} label="MAX" />
        </div>
      </FilterSection>

      {/* 5. Availability */}
      <FilterSection title="Availability">
        <ToggleRow active={availableOnly} onToggle={() => setAvailableOnly(!availableOnly)} label="Available now only" />
      </FilterSection>

      {/* 6. Min rating */}
      <FilterSection title="Minimum rating" hint={minRating > 0 ? `${minRating}.0 stars or above` : null}>
        <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
          {[1, 2, 3, 4, 5].map((stars) => {
            const isActive = minRating === stars;
            const isLower = minRating > stars;
            return (
              <button
                key={stars}
                onClick={() => setMinRating(minRating === stars ? 0 : stars)}
                style={{
                  flex: 1, padding: "12px 8px",
                  background: isActive ? T.accentSoft : T.surface,
                  border: `1px solid ${isActive ? T.accentBorder : T.border}`,
                  borderRadius: 12, cursor: "pointer",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                }}
              >
                <Star
                  size={14}
                  fill={isActive || isLower ? T.accent : "transparent"}
                  color={isActive || isLower ? T.accent : T.inkMuted}
                  strokeWidth={isActive || isLower ? 0 : 2}
                />
                <span style={{
                  fontFamily: T.fontMono, fontSize: 9.5,
                  color: isActive ? T.accent : T.inkMuted,
                  fontWeight: 600, letterSpacing: "0.05em",
                }}>
                  {stars}+
                </span>
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* 7. Content language */}
      <FilterSection title="Content language" hint={languages.length > 0 ? `${languages.length} selected` : null}>
        <PillGrid options={LANGUAGES} selected={languages} onToggle={(id) => togglePill(id, languages, setLanguages)} />
      </FilterSection>

      {/* 8. Age bracket — 2-col grid, no hint, centered */}
      <FilterSection title="Age bracket" hint={ageBrackets.length > 0 ? `${ageBrackets.length} selected` : null}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 4 }}>
          {AGE_BRACKETS.map((b) => {
            const isActive = ageBrackets.includes(b.id);
            return (
              <button
                key={b.id}
                onClick={() => togglePill(b.id, ageBrackets, setAgeBrackets)}
                style={{
                  padding: "12px 14px",
                  background: isActive ? T.accentSoft : T.surface,
                  border: `1px solid ${isActive ? T.accentBorder : T.border}`,
                  borderRadius: 12, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: T.fontDisplay, fontSize: 14, fontWeight: 700,
                  color: isActive ? T.accent : T.ink, letterSpacing: "-0.02em",
                }}
              >
                {b.label}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* 9. Gender */}
      <FilterSection title="Gender" hint={genders.length > 0 ? `${genders.length} selected` : null}>
        <PillGrid options={GENDERS} selected={genders} onToggle={(id) => togglePill(id, genders, setGenders)} />
      </FilterSection>

      {/* 10. Sort by */}
      <SortSection sort={sort} setSort={setSort} options={TALENT_SORT} />
    </FilterSheetShell>
  );
}

// =================================================================
// HELPERS — match reference Number input + Toggle row
// =================================================================
function NumberInput({ value, onChange, label }) {
  return (
    <div
      style={{
        flex: 1, padding: "10px 14px",
        background: T.surface, border: `1px solid ${T.border}`,
        borderRadius: 12,
      }}
    >
      <div
        style={{
          fontFamily: T.fontMono, fontSize: 9,
          color: T.inkMuted,
          letterSpacing: "0.18em", textTransform: "uppercase",
          fontWeight: 500, marginBottom: 4,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span style={{ fontFamily: T.fontDisplay, fontSize: 14, fontWeight: 500, color: T.inkMuted }}>₪</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value || "0", 10))}
          style={{
            flex: 1, background: "transparent", border: "none", outline: "none",
            fontFamily: T.fontDisplay, fontSize: 16, fontWeight: 700,
            color: T.ink, letterSpacing: "-0.025em",
            padding: 0, width: "100%",
          }}
        />
      </div>
    </div>
  );
}

function ToggleRow({ active, onToggle, label }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: "100%", padding: "14px 16px",
        background: active ? T.accentSoft : T.surface,
        border: `1px solid ${active ? T.accentBorder : T.border}`,
        borderRadius: 14, cursor: "pointer",
        display: "flex", alignItems: "center", gap: 12,
        fontFamily: T.fontBody, textAlign: "left", marginTop: 4,
      }}
    >
      <div
        style={{
          width: 22, height: 22, borderRadius: 6,
          border: active ? "none" : `1.5px solid ${T.borderStrong}`,
          background: active ? T.accent : "transparent",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {active && <Check size={14} strokeWidth={3} color={T.bg} />}
      </div>
      <span style={{
        fontFamily: T.fontDisplay, fontSize: 14.5, fontWeight: 600,
        color: T.ink, letterSpacing: "-0.02em",
      }}>
        {label}
      </span>
    </button>
  );
}

// =================================================================
// EMPTY STATE
// =================================================================
function EmptyState({ isPerks, onReset }) {
  return (
    <div style={{ padding: "50px 22px", textAlign: "center", fontFamily: T.fontBody, gridColumn: "1 / -1" }}>
      <div
        style={{
          fontFamily: T.fontMono, fontSize: 10,
          color: T.inkMuted,
          letterSpacing: "0.22em", textTransform: "uppercase",
          fontWeight: 600, marginBottom: 12,
        }}
      >
        Nothing matches
      </div>
      <p
        style={{
          fontFamily: T.fontBody, fontSize: 14,
          color: T.ink, opacity: 0.7,
          lineHeight: 1.5, margin: "0 auto 22px",
          maxWidth: "30ch",
        }}
      >
        Drop a filter or clear the search to see more {isPerks ? "perks" : "talent"}.
      </p>
      <button
        onClick={onReset}
        style={{
          padding: "12px 20px",
          background: "transparent",
          border: `1px solid ${T.borderStrong}`,
          borderRadius: 100, cursor: "pointer",
          fontFamily: T.fontDisplay, fontSize: 13, fontWeight: 700,
          color: T.ink, letterSpacing: "-0.015em",
        }}
      >
        Reset filters
      </button>
    </div>
  );
}
