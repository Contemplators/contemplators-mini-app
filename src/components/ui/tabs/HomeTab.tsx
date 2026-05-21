"use client";

import { useState, useMemo } from "react";
import { QUESTIONS, type Answers } from "~/lib/questions";
import { findMatches, isComplete, type ScoredContemplator } from "~/lib/match";

/**
 * HomeTab — Contemplators Atlas quiz, ported from the web Atlas.
 *
 * Visual palette (extracted from the live site at contemplators.art/atlas):
 *   - BG          #2a2e26   dark olive-green background
 *   - TEXT        #f0ebdc   warm beige text (main body)
 *   - SUBTEXT     #d9fce7   pale cream-green (subtitles, hints)
 *   - DIM         #a3a2a2   gray (inactive borders)
 *   - ORANGE      #edb485   salmon-orange (titles, primary CTA)
 *   - ACTIVE      #25d366   bright green (active borders, selection)
 *
 * Typography: JetBrains Mono / monospace throughout, mirroring the web Atlas.
 */

type Screen = "quiz" | "results" | "detail";

const SITE_BASE = "https://www.contemplators.art";

// --- Brand palette ---
const BG = "#2a2e26";
const TEXT = "#f0ebdc";
const SUBTEXT = "#d9fce7";
const DIM = "#a3a2a2";
const ORANGE = "#edb485";
const ACTIVE = "#25d366";
const WHATSAPP_GREEN = "#25D366";
const MAP_GREEN = "#95C4A7";

export function HomeTab() {
  // --- State ---
  const [screen, setScreen] = useState<Screen>("quiz");
  const [answers, setAnswers] = useState<Answers>({});
  const [openQuestionId, setOpenQuestionId] = useState<number | null>(1);
  const [selected, setSelected] = useState<ScoredContemplator | null>(null);

  // --- Derived ---
  const allAnswered = useMemo(() => isComplete(answers), [answers]);
  const matches = useMemo(
    () => (allAnswered ? findMatches(answers) : []),
    [answers, allAnswered]
  );

  // --- Handlers ---
  const handleSelectOption = (
    attribute: "object" | "state" | "environment" | "vector" | "link",
    value: string,
    questionId: number
  ) => {
    setAnswers((prev) => ({ ...prev, [attribute]: value }));
    const next = QUESTIONS.find(
      (q) => q.id > questionId && answers[q.attribute] === undefined
    );
    setOpenQuestionId(next ? next.id : null);
  };

  const handleShowResults = () => setScreen("results");

  const handlePickContemplator = (c: ScoredContemplator) => {
    setSelected(c);
    setScreen("detail");
  };

  const handleStartOver = () => {
    setAnswers({});
    setSelected(null);
    setOpenQuestionId(1);
    setScreen("quiz");
  };

  // --- WhatsApp share ---
  const shareViaWhatsApp = (c: ScoredContemplator) => {
    const url = `${SITE_BASE}/en/contemplators/${c.slug}`;
    const message = `There is a Contemplator who looks like you: ${c.name} ${url}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
    if (typeof window !== "undefined") {
      window.open(waUrl, "_blank");
    }
  };

  // --- Common wrapper ---
  const wrapperStyle: React.CSSProperties = {
    backgroundColor: BG,
    color: TEXT,
    fontFamily: '"JetBrains Mono", "Fira Code", "Courier New", monospace',
    minHeight: "100vh",
    width: "100%",
  };

  // --- Render: detail screen ---
  if (screen === "detail" && selected) {
    const fichaUrl = `${SITE_BASE}/en/contemplators/${selected.slug}`;
    const mapUrl = `${SITE_BASE}/en/map?contemplator=${encodeURIComponent(selected.slug)}`;
    const chatUrl = `${SITE_BASE}/en/chat?contemplator=${encodeURIComponent(selected.slug)}`;

    return (
      <div style={wrapperStyle}>
        <div className="px-4 py-4 max-w-md mx-auto">
          <button
            onClick={() => setScreen("results")}
            className="text-xs mb-4 tracking-widest"
            style={{ color: DIM }}
            type="button"
          >
            ← BACK TO RESULTS
          </button>

          {/* Image — link to ficha */}
          <a
            href={fichaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block relative w-full mb-4"
          >
            <div className="aspect-square w-full overflow-hidden" style={{ backgroundColor: "#1f221d" }}>
              <img
                src={selected.image}
                alt={selected.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div
              className="absolute top-2 right-2 px-2.5 py-1 rounded-full text-xs font-bold"
              style={{
                backgroundColor:
                  selected.score === 100 ? ORANGE : "rgba(0,0,0,0.7)",
                color: selected.score === 100 ? BG : TEXT,
              }}
            >
              {selected.score}%
            </div>
          </a>

          {/* Number + Name */}
          <p className="text-xs tracking-widest mb-1" style={{ color: DIM }}>
            {selected.number}
          </p>
          <h2 className="text-xl uppercase mb-5 tracking-wider" style={{ color: TEXT }}>
            {selected.name}
          </h2>

          {/* Revelation phrase */}
          <div className="pl-4 mb-6" style={{ borderLeft: `3px solid ${ORANGE}` }}>
            <p className="text-xs tracking-widest mb-2" style={{ color: DIM }}>
              REVELATION
            </p>
            <p className="text-base italic leading-relaxed" style={{ color: SUBTEXT }}>
              “{selected.phrase}”
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 mb-6">
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-5 text-center text-sm tracking-wide font-medium"
              style={{ backgroundColor: MAP_GREEN, color: "#1f221d", borderRadius: "2px" }}
            >
              📍 PLACE ME ON THE MAP
            </a>
            <a
              href={chatUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-5 text-center text-sm tracking-wide font-medium"
              style={{ backgroundColor: TEXT, color: BG, borderRadius: "2px" }}
            >
              💬 CHAT WITH ME
            </a>
            <button
              onClick={() => shareViaWhatsApp(selected)}
              className="w-full py-3 px-5 text-center text-sm tracking-wide font-medium"
              style={{ backgroundColor: WHATSAPP_GREEN, color: "#FFFFFF", borderRadius: "2px" }}
              type="button"
            >
              📤 SEND TO A FRIEND
            </button>
          </div>

          {/* Start over */}
          <button
            onClick={handleStartOver}
            className="w-full py-3 px-5 text-center text-xs tracking-widest"
            style={{
              backgroundColor: "transparent",
              color: DIM,
              border: `1px solid ${DIM}`,
              borderRadius: "2px",
            }}
            type="button"
          >
            ↺ START OVER
          </button>
        </div>
      </div>
    );
  }

  // --- Render: results screen ---
  if (screen === "results") {
    return (
      <div style={wrapperStyle}>
        <div className="px-4 py-4 max-w-md mx-auto">
          <button
            onClick={() => setScreen("quiz")}
            className="text-xs mb-4 tracking-widest"
            style={{ color: DIM }}
            type="button"
          >
            ← BACK TO QUIZ
          </button>

          {/* Header */}
          <div className="mb-5 pb-3" style={{ borderBottom: `1px solid ${DIM}` }}>
            <p className="text-sm tracking-widest" style={{ color: TEXT }}>
              {matches.length} RESULTS
            </p>
          </div>

          {/* Hint box */}
          <div
            className="mb-6 p-3 pl-4"
            style={{
              borderLeft: `3px solid ${ORANGE}`,
              backgroundColor: "rgba(237, 180, 133, 0.06)",
            }}
          >
            <p className="text-sm mb-1 tracking-wide" style={{ color: TEXT }}>
              Choose your Contemplator and tap it
            </p>
            <p className="text-xs" style={{ color: SUBTEXT, opacity: 0.7 }}>
              The % shows how closely it matches your selection
            </p>
          </div>

          {/* Results grid (2 columns) */}
          {matches.length === 0 ? (
            <p className="italic text-center py-8 text-sm" style={{ color: DIM }}>
              No Contemplator exceeds 60% match. Try a different combination.
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {matches.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handlePickContemplator(c)}
                  className="block text-left"
                  type="button"
                >
                  <div className="relative aspect-square overflow-hidden mb-2" style={{ backgroundColor: "#1f221d" }}>
                    <img
                      src={c.image}
                      alt={c.name}
                      className="w-full h-full object-cover"
                    />
                    <div
                      className="absolute top-1 right-1 px-2 py-0.5 rounded-full text-xs font-bold"
                      style={{
                        backgroundColor:
                          c.score === 100 ? ORANGE : "rgba(0,0,0,0.7)",
                        color: c.score === 100 ? BG : TEXT,
                      }}
                    >
                      {c.score}%
                    </div>
                  </div>
                  <p className="text-sm italic" style={{ color: TEXT }}>
                    {c.name}
                  </p>
                  <p className="text-xs tracking-widest mt-0.5" style={{ color: DIM }}>
                    {c.number}
                  </p>
                </button>
              ))}
            </div>
          )}

          {/* Start over */}
          <button
            onClick={handleStartOver}
            className="w-full mt-8 py-3 px-5 text-center text-xs tracking-widest"
            style={{
              backgroundColor: "transparent",
              color: DIM,
              border: `1px solid ${DIM}`,
              borderRadius: "2px",
            }}
            type="button"
          >
            ↺ START OVER
          </button>
        </div>
      </div>
    );
  }

  // --- Render: quiz screen (default) ---
  return (
    <div style={wrapperStyle}>
      <div className="px-4 py-6 max-w-md mx-auto">
        {/* Intro */}
        <div className="mb-6 text-center">
          <h1 className="text-lg tracking-wide mb-2" style={{ color: ORANGE }}>
            Discover your Contemplator
          </h1>
          <p className="text-xs leading-relaxed" style={{ color: SUBTEXT, opacity: 0.85 }}>
            Answer 5 questions to find the figure that mirrors your gaze.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-2">
          {QUESTIONS.map((q) => {
            const isOpen = openQuestionId === q.id;
            const isAnswered = answers[q.attribute] !== undefined;
            const selectedValue = answers[q.attribute];
            const selectedLabel = selectedValue
              ? q.options.find((o) => o.value === selectedValue)?.label
              : null;

            // Border color: green if answered, gray if not, slightly stronger when open
            const borderColor = isAnswered ? ACTIVE : DIM;

            return (
              <div
                key={q.id}
                style={{
                  border: `1px solid ${borderColor}`,
                  borderRadius: "2px",
                  transition: "border 0.2s ease",
                }}
              >
                {/* Question header */}
                <button
                  onClick={() => setOpenQuestionId(isOpen ? null : q.id)}
                  className="w-full p-3 flex items-start justify-between text-left"
                  type="button"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs tracking-widest mb-1" style={{ color: DIM }}>
                      {q.id}/5
                    </p>
                    <p className="text-sm tracking-wide" style={{ color: TEXT }}>
                      {q.title}
                    </p>
                    {selectedLabel && !isOpen && (
                      <p
                        className="text-xs italic mt-1 truncate"
                        style={{ color: ACTIVE }}
                      >
                        → {selectedLabel}
                      </p>
                    )}
                  </div>
                  <span
                    className="ml-3 mt-0.5 text-base"
                    style={{ color: isAnswered ? ACTIVE : DIM }}
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {/* Options (only when open) */}
                {isOpen && (
                  <div className="px-3 pb-3 space-y-1.5">
                    {q.options.map((opt) => {
                      const isSelected = selectedValue === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => handleSelectOption(q.attribute, opt.value, q.id)}
                          className="w-full text-left px-3 py-2 text-sm transition-colors"
                          style={{
                            borderRadius: "2px",
                            backgroundColor: isSelected ? ACTIVE : "transparent",
                            color: isSelected ? BG : TEXT,
                            border: `1px solid ${isSelected ? ACTIVE : DIM}`,
                          }}
                          type="button"
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Show results button — only when all 5 answered */}
        {allAnswered && (
          <button
            onClick={handleShowResults}
            className="w-full mt-6 py-3.5 px-5 text-sm tracking-widest"
            style={{
              backgroundColor: ORANGE,
              color: BG,
              borderRadius: "2px",
              fontWeight: 500,
            }}
            type="button"
          >
            DISCOVER YOURS →
          </button>
        )}

        {/* Tiny progress hint */}
        {!allAnswered && (
          <p className="text-xs text-center mt-6 tracking-widest" style={{ color: DIM }}>
            {Object.values(answers).filter(Boolean).length} / 5 ANSWERED
          </p>
        )}
      </div>
    </div>
  );
}
