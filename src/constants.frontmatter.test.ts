import {
  CORTEX_COMMAND_CONTEXT_MENU_ENABLED,
  CORTEX_COMMAND_CONTEXT_MENU_ORDER,
  CORTEX_COMMAND_LAST_USED,
  CORTEX_COMMAND_MODEL_KEY,
  CORTEX_COMMAND_SLASH_ENABLED,
} from "@/commands/constants";
import {
  CORTEX_PROJECT_CREATED,
  CORTEX_PROJECT_DESCRIPTION,
  CORTEX_PROJECT_EXCLUSIONS,
  CORTEX_PROJECT_ID,
  CORTEX_PROJECT_INCLUSIONS,
  CORTEX_PROJECT_LAST_USED,
  CORTEX_PROJECT_MAX_TOKENS,
  CORTEX_PROJECT_MODEL_KEY,
  CORTEX_PROJECT_NAME,
  CORTEX_PROJECT_TEMPERATURE,
  CORTEX_PROJECT_WEB_URLS,
  CORTEX_PROJECT_YOUTUBE_URLS,
} from "@/projects/constants";
import {
  CORTEX_SYSTEM_PROMPT_CREATED,
  CORTEX_SYSTEM_PROMPT_DEFAULT,
  CORTEX_SYSTEM_PROMPT_LAST_USED,
  CORTEX_SYSTEM_PROMPT_MODIFIED,
} from "@/system-prompts/constants";

/**
 * Validates Requirement 6.1: every frontmatter key constant uses the `cortex-`
 * prefix and none retains the legacy `copilot-` prefix.
 *
 * Scope note: only the frontmatter KEY constants are asserted here. The legacy
 * placeholder `LEGACY_SELECTED_TEXT_PLACEHOLDER = "{copilot-selection}"` in
 * `src/commands/constants.ts` is intentionally preserved and is NOT a
 * frontmatter key, so it is deliberately excluded from these assertions.
 */

// Each entry maps the exported identifier name to its value so failures point
// at the exact constant that regressed.
const commandFrontmatterKeys: Record<string, string> = {
  CORTEX_COMMAND_CONTEXT_MENU_ENABLED,
  CORTEX_COMMAND_SLASH_ENABLED,
  CORTEX_COMMAND_CONTEXT_MENU_ORDER,
  CORTEX_COMMAND_MODEL_KEY,
  CORTEX_COMMAND_LAST_USED,
};

const projectFrontmatterKeys: Record<string, string> = {
  CORTEX_PROJECT_ID,
  CORTEX_PROJECT_NAME,
  CORTEX_PROJECT_DESCRIPTION,
  CORTEX_PROJECT_MODEL_KEY,
  CORTEX_PROJECT_TEMPERATURE,
  CORTEX_PROJECT_MAX_TOKENS,
  CORTEX_PROJECT_CREATED,
  CORTEX_PROJECT_LAST_USED,
  CORTEX_PROJECT_INCLUSIONS,
  CORTEX_PROJECT_EXCLUSIONS,
  CORTEX_PROJECT_WEB_URLS,
  CORTEX_PROJECT_YOUTUBE_URLS,
};

const systemPromptFrontmatterKeys: Record<string, string> = {
  CORTEX_SYSTEM_PROMPT_CREATED,
  CORTEX_SYSTEM_PROMPT_MODIFIED,
  CORTEX_SYSTEM_PROMPT_LAST_USED,
  CORTEX_SYSTEM_PROMPT_DEFAULT,
};

const allFrontmatterKeys: Record<string, string> = {
  ...commandFrontmatterKeys,
  ...projectFrontmatterKeys,
  ...systemPromptFrontmatterKeys,
};

describe("frontmatter key constants (Requirement 6.1)", () => {
  describe.each([
    ["commands", commandFrontmatterKeys],
    ["projects", projectFrontmatterKeys],
    ["system-prompts", systemPromptFrontmatterKeys],
  ])("%s module", (_module, keys) => {
    it.each(Object.entries(keys))("%s uses the cortex- prefix", (_name, value) => {
      expect(value.startsWith("cortex-")).toBe(true);
    });

    it.each(Object.entries(keys))("%s contains no copilot token", (_name, value) => {
      expect(value.toLowerCase()).not.toContain("copilot");
    });
  });

  it("covers a non-empty set of frontmatter keys across all modules", () => {
    // Guards against the import list silently collapsing to nothing.
    expect(Object.keys(allFrontmatterKeys).length).toBeGreaterThan(0);
  });
});
