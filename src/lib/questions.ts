/**
 * Atlas Questions — the 5 contemplative questions that drive the match.
 *
 * Questions and options mirror EXACTLY the Atlas on contemplators.art (English).
 * Some options here have no direct Contemplator with that exact attribute value
 * (e.g. "The time that passes", "Light and shadows"). That is intentional:
 * the match algorithm computes affinity by similarity, so users still get a
 * Contemplator result with a coherent percentage, even when their answers
 * sit outside the 5 base categories of the dataset.
 *
 * The order, labels and number of options here are the source of truth for the
 * Mini App quiz and must stay aligned with the web Atlas.
 */

// --- Types ---

/**
 * Each option a user can select.
 * `label`  — what the user reads on screen (English, mirrors the web).
 * `value`  — internal identifier used by the match algorithm.
 */
export interface Option {
    label: string;
    value: string;
  }
  
  /**
   * A single question of the Atlas quiz.
   * `attribute` indicates which Contemplator field this question targets
   * when computing the match.
   */
  export interface Question {
    id: number;
    attribute: "object" | "state" | "environment" | "vector" | "link";
    title: string;
    options: Option[];
  }
  
  // --- Question 1: Object of Contemplation ---
  
  export const QUESTION_OBJECT: Question = {
    id: 1,
    attribute: "object",
    title: "What are you contemplating?",
    options: [
      { label: "The landscape", value: "the_landscape" },
      { label: "People", value: "people" },
      { label: "Something created", value: "something_created" },
      { label: "My own thoughts", value: "my_own_thoughts" },
      { label: "The time that passes", value: "the_time_that_passes" },
      { label: "Light and shadows", value: "light_and_shadows" },
      { label: "The silence between things", value: "the_silence_between_things" },
    ],
  };
  
  // --- Question 2: Mental State ---
  
  export const QUESTION_STATE: Question = {
    id: 2,
    attribute: "state",
    title: "How are you feeling?",
    options: [
      { label: "At peace, without haste", value: "at_peace" },
      { label: "Eager to understand", value: "eager_to_understand" },
      { label: "Missing something a little", value: "missing_something" },
      { label: "Thinking of others", value: "thinking_of_others" },
      { label: "Open to whatever comes", value: "open_to_whatever_comes" },
      { label: "A little lost", value: "a_little_lost" },
      { label: "Surprised by something small", value: "surprised_by_small" },
    ],
  };
  
  // --- Question 3: Environment ---
  
  export const QUESTION_ENVIRONMENT: Question = {
    id: 3,
    attribute: "environment",
    title: "Where does it usually happen?",
    options: [
      { label: "Among people", value: "among_people" },
      { label: "In a sacred or intimate place", value: "sacred_or_intimate" },
      { label: "Near the water", value: "near_the_water" },
      { label: "In the face of something very large and open", value: "vast_and_open" },
      { label: "In an empty space", value: "empty_space" },
      { label: "At home, in silence", value: "at_home_in_silence" },
      { label: "In motion", value: "in_motion" },
    ],
  };
  
  // --- Question 4: Sensitive Vector ---
  
  export const QUESTION_VECTOR: Question = {
    id: 4,
    attribute: "vector",
    title: "How does it affect you?",
    options: [
      { label: "It shakes me to the core", value: "shakes_to_core" },
      { label: "It makes me think without getting anywhere", value: "thinking_without_arriving" },
      { label: "It completely envelops me", value: "envelops_completely" },
      { label: "It takes me to something deeper", value: "something_deeper" },
      { label: "It soothes me, it lightens me", value: "soothes_lightens" },
      { label: "Time holds me back", value: "time_holds_back" },
      { label: "It connects me to something greater", value: "something_greater" },
    ],
  };
  
  // --- Question 5: Contemplative Link ---
  
  export const QUESTION_LINK: Question = {
    id: 5,
    attribute: "link",
    title: "What do you do with it?",
    options: [
      { label: "I look at it without touching it", value: "look_without_touching" },
      { label: "I wait for it to speak to me", value: "wait_to_speak" },
      { label: "I give it my full attention", value: "full_attention" },
      { label: "I let myself be carried away by it", value: "carried_away" },
      { label: "I hear it more than I see it", value: "hear_more_than_see" },
      { label: "I accept it without judging it", value: "accept_without_judging" },
      { label: "I keep it inside", value: "keep_inside" },
    ],
  };
  
  // --- Ordered list of all 5 questions ---
  
  /**
   * All Atlas questions in the order they should be shown to the user.
   * The Mini App quiz walks through these one by one.
   */
  export const QUESTIONS: Question[] = [
    QUESTION_OBJECT,
    QUESTION_STATE,
    QUESTION_ENVIRONMENT,
    QUESTION_VECTOR,
    QUESTION_LINK,
  ];
  
  // --- Answers type ---
  
  /**
   * The shape of a complete set of user answers.
   * Each field stores the `value` of the selected option for that question.
   * Optional fields allow representing partial progress through the quiz.
   */
  export interface Answers {
    object?: string;
    state?: string;
    environment?: string;
    vector?: string;
    link?: string;
  }
  