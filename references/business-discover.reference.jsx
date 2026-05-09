// =================================================================
// REFERENCE FILE — Business Discover screen
// =================================================================
// Source: Tom-provided reference, 2026-05-09
//
// PURPOSE: Visual reference ONLY. Do NOT port 1:1.
// The Hub is React Native (Expo) + NativeWind. Implement using native
// RN primitives, NativeWind classes where they map cleanly, and the
// design tokens already in `constants/theme.ts`.
//
// Same web-only patterns as the dashboard reference apply — ignore:
//   - inline `style={{...}}`        → use StyleSheet / NativeWind
//   - CSS @keyframes                → react-native-reanimated worklets
//   - `backdropFilter: blur`        → expo-blur
//   - `boxShadow` strings           → RN shadow props
//   - `<img>` / `<input>`           → expo-image / TextInput
//   - the 440px phone-frame wrapper → not needed in RN
//   - The DEMO STATE TOGGLE at the top → that's dev-time UX only.
//     Production should ship the real loading→content transition based
//     on data fetching state (not user-controlled).
//
// What this screen has that's NEW vs. the dashboard:
//   1. Search bar + filter icon button in the header
//   2. Horizontal scrolling category chips
//   3. Multiple horizontal scrolling Talent rows (Top match, Trending,
//      Top rated, New, Available now)
//   4. Talent card with image (4:5 aspect), available pulse dot, badge
//      pill, rating chip overlay, gradient bottom scrim
//   5. Three render states:
//        a. LOADING  — shimmer skeleton rows that match the real shape
//        b. CONTENT  — populated rows with TalentCards
//        c. EMPTY    — "No talent matches" hero + reset filters CTA
//   6. Filter Panel — bottom sheet with:
//        - Location radius slider (1–50 km)
//        - Price range two number inputs
//        - Platform multi-select (IG, TikTok, YouTube, Event)
//        - Min rating 1–5 buttons
//        - Available now toggle
//        - Sort radio list
//        - Sticky footer: Reset (outline) + Apply (primary)
//   7. Animations:
//        - pulse-dot       2s ease-in-out infinite, opacity 1↔0.4 (available indicator)
//        - fade-up         400ms ease-out, opacity 0→1, translateY 8px→0 (rows + empty state)
//        - shimmer         1.6s linear infinite, gradient sweep (skeletons)
//        - sheet-rise      420ms cubic-bezier(0.32, 0.72, 0, 1), translateY 100%→0% (filter sheet)
//        - overlay-fade    300ms ease-out, opacity 0→1 (sheet scrim)
//
// Mojibake note: the source pasted via chat had encoding artifacts.
//   `âª`  → `₪`
//   `Ã`   → `×`
//   `→`   → `→` (sometimes shown as `â`)
// In this file the correct Unicode characters are used.
//
// =================================================================

import { useState, useRef } from "react";
import {
  Search,
  LayoutDashboard,
  MessageSquare,
  User,
  Sliders,
  Star,
  ChevronRight,
  X,
  MapPin,
  Check,
  Instagram,
  Music2,
  Youtube,
  CalendarClock,
} from "lucide-react";

// =================================================================
// DESIGN TOKENS — Metal × Sunset Orange (locked, from system)
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
  {
    id: "t-1",
    name: "Maya Cohen",
    photo: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
    rating: 4.9,
    badge: "Top match",
    available: true,
    categories: ["Fitness", "Lifestyle"],
  },
  {
    id: "t-2",
    name: "Noa Berman",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80",
    rating: 4.8,
    badge: null,
    available: true,
    categories: ["Lifestyle", "Fashion"],
  },
  {
    id: "t-3",
    name: "Daniel Levi",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80",
    rating: 4.7,
    badge: null,
    available: false,
    categories: ["Food", "Lifestyle"],
  },
  {
    id: "t-4",
    name: "Yael Mizrahi",
    photo: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&q=80",
    rating: 5.0,
    badge: "Top rated",
    available: true,
    categories: ["Fashion", "Beauty"],
  },
  {
    id: "t-5",
    name: "Tomer Avraham",
    photo: "https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=600&q=80",
    rating: null,
    badge: "New",
    available: true,
    categories: ["Music", "Lifestyle"],
  },
  {
    id: "t-6",
    name: "Roni Kaplan",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80",
    rating: 4.9,
    badge: null,
    available: true,
    categories: ["Fitness", "Wellness"],
  },
  {
    id: "t-7",
    name: "Adi Shoham",
    photo: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80",
    rating: 4.6,
    badge: null,
    available: false,
    categories: ["Tech", "Lifestyle"],
  },
];

const ROWS = [
  {
    id: "row-match",
    title: "Top match for FitBar",
    subtitle: "Based on your category",
    talentIds: ["t-1", "t-6", "t-2", "t-3"],
  },
  {
    id: "row-trending",
    title: "Trending in Tel Aviv",
    subtitle: null,
    talentIds: ["t-2", "t-4", "t-1", "t-7"],
  },
  {
    id: "row-toprated",
    title: "Top rated",
    subtitle: null,
    talentIds: ["t-4", "t-1", "t-6", "t-2"],
  },
  {
    id: "row-new",
    title: "New on The Hub",
    subtitle: null,
    talentIds: ["t-5", "t-7", "t-3"],
  },
  {
    id: "row-available",
    title: "Available right now",
    subtitle: null,
    talentIds: ["t-1", "t-2", "t-4", "t-5", "t-6"],
  },
];

const CATEGORIES = [
  "All",
  "Fitness",
  "Lifestyle",
  "Food",
  "Fashion",
  "Beauty",
  "Music",
  "Tech",
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
  const [demoState, setDemoState] = useState("content"); // loading | content | empty (DEV ONLY — strip in prod)

  const [activeTab, setActiveTab] = useState("discover");
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchValue, setSearchValue] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const [filterRadius, setFilterRadius] = useState(10);
  const [filterPriceMin, setFilterPriceMin] = useState(50);
  const [filterPriceMax, setFilterPriceMax] = useState(2000);
  const [filterPlatforms, setFilterPlatforms] = useState([]);
  const [filterMinRating, setFilterMinRating] = useState(0);
  const [filterAvailableOnly, setFilterAvailableOnly] = useState(false);
  const [filterSort, setFilterSort] = useState("recommended");

  const resetFiltersState = () => {
    setActiveCategory("All");
    setSearchValue("");
    setFilterRadius(10);
    setFilterPriceMin(50);
    setFilterPriceMax(2000);
    setFilterPlatforms([]);
    setFilterMinRating(0);
    setFilterAvailableOnly(false);
    setFilterSort("recommended");
    setDemoState("content");
  };

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
        @import url('https://fonts.googleapis.com/css2?family=Inter+Tight:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        .scroll-container::-webkit-scrollbar { display: none; }
        .scroll-container { -ms-overflow-style: none; scrollbar-width: none; }
        .h-scroll::-webkit-scrollbar { display: none; }
        .h-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0% { background-position: -400px 0; }
          100% { background-position: 400px 0; }
        }
        @keyframes sheetRise {
          from { transform: translateY(100%); }
          to { transform: translateY(0%); }
        }
        @keyframes overlayFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }
        .fade-up { animation: fadeUp 0.4s ease-out both; }
        .skeleton-shimmer {
          background: linear-gradient(
            90deg,
            ${T.surface} 0%,
            ${T.surfaceAlt} 30%,
            #34302a 50%,
            ${T.surfaceAlt} 70%,
            ${T.surface} 100%
          );
          background-size: 800px 100%;
          animation: shimmer 1.6s linear infinite;
        }
        .sheet-rise { animation: sheetRise 0.42s cubic-bezier(0.32, 0.72, 0, 1) both; }
        .overlay-fade { animation: overlayFade 0.3s ease-out both; }
      `}</style>

      {/* DEMO STATE TOGGLE — STRIP IN PROD */}
      <div
        style={{
          maxWidth: 440,
          margin: "0 auto 12px",
          padding: "0 16px",
          display: "flex",
          gap: 6,
        }}
      >
        {[
          { id: "loading", label: "Loading" },
          { id: "content", label: "Content" },
          { id: "empty", label: "Empty" },
        ].map((opt) => {
          const isActive = demoState === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => setDemoState(opt.id)}
              style={{
                flex: 1,
                padding: "8px 10px",
                borderRadius: 10,
                border: isActive
                  ? "1px solid rgba(255,255,255,0.4)"
                  : "1px solid rgba(255,255,255,0.1)",
                background: isActive
                  ? "rgba(255,255,255,0.1)"
                  : "rgba(255,255,255,0.02)",
                color: "#fff",
                fontSize: 11,
                fontFamily: "system-ui",
                fontWeight: 600,
                cursor: "pointer",
                textAlign: "center",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* PHONE FRAME — REMOVE IN RN */}
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
          height: "calc(100vh - 100px)",
          maxHeight: 880,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            padding: "14px 16px 10px",
            background: T.bg,
            flexShrink: 0,
            zIndex: 5,
          }}
        >
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div
              style={{
                flex: 1,
                background: T.surface,
                border: `1px solid ${
                  searchValue.length > 0 ? T.borderStrong : T.border
                }`,
                borderRadius: 100,
                padding: "10px 14px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                transition: "border-color 0.15s ease",
              }}
            >
              <Search
                size={16}
                strokeWidth={2.2}
                color={searchValue.length > 0 ? T.ink : T.inkMuted}
              />
              <input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search talent or category..."
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontFamily: T.fontBody,
                  fontSize: 14,
                  color: T.ink,
                  fontWeight: 500,
                  minWidth: 0,
                }}
              />
            </div>
            <button
              onClick={() => setFiltersOpen(true)}
              aria-label="Filters"
              style={{
                width: 42,
                height: 42,
                borderRadius: "50%",
                background: T.surface,
                border: `1px solid ${T.border}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: T.ink,
                flexShrink: 0,
                position: "relative",
              }}
            >
              <Sliders size={17} strokeWidth={2.2} />
            </button>
          </div>
        </div>

        {/* CATEGORY CHIPS */}
        <div
          className="h-scroll"
          style={{
            display: "flex",
            gap: 8,
            padding: "6px 16px 14px",
            overflowX: "auto",
            flexShrink: 0,
          }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "8px 14px",
                  background: isActive ? T.accent : T.surface,
                  border: `1px solid ${isActive ? T.accent : T.border}`,
                  borderRadius: 100,
                  cursor: "pointer",
                  fontFamily: T.fontDisplay,
                  fontSize: 13,
                  fontWeight: 600,
                  color: isActive ? T.bg : T.ink,
                  letterSpacing: "-0.01em",
                  whiteSpace: "nowrap",
                  flexShrink: 0,
                  transition: "all 0.18s ease",
                  boxShadow: isActive ? `0 6px 16px ${T.accentShadow}` : "none",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* BODY */}
        <div
          className="scroll-container"
          style={{
            flex: 1,
            overflowY: "auto",
            paddingBottom: 100,
          }}
        >
          {demoState === "loading" && <SkeletonState />}
          {demoState === "content" && <ContentState />}
          {demoState === "empty" && <EmptyState onReset={resetFiltersState} />}
          <div style={{ height: 24 }} />
        </div>

        {/* FILTER PANEL */}
        {filtersOpen && (
          <FilterPanel
            onClose={() => setFiltersOpen(false)}
            radius={filterRadius}
            setRadius={setFilterRadius}
            priceMin={filterPriceMin}
            setPriceMin={setFilterPriceMin}
            priceMax={filterPriceMax}
            setPriceMax={setFilterPriceMax}
            platforms={filterPlatforms}
            setPlatforms={setFilterPlatforms}
            minRating={filterMinRating}
            setMinRating={setFilterMinRating}
            availableOnly={filterAvailableOnly}
            setAvailableOnly={setFilterAvailableOnly}
            sort={filterSort}
            setSort={setFilterSort}
            onReset={() => {
              setFilterRadius(10);
              setFilterPriceMin(50);
              setFilterPriceMax(2000);
              setFilterPlatforms([]);
              setFilterMinRating(0);
              setFilterAvailableOnly(false);
              setFilterSort("recommended");
            }}
          />
        )}

        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}

// =================================================================
// CONTENT STATE
// =================================================================
function ContentState() {
  return (
    <>
      {ROWS.map((row, idx) => (
        <TalentRow key={row.id} row={row} delayIndex={idx} />
      ))}
    </>
  );
}

// =================================================================
// SKELETON STATE
// =================================================================
function SkeletonState() {
  return (
    <>
      {[1, 2, 3].map((rowIdx) => (
        <div key={rowIdx} style={{ marginTop: 22 }}>
          <div
            style={{
              padding: "0 16px",
              marginBottom: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div
              className="skeleton-shimmer"
              style={{
                width: rowIdx === 1 ? 200 : 140,
                height: 22,
                borderRadius: 6,
              }}
            />
            <div
              className="skeleton-shimmer"
              style={{ width: 50, height: 12, borderRadius: 4 }}
            />
          </div>
          <div
            style={{
              display: "flex",
              gap: 10,
              padding: "0 16px",
              overflow: "hidden",
            }}
          >
            {[1, 2, 3].map((cardIdx) => (
              <div
                key={cardIdx}
                style={{
                  flex: "0 0 auto",
                  width: 168,
                  display: "flex",
                  flexDirection: "column",
                  gap: 10,
                }}
              >
                <div
                  className="skeleton-shimmer"
                  style={{
                    width: "100%",
                    aspectRatio: "4/5",
                    borderRadius: 14,
                  }}
                />
                <div
                  className="skeleton-shimmer"
                  style={{
                    width: cardIdx === 1 ? "70%" : cardIdx === 2 ? "55%" : "80%",
                    height: 14,
                    borderRadius: 4,
                    marginLeft: 2,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

// =================================================================
// EMPTY STATE
// =================================================================
function EmptyState({ onReset }) {
  return (
    <div
      className="fade-up"
      style={{
        padding: "60px 32px",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: T.surface,
          border: `1px solid ${T.border}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 24,
        }}
      >
        <Search size={26} strokeWidth={2} color={T.inkMuted} />
      </div>

      <div
        style={{
          fontFamily: T.fontMono,
          fontSize: 10,
          color: T.inkMuted,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          fontWeight: 500,
          marginBottom: 14,
        }}
      >
        No talent matches
      </div>

      <h2
        style={{
          fontFamily: T.fontDisplay,
          fontSize: 30,
          fontWeight: 800,
          margin: "0 0 10px",
          color: T.ink,
          letterSpacing: "-0.045em",
          lineHeight: 0.95,
        }}
      >
        Try widening
        <br />
        your search.
      </h2>

      <p
        style={{
          fontSize: 14,
          color: T.ink,
          opacity: 0.7,
          lineHeight: 1.5,
          margin: "0 0 28px",
          maxWidth: "30ch",
          fontWeight: 400,
        }}
      >
        Drop a category filter, expand your radius, or clear the search to see
        more talent.
      </p>

      <button
        onClick={onReset}
        style={{
          background: T.accent,
          color: T.bg,
          border: "none",
          padding: "14px 26px",
          borderRadius: 100,
          fontSize: 14,
          fontWeight: 700,
          fontFamily: T.fontDisplay,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: 6,
          letterSpacing: "-0.015em",
          boxShadow: `0 6px 18px ${T.accentShadow}`,
          transition: "transform 0.15s ease",
        }}
      >
        Reset filters
      </button>
    </div>
  );
}

// =================================================================
// TALENT ROW
// =================================================================
function TalentRow({ row, delayIndex }) {
  return (
    <div
      className="fade-up"
      style={{
        marginTop: 22,
        animationDelay: `${delayIndex * 0.05}s`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          padding: "0 16px",
          marginBottom: 12,
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: T.fontDisplay,
              fontSize: 20,
              fontWeight: 700,
              margin: 0,
              color: T.ink,
              letterSpacing: "-0.035em",
              lineHeight: 1.1,
            }}
          >
            {row.title}
          </h2>
          {row.subtitle && (
            <div
              style={{
                fontFamily: T.fontMono,
                fontSize: 9.5,
                color: T.accent,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                fontWeight: 500,
                marginTop: 5,
              }}
            >
              {row.subtitle}
            </div>
          )}
        </div>
        <button
          aria-label={`See all ${row.title}`}
          style={{
            background: "none",
            border: "none",
            display: "flex",
            alignItems: "center",
            gap: 2,
            fontFamily: T.fontMono,
            fontSize: 10,
            fontWeight: 500,
            color: T.inkMuted,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            cursor: "pointer",
            padding: 0,
          }}
        >
          See all
          <ChevronRight size={12} strokeWidth={2.4} />
        </button>
      </div>

      <div
        className="h-scroll"
        style={{
          display: "flex",
          gap: 10,
          overflowX: "auto",
          padding: "0 16px",
        }}
      >
        {row.talentIds.map((id) => {
          const talent = TALENT.find((t) => t.id === id);
          if (!talent) return null;
          return <TalentCard key={id} talent={talent} />;
        })}
      </div>
    </div>
  );
}

// =================================================================
// TALENT CARD
// =================================================================
function TalentCard({ talent }) {
  return (
    <button
      style={{
        flex: "0 0 auto",
        width: 168,
        background: "transparent",
        border: "none",
        padding: 0,
        cursor: "pointer",
        textAlign: "left",
        fontFamily: T.fontBody,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "4/5",
          borderRadius: 14,
          overflow: "hidden",
          border: `1px solid ${T.borderStrong}`,
        }}
      >
        <img
          src={talent.photo}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        {talent.badge && (
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              padding: "5px 10px",
              borderRadius: 100,
              background: "rgba(26, 24, 21, 0.85)",
              backdropFilter: "blur(8px)",
              border: `1px solid ${T.accentBorder}`,
              fontFamily: T.fontMono,
              fontSize: 9,
              color: T.accent,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {talent.badge}
          </div>
        )}

        {talent.available && (
          <div
            className="pulse-dot"
            title="Available now"
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: T.accent,
              boxShadow: `0 0 10px ${T.accent}`,
              border: `2px solid rgba(0,0,0,0.5)`,
            }}
          />
        )}

        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            height: 70,
            background: "linear-gradient(to top, rgba(0,0,0,0.75), transparent)",
            pointerEvents: "none",
          }}
        />
        {talent.rating && (
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: 10,
              display: "flex",
              alignItems: "center",
              gap: 4,
              padding: "4px 8px 4px 7px",
              background: "rgba(26, 24, 21, 0.85)",
              backdropFilter: "blur(8px)",
              borderRadius: 100,
            }}
          >
            <Star size={10} fill={T.accent} color={T.accent} strokeWidth={0} />
            <span
              style={{
                fontFamily: T.fontDisplay,
                fontSize: 11.5,
                fontWeight: 700,
                color: T.ink,
                letterSpacing: "-0.02em",
                lineHeight: 1,
              }}
            >
              {talent.rating}
            </span>
          </div>
        )}
      </div>

      <div style={{ padding: "0 2px" }}>
        <div
          style={{
            fontFamily: T.fontDisplay,
            fontSize: 14.5,
            fontWeight: 700,
            color: T.ink,
            letterSpacing: "-0.025em",
            lineHeight: 1.15,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {talent.name}
        </div>
      </div>
    </button>
  );
}

// =================================================================
// FILTER PANEL — full filter sheet
// =================================================================
function FilterPanel({
  onClose,
  radius,
  setRadius,
  priceMin,
  setPriceMin,
  priceMax,
  setPriceMax,
  platforms,
  setPlatforms,
  minRating,
  setMinRating,
  availableOnly,
  setAvailableOnly,
  sort,
  setSort,
  onReset,
}) {
  const togglePlatform = (id) => {
    setPlatforms((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  return (
    <>
      <div
        className="overlay-fade"
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0, 0, 0, 0.55)",
          backdropFilter: "blur(2px)",
          zIndex: 60,
        }}
      />
      <div
        className="sheet-rise"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          background: T.bg,
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          boxShadow: "0 -20px 60px rgba(0,0,0,0.5)",
          zIndex: 70,
          maxHeight: "92%",
          display: "flex",
          flexDirection: "column",
          borderTop: `1px solid ${T.borderStrong}`,
          overflow: "hidden",
        }}
      >
        {/* Drag handle */}
        <div
          style={{
            padding: "10px 0 6px",
            display: "flex",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 2,
              background: T.borderStrong,
            }}
          />
        </div>

        {/* Header */}
        <div
          style={{
            padding: "8px 22px 18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: `1px solid ${T.border}`,
            flexShrink: 0,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: T.fontMono,
                fontSize: 10,
                color: T.accent,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: 500,
                marginBottom: 6,
              }}
            >
              Refine your search
            </div>
            <h2
              style={{
                fontFamily: T.fontDisplay,
                fontSize: 26,
                fontWeight: 800,
                margin: 0,
                color: T.ink,
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}
            >
              Filters
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              background: T.surface,
              border: `1px solid ${T.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: T.ink,
            }}
          >
            <X size={18} strokeWidth={2.2} />
          </button>
        </div>

        {/* Body */}
        <div
          className="scroll-container"
          style={{
            overflowY: "auto",
            flex: 1,
            padding: "20px 22px 8px",
          }}
        >
          {/* Location */}
          <FilterSection title="Location" hint={`${radius} km from you`}>
            <div style={{ padding: "8px 0 4px" }}>
              <input
                type="range"
                min={1}
                max={50}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                style={rangeStyle()}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: 6,
                  fontFamily: T.fontMono,
                  fontSize: 9.5,
                  color: T.inkMuted,
                  letterSpacing: "0.12em",
                  fontWeight: 500,
                }}
              >
                <span>1 KM</span>
                <span>50 KM</span>
              </div>
            </div>
          </FilterSection>

          {/* Price */}
          <FilterSection
            title="Price range"
            hint={`₪${priceMin} – ₪${priceMax}`}
          >
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <NumberInput value={priceMin} onChange={setPriceMin} label="Min" />
              <NumberInput value={priceMax} onChange={setPriceMax} label="Max" />
            </div>
          </FilterSection>

          {/* Platform */}
          <FilterSection title="Platform">
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 8,
                marginTop: 4,
              }}
            >
              {PLATFORMS.map((p) => {
                const isActive = platforms.includes(p.id);
                const Icon = p.Icon;
                return (
                  <button
                    key={p.id}
                    onClick={() => togglePlatform(p.id)}
                    style={{
                      padding: "9px 14px",
                      background: isActive ? T.accentSoft : T.surface,
                      border: `1px solid ${
                        isActive ? T.accentBorder : T.border
                      }`,
                      borderRadius: 100,
                      cursor: "pointer",
                      fontFamily: T.fontDisplay,
                      fontSize: 13,
                      fontWeight: 600,
                      color: isActive ? T.accent : T.ink,
                      letterSpacing: "-0.01em",
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      transition: "all 0.15s ease",
                    }}
                  >
                    <Icon size={13} strokeWidth={2.2} />
                    {p.label}
                  </button>
                );
              })}
            </div>
          </FilterSection>

          {/* Min rating */}
          <FilterSection
            title="Minimum rating"
            hint={minRating > 0 ? `${minRating}.0 stars or above` : "Any rating"}
          >
            <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
              {[1, 2, 3, 4, 5].map((stars) => {
                const isActive = minRating === stars;
                const isAlmostActive = minRating > stars;
                return (
                  <button
                    key={stars}
                    onClick={() =>
                      setMinRating(minRating === stars ? 0 : stars)
                    }
                    style={{
                      flex: 1,
                      padding: "12px 8px",
                      background: isActive ? T.accentSoft : T.surface,
                      border: `1px solid ${
                        isActive ? T.accentBorder : T.border
                      }`,
                      borderRadius: 12,
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 4,
                      transition: "all 0.15s ease",
                    }}
                  >
                    <Star
                      size={14}
                      fill={isActive || isAlmostActive ? T.accent : "transparent"}
                      color={isActive || isAlmostActive ? T.accent : T.inkMuted}
                      strokeWidth={isActive || isAlmostActive ? 0 : 2}
                    />
                    <span
                      style={{
                        fontFamily: T.fontMono,
                        fontSize: 9.5,
                        color: isActive ? T.accent : T.inkMuted,
                        fontWeight: 600,
                        letterSpacing: "0.05em",
                      }}
                    >
                      {stars}+
                    </span>
                  </button>
                );
              })}
            </div>
          </FilterSection>

          {/* Available only */}
          <FilterSection title="Availability">
            <button
              onClick={() => setAvailableOnly(!availableOnly)}
              style={{
                width: "100%",
                padding: "14px 16px",
                background: availableOnly ? T.accentSoft : T.surface,
                border: `1px solid ${
                  availableOnly ? T.accentBorder : T.border
                }`,
                borderRadius: 14,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontFamily: T.fontBody,
                textAlign: "left",
                marginTop: 4,
                transition: "all 0.15s ease",
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 6,
                  border: availableOnly
                    ? "none"
                    : `1.5px solid ${T.borderStrong}`,
                  background: availableOnly ? T.accent : "transparent",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  transition: "all 0.15s ease",
                }}
              >
                {availableOnly && <Check size={14} strokeWidth={3} color={T.bg} />}
              </div>
              <span
                style={{
                  fontFamily: T.fontDisplay,
                  fontSize: 14.5,
                  fontWeight: 600,
                  color: T.ink,
                  letterSpacing: "-0.02em",
                }}
              >
                Available now only
              </span>
            </button>
          </FilterSection>

          {/* Sort */}
          <FilterSection title="Sort by">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 6,
                marginTop: 4,
              }}
            >
              {SORT_OPTIONS.map((opt) => {
                const isActive = sort === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => setSort(opt.id)}
                    style={{
                      width: "100%",
                      padding: "13px 16px",
                      background: isActive ? T.accentSoft : T.surface,
                      border: `1px solid ${
                        isActive ? T.accentBorder : T.border
                      }`,
                      borderRadius: 12,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      fontFamily: T.fontDisplay,
                      fontSize: 14,
                      fontWeight: 600,
                      color: T.ink,
                      letterSpacing: "-0.02em",
                      textAlign: "left",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {opt.label}
                    {isActive && (
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          background: T.accent,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
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
        </div>

        {/* Sticky footer */}
        <div
          style={{
            padding: "14px 16px 22px",
            background: T.bg,
            borderTop: `1px solid ${T.border}`,
            display: "flex",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <button
            onClick={onReset}
            style={{
              flex: 1,
              background: "transparent",
              color: T.ink,
              border: `1px solid ${T.borderStrong}`,
              padding: "16px 22px",
              borderRadius: 100,
              fontSize: 14.5,
              fontWeight: 700,
              fontFamily: T.fontDisplay,
              cursor: "pointer",
              letterSpacing: "-0.015em",
              transition: "all 0.15s ease",
            }}
          >
            Reset
          </button>
          <button
            onClick={onClose}
            style={{
              flex: 1.5,
              background: T.accent,
              color: T.bg,
              border: "none",
              padding: "16px 22px",
              borderRadius: 100,
              fontSize: 14.5,
              fontWeight: 700,
              fontFamily: T.fontDisplay,
              cursor: "pointer",
              letterSpacing: "-0.015em",
              boxShadow: `0 8px 24px ${T.accentShadow}`,
              transition: "all 0.15s ease",
            }}
          >
            Apply filters
          </button>
        </div>
      </div>
    </>
  );
}

// =================================================================
// HELPERS
// =================================================================
function FilterSection({ title, hint, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <h3
          style={{
            fontFamily: T.fontDisplay,
            fontSize: 16,
            fontWeight: 700,
            margin: 0,
            color: T.ink,
            letterSpacing: "-0.025em",
          }}
        >
          {title}
        </h3>
        {hint && (
          <span
            style={{
              fontFamily: T.fontMono,
              fontSize: 9.5,
              color: T.inkMuted,
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

function NumberInput({ value, onChange, label }) {
  return (
    <div
      style={{
        flex: 1,
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 12,
        padding: "10px 14px",
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <span
        style={{
          fontFamily: T.fontMono,
          fontSize: 9,
          color: T.inkMuted,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          fontWeight: 500,
        }}
      >
        {label}
      </span>
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span
          style={{
            fontFamily: T.fontDisplay,
            fontSize: 14,
            color: T.inkMuted,
            fontWeight: 500,
          }}
        >
          ₪
        </span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            fontFamily: T.fontDisplay,
            fontSize: 16,
            color: T.ink,
            fontWeight: 700,
            letterSpacing: "-0.025em",
            width: "100%",
            minWidth: 0,
            padding: 0,
          }}
        />
      </div>
    </div>
  );
}

function rangeStyle() {
  return {
    width: "100%",
    height: 4,
    background: T.borderStrong,
    borderRadius: 2,
    outline: "none",
    appearance: "none",
    cursor: "pointer",
  };
}

// =================================================================
// TAB BAR — locked structure (already implemented in components/business/CustomTabBar.tsx)
// =================================================================
function TabBar({ activeTab, setActiveTab }) {
  const tabs = [
    { id: "discover", label: "Discover", icon: Search },
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "inquiries", label: "Inquiries", icon: MessageSquare, badge: 1 },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "10px 12px 18px",
        background: "rgba(26, 24, 21, 0.94)",
        backdropFilter: "blur(16px)",
        borderTop: `1px solid ${T.border}`,
        display: "flex",
        justifyContent: "space-around",
        zIndex: 50,
      }}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: "transparent",
              border: "none",
              padding: "8px 12px",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
              flex: 1,
              transition: "all 0.18s ease",
              position: "relative",
            }}
          >
            <Icon
              size={20}
              strokeWidth={isActive ? 2.4 : 2}
              color={isActive ? T.accent : T.inkMuted}
            />
            <span
              style={{
                fontFamily: T.fontMono,
                fontSize: 9,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? T.accent : T.inkMuted,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
