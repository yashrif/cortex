/**
 * Unit tests for frontmatter key constants.
 *
 * Asserts that every frontmatter key constant across commands, projects, and
 * system-prompts uses the `cortex-` prefix and none retains `copilot-`.
 *
 * Validates: Requirements 6.1
 */

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

describe("Command frontmatter key constants", () => {
  const commandConstants = [
    { name: "CORTEX_COMMAND_CONTEXT_MENU_ENABLED", value: CORTEX_COMMAND_CONTEXT_MENU_ENABLED },
    { name: "CORTEX_COMMAND_SLASH_ENABLED", value: CORTEX_COMMAND_SLASH_ENABLED },
    { name: "CORTEX_COMMAND_CONTEXT_MENU_ORDER", value: CORTEX_COMMAND_CONTEXT_MENU_ORDER },
    { name: "CORTEX_COMMAND_MODEL_KEY", value: CORTEX_COMMAND_MODEL_KEY },
    { name: "CORTEX_COMMAND_LAST_USED", value: CORTEX_COMMAND_LAST_USED },
  ];

  it.each(commandConstants)("$name starts with 'cortex-'", ({ value }) => {
    expect(value.startsWith("cortex-")).toBe(true);
  });

  it.each(commandConstants)("$name does not contain 'copilot'", ({ value }) => {
    expect(value).not.toContain("copilot");
  });
});

describe("Project frontmatter key constants", () => {
  const projectConstants = [
    { name: "CORTEX_PROJECT_ID", value: CORTEX_PROJECT_ID },
    { name: "CORTEX_PROJECT_NAME", value: CORTEX_PROJECT_NAME },
    { name: "CORTEX_PROJECT_DESCRIPTION", value: CORTEX_PROJECT_DESCRIPTION },
    { name: "CORTEX_PROJECT_MODEL_KEY", value: CORTEX_PROJECT_MODEL_KEY },
    { name: "CORTEX_PROJECT_TEMPERATURE", value: CORTEX_PROJECT_TEMPERATURE },
    { name: "CORTEX_PROJECT_MAX_TOKENS", value: CORTEX_PROJECT_MAX_TOKENS },
    { name: "CORTEX_PROJECT_CREATED", value: CORTEX_PROJECT_CREATED },
    { name: "CORTEX_PROJECT_LAST_USED", value: CORTEX_PROJECT_LAST_USED },
    { name: "CORTEX_PROJECT_INCLUSIONS", value: CORTEX_PROJECT_INCLUSIONS },
    { name: "CORTEX_PROJECT_EXCLUSIONS", value: CORTEX_PROJECT_EXCLUSIONS },
    { name: "CORTEX_PROJECT_WEB_URLS", value: CORTEX_PROJECT_WEB_URLS },
    { name: "CORTEX_PROJECT_YOUTUBE_URLS", value: CORTEX_PROJECT_YOUTUBE_URLS },
  ];

  it.each(projectConstants)("$name starts with 'cortex-'", ({ value }) => {
    expect(value.startsWith("cortex-")).toBe(true);
  });

  it.each(projectConstants)("$name does not contain 'copilot'", ({ value }) => {
    expect(value).not.toContain("copilot");
  });
});

describe("System-prompt frontmatter key constants", () => {
  const systemPromptConstants = [
    { name: "CORTEX_SYSTEM_PROMPT_CREATED", value: CORTEX_SYSTEM_PROMPT_CREATED },
    { name: "CORTEX_SYSTEM_PROMPT_MODIFIED", value: CORTEX_SYSTEM_PROMPT_MODIFIED },
    { name: "CORTEX_SYSTEM_PROMPT_LAST_USED", value: CORTEX_SYSTEM_PROMPT_LAST_USED },
    { name: "CORTEX_SYSTEM_PROMPT_DEFAULT", value: CORTEX_SYSTEM_PROMPT_DEFAULT },
  ];

  it.each(systemPromptConstants)("$name starts with 'cortex-'", ({ value }) => {
    expect(value.startsWith("cortex-")).toBe(true);
  });

  it.each(systemPromptConstants)("$name does not contain 'copilot'", ({ value }) => {
    expect(value).not.toContain("copilot");
  });
});
