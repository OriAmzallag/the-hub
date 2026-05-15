// =============================================================================
// MARK DEAL AS DONE — Reference (web JSX preview)
// =============================================================================
// This file is a *visual reference only* from Tom. It is NOT meant to be ported
// 1:1 into React Native. Use it to lock layout, spacing, copy, motion, and
// state behaviour — then implement using the project's actual primitives.
//
// TAKE FROM THIS FILE
//   ✓ Copy verbatim (titles, body, mono captions, toast text)
//   ✓ Layout structure of the thread tile, dashboard card divider, modal, toast
//   ✓ State logic (IN_PROGRESS → COMPLETED, what disappears, what appears)
//   ✓ The six locked product decisions in the conversation that spawned this
//   ✓ Optional-final-message behaviour (200 char, posts before system event)
//   ✓ Toast: no auto-route, 3.5s dismiss, accent-check pop animation
//
// IGNORE FROM THIS FILE
//   ✗ The local `T` token literal — use `constants/theme.ts` tokens instead.
//   ✗ Inline `style={{ ... }}` — use the project's styled primitives.
//   ✗ Web-only APIs (CSS @import, ::-webkit-scrollbar, backdrop-filter literal,
//     :hover handlers, textarea HTML element). Map to RN equivalents:
//        backdrop-filter → BlurView (expo-blur)
//        textarea        → TextInput (multiline)
//        :hover          → Pressable hitSlop + active opacity
//        CSS keyframes   → Reanimated 3 timing / withSequence
//   ✗ Encoded glyphs like `Â·` and `âª` — these are mojibake. Use `·` and `₪`.
//   ✗ The demo toggles at the top (entry-point + reset). They are stage props
//     for previewing both entries in one browser tab.
//   ✗ `lucide-react` icons — use the project's icon system (likely lucide-
//     react-native; check existing imports before adding).
//   ✗ The dashboard "RATE NOW" terminal card mock — that surface already
//     exists in the canonical caption resolver. Do not re-create it here; just
//     ensure Mark Done triggers the state transition that flips the caption.
//
// MOJIBAKE TRANSLATION (the source uses Latin-1 mis-decode of UTF-8)
//   Â·  →  ·    (middle dot, used in mono captions and timestamps)
//   âª  →  ₪    (NIS currency sign)
//   â   →  —    (em dash, used in placeholder copy and section headers)
//   â»  →  ↻    (reset arrow on demo toggle — irrelevant for prod)
// =============================================================================

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  Send,
  Check,
  CheckCircle2,
  X,
  ArrowRight,
  Bell,
  MessageCircle,
  Sparkles,
  Star,
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
// MOCK DATA
// =================================================================
const DEAL = {
  id: "d-active",
  state: "IN_PROGRESS",
  influencer: {
    name: "Maya Cohen",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
  business: {
    name: "FitBar TLV",
    monogram: "FB",
  },
  summary: "Instagram Reel + Story Set",
  money: 530,
  startedDate: "Apr 28",
};

const THREAD_MESSAGES = [
  {
    type: "system",
    text: "Deal accepted · In progress",
    date: "Apr 28 · 16:08",
  },
  {
    from: "business",
    text: "Hey! Excited to work together. I'll send over the product samples this week.",
    date: "Apr 28 · 16:14",
  },
  {
    from: "influencer",
    text: "Sounds good! Once I get them I'll plan the shoot for the weekend.",
    date: "Apr 28 · 16:32",
  },
  {
    from: "business",
    text: "Samples shipped today, should arrive Tuesday.",
    date: "Apr 29 · 11:02",
  },
  {
    from: "influencer",
    text: "Got them! Will start filming tomorrow morning. Should have something by Sunday.",
    date: "May 1 · 19:44",
  },
  {
    from: "influencer",
    text: "Reel is ready — sent you the link via WhatsApp. Story set going up tonight at 8pm.",
    date: "May 3 · 14:20",
  },
];

// =================================================================
// MAIN
// =================================================================
export default function MarkDoneFlow() {
  const [entryPoint, setEntryPoint] = useState("thread"); // thread | dashboard
  const [dealState, setDealState] = useState("IN_PROGRESS"); // IN_PROGRESS | COMPLETED
  const [modalOpen, setModalOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [finalMessage, setFinalMessage] = useState("");

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setFinalMessage("");
  };

  const confirmDone = () => {
    setModalOpen(false);
    setDealState("COMPLETED");
    setToastVisible(true);
    // The final message would post to the thread; for demo we just keep it
  };

  // Toast auto-hide
  useEffect(() => {
    if (!toastVisible) return;
    const t = setTimeout(() => setToastVisible(false), 3500);
    return () => clearTimeout(t);
  }, [toastVisible]);

  const reset = () => {
    setDealState("IN_PROGRESS");
    setToastVisible(false);
    setFinalMessage("");
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
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes modalIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes backdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes checkPop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        .fade-up { animation: fadeUp 0.35s ease-out both; }
        .modal-in { animation: modalIn 0.32s cubic-bezier(0.32, 0.72, 0, 1) both; }
        .backdrop-in { animation: backdropIn 0.22s ease-out both; }
        .toast-in { animation: toastIn 0.35s cubic-bezier(0.32, 0.72, 0, 1) both; }
        .check-pop { animation: checkPop 0.5s cubic-bezier(0.32, 0.72, 0, 1) both; }
        textarea::placeholder {
          color: ${T.inkSubtle};
          font-weight: 400;
        }
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
        {/* Entry point toggle */}
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { id: "thread", label: "Entry: Thread" },
            { id: "dashboard", label: "Entry: Dashboard" },
          ].map((opt) => {
            const isActive = entryPoint === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => {
                  setEntryPoint(opt.id);
                  reset();
                }}
                style={demoToggleStyle(isActive)}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Reset button */}
        {dealState === "COMPLETED" && (
          <button
            onClick={reset}
            style={{
              padding: "8px",
              borderRadius: 10,
              border: "1px solid rgba(255,122,41,0.4)",
              background: "rgba(255,122,41,0.12)",
              color: "#FF7A29",
              fontSize: 10.5,
              fontFamily: "system-ui",
              fontWeight: 600,
              cursor: "pointer",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            ↻ Reset to IN_PROGRESS
          </button>
        )}
      </div>

      {/* PHONE FRAME */}
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
          height: "calc(100vh - 130px)",
          maxHeight: 880,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {entryPoint === "thread" ? (
          <CoordinationThread
            dealState={dealState}
            onMarkDone={openModal}
          />
        ) : (
          <DashboardView
            dealState={dealState}
            onMarkDone={openModal}
          />
        )}

        {/* Toast */}
        {toastVisible && <Toast onDismiss={() => setToastVisible(false)} />}

        {/* Modal */}
        {modalOpen && (
          <MarkDoneModal
            finalMessage={finalMessage}
            setFinalMessage={setFinalMessage}
            onConfirm={confirmDone}
            onCancel={closeModal}
          />
        )}
      </div>
    </div>
  );
}

function demoToggleStyle(isActive) {
  return {
    flex: 1,
    padding: "8px 8px",
    borderRadius: 10,
    border: isActive
      ? "1px solid rgba(255,255,255,0.4)"
      : "1px solid rgba(255,255,255,0.1)",
    background: isActive
      ? "rgba(255,255,255,0.1)"
      : "rgba(255,255,255,0.02)",
    color: "#fff",
    fontSize: 10.5,
    fontFamily: "system-ui",
    fontWeight: 600,
    cursor: "pointer",
    textAlign: "center",
    letterSpacing: "0.04em",
    textTransform: "uppercase",
  };
}

// =================================================================
// COORDINATION THREAD (Influencer POV)
// =================================================================
function CoordinationThread({ dealState, onMarkDone }) {
  const isInProgress = dealState === "IN_PROGRESS";
  const caption = isInProgress ? "IN PROGRESS" : "RATE NOW";
  const captionColor = isInProgress ? T.inkMuted : T.accent;

  return (
    <div
      className="fade-up"
      style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}
    >
      {/* TOP BAR */}
      <div
        style={{
          padding: "12px 14px",
          display: "flex",
          alignItems: "center",
          gap: 12,
          flexShrink: 0,
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <button
          aria-label="Back"
          style={{
            width: 34,
            height: 34,
            borderRadius: "50%",
            background: T.surface,
            border: `1px solid ${T.border}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            color: T.ink,
            flexShrink: 0,
          }}
        >
          <ChevronLeft size={17} strokeWidth={2.2} />
        </button>

        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: T.surfaceAlt,
            border: `1px solid ${T.borderStrong}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: T.fontDisplay,
              fontSize: 12,
              fontWeight: 800,
              color: T.ink,
              letterSpacing: "-0.04em",
            }}
          >
            {DEAL.business.monogram}
          </span>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: T.fontDisplay,
              fontSize: 14,
              fontWeight: 700,
              color: T.ink,
              letterSpacing: "-0.025em",
              lineHeight: 1.2,
            }}
          >
            {DEAL.business.name}
          </div>
          <div
            style={{
              fontFamily: T.fontMono,
              fontSize: 9,
              color: captionColor,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 600,
              marginTop: 2,
            }}
          >
            {caption}
          </div>
        </div>
      </div>

      {/* THREAD BODY */}
      <div
        className="scroll-container"
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          padding: "16px 14px 8px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {THREAD_MESSAGES.map((msg, i) => {
          if (msg.type === "system") {
            return <SystemMessage key={i} text={msg.text} date={msg.date} />;
          }
          const fromYou = msg.from === "influencer";
          return (
            <MessageBubble
              key={i}
              from={fromYou ? "you" : DEAL.business.name}
              text={msg.text}
              date={msg.date}
              fromYou={fromYou}
            />
          );
        })}

        {/* System message: COMPLETED transition */}
        {!isInProgress && (
          <SystemMessage
            text="You marked the deal as done · Both can rate now"
            date="Just now"
            accent
          />
        )}
      </div>

      {/* MARK DONE TILE — sticky above message input */}
      {isInProgress && (
        <div
          style={{
            padding: "10px 14px 0",
            flexShrink: 0,
            background: T.bg,
          }}
        >
          <button
            onClick={onMarkDone}
            style={{
              width: "100%",
              padding: "12px 14px",
              background: T.accentSoft,
              border: `1px solid ${T.accentBorder}`,
              borderRadius: 12,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 12,
              fontFamily: T.fontBody,
              textAlign: "left",
              transition: "transform 0.12s ease",
            }}
            onMouseDown={(e) =>
              (e.currentTarget.style.transform = "scale(0.99)")
            }
            onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                background: T.accent,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <Check size={17} strokeWidth={3} color={T.bg} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontFamily: T.fontDisplay,
                  fontSize: 14,
                  fontWeight: 700,
                  color: T.ink,
                  letterSpacing: "-0.025em",
                  lineHeight: 1.2,
                }}
              >
                Mark deal as done
              </div>
              <div
                style={{
                  fontFamily: T.fontMono,
                  fontSize: 9,
                  color: T.inkMuted,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  marginTop: 2,
                }}
              >
                When the work is delivered
              </div>
            </div>
            <ArrowRight size={14} strokeWidth={2.4} color={T.accent} />
          </button>
        </div>
      )}

      {/* MESSAGE INPUT */}
      <div
        style={{
          padding: "10px 14px 14px",
          flexShrink: 0,
          background: T.bg,
          borderTop: isInProgress ? "none" : `1px solid ${T.border}`,
          marginTop: 8,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            background: T.surface,
            border: `1px solid ${T.border}`,
            borderRadius: 22,
            padding: "8px 8px 8px 16px",
          }}
        >
          <input
            placeholder="Message…"
            disabled={!isInProgress}
            style={{
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              color: T.ink,
              fontFamily: T.fontBody,
              fontSize: 14,
              fontWeight: 400,
              opacity: isInProgress ? 1 : 0.4,
            }}
          />
          <button
            disabled={!isInProgress}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: isInProgress ? T.accent : T.surfaceAlt,
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: isInProgress ? "pointer" : "not-allowed",
              flexShrink: 0,
            }}
          >
            <Send
              size={14}
              strokeWidth={2.4}
              color={isInProgress ? T.bg : T.inkMuted}
            />
          </button>
        </div>
        {!isInProgress && (
          <div
            style={{
              marginTop: 8,
              textAlign: "center",
              fontFamily: T.fontMono,
              fontSize: 9,
              color: T.inkSubtle,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 500,
            }}
          >
            Deal closed · Rate to finish
          </div>
        )}
      </div>
    </div>
  );
}

function SystemMessage({ text, date, accent }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 4,
        padding: "6px 0",
      }}
    >
      <div
        style={{
          padding: "4px 10px",
          background: accent ? T.accentSoft : T.surfaceAlt,
          border: `1px solid ${accent ? T.accentBorder : T.border}`,
          borderRadius: 100,
          fontFamily: T.fontMono,
          fontSize: 9,
          color: accent ? T.accent : T.inkMuted,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        {text}
      </div>
      <div
        style={{
          fontFamily: T.fontMono,
          fontSize: 8.5,
          color: T.inkSubtle,
          letterSpacing: "0.12em",
          fontWeight: 500,
        }}
      >
        {date}
      </div>
    </div>
  );
}

function MessageBubble({ from, text, date, fromYou }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: fromYou ? "flex-end" : "flex-start",
        gap: 3,
        maxWidth: "85%",
        alignSelf: fromYou ? "flex-end" : "flex-start",
      }}
    >
      <div
        style={{
          padding: "10px 13px",
          background: fromYou ? T.accentSoft : T.surface,
          border: `1px solid ${fromYou ? T.accentBorder : T.border}`,
          borderRadius: 14,
          borderBottomRightRadius: fromYou ? 4 : 14,
          borderBottomLeftRadius: fromYou ? 14 : 4,
          fontFamily: T.fontBody,
          fontSize: 13.5,
          color: T.ink,
          lineHeight: 1.45,
        }}
      >
        {text}
      </div>
      <div
        style={{
          fontFamily: T.fontMono,
          fontSize: 8.5,
          color: T.inkSubtle,
          letterSpacing: "0.12em",
          fontWeight: 500,
          padding: "0 4px",
        }}
      >
        {date}
      </div>
    </div>
  );
}

// =================================================================
// DASHBOARD VIEW (Influencer POV)
// =================================================================
function DashboardView({ dealState, onMarkDone }) {
  const isInProgress = dealState === "IN_PROGRESS";
  const caption = isInProgress ? "IN PROGRESS" : "RATE NOW";
  const captionColor = isInProgress ? T.inkMuted : T.accent;

  return (
    <div
      className="fade-up"
      style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}
    >
      {/* TOP BAR */}
      <div
        style={{
          padding: "16px 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexShrink: 0,
          borderBottom: `1px solid ${T.border}`,
        }}
      >
        <div>
          <div
            style={{
              fontFamily: T.fontMono,
              fontSize: 9,
              color: T.accent,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: 2,
            }}
          >
            Influencer POV
          </div>
          <h1
            style={{
              fontFamily: T.fontDisplay,
              fontSize: 20,
              fontWeight: 800,
              margin: 0,
              color: T.ink,
              letterSpacing: "-0.035em",
            }}
          >
            Dashboard
          </h1>
        </div>
        <button
          aria-label="Notifications"
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
          <Bell size={16} strokeWidth={2.2} />
        </button>
      </div>

      {/* SCROLL BODY */}
      <div
        className="scroll-container"
        style={{
          flex: 1,
          minHeight: 0,
          overflowY: "auto",
          padding: "20px 18px 30px",
        }}
      >
        {/* Section header */}
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <h2
            style={{
              fontFamily: T.fontDisplay,
              fontSize: 17,
              fontWeight: 700,
              margin: 0,
              color: T.ink,
              letterSpacing: "-0.03em",
            }}
          >
            {isInProgress ? "Active deals" : "Needs your attention"}
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
            1
          </span>
        </div>

        {/* THE DEAL CARD with inline Mark done CTA */}
        <DealCardWithMarkDone
          dealState={dealState}
          onMarkDone={onMarkDone}
        />
      </div>
    </div>
  );
}

function DealCardWithMarkDone({ dealState, onMarkDone }) {
  const isInProgress = dealState === "IN_PROGRESS";

  if (!isInProgress) {
    // COMPLETED state — RATE NOW card with accent fill
    return (
      <div
        style={{
          width: "100%",
          padding: "14px 16px",
          background: T.accentSoft,
          border: `1px solid ${T.accentBorder}`,
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: T.surfaceAlt,
            border: `1px solid ${T.borderStrong}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: T.fontDisplay,
              fontSize: 16,
              fontWeight: 800,
              color: T.ink,
              letterSpacing: "-0.05em",
            }}
          >
            {DEAL.business.monogram}
          </span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: T.fontDisplay,
              fontSize: 15,
              fontWeight: 700,
              color: T.ink,
              letterSpacing: "-0.025em",
              marginBottom: 3,
            }}
          >
            {DEAL.business.name}
          </div>
          <div
            style={{
              fontFamily: T.fontMono,
              fontSize: 9.5,
              color: T.accent,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            RATE NOW
          </div>
          <div
            style={{
              fontFamily: T.fontBody,
              fontSize: 12,
              color: T.inkMuted,
            }}
          >
            {DEAL.summary} · ₪{DEAL.money}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            fontFamily: T.fontMono,
            fontSize: 8.5,
            color: T.accent,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          Tap to rate
          <ArrowRight size={10} strokeWidth={2.6} />
        </div>
      </div>
    );
  }

  // IN_PROGRESS — neutral card + inline Mark done CTA
  return (
    <div
      style={{
        width: "100%",
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      {/* Card top — same as Dashboard pattern */}
      <div
        style={{
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          gap: 14,
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: T.surfaceAlt,
            border: `1px solid ${T.borderStrong}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: T.fontDisplay,
              fontSize: 16,
              fontWeight: 800,
              color: T.ink,
              letterSpacing: "-0.05em",
            }}
          >
            {DEAL.business.monogram}
          </span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontFamily: T.fontDisplay,
              fontSize: 15,
              fontWeight: 700,
              color: T.ink,
              letterSpacing: "-0.025em",
              marginBottom: 3,
            }}
          >
            {DEAL.business.name}
          </div>
          <div
            style={{
              fontFamily: T.fontMono,
              fontSize: 9.5,
              color: T.inkMuted,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 600,
              marginBottom: 4,
            }}
          >
            IN PROGRESS · STARTED {DEAL.startedDate.toUpperCase()}
          </div>
          <div
            style={{
              fontFamily: T.fontBody,
              fontSize: 12,
              color: T.inkMuted,
            }}
          >
            {DEAL.summary} · ₪{DEAL.money}
          </div>
        </div>
      </div>

      {/* Mark done CTA — bottom of card */}
      <button
        onClick={onMarkDone}
        style={{
          width: "100%",
          padding: "12px 16px",
          background: T.accentSoft,
          border: "none",
          borderTop: `1px solid ${T.accentBorder}`,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: T.fontBody,
          transition: "background 0.15s ease",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(255,122,41,0.18)")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.background = T.accentSoft)
        }
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Check size={14} strokeWidth={2.8} color={T.accent} />
          <span
            style={{
              fontFamily: T.fontDisplay,
              fontSize: 13,
              fontWeight: 700,
              color: T.accent,
              letterSpacing: "-0.02em",
            }}
          >
            Mark deal as done
          </span>
        </div>
        <ArrowRight size={13} strokeWidth={2.6} color={T.accent} />
      </button>
    </div>
  );
}

// =================================================================
// MARK DONE MODAL
// =================================================================
function MarkDoneModal({ finalMessage, setFinalMessage, onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      {/* Backdrop */}
      <div
        className="backdrop-in"
        onClick={onCancel}
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
      />

      {/* Sheet */}
      <div
        className="modal-in"
        style={{
          position: "relative",
          background: T.bg,
          borderTopLeftRadius: 22,
          borderTopRightRadius: 22,
          borderTop: `1px solid ${T.borderStrong}`,
          paddingTop: 8,
          paddingBottom: 20,
          zIndex: 2,
        }}
      >
        {/* Handle */}
        <div
          style={{
            width: 36,
            height: 4,
            borderRadius: 2,
            background: T.borderStrong,
            margin: "0 auto 18px",
          }}
        />

        {/* Hero — large accent check */}
        <div
          style={{
            padding: "8px 22px 18px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background: T.accentSoft,
              border: `1px solid ${T.accentBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
            }}
          >
            <Check size={26} strokeWidth={2.6} color={T.accent} />
          </div>

          <h2
            style={{
              fontFamily: T.fontDisplay,
              fontSize: 24,
              fontWeight: 800,
              margin: 0,
              color: T.ink,
              letterSpacing: "-0.04em",
              lineHeight: 1.1,
              marginBottom: 10,
            }}
          >
            Mark deal as done?
          </h2>

          <p
            style={{
              fontFamily: T.fontBody,
              fontSize: 14,
              color: T.ink,
              opacity: 0.75,
              lineHeight: 1.5,
              margin: 0,
              maxWidth: "32ch",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            This tells {DEAL.business.name} you've delivered the work. They'll be
            able to rate the deal.
          </p>
        </div>

        {/* Optional final message */}
        <div style={{ padding: "0 22px 18px" }}>
          <div
            style={{
              fontFamily: T.fontMono,
              fontSize: 9.5,
              color: T.inkMuted,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 500,
              marginBottom: 8,
            }}
          >
            Add a final message · optional
          </div>
          <div
            style={{
              padding: "12px 14px",
              background: T.surface,
              border: `1px solid ${T.border}`,
              borderRadius: 12,
            }}
          >
            <textarea
              value={finalMessage}
              onChange={(e) => setFinalMessage(e.target.value.slice(0, 200))}
              placeholder="e.g. Reel is live, story set going up tonight. Let me know if you need anything else!"
              rows={3}
              style={{
                width: "100%",
                background: "transparent",
                border: "none",
                outline: "none",
                fontFamily: T.fontBody,
                fontSize: 13.5,
                color: T.ink,
                lineHeight: 1.5,
                resize: "none",
                padding: 0,
              }}
            />
            <div
              style={{
                marginTop: 4,
                textAlign: "right",
                fontFamily: T.fontMono,
                fontSize: 9,
                color: finalMessage.length > 180 ? T.accent : T.inkSubtle,
                letterSpacing: "0.1em",
                fontWeight: 500,
              }}
            >
              {finalMessage.length}/200
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding: "0 16px", display: "flex", gap: 8 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "15px 22px",
              background: "transparent",
              border: `1px solid ${T.borderStrong}`,
              borderRadius: 100,
              cursor: "pointer",
              fontFamily: T.fontDisplay,
              fontSize: 14,
              fontWeight: 700,
              color: T.ink,
              letterSpacing: "-0.015em",
            }}
          >
            Not yet
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1.5,
              padding: "15px 22px",
              background: T.accent,
              border: "none",
              borderRadius: 100,
              cursor: "pointer",
              fontFamily: T.fontDisplay,
              fontSize: 14,
              fontWeight: 700,
              color: T.bg,
              letterSpacing: "-0.015em",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              boxShadow: `0 8px 24px ${T.accentShadow}`,
            }}
          >
            Mark done
            <Check size={15} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
}

// =================================================================
// TOAST
// =================================================================
function Toast({ onDismiss }) {
  return (
    <div
      className="toast-in"
      style={{
        position: "absolute",
        top: 16,
        left: 14,
        right: 14,
        zIndex: 90,
        background: "rgba(26, 24, 21, 0.96)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: `1px solid ${T.accentBorder}`,
        borderRadius: 14,
        padding: "12px 14px",
        display: "flex",
        alignItems: "center",
        gap: 11,
        boxShadow: `0 12px 32px rgba(0,0,0,0.4), 0 0 0 1px ${T.accentBorder}`,
      }}
    >
      <div
        className="check-pop"
        style={{
          width: 32,
          height: 32,
          borderRadius: 9,
          background: T.accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Check size={17} strokeWidth={3} color={T.bg} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontFamily: T.fontDisplay,
            fontSize: 13.5,
            fontWeight: 700,
            color: T.ink,
            letterSpacing: "-0.02em",
            lineHeight: 1.2,
            marginBottom: 1,
          }}
        >
          Marked done.
        </div>
        <div
          style={{
            fontFamily: T.fontMono,
            fontSize: 9,
            color: T.inkMuted,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          Rate when you're ready
        </div>
      </div>
      <button
        onClick={onDismiss}
        aria-label="Dismiss"
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: "transparent",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          color: T.inkMuted,
          flexShrink: 0,
        }}
      >
        <X size={14} strokeWidth={2.4} />
      </button>
    </div>
  );
}
