import { CHAT_VIEWTYPE, COMMAND_IDS, CORTEX_FOLDER_ROOT, DEFAULT_SYSTEM_PROMPT } from "@/constants";

/**
 * Verifies the static rename of plugin-identity constants and command IDs from
 * "copilot" to "cortex" (see spec: plugin-rename-cortex, task 2.2).
 *
 * The external "GitHub Copilot" provider lives in the ChatModelProviders enum
 * (value "github-copilot"), which is intentionally NOT covered here — these
 * assertions are scoped to COMMAND_IDS, CHAT_VIEWTYPE, and renamed
 * folder/identity constants only.
 */
describe("constants rename (copilot -> cortex)", () => {
  describe("CHAT_VIEWTYPE", () => {
    it("uses the cortex-prefixed chat view type", () => {
      // Requirement 3.1
      expect(CHAT_VIEWTYPE).toBe("cortex-chat-view");
    });

    it("does not contain a plugin-identity copilot token", () => {
      expect(CHAT_VIEWTYPE.toLowerCase()).not.toContain("copilot");
    });
  });

  describe("renamed identity constants", () => {
    it("exposes CORTEX_FOLDER_ROOT", () => {
      // Requirement 8.6 — the constant was renamed from COPILOT_FOLDER_ROOT.
      expect(CORTEX_FOLDER_ROOT).toBeDefined();
      expect(typeof CORTEX_FOLDER_ROOT).toBe("string");
    });
  });

  describe("DEFAULT_SYSTEM_PROMPT", () => {
    it('contains "Cortex" in the system prompt', () => {
      // Requirement 2.5 — the default system prompt references the new brand name.
      expect(DEFAULT_SYSTEM_PROMPT).toContain("Cortex");
    });

    it('does not contain "Obsidian Copilot" in the system prompt', () => {
      // Requirement 2.5 — the old plugin-identity phrase must be absent.
      expect(DEFAULT_SYSTEM_PROMPT).not.toContain("Obsidian Copilot");
    });
  });

  describe("COMMAND_IDS", () => {
    const commandIdValues = Object.values(COMMAND_IDS);

    it("contains no plugin-identity copilot token in any value", () => {
      // Requirements 4.1, 4.2, 8.6 — no command id retains "copilot".
      for (const value of commandIdValues) {
        expect(value.toLowerCase()).not.toContain("copilot");
      }
    });

    it("renames index/cache/chat-conversation command ids to their cortex values", () => {
      // Requirement 4.2 — ids previously containing "copilot" now use "cortex".
      expect(COMMAND_IDS.CLEAR_LOCAL_CORTEX_INDEX).toBe("clear-local-cortex-index");
      expect(COMMAND_IDS.CLEAR_CORTEX_CACHE).toBe("clear-cortex-cache");
      expect(COMMAND_IDS.FORCE_REINDEX_VAULT_TO_CORTEX_INDEX).toBe(
        "force-reindex-vault-to-cortex-index"
      );
      expect(COMMAND_IDS.GARBAGE_COLLECT_CORTEX_INDEX).toBe("garbage-collect-cortex-index");
      expect(COMMAND_IDS.INDEX_VAULT_TO_CORTEX_INDEX).toBe("index-vault-to-cortex-index");
      expect(COMMAND_IDS.INSPECT_CORTEX_INDEX_BY_NOTE_PATHS).toBe(
        "cortex-inspect-index-by-note-paths"
      );
      expect(COMMAND_IDS.LIST_INDEXED_FILES).toBe("cortex-list-indexed-files");
      expect(COMMAND_IDS.LOAD_CORTEX_CHAT_CONVERSATION).toBe("load-cortex-chat-conversation");
      expect(COMMAND_IDS.SEARCH_ORAMA_DB).toBe("cortex-search-orama-db");
    });

    it("each renamed index/cache/chat command id value contains cortex", () => {
      // Requirements 4.1, 4.2 — the renamed subset carries the new brand token.
      const renamedToCortex = [
        COMMAND_IDS.CLEAR_LOCAL_CORTEX_INDEX,
        COMMAND_IDS.CLEAR_CORTEX_CACHE,
        COMMAND_IDS.FORCE_REINDEX_VAULT_TO_CORTEX_INDEX,
        COMMAND_IDS.GARBAGE_COLLECT_CORTEX_INDEX,
        COMMAND_IDS.INDEX_VAULT_TO_CORTEX_INDEX,
        COMMAND_IDS.INSPECT_CORTEX_INDEX_BY_NOTE_PATHS,
        COMMAND_IDS.LIST_INDEXED_FILES,
        COMMAND_IDS.LOAD_CORTEX_CHAT_CONVERSATION,
        COMMAND_IDS.SEARCH_ORAMA_DB,
      ];

      for (const value of renamedToCortex) {
        expect(value).toContain("cortex");
      }
    });

    it("keeps the chat window command ids on their existing values", () => {
      // Requirement 4.2 — these ids never contained "copilot"; ensure they are
      // not accidentally given a "copilot" token during the rename.
      expect(COMMAND_IDS.OPEN_CORTEX_CHAT_WINDOW).toBe("chat-open-window");
      expect(COMMAND_IDS.TOGGLE_CORTEX_CHAT_WINDOW).toBe("chat-toggle-window");
    });
  });
});
