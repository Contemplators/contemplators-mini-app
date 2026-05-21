/**
 * Match Algorithm — replicates EXACTLY the ContemplatorEngine logic from the web Atlas.
 *
 * The 5 quiz questions each map to one of the 5 Contemplator attributes
 * (object, state, environment, vector, link).
 *
 * Each user-facing option can map to one or two underlying attribute values
 * (e.g. "Light and shadows" maps to both "art" and "nature"). When an option
 * maps to multiple values, each value contributes a partial weight to the
 * total score for that question.
 *
 * Scoring formula (mirrors web Atlas):
 *   - For each active filter:
 *     - Get the list of underlying values the option maps to
 *     - weightPerOriginal = 1 / list.length
 *     - For each underlying value, if the Contemplator matches it, add weight
 *   - finalScore = round((sumOfPoints / activeFiltersCount) * 100)
 *   - Only Contemplators with score >= MIN_SCORE_THRESHOLD are returned
 *   - Results are sorted by score descending
 */

import { CONTEMPLATORS, type Contemplator } from "./contemplators";
import type { Answers } from "./questions";

// --- Constants ---

/**
 * Minimum match percentage for a Contemplator to be shown as a result.
 * Mirrors the threshold used by the web Atlas.
 */
export const MIN_SCORE_THRESHOLD = 60;

// --- Types ---

/**
 * A Contemplator enriched with its match score (0..100) against a set of answers.
 */
export interface ScoredContemplator extends Contemplator {
  score: number;
}

// --- Variable Map ---

/**
 * Maps each user-facing option `value` (from questions.ts) to one or more
 * underlying Contemplator attribute values.
 *
 * Keys here must match the `value` field of each Option in questions.ts.
 * Values must match the union types in contemplators.ts.
 *
 * Most options map 1:1 to a single attribute value. A few options map to
 * two values — those will award partial credit (0.5) when only one matches.
 */
export const VARIABLE_MAP = {
  // --- Question 1: Object of Contemplation ---
  object: {
    the_landscape: ["nature"],
    people: ["people"],
    something_created: ["art"],
    my_own_thoughts: ["thoughts"],
    the_time_that_passes: ["thoughts", "silence"],
    light_and_shadows: ["art", "nature"],
    the_silence_between_things: ["silence"],
  },

  // --- Question 2: Mental State ---
  state: {
    at_peace: ["calm"],
    eager_to_understand: ["curiosity"],
    missing_something: ["nostalgia"],
    thinking_of_others: ["empathy"],
    open_to_whatever_comes: ["openness"],
    a_little_lost: ["nostalgia", "openness"],
    surprised_by_small: ["curiosity", "calm"],
  },

  // --- Question 3: Environment ---
  environment: {
    among_people: ["crowded_place"],
    sacred_or_intimate: ["sacred_refuge"],
    near_the_water: ["shore"],
    vast_and_open: ["horizon"],
    empty_space: ["empty_space"],
    at_home_in_silence: ["sacred_refuge", "empty_space"],
    in_motion: ["crowded_place", "horizon"],
  },

  // --- Question 4: Sensitive Vector ---
  vector: {
    shakes_to_core: ["intensity"],
    thinking_without_arriving: ["abstraction"],
    envelops_completely: ["immersion"],
    something_deeper: ["depth"],
    soothes_lightens: ["lightness"],
    time_holds_back: ["immersion", "depth"],
    something_greater: ["depth", "intensity"],
  },

  // --- Question 5: Contemplative Link ---
  link: {
    look_without_touching: ["observation"],
    wait_to_speak: ["waiting"],
    full_attention: ["attention"],
    carried_away: ["opening"],
    hear_more_than_see: ["listening"],
    accept_without_judging: ["opening", "listening"],
    keep_inside: ["attention", "waiting"],
  },
} as const;

// --- Helper Types ---

type AttributeKey = keyof Answers; // "object" | "state" | "environment" | "vector" | "link"

// --- Score Calculation ---

/**
 * Calculate the match score (0..100) for one Contemplator against a set of answers.
 *
 * Mirrors the `calcScore` function from the web Atlas:
 *   total = sum over each active filter of:
 *     (1 / mappedValues.length) for each mapped value that matches
 *   score = round((total / activeFiltersCount) * 100)
 *
 * @param contemplator - A single Contemplator to score
 * @param answers - The user\'s current answers (partial allowed)
 * @returns Integer score from 0 to 100, or 0 if no filters are active
 */
export function calcScore(contemplator: Contemplator, answers: Answers): number {
  const keys: AttributeKey[] = ["object", "state", "environment", "vector", "link"];

  // Count how many questions the user has actually answered
  const activeFilters = keys.filter((k) => answers[k] !== undefined && answers[k] !== null).length;
  if (activeFilters === 0) return 0;

  let total = 0;

  for (const key of keys) {
    const selectedValue = answers[key];
    if (!selectedValue) continue;

    // Look up which underlying attribute values this option maps to
    const map = VARIABLE_MAP[key] as Record<string, readonly string[]>;
    const mappedValues = map[selectedValue];
    if (!mappedValues || mappedValues.length === 0) continue;

    // The Contemplator\'s value for this attribute (e.g. its "nature")
    const contemplatorValue = String(contemplator[key]).toLowerCase();

    // Each mapped value contributes 1/N of this question\'s weight
    const weightPerValue = 1 / mappedValues.length;

    for (const mappedValue of mappedValues) {
      if (contemplatorValue === mappedValue.toLowerCase()) {
        total += weightPerValue;
      }
    }
  }

  return Math.round((total / activeFilters) * 100);
}

// --- Main Match Function ---

/**
 * Find all Contemplators that match the user\'s answers above the threshold.
 *
 * @param answers - The user\'s answers (partial answers allowed)
 * @returns Contemplators sorted by score descending, only those with score >= threshold
 */
export function findMatches(answers: Answers): ScoredContemplator[] {
  return CONTEMPLATORS.map((c) => ({ ...c, score: calcScore(c, answers) }))
    .filter((c) => c.score >= MIN_SCORE_THRESHOLD)
    .sort((a, b) => b.score - a.score);
}

/**
 * Convenience: find the single best Contemplator match for a set of answers.
 * Returns null if no Contemplator passes the threshold.
 */
export function findBestMatch(answers: Answers): ScoredContemplator | null {
  const matches = findMatches(answers);
  return matches.length > 0 ? matches[0] : null;
}

/**
 * Convenience: check whether all 5 questions have been answered.
 */
export function isComplete(answers: Answers): boolean {
  return (
    answers.object !== undefined &&
    answers.state !== undefined &&
    answers.environment !== undefined &&
    answers.vector !== undefined &&
    answers.link !== undefined
  );
}
