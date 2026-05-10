// =================================================================
// REFERENCE FILE — Business (Business) Dashboard
// =================================================================
// Source: Tom-provided reference, 2026-05-09
//
// PURPOSE: This is a VISUAL REFERENCE ONLY for the design.
// DO NOT port this code 1:1. The Hub is React Native (Expo) + NativeWind.
// The implementation must use native RN components, NativeWind classes,
// and the design tokens already defined in `constants/theme.ts`.
//
// What to take from this file:
//   - Layout structure (top bar → attention banner → deals → quick actions → perks → stats → tab bar)
//   - Spacing values (padding, gap, border-radius)
//   - Typography (sizes, weights, letter-spacing, line-height)
//   - Color usage (which token goes where)
//   - Component patterns (DealRow, ActionTile, PerkRow, StatTile, TabBar)
//   - Animation cues (pulse-dot, fadeUp)
//
// What to ignore:
//   - Inline `style={{...}}` patterns — use NativeWind / StyleSheet instead
//   - CSS @keyframes — use react-native-reanimated for the pulsing dot
//   - `boxShadow` strings — use RN shadow props (shadowColor, shadowOffset, etc.) or elevation
//   - `backdropFilter: blur` — use expo-blur for the tab bar / top bar
//   - `cursor: pointer` — n/a in RN
//   - Google Fonts <style> import — fonts must be loaded via expo-font in app/_layout.tsx
//   - The 440px max-width "phone frame" wrapper — not needed in RN, screen is always device-width
//
// Mojibake note: this file contains some encoding artifacts from copy-paste:
//   - `âª`  should be `₪` (Israeli shekel)
//   - `Ã`   should be `×` (multiplication sign)
//   - `→`   may appear as `â`
//   These are display-only — use the correct Unicode characters in the actual implementation.
//
// =================================================================

import { useState } from "react";
import {
  Search,
  LayoutDashboard,
  MessageSquare,
  User,
  ChevronRight,
  Plus,
  Star,
  Clock,
  Bell,
  Sparkles,
  TrendingUp,
  Gift,
  CheckCircle2,
  ArrowUpRight,
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
// MOCK DATA — FitBar TLV's dashboard
// =================================================================
const BUSINESS = {
  name: "FitBar TLV",
  firstName: "FitBar",
  monogram: "FB",
};

// "Needs attention" items shown at the top
const ATTENTION_ITEMS = [
  {
    id: "att-1",
    kind: "rating-due",
    title: "Rate Daniel Levi",
    subtitle: "Story Set delivered May 6",
    cta: "Rate now",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
  },
];

// Active deals — sorted by urgency
const DEALS = [
  {
    id: "deal-1",
    influencer: {
      name: "Maya Cohen",
      photo:
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80",
    },
    services: "2 services",
    total: 530,
    status: "in_progress",
    statusLabel: "In progress",
    statusAccent: false,
    timeLabel: "Started 4h ago",
  },
  {
    id: "deal-2",
    influencer: {
      name: "Noa Berman",
      photo:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
    },
    services: "1 service",
    total: 350,
    status: "waiting",
    statusLabel: "Waiting · 47h left",
    statusAccent: true,
    timeLabel: "Sent yesterday",
  },
  {
    id: "deal-3",
    influencer: {
      name: "Daniel Levi",
      photo:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
    },
    services: "1 service",
    total: 180,
    status: "rate_now",
    statusLabel: "Rate now",
    statusAccent: true,
    timeLabel: "Delivered 3d ago",
  },
];

// Active perks
const PERKS = [
  {
    id: "perk-1",
    title: "Free dinner for 2",
    claimed: 3,
    max: 5,
    expires: "May 31",
  },
];

// Stats
const STATS = {
  activeDeals: 3,
  bookingValue: 1060,
  perksClaimed: 3,
};

// =================================================================
// MAIN
// =================================================================
export default function BusinessDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");

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
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .pulse-dot { animation: pulse-dot 2s ease-in-out infinite; }
        .fade-up { animation: fadeUp 0.4s ease-out both; }
      `}</style>

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
          height: "calc(100vh - 60px)",
          maxHeight: 880,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* TOP BAR */}
        <div
          style={{
            padding: "16px 20px 14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexShrink: 0,
          }}
        >
          <div>
            <div
              style={{
                fontFamily: T.fontMono,
                fontSize: 10,
                color: T.inkMuted,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                fontWeight: 500,
                marginBottom: 4,
              }}
            >
              Good morning
            </div>
            <h1
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
              {BUSINESS.firstName}.
            </h1>
          </div>

          <div style={{ display: "flex", gap: 8 }}>
            <button
              aria-label="Notifications"
              style={iconBtn()}
            >
              <Bell size={17} strokeWidth={2.2} />
              <span
                style={{
                  position: "absolute",
                  top: 9,
                  right: 9,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: T.accent,
                  border: `2px solid ${T.bg}`,
                  boxShadow: `0 0 8px ${T.accent}`,
                }}
              />
            </button>
            <button
              aria-label="Profile"
              style={{
                ...iconBtn(),
                background: T.surfaceAlt,
              }}
            >
              <span
                style={{
                  fontFamily: T.fontDisplay,
                  fontSize: 13,
                  fontWeight: 800,
                  color: T.ink,
                  letterSpacing: "-0.04em",
                }}
              >
                {BUSINESS.monogram}
              </span>
            </button>
          </div>
        </div>

        {/* SCROLLABLE BODY */}
        <div
          className="scroll-container"
          style={{
            flex: 1,
            overflowY: "auto",
            paddingBottom: 100, // room for tab bar
          }}
        >
          {/* ATTENTION BANNER */}
          {ATTENTION_ITEMS.length > 0 && (
            <div style={{ padding: "0 20px 24px" }}>
              {ATTENTION_ITEMS.map((item) => (
                <button
                  key={item.id}
                  className="fade-up"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "14px 16px",
                    background: T.accentSoft,
                    border: `1px solid ${T.accentBorder}`,
                    borderRadius: 14,
                    cursor: "pointer",
                    fontFamily: T.fontBody,
                    textAlign: "left",
                    transition: "all 0.18s ease",
                  }}
                >
                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      overflow: "hidden",
                      flexShrink: 0,
                      position: "relative",
                      border: `1px solid ${T.borderStrong}`,
                    }}
                  >
                    <img
                      src={item.photo}
                      alt=""
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        bottom: -2,
                        right: -2,
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        background: T.accent,
                        border: `2px solid ${T.bg}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Star
                        size={10}
                        fill={T.bg}
                        color={T.bg}
                        strokeWidth={0}
                      />
                    </div>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontFamily: T.fontDisplay,
                        fontSize: 14.5,
                        fontWeight: 700,
                        color: T.ink,
                        letterSpacing: "-0.025em",
                        lineHeight: 1.1,
                        marginBottom: 3,
                      }}
                    >
                      {item.title}
                    </div>
                    <div
                      style={{
                        fontFamily: T.fontMono,
                        fontSize: 9.5,
                        color: T.accent,
                        letterSpacing: "0.15em",
                        textTransform: "uppercase",
                        fontWeight: 500,
                      }}
                    >
                      {item.subtitle}
                    </div>
                  </div>
                  <ChevronRight
                    size={18}
                    strokeWidth={2.2}
                    color={T.accent}
                  />
                </button>
              ))}
            </div>
          )}

          {/* ACTIVE DEALS */}
          <div style={{ padding: "0 20px 24px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <h2
                style={{
                  fontFamily: T.fontDisplay,
                  fontSize: 22,
                  fontWeight: 700,
                  margin: 0,
                  color: T.ink,
                  letterSpacing: "-0.035em",
                }}
              >
                Active deals
              </h2>
              <span
                style={{
                  fontFamily: T.fontMono,
                  fontSize: 9.5,
                  color: T.inkMuted,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                {DEALS.length}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 8,
              }}
            >
              {DEALS.map((deal) => (
                <DealRow key={deal.id} deal={deal} />
              ))}
            </div>
          </div>

          {/* QUICK ACTIONS */}
          <div style={{ padding: "0 20px 24px" }}>
            <h2
              style={{
                fontFamily: T.fontDisplay,
                fontSize: 22,
                fontWeight: 700,
                margin: "0 0 14px",
                color: T.ink,
                letterSpacing: "-0.035em",
              }}
            >
              Quick actions
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              <ActionTile
                icon={<Search size={18} strokeWidth={2.2} />}
                label="Find influencer"
                hint="Browse"
                primary
              />
              <ActionTile
                icon={<Gift size={18} strokeWidth={2.2} />}
                label="Post a perk"
                hint="Barter"
              />
            </div>
          </div>

          {/* PERKS — small section */}
          <div style={{ padding: "0 20px 24px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                marginBottom: 14,
              }}
            >
              <h2
                style={{
                  fontFamily: T.fontDisplay,
                  fontSize: 22,
                  fontWeight: 700,
                  margin: 0,
                  color: T.ink,
                  letterSpacing: "-0.035em",
                }}
              >
                Your perks
              </h2>
              <button
                style={{
                  background: "none",
                  border: "none",
                  fontFamily: T.fontMono,
                  fontSize: 10.5,
                  fontWeight: 500,
                  color: T.accent,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                See all →
              </button>
            </div>

            {PERKS.map((perk) => (
              <PerkRow key={perk.id} perk={perk} />
            ))}
          </div>

          {/* STATS — small reflection panel */}
          <div style={{ padding: "0 20px 32px" }}>
            <h2
              style={{
                fontFamily: T.fontDisplay,
                fontSize: 22,
                fontWeight: 700,
                margin: "0 0 14px",
                color: T.ink,
                letterSpacing: "-0.035em",
              }}
            >
              Overview
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: 8,
              }}
            >
              <StatTile label="Active" value={STATS.activeDeals} />
              <StatTile
                label="Booking value"
                value={`₪${STATS.bookingValue}`}
              />
              <StatTile label="Perks claimed" value={STATS.perksClaimed} />
            </div>
          </div>
        </div>

        {/* TAB BAR */}
        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}

// =================================================================
// DEAL ROW
// =================================================================
function DealRow({ deal }) {
  return (
    <button
      style={{
        display: "flex",
        alignItems: "center",
        padding: "14px 16px",
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        cursor: "pointer",
        textAlign: "left",
        fontFamily: T.fontBody,
        width: "100%",
        gap: 12,
        transition: "all 0.18s ease",
      }}
    >
      {/* Influencer photo */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          overflow: "hidden",
          flexShrink: 0,
          border: `1px solid ${T.borderStrong}`,
        }}
      >
        <img
          src={deal.influencer.photo}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Influencer + services */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: T.fontDisplay,
            fontSize: 15,
            fontWeight: 700,
            color: T.ink,
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
            marginBottom: 4,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {deal.influencer.name}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: T.fontMono,
            fontSize: 9.5,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          <span
            style={{
              color: deal.statusAccent ? T.accent : T.inkMuted,
            }}
          >
            {deal.statusLabel}
          </span>
          <span
            style={{
              width: 3,
              height: 3,
              borderRadius: "50%",
              background: T.inkSubtle,
            }}
          />
          <span style={{ color: T.inkMuted }}>{deal.services}</span>
        </div>
      </div>

      {/* Right side: total + chevron */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            fontFamily: T.fontDisplay,
            fontSize: 16,
            fontWeight: 700,
            color: T.ink,
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          ₪{deal.total}
        </div>
        <ChevronRight
          size={16}
          strokeWidth={2.2}
          color={deal.statusAccent ? T.accent : T.inkMuted}
        />
      </div>
    </button>
  );
}

// =================================================================
// ACTION TILE
// =================================================================
function ActionTile({ icon, label, hint, primary = false }) {
  return (
    <button
      style={{
        padding: "18px 16px",
        background: primary ? T.accent : T.surface,
        border: primary ? "none" : `1px solid ${T.border}`,
        borderRadius: 14,
        cursor: "pointer",
        textAlign: "left",
        fontFamily: T.fontBody,
        display: "flex",
        flexDirection: "column",
        gap: 24,
        minHeight: 110,
        transition: "all 0.18s ease",
        boxShadow: primary ? `0 8px 20px ${T.accentShadow}` : "none",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: primary
            ? "rgba(26, 24, 21, 0.18)"
            : T.surfaceAlt,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: primary ? T.bg : T.ink,
        }}
      >
        {icon}
      </div>
      <div>
        <div
          style={{
            fontFamily: T.fontDisplay,
            fontSize: 17,
            fontWeight: 700,
            color: primary ? T.bg : T.ink,
            letterSpacing: "-0.03em",
            lineHeight: 1,
            marginBottom: 5,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: T.fontMono,
            fontSize: 9.5,
            color: primary ? "rgba(26, 24, 21, 0.55)" : T.inkMuted,
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          {hint}
        </div>
      </div>
    </button>
  );
}

// =================================================================
// PERK ROW
// =================================================================
function PerkRow({ perk }) {
  const progress = (perk.claimed / perk.max) * 100;
  return (
    <button
      style={{
        width: "100%",
        padding: "14px 16px",
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
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
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: T.fontDisplay,
              fontSize: 15,
              fontWeight: 700,
              color: T.ink,
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              marginBottom: 4,
            }}
          >
            {perk.title}
          </div>
          <div
            style={{
              fontFamily: T.fontMono,
              fontSize: 9.5,
              color: T.inkMuted,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Expires {perk.expires}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: 5,
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: T.fontDisplay,
              fontSize: 14,
              fontWeight: 700,
              color: T.ink,
              letterSpacing: "-0.025em",
            }}
          >
            {perk.claimed}/{perk.max}
          </span>
          <span
            style={{
              fontFamily: T.fontMono,
              fontSize: 9.5,
              color: T.inkMuted,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            claimed
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div
        style={{
          width: "100%",
          height: 4,
          background: T.surfaceAlt,
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: T.accent,
            borderRadius: 2,
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </button>
  );
}

// =================================================================
// STAT TILE
// =================================================================
function StatTile({ label, value }) {
  return (
    <div
      style={{
        padding: 14,
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        minHeight: 86,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          fontFamily: T.fontMono,
          fontSize: 9.5,
          color: T.inkMuted,
          fontWeight: 500,
          textTransform: "uppercase",
          letterSpacing: "0.15em",
          lineHeight: 1.3,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: T.fontDisplay,
          fontSize: 24,
          fontWeight: 800,
          color: T.ink,
          letterSpacing: "-0.04em",
          lineHeight: 1,
          marginTop: 8,
        }}
      >
        {value}
      </div>
    </div>
  );
}

// =================================================================
// TAB BAR
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
        WebkitBackdropFilter: "blur(16px)",
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
            <div style={{ position: "relative" }}>
              <Icon
                size={20}
                strokeWidth={isActive ? 2.4 : 2}
                color={isActive ? T.accent : T.inkMuted}
              />
              {tab.badge && (
                <span
                  style={{
                    position: "absolute",
                    top: -3,
                    right: -5,
                    minWidth: 14,
                    height: 14,
                    borderRadius: 7,
                    background: T.accent,
                    border: `2px solid ${T.bg}`,
                    color: T.bg,
                    fontSize: 8,
                    fontFamily: T.fontMono,
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 3px",
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </div>
            <span
              style={{
                fontFamily: T.fontMono,
                fontSize: 9,
                fontWeight: isActive ? 600 : 500,
                color: isActive ? T.accent : T.inkMuted,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                transition: "all 0.18s ease",
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

// =================================================================
// HELPERS
// =================================================================
function iconBtn() {
  return {
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
    position: "relative",
  };
}
