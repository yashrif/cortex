import fc from "fast-check";
import { renamePathSegments, renamePluginIdentity } from "./renameTransform";

/**
 * Counts the number of non-overlapping occurrences of `needle` within
 * `haystack`. Used to assert that protected GitHub Copilot references survive
 * the rename transformation verbatim (same count in and out).
 */
function countOccurrences(haystack: string, needle: string): number {
  if (needle.length === 0) return 0;
  let count = 0;
  let idx = haystack.indexOf(needle);
  while (idx !== -1) {
    count += 1;
    idx = haystack.indexOf(needle, idx + needle.length);
  }
  return count;
}

// Provider references that name the *external* GitHub Copilot service. These
// must be preserved verbatim by `renamePluginIdentity`.
const PROTECTED_TOKENS = ["GitHub Copilot", "GITHUB_COPILOT", "GitHubCopilotAuth"] as const;

describe("renamePluginIdentity — Property 1: GitHub Copilot preservation", () => {
  // Feature: plugin-rename-cortex, Property 1: GitHub Copilot references are never renamed
  // Validates: Requirements 2.6, 8.7, 9.2
  it("preserves every 'GitHub Copilot' occurrence verbatim across arbitrary inputs", () => {
    // Generators for the building blocks the property is about: the protected
    // external-provider phrases, standalone plugin-identity tokens (which the
    // transform *is* allowed to rewrite), and arbitrary filler text.
    const protectedPhrase = fc.constantFrom(...PROTECTED_TOKENS);
    const standaloneToken = fc.constantFrom("Copilot", "copilot", "COPILOT");
    const filler = fc.string();
    const part = fc.oneof(protectedPhrase, standaloneToken, filler);
    const separator = fc.constantFrom(" ", "", "\n", " - ", ".");

    fc.assert(
      fc.property(fc.array(part, { minLength: 1, maxLength: 20 }), separator, (parts, sep) => {
        const input = parts.join(sep);
        const output = renamePluginIdentity(input);

        // Each protected external-provider reference appears the same number
        // of times after the rename as it did before — i.e. none were
        // rewritten, dropped, or newly introduced.
        for (const token of PROTECTED_TOKENS) {
          expect(countOccurrences(output, token)).toBe(countOccurrences(input, token));
        }
      }),
      { numRuns: 100 }
    );
  });

  it("preserves 'GitHub Copilot' even when adjacent to standalone plugin-identity tokens", () => {
    fc.assert(
      fc.property(
        fc.array(fc.constantFrom("Copilot", "copilot", "GitHub Copilot"), {
          minLength: 1,
          maxLength: 30,
        }),
        (tokens) => {
          const input = tokens.join(" ");
          const output = renamePluginIdentity(input);
          // Every embedded "GitHub Copilot" survives verbatim regardless of how
          // many standalone "Copilot"/"copilot" tokens surround it.
          expect(countOccurrences(output, "GitHub Copilot")).toBe(
            countOccurrences(input, "GitHub Copilot")
          );
        }
      ),
      { numRuns: 100 }
    );
  });
});

describe("renamePluginIdentity — Property 2: No residual plugin-identity copilot", () => {
  // Feature: plugin-rename-cortex, Property 2: No residual plugin-identity "copilot" remains after rename
  // Validates: Requirements 3.2, 4.2, 6.1, 8.6
  //
  // For any input string that does not contain the external GitHub Copilot
  // provider references, renamePluginIdentity must produce output with no
  // case-insensitive "copilot" token remaining — every plugin-identity
  // occurrence is rewritten to "cortex".

  /** Standalone plugin-identity tokens that MUST be rewritten by the rename. */
  const copilotToken = fc.constantFrom("copilot", "Copilot", "COPILOT");

  /**
   * Generic filler text that contains no "copilot" token and no "github"
   * fragment, so it can never accidentally reconstruct a protected
   * external-provider identifier when concatenated with copilot tokens.
   */
  const safeWord = fc
    .string({ maxLength: 8 })
    .filter((s) => !/copilot/i.test(s) && !/github/i.test(s));

  /** Separators used to glue the generated fragments together. */
  const separator = fc.constantFrom(" ", "-", "_", "/", ".", "", "\n", "\t");

  /**
   * Build a generic string that mixes filler text with at least one
   * standalone "copilot" token, while guaranteeing none of the protected
   * external-provider tokens appear (filtered defensively to keep the
   * property's precondition exact).
   */
  const pluginIdentityString = fc
    .tuple(fc.array(fc.oneof(safeWord, copilotToken), { maxLength: 11 }), copilotToken, separator)
    .map(([parts, token, sep]) => [...parts, token].join(sep))
    .filter((s) => !PROTECTED_TOKENS.some((token) => s.includes(token)));

  it("leaves no case-insensitive 'copilot' token in the output", () => {
    fc.assert(
      fc.property(pluginIdentityString, (input) => {
        const output = renamePluginIdentity(input);
        expect(/copilot/i.test(output)).toBe(false);
      }),
      { numRuns: 100 }
    );
  });
});

describe("renamePathSegments — Property 3: Default path transformation", () => {
  // Feature: plugin-rename-cortex, Property 3: Default path transformation maps copilot/ segments to cortex/ correctly
  // Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 10.1
  //
  // For any path string, renamePathSegments must replace each `copilot` token
  // with `cortex` in the same position within each `/`-delimited segment,
  // leave all other characters (including the separators) unchanged, and
  // return paths that contain no `copilot` token identically.

  /**
   * Independent reference transformation for cross-checking. Uses a global
   * regex replace (distinct from the implementation's split/join) so the test
   * does not merely restate the implementation. The plugin's defaults are all
   * lower-case, and the path transform only rewrites the literal lower-case
   * `copilot` token — capitalised variants are intentionally left as-is.
   */
  const expectedTransform = (path: string): string =>
    path
      .split("/")
      .map((segment) => segment.replace(/copilot/g, "cortex"))
      .join("/");

  /**
   * Filler text that contains neither a `/` separator nor any `copilot`
   * token (case-insensitive), so injected `copilot` tokens are the only
   * occurrences and "no copilot segment" cases stay genuinely copilot-free.
   */
  const safeChunk = fc
    .string({ maxLength: 6 })
    .filter((s) => !s.includes("/") && !/copilot/i.test(s));

  /** A single path segment, optionally embedding one or more `copilot` tokens. */
  const segment = fc
    .array(fc.oneof(safeChunk, fc.constant("copilot")), { maxLength: 4 })
    .map((parts) => parts.join(""));

  /** A path-like string: segments joined by `/`. */
  const pathString = fc
    .array(segment, { minLength: 1, maxLength: 6 })
    .map((segments) => segments.join("/"));

  it("maps each 'copilot' segment token to 'cortex' in place and preserves separators", () => {
    fc.assert(
      fc.property(pathString, (path) => {
        const output = renamePathSegments(path);

        // Separator structure is preserved: same number of segments.
        const inSegments = path.split("/");
        const outSegments = output.split("/");
        expect(outSegments.length).toBe(inSegments.length);

        // Each segment is the input segment with `copilot` -> `cortex` in
        // position; segments without a `copilot` token are unchanged.
        outSegments.forEach((outSeg, i) => {
          const inSeg = inSegments[i];
          expect(outSeg).toBe(inSeg.replace(/copilot/g, "cortex"));
          if (!inSeg.includes("copilot")) {
            expect(outSeg).toBe(inSeg);
          }
        });

        // Whole-path equivalence against the independent reference.
        expect(output).toBe(expectedTransform(path));
      }),
      { numRuns: 100 }
    );
  });

  it("returns paths without a 'copilot' token identically", () => {
    const copilotFreePath = fc
      .array(safeChunk, { minLength: 1, maxLength: 6 })
      .map((segments) => segments.join("/"))
      .filter((p) => !p.includes("copilot"));

    fc.assert(
      fc.property(copilotFreePath, (path) => {
        expect(renamePathSegments(path)).toBe(path);
      }),
      { numRuns: 100 }
    );
  });

  it("maps the concrete default folder and index paths to their cortex equivalents", () => {
    // Anchors Requirements 5.1–5.6 and 10.1 to the documented default paths.
    expect(renamePathSegments("copilot")).toBe("cortex");
    expect(renamePathSegments("copilot/copilot-conversations")).toBe("cortex/cortex-conversations");
    expect(renamePathSegments("copilot/copilot-custom-prompts")).toBe(
      "cortex/cortex-custom-prompts"
    );
    expect(renamePathSegments("copilot/memory")).toBe("cortex/memory");
    expect(renamePathSegments("copilot/system-prompts")).toBe("cortex/system-prompts");
    expect(renamePathSegments("copilot/projects")).toBe("cortex/projects");
    expect(renamePathSegments(".copilot-index")).toBe(".cortex-index");
  });
});
