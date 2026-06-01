/**
 * Pure, dependency-free rename transformation utilities.
 *
 * This module captures the *conceptual* rename logic for the
 * "Copilot → Cortex" plugin branding change. It is intentionally a leaf
 * module with no imports of plugin singletons, settings, or Obsidian APIs so
 * that it can be exercised directly by example-based and property-based tests
 * (see the `plugin-rename-cortex` spec, Properties 1–3).
 *
 * The functions here are *not* used to mutate the live codebase at runtime —
 * the actual rename is a static find-and-replace applied during development.
 * They exist to express the same transformation as testable, generalizable
 * functions so the universal correctness properties can be verified across
 * many generated inputs.
 */

/**
 * Provider references that name the *external* GitHub Copilot service rather
 * than the plugin's own identity. These must survive the rename verbatim.
 *
 * Ordered most-specific first so that masking never partially consumes a
 * longer protected token (e.g. `GitHubCopilotAuth` is handled before any
 * shorter overlap could be considered).
 */
const PROTECTED_GITHUB_COPILOT_TOKENS = [
  "GitHubCopilotAuth",
  "GITHUB_COPILOT",
  "GitHub Copilot",
] as const;

/**
 * Maps a matched, case-varying `copilot` token to the equivalently cased
 * `cortex` replacement so that the surrounding text style is preserved.
 *
 * - `COPILOT` → `CORTEX` (all upper-case)
 * - `Copilot` / mixed leading-upper → `Cortex` (title-case)
 * - `copilot` → `cortex` (lower-case)
 *
 * @param match - The literal `copilot` token (any casing) that was matched.
 * @returns The case-matched `cortex` token.
 */
function toCortexWithMatchingCase(match: string): string {
  if (match === match.toUpperCase()) return "CORTEX";
  if (match[0] === match[0].toUpperCase()) return "Cortex";
  return "cortex";
}

/**
 * Rewrites standalone plugin-identity occurrences of "Copilot"/"copilot" to
 * "Cortex"/"cortex" while leaving every reference to the external GitHub
 * Copilot provider untouched.
 *
 * Preserved verbatim (never rewritten):
 * - the phrase `"GitHub Copilot"`
 * - the `GITHUB_COPILOT` provider identifier
 * - the `GitHubCopilotAuth` component identifier
 *
 * The match for plugin-identity tokens is case-insensitive (so `COPILOT`,
 * `Copilot`, and `copilot` are all rewritten), and the casing of each match
 * is carried over to its `cortex` replacement.
 *
 * Properties this satisfies (see design doc):
 * - Property 1: GitHub Copilot references are never renamed.
 * - Property 2: for inputs without `"GitHub Copilot"`, no case-insensitive
 *   plugin-identity "copilot" token remains in the output.
 *
 * @param input - Arbitrary text that may contain plugin-identity and/or
 *   external-provider references.
 * @returns The input with plugin-identity "copilot" tokens rewritten to
 *   "cortex" and external GitHub Copilot references preserved unchanged.
 */
export function renamePluginIdentity(input: string): string {
  // Phase 1: mask the external GitHub Copilot provider references so the
  // generic "copilot" replacement below cannot touch them. Sentinels use a
  // NUL delimiter that will not appear in realistic source text and contains
  // no "copilot" substring, so it is invisible to the replacement pass.
  const placeholders = new Map<string, string>();
  let working = input;

  PROTECTED_GITHUB_COPILOT_TOKENS.forEach((token, index) => {
    if (!working.includes(token)) return;
    const placeholder = `\u0000__CORTEX_RENAME_PROTECT_${index}__\u0000`;
    placeholders.set(placeholder, token);
    working = working.split(token).join(placeholder);
  });

  // Phase 2: rewrite every remaining plugin-identity "copilot" token,
  // preserving the original casing of each occurrence.
  working = working.replace(/copilot/gi, (match) => toCortexWithMatchingCase(match));

  // Phase 3: restore the masked GitHub Copilot provider references verbatim.
  placeholders.forEach((token, placeholder) => {
    working = working.split(placeholder).join(token);
  });

  return working;
}

/**
 * Replaces each `copilot` token within a path with `cortex`, in place,
 * leaving all other characters (including the `/` separators) unchanged.
 *
 * The path is processed segment-by-segment (splitting on `/`) so the
 * separator structure is guaranteed to be preserved. Within each segment the
 * literal lower-case `copilot` token is rewritten to `cortex`, which handles
 * both whole-segment names (`copilot` → `cortex`) and prefixed/embedded forms
 * (`copilot-conversations` → `cortex-conversations`, `.copilot-index` →
 * `.cortex-index`). Paths that contain no `copilot` segment are returned
 * identically.
 *
 * This is the transformation conceptually used to derive the new default
 * folder and index paths (see design doc, Property 3).
 *
 * @param path - A path string (e.g. `copilot/copilot-conversations`).
 * @returns The path with every `copilot` segment token rewritten to `cortex`.
 */
export function renamePathSegments(path: string): string {
  return path
    .split("/")
    .map((segment) => segment.split("copilot").join("cortex"))
    .join("/");
}
