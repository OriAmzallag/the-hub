// =================================================================
// REFERENCE FILE — Business Discover screen (v2 — filters iteration)
// =================================================================
// Source: Tom-provided update, 2026-05-09 (v2 of the original reference)
//
// v2 CHANGES vs. the previous reference:
//   - REMOVED: Location radius slider (was 1–50 km from user)
//   - ADDED: Content type multi-select (10 options: UGC, Sponsored,
//            Short-Form Video, Lifestyle, Product Review, Tutorial,
//            Storytelling, Performance, Testimonial, BTS)
//   - ADDED: Audience size 2×2 grid (Nano <10K, Micro 10–50K,
//            Mid 50–500K, Macro 500K+) — labels with hint sublabel
//   - ADDED: Content language multi-select (Hebrew, English, Arabic,
//            Russian)
//   - ADDED: Age bracket 2×2 grid (18–24, 25–34, 35–44, 45+)
//   - ADDED: Gender multi-select (Women, Men, Non-binary)
//   - ADDED: ActiveFilterChipBar component — appears between the
//            category chips and the content body when any filter is
//            active. Header shows "{N} filter(s) active" (mono accent)
//            + "Clear all" button. Body is a horizontal scroll of
//            removable chip pills (each with X icon).
//   - ADDED: DiscoverHeader filter button shows active state when
//            filters are active: accent-soft background, accent border,
//            accent icon color, and a small badge in the top-right with
//            the count of active filters (mono, accent-on-bg).
//   - UPDATED: FilterSheet header subtitle says "{N} active" when
//              filters are active, otherwise "Refine your search".
//   - UPDATED: FilterSection's `hint` is now styled in accent color
//              (was inkMuted) since hints now mean "{N} selected" or
//              the active price range.
//
// New filter section order (top to bottom):
//   1. Content type        — pill grid (multi-select)
//   2. Audience size       — 2×2 grid with label + hint
//   3. Platform            — pill grid with icons (multi-select)
//   4. Price range         — 2 number inputs
//   5. Availability        — checkbox toggle
//   6. Minimum rating      — 5-button row with cumulative star fills
//   7. Content language    — pill grid (multi-select)
//   8. Age bracket         — 2×2 grid (multi-select)
//   9. Gender              — pill grid (multi-select)
//  10. Sort by             — vertical radio list
//
// Same web-only patterns as before — ignore inline styles, CSS
// keyframes, backdropFilter strings, <img>/<input>, the phone-frame
// wrapper, the dev-time state toggle. Implement using React Native +
// NativeWind + Reanimated + expo-blur + expo-image + lucide-react-native.
//
// Encoding artifacts in the source:
//   `âª`  → `₪`
//   `Ã`   → `×`
//   `→`   → `→` (sometimes shown as `â`)
// In this file the correct Unicode characters are used.
//
// =================================================================

import { useState } from "react";
import {
  Search,
  LayoutDashboard,
  MessageSquare,
  User,
  Sliders,
  Star,
  ChevronRight,
  X,
  Check,
  Instagram,
  Music2,
  Youtube,
  CalendarClock,
} from "lucide-react";

// =================================================================
// DESIGN TOKENS — Metal × Sunset Orange
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

  fontDisplay: "'Inter Tight', system-ui, sans-serif",
  fontBody: "'Inter Tight', system-ui, sans-serif",
  fontMono: "'JetBrains Mono', monospace",
};

// =================================================================
// MOCK DATA
// =================================================================
const TALENT = [
  { id: "t-1", name: "Maya Cohen", photo: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80", rating: 4.9, badge: "Top match", available: true },
  { id: "t-2", name: "Noa Berman", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80", rating: 4.8, badge: null, available: true },
  { id: "t-3", name: "Daniel Levi", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80", rating: 4.7, badge: null, available: false },
  { id: "t-4", name: "Yael Mizrahi", photo: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80", rating: 5.0, badge: "Top rated", available: true },
  { id: "t-5", name: "Tomer Avraham", photo: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=600&q=80", rating: null, badge: "New", available: true },
  { id: "t-6", name: "Roni Kaplan", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80", rating: 4.9, badge: null, available: true },
  { id: "t-7", name: "Adi Shoham", photo: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80", rating: 4.6, badge: null, available: false },
];

const ROWS = [
  { id: "row-match", title: "Top match for FitBar", subtitle: "Based on your category", talentIds: ["t-1", "t-6", "t-2", "t-3"] },
  { id: "row-trending", title: "Trending in Tel Aviv", subtitle: null, talentIds: ["t-2", "t-4", "t-1", "t-7"] },
  { id: "row-toprated", title: "Top rated", subtitle: null, talentIds: ["t-4", "t-1", "t-6", "t-2"] },
  { id: "row-new", title: "New on The Hub", subtitle: null, talentIds: ["t-5", "t-7", "t-3"] },
  { id: "row-available", title: "Available right now", subtitle: null, talentIds: ["t-1", "t-2", "t-4", "t-5", "t-6"] },
];

const CATEGORIES = ["All", "Fitness", "Lifestyle", "Food", "Fashion", "Beauty", "Music", "Tech"];

// New filter option lists
const CONTENT_TYPES = [
  { id: "ugc", label: "UGC" },
  { id: "sponsored", label: "Sponsored" },
  { id: "short_video", label: "Short-Form Video" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "product_review", label: "Product Review" },
  { id: "tutorial", label: "Tutorial / Educational" },
  { id: "storytelling", label: "Storytelling" },
  { id: "performance", label: "Performance Creative" },
  { id: "testimonial", label: "Testimonial" },
  { id: "bts", label: "Behind-the-Scenes" },
];

const AUDIENCE_TIERS = [
  { id: "nano", label: "Nano", hint: "<10K" },
  { id: "micro", label: "Micro", hint: "10–50K" },
  { id: "mid", label: "Mid", hint: "50–500K" },
  { id: "macro", label: "Macro", hint: "500K+" },
];

const LANGUAGES = [
  { id: "he", label: "Hebrew" },
  { id: "en", label: "English" },
  { id: "ar", label: "Arabic" },
  { id: "ru", label: "Russian" },
];

const AGE_BRACKETS = [
  { id: "18-24", label: "18–24" },
  { id: "25-34", label: "25–34" },
  { id: "35-44", label: "35–44" },
  { id: "45+", label: "45+" },
];

const GENDERS = [
  { id: "women", label: "Women" },
  { id: "men", label: "Men" },
  { id: "nonbinary", label: "Non-binary" },
];

const PLATFORMS = [
  { id: "ig", label: "Instagram", Icon: Instagram },
  { id: "tt", label: "TikTok", Icon: Music2 },
  { id: "yt", label: "YouTube", Icon: Youtube },
  { id: "ev", label: "Event", Icon: CalendarClock },
];

const SORT_OPTIONS = [
  { id: "recommended", label: "Recommended" },
  { id: "price_low", label: "Price: low → high" },
  { id: "price_high", label: "Price: high → low" },
  { id: "rating", label: "Rating" },
  { id: "newest", label: "Newest" },
];

// =================================================================
// MAIN
// =================================================================
export default function BusinessDiscover() {
  const [demoState, setDemoState] = useState("content");
  const [activeTab, setActiveTab] = useState("discover");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchValue, setSearchValue] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filter state — multi-select arrays + sort
  const [filterContentTypes, setFilterContentTypes] = useState([]);
  const [filterAudienceTiers, setFilterAudienceTiers] = useState([]);
  const [filterPlatforms, setFilterPlatforms] = useState([]);
  const [filterPriceMin, setFilterPriceMin] = useState(50);
  const [filterPriceMax, setFilterPriceMax] = useState(2000);
  const [filterAvailableOnly, setFilterAvailableOnly] = useState(false);
  const [filterMinRating, setFilterMinRating] = useState(0);
  const [filterLanguages, setFilterLanguages] = useState([]);
  const [filterAgeBrackets, setFilterAgeBrackets] = useState([]);
  const [filterGenders, setFilterGenders] = useState([]);
  const [filterSort, setFilterSort] = useState("recommended");

  // Defaults — used to detect active state
  const PRICE_MIN_DEFAULT = 50;
  const PRICE_MAX_DEFAULT = 2000;
  const isPriceActive =
    filterPriceMin !== PRICE_MIN_DEFAULT ||
    filterPriceMax !== PRICE_MAX_DEFAULT;
  const isSortActive = filterSort !== "recommended";

  // Build active filter chips list (each chip removes one specific filter value)
  const activeChips = [];
  filterContentTypes.forEach((id) => {
    const opt = CONTENT_TYPES.find((o) => o.id === id);
    if (opt) activeChips.push({ key: `ct-${id}`, label: opt.label, remove: () => setFilterContentTypes((p) => p.filter((x) => x !== id)) });
  });
  filterAudienceTiers.forEach((id) => {
    const opt = AUDIENCE_TIERS.find((o) => o.id === id);
    if (opt) activeChips.push({ key: `at-${id}`, label: opt.label, remove: () => setFilterAudienceTiers((p) => p.filter((x) => x !== id)) });
  });
  filterPlatforms.forEach((id) => {
    const opt = PLATFORMS.find((o) => o.id === id);
    if (opt) activeChips.push({ key: `pl-${id}`, label: opt.label, remove: () => setFilterPlatforms((p) => p.filter((x) => x !== id)) });
  });
  if (isPriceActive) {
    activeChips.push({ key: "price", label: `₪${filterPriceMin}–₪${filterPriceMax}`, remove: () => { setFilterPriceMin(PRICE_MIN_DEFAULT); setFilterPriceMax(PRICE_MAX_DEFAULT); } });
  }
  if (filterAvailableOnly) {
    activeChips.push({ key: "avail", label: "Available now", remove: () => setFilterAvailableOnly(false) });
  }
  if (filterMinRating > 0) {
    activeChips.push({ key: "rating", label: `${filterMinRating}+ ★`, remove: () => setFilterMinRating(0) });
  }
  filterLanguages.forEach((id) => {
    const opt = LANGUAGES.find((o) => o.id === id);
    if (opt) activeChips.push({ key: `lang-${id}`, label: opt.label, remove: () => setFilterLanguages((p) => p.filter((x) => x !== id)) });
  });
  filterAgeBrackets.forEach((id) => {
    const opt = AGE_BRACKETS.find((o) => o.id === id);
    if (opt) activeChips.push({ key: `age-${id}`, label: opt.label, remove: () => setFilterAgeBrackets((p) => p.filter((x) => x !== id)) });
  });
  filterGenders.forEach((id) => {
    const opt = GENDERS.find((o) => o.id === id);
    if (opt) activeChips.push({ key: `gen-${id}`, label: opt.label, remove: () => setFilterGenders((p) => p.filter((x) => x !== id)) });
  });
  if (isSortActive) {
    const opt = SORT_OPTIONS.find((o) => o.id === filterSort);
    if (opt) activeChips.push({ key: "sort", label: opt.label, remove: () => setFilterSort("recommended") });
  }

  const hasActiveFilters = activeChips.length > 0;

  const clearAllFilters = () => {
    setFilterContentTypes([]);
    setFilterAudienceTiers([]);
    setFilterPlatforms([]);
    setFilterPriceMin(PRICE_MIN_DEFAULT);
    setFilterPriceMax(PRICE_MAX_DEFAULT);
    setFilterAvailableOnly(false);
    setFilterMinRating(0);
    setFilterLanguages([]);
    setFilterAgeBrackets([]);
    setFilterGenders([]);
    setFilterSort("recommended");
  };

  const fullReset = () => {
    setActiveCategory("All");
    setSearchValue("");
    clearAllFilters();
    setDemoState("content");
  };

  // (rendering body — see chat history v1 reference for the boilerplate;
  //  the only NEW UI elements vs. v1 are listed at the top of this file)

  return null; // shape only — see component implementations below
}

// =================================================================
// ACTIVE FILTER CHIP BAR — NEW component (between category chips and body)
// =================================================================
function ActiveFilterChipBar({ chips, onClearAll }) {
  return (
    <div className="fade-up" style={{ flexShrink: 0, padding: "0 16px 12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <div
          style={{
            fontFamily: T.fontMono,
            fontSize: 9.5,
            color: T.accent,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 600,
            flex: 1,
          }}
        >
          {chips.length} {chips.length === 1 ? "filter" : "filters"} active
        </div>
        <button
          onClick={onClearAll}
          style={{
            background: "none",
            border: "none",
            fontFamily: T.fontMono,
            fontSize: 9.5,
            fontWeight: 500,
            color: T.inkMuted,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            cursor: "pointer",
            padding: 0,
          }}
        >
          Clear all
        </button>
      </div>
      <div className="h-scroll" style={{ display: "flex", gap: 6, overflowX: "auto" }}>
        {chips.map((chip) => (
          <button
            key={chip.key}
            onClick={chip.remove}
            style={{
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "6px 10px 6px 12px",
              background: T.accentSoft,
              border: `1px solid ${T.accentBorder}`,
              borderRadius: 100,
              cursor: "pointer",
              fontFamily: T.fontDisplay,
              fontSize: 12,
              fontWeight: 600,
              color: T.accent,
              letterSpacing: "-0.01em",
              transition: "all 0.15s ease",
            }}
          >
            {chip.label}
            <X size={11} strokeWidth={2.6} />
          </button>
        ))}
      </div>
    </div>
  );
}

// =================================================================
// HEADER FILTER BUTTON — UPDATED with active state + count badge
// =================================================================
// (This is the change vs. v1 inside DiscoverHeader)
function FilterButtonV2({ hasActiveFilters, count, onPress }) {
  return (
    <button
      onClick={onPress}
      aria-label="Filters"
      style={{
        width: 42,
        height: 42,
        borderRadius: "50%",
        background: hasActiveFilters ? T.accentSoft : T.surface,
        border: `1px solid ${hasActiveFilters ? T.accentBorder : T.border}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        color: hasActiveFilters ? T.accent : T.ink,
        flexShrink: 0,
        position: "relative",
        transition: "all 0.18s ease",
      }}
    >
      <Sliders size={17} strokeWidth={2.2} />
      {hasActiveFilters && (
        <span
          style={{
            position: "absolute",
            top: -3,
            right: -3,
            minWidth: 16,
            height: 16,
            borderRadius: 8,
            background: T.accent,
            border: `2px solid ${T.bg}`,
            color: T.bg,
            fontSize: 9,
            fontFamily: T.fontMono,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 4px",
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

// =================================================================
// FILTER PANEL — UPDATED with new sections (Location REMOVED)
// =================================================================
// New section order:
//   1. Content type       — PillGrid (multi-select)
//   2. Audience size      — 2×2 grid (label + hint sublabel)
//   3. Platform           — PillGrid with icons
//   4. Price range        — Min/Max NumberInputs
//   5. Availability       — checkbox toggle (unchanged)
//   6. Minimum rating     — 5 buttons (unchanged)
//   7. Content language   — PillGrid
//   8. Age bracket        — 2×2 grid
//   9. Gender             — PillGrid
//  10. Sort by            — radio list (unchanged)
//
// Sheet header subtitle: "{N} active" when filters set, else "Refine your search"

function FilterPanelV2({
  onClose,
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
  activeCount,
}) {
  const togglePill = (id, list, setList) => {
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  };

  return (
    <>
      {/* overlay + sheet container — same as v1, omitted for brevity */}

      {/* HEADER subtitle — UPDATED */}
      <div style={{ fontFamily: T.fontMono, fontSize: 10, color: T.accent, letterSpacing: "0.2em", textTransform: "uppercase", fontWeight: 500, marginBottom: 6 }}>
        {activeCount > 0 ? `${activeCount} active` : "Refine your search"}
      </div>

      {/* SECTIONS — see scrollable body below */}
      {/* 1. Content type */}
      <FilterSection title="Content type" hint={contentTypes.length > 0 ? `${contentTypes.length} selected` : null}>
        <PillGrid options={CONTENT_TYPES} selected={contentTypes} onToggle={(id) => togglePill(id, contentTypes, setContentTypes)} />
      </FilterSection>

      {/* 2. Audience size — 2×2 grid with label + hint */}
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
                  borderRadius: 14,
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: T.fontBody,
                  transition: "all 0.18s ease",
                }}
              >
                <div style={{ fontFamily: T.fontDisplay, fontSize: 14, fontWeight: 700, color: isActive ? T.accent : T.ink, letterSpacing: "-0.02em", lineHeight: 1.1, marginBottom: 4 }}>
                  {tier.label}
                </div>
                <div style={{ fontFamily: T.fontMono, fontSize: 9.5, color: T.inkMuted, letterSpacing: "0.12em", fontWeight: 500 }}>
                  {tier.hint}
                </div>
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* 3. Platform — pill grid with icons (UNCHANGED from v1) */}
      <FilterSection title="Platform" hint={platforms.length > 0 ? `${platforms.length} selected` : null}>
        {/* same as v1 — see PLATFORMS rendering */}
      </FilterSection>

      {/* 4. Price range — UNCHANGED from v1 */}
      <FilterSection title="Price range" hint={`₪${priceMin} – ₪${priceMax}`}>
        {/* same as v1 — Min/Max NumberInput cards */}
      </FilterSection>

      {/* 5. Availability — UNCHANGED from v1 */}
      <FilterSection title="Availability">
        {/* same as v1 — checkbox button */}
      </FilterSection>

      {/* 6. Minimum rating — UNCHANGED from v1 */}
      <FilterSection title="Minimum rating" hint={minRating > 0 ? `${minRating}.0 stars or above` : null}>
        {/* same as v1 — 5 button row */}
      </FilterSection>

      {/* 7. Content language — NEW */}
      <FilterSection title="Content language" hint={languages.length > 0 ? `${languages.length} selected` : null}>
        <PillGrid options={LANGUAGES} selected={languages} onToggle={(id) => togglePill(id, languages, setLanguages)} />
      </FilterSection>

      {/* 8. Age bracket — NEW (2×2 grid) */}
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
                  borderRadius: 12,
                  cursor: "pointer",
                  fontFamily: T.fontDisplay,
                  fontSize: 14,
                  fontWeight: 700,
                  color: isActive ? T.accent : T.ink,
                  letterSpacing: "-0.02em",
                  transition: "all 0.15s ease",
                }}
              >
                {b.label}
              </button>
            );
          })}
        </div>
      </FilterSection>

      {/* 9. Gender — NEW */}
      <FilterSection title="Gender" hint={genders.length > 0 ? `${genders.length} selected` : null}>
        <PillGrid options={GENDERS} selected={genders} onToggle={(id) => togglePill(id, genders, setGenders)} />
      </FilterSection>

      {/* 10. Sort by — UNCHANGED from v1 */}
      <FilterSection title="Sort by">
        {/* same as v1 — vertical radio list */}
      </FilterSection>

      {/* Sticky footer — Reset (outline) + Apply (primary) — UNCHANGED */}
    </>
  );
}

// =================================================================
// SHARED PILL GRID — used for Content type, Language, Gender
// =================================================================
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
              padding: "9px 14px",
              background: isActive ? T.accentSoft : T.surface,
              border: `1px solid ${isActive ? T.accentBorder : T.border}`,
              borderRadius: 100,
              cursor: "pointer",
              fontFamily: T.fontDisplay,
              fontSize: 13,
              fontWeight: 600,
              color: isActive ? T.accent : T.ink,
              letterSpacing: "-0.01em",
              transition: "all 0.15s ease",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

// =================================================================
// FilterSection helper — UPDATED so `hint` is rendered in accent color
// =================================================================
function FilterSection({ title, hint, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
        <h3 style={{ fontFamily: T.fontDisplay, fontSize: 16, fontWeight: 700, margin: 0, color: T.ink, letterSpacing: "-0.025em" }}>
          {title}
        </h3>
        {hint && (
          <span
            style={{
              fontFamily: T.fontMono,
              fontSize: 9.5,
              color: T.accent, // <-- changed from T.inkMuted in v1
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              fontWeight: 500,
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
