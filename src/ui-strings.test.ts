import * as fs from "fs";
import * as path from "path";
import { DEFAULT_SETTINGS, DEFAULT_SYSTEM_PROMPT, RESTRICTION_MESSAGES } from "@/constants";

/**
 * Verifies UI strings and index path after the plugin rename from "Copilot" to "Cortex".
 * Covers Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 10.1.
 */
describe("UI strings and index path (plugin-rename-cortex, task 7.3)", () => {
  // ---------------------------------------------------------------------------
  // Req 2.5 — DEFAULT_SYSTEM_PROMPT references "Cortex", not "Obsidian Copilot"
  // ---------------------------------------------------------------------------
  describe("DEFAULT_SYSTEM_PROMPT", () => {
    it('contains "Cortex"', () => {
      // Requirement 2.5
      expect(DEFAULT_SYSTEM_PROMPT).toContain("Cortex");
    });

    it('does not contain "Obsidian Copilot"', () => {
      // Requirement 2.5
      expect(DEFAULT_SYSTEM_PROMPT).not.toContain("Obsidian Copilot");
    });
  });

  // ---------------------------------------------------------------------------
  // Req 2.4 — RESTRICTION_MESSAGES use "Cortex Plus", not "Copilot Plus"
  // ---------------------------------------------------------------------------
  describe("RESTRICTION_MESSAGES.NON_MARKDOWN_FILES_RESTRICTED", () => {
    it('contains "Cortex Plus"', () => {
      // Requirement 2.4
      expect(RESTRICTION_MESSAGES.NON_MARKDOWN_FILES_RESTRICTED).toContain("Cortex Plus");
    });

    it('does not contain "Copilot Plus"', () => {
      // Requirement 2.4
      expect(RESTRICTION_MESSAGES.NON_MARKDOWN_FILES_RESTRICTED).not.toContain("Copilot Plus");
    });
  });

  describe("RESTRICTION_MESSAGES.URL_PROCESSING_RESTRICTED", () => {
    it('contains "Cortex Plus"', () => {
      // Requirement 2.4
      expect(RESTRICTION_MESSAGES.URL_PROCESSING_RESTRICTED).toContain("Cortex Plus");
    });

    it('does not contain "Copilot Plus"', () => {
      // Requirement 2.4
      expect(RESTRICTION_MESSAGES.URL_PROCESSING_RESTRICTED).not.toContain("Copilot Plus");
    });
  });

  // ---------------------------------------------------------------------------
  // Req 10.1 — default index path uses ".cortex-index", not ".copilot-index"
  // ---------------------------------------------------------------------------
  describe("default semantic index path in dbOperations.ts", () => {
    const dbOpsSource = fs.readFileSync(path.resolve(__dirname, "search/dbOperations.ts"), "utf-8");

    it('contains ".cortex-index" as the default index path', () => {
      // Requirement 10.1
      expect(dbOpsSource).toContain(".cortex-index");
    });

    it('does not contain ".copilot-index" as the default index path', () => {
      // Requirement 10.1
      expect(dbOpsSource).not.toContain(".copilot-index");
    });
  });

  // ---------------------------------------------------------------------------
  // Req 2.2 — DEFAULT_SETTINGS.defaultConversationTag uses "cortex-conversation"
  // ---------------------------------------------------------------------------
  describe("DEFAULT_SETTINGS.defaultConversationTag", () => {
    it('equals "cortex-conversation"', () => {
      // Requirement 2.2
      expect(DEFAULT_SETTINGS.defaultConversationTag).toBe("cortex-conversation");
    });
  });

  // ---------------------------------------------------------------------------
  // Req 2.3 — ribbon tooltip in main.ts reads "Open Cortex Chat"
  // ---------------------------------------------------------------------------
  describe("ribbon icon tooltip in main.ts", () => {
    const mainSource = fs.readFileSync(path.resolve(__dirname, "main.ts"), "utf-8");

    it('contains "Open Cortex Chat" as the ribbon tooltip', () => {
      // Requirement 2.3
      expect(mainSource).toContain("Open Cortex Chat");
    });

    it('does not contain "Open Copilot Chat" as the ribbon tooltip', () => {
      // Requirement 2.3
      expect(mainSource).not.toContain("Open Copilot Chat");
    });
  });
});
