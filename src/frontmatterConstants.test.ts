import {
  CORTEX_COMMAND_CONTEXT_MENU_ENABLED,
  CORTEX_COMMAND_SLASH_ENABLED,
  CORTEX_COMMAND_CONTEXT_MENU_ORDER,
  CORTEX_COMMAND_MODEL_KEY,
  CORTEX_COMMAND_LAST_USED,
} from "@/commands/constants";
import {
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
} from "@/projects/constants";
import {
  CORTEX_SYSTEM_PROMPT_CREATED,
  CORTEX_SYSTEM_PROMPT_MODIFIED,
  CORTEX_SYSTEM_PROMPT_LAST_USED,
  CORTEX_SYSTEM_PROMPT_DEFAULT,
} from "@/system-prompts/constants";

/**
 * Verifies the frontmatter key rename (Copilot -> Cortex).
 *
 * Each frontmatter key constant across the commands, projects, and
 * system-prompts modules must use the `cortex-` prefix and must not retain the
 * legacy `copilot-` prefix.
 *
 * Note: `LEGACY_SELECTED_TEXT_PLACEHOLDER = "{copilot-selection}"` is
 * intentionally excluded — it is a text placeholder, not a frontmatter key, and
 * is deliberately left unchanged per the design.
 *
 * _Requirements: 6.1_
 */
describe("frontmatter key constants use the cortex- prefix", () => {
  const commandFrontmatterKeys: Array<[string, string]> = [
    ["CORTEX_COMMAND_CONTEXT_MENU_ENABLED", CORTEX_COMMAND_CONTEXT_MENU_ENABLED],
    ["CORTEX_COMMAND_SLASH_ENABLED", CORTEX_COMMAND_SLASH_ENABLED],
    ["CORTEX_COMMAND_CONTEXT_MENU_ORDER", CORTEX_COMMAND_CONTEXT_MENU_ORDER],
    ["CORTEX_COMMAND_MODEL_KEY", CORTEX_COMMAND_MODEL_KEY],
    ["CORTEX_COMMAND_LAST_USED", CORTEX_COMMAND_LAST_USED],
  ];

  const projectFrontmatterKeys: Array<[string, string]> = [
    ["CORTEX_PROJECT_ID", CORTEX_PROJECT_ID],
    ["CORTEX_PROJECT_NAME", CORTEX_PROJECT_NAME],
    ["CORTEX_PROJECT_DESCRIPTION", CORTEX_PROJECT_DESCRIPTION],
    ["CORTEX_PROJECT_MODEL_KEY", CORTEX_PROJECT_MODEL_KEY],
    ["CORTEX_PROJECT_TEMPERATURE", CORTEX_PROJECT_TEMPERATURE],
    ["CORTEX_PROJECT_MAX_TOKENS", CORTEX_PROJECT_MAX_TOKENS],
    ["CORTEX_PROJECT_CREATED", CORTEX_PROJECT_CREATED],
    ["CORTEX_PROJECT_LAST_USED", CORTEX_PROJECT_LAST_USED],
    ["CORTEX_PROJECT_INCLUSIONS", CORTEX_PROJECT_INCLUSIONS],
    ["CORTEX_PROJECT_EXCLUSIONS", CORTEX_PROJECT_EXCLUSIONS],
    ["CORTEX_PROJECT_WEB_URLS", CORTEX_PROJECT_WEB_URLS],
    ["CORTEX_PROJECT_YOUTUBE_URLS", CORTEX_PROJECT_YOUTUBE_URLS],
  ];

  const systemPromptFrontmatterKeys: Array<[string, string]> = [
    ["CORTEX_SYSTEM_PROMPT_CREATED", CORTEX_SYSTEM_PROMPT_CREATED],
    ["CORTEX_SYSTEM_PROMPT_MODIFIED", CORTEX_SYSTEM_PROMPT_MODIFIED],
    ["CORTEX_SYSTEM_PROMPT_LAST_USED", CORTEX_SYSTEM_PROMPT_LAST_USED],
    ["CORTEX_SYSTEM_PROMPT_DEFAULT", CORTEX_SYSTEM_PROMPT_DEFAULT],
  ];

  const allFrontmatterKeys: Array<[string, string]> = [
    ...commandFrontmatterKeys,
    ...projectFrontmatterKeys,
    ...systemPromptFrontmatterKeys,
  ];

  it.each(allFrontmatterKeys)("%s starts with the cortex- prefix", (_name, value) => {
    expect(value.startsWith("cortex-")).toBe(true);
  });

  it.each(allFrontmatterKeys)("%s does not retain the copilot- prefix", (_name, value) => {
    expect(value).not.toContain("copilot-");
  });

  it("covers the expected command frontmatter keys with cortex-command- prefix", () => {
    for (const [, value] of commandFrontmatterKeys) {
      expect(value.startsWith("cortex-command-")).toBe(true);
    }
  });

  it("covers the expected project frontmatter keys with cortex-project- prefix", () => {
    for (const [, value] of projectFrontmatterKeys) {
      expect(value.startsWith("cortex-project-")).toBe(true);
    }
  });

  it("covers the expected system-prompt frontmatter keys with cortex-system-prompt- prefix", () => {
    for (const [, value] of systemPromptFrontmatterKeys) {
      expect(value.startsWith("cortex-system-prompt-")).toBe(true);
    }
  });
});
