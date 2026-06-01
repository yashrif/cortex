/**
 * Unit tests for class renames and settings defaults.
 *
 * Verifies that:
 * - CortexPlugin, CortexView, CortexSettingTab, and CortexSettings exist
 * - Old Copilot* symbols are absent
 * - Default folder paths use the cortex/ literals
 *
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 5.1, 5.2, 5.3, 5.4, 5.5, 5.6
 */

// ---------------------------------------------------------------------------
// Mock heavy transitive dependencies before any imports
// ---------------------------------------------------------------------------

// Mock the entire @/main module's deep dependency chain by mocking the modules
// that main.ts imports transitively. We only need the class shape, not runtime
// behaviour.

jest.mock("@/LLMProviders/brevilabsClient", () => ({
  BrevilabsClient: jest.fn(),
}));

jest.mock("@/LLMProviders/projectManager", () => ({
  default: jest.fn(),
}));

jest.mock("@/LLMProviders/chainManager", () => ({
  default: jest.fn(),
}));

jest.mock("@/aiParams", () => ({
  getCurrentProject: jest.fn(),
  setSelectedTextContexts: jest.fn(),
  getSelectedTextContexts: jest.fn(),
}));

jest.mock("@/commands", () => ({
  registerCommands: jest.fn(),
}));

jest.mock("@/commands/contextMenu", () => ({
  registerContextMenu: jest.fn(),
}));

jest.mock("@/commands/customCommandRegister", () => ({
  CustomCommandRegister: jest.fn(),
}));

jest.mock("@/commands/migrator", () => ({
  migrateCommands: jest.fn(),
  suggestDefaultCommands: jest.fn(),
}));

jest.mock("@/system-prompts/migration", () => ({
  migrateSystemPromptsFromSettings: jest.fn(),
}));

jest.mock("@/system-prompts/systemPromptRegister", () => ({
  SystemPromptRegister: jest.fn(),
}));

jest.mock("@/projects/projectRegister", () => ({
  ProjectRegister: jest.fn(),
}));

jest.mock("@/core/ChatManager", () => ({
  ChatManager: jest.fn(),
}));

jest.mock("@/core/MessageRepository", () => ({
  MessageRepository: jest.fn(),
}));

jest.mock("@/logger", () => ({
  logError: jest.fn(),
  logInfo: jest.fn(),
  logWarn: jest.fn(),
}));

jest.mock("@/logFileManager", () => ({
  logFileManager: { log: jest.fn() },
}));

jest.mock("@/services/keychainService", () => ({
  KeychainService: { getInstance: jest.fn() },
}));

jest.mock("@/services/settingsPersistence", () => ({
  persistSettings: jest.fn(),
  loadSettingsWithKeychain: jest.fn(),
  flushPersistence: jest.fn(),
  resetPersistenceState: jest.fn(),
}));

jest.mock("@/memory/UserMemoryManager", () => ({
  UserMemoryManager: jest.fn(),
}));

jest.mock("@/LLMProviders/chainRunner/utils/promptPayloadRecorder", () => ({
  clearRecordedPromptPayload: jest.fn(),
}));

jest.mock("@/plusUtils", () => ({
  checkIsPlusUser: jest.fn(),
  refreshSelfHostModeValidation: jest.fn(),
}));

jest.mock("@/services/webViewerService/webViewerServiceSingleton", () => ({
  getWebViewerService: jest.fn(),
  startActiveWebTabTracking: jest.fn(),
}));

jest.mock("@/services/webViewerService/webViewerServiceSelection", () => ({
  WebSelectionTracker: jest.fn(),
}));

jest.mock("@/search/vectorStoreManager", () => ({
  default: jest.fn(),
}));

jest.mock("@/state/ChatUIState", () => ({
  ChatUIState: jest.fn(),
}));

jest.mock("@/state/vaultDataAtoms", () => ({
  VaultDataManager: jest.fn(),
}));

jest.mock("@/tools/FileParserManager", () => ({
  FileParserManager: jest.fn(),
}));

jest.mock("@/tools/builtinTools", () => ({
  initializeBuiltinTools: jest.fn(),
}));

jest.mock("@/editor", () => ({
  ChatSelectionHighlightController: jest.fn(),
  hideChatSelectionHighlight: jest.fn(),
  QuickAskController: jest.fn(),
  SelectionHighlight: jest.fn(),
}));

jest.mock("@/components/modals/LoadChatHistoryModal", () => ({
  LoadChatHistoryModal: jest.fn(),
}));

jest.mock("@/components/composer/ApplyView", () => ({
  APPLY_VIEW_TYPE: "apply-view",
  ApplyView: jest.fn(),
}));

jest.mock("@/utils/chatHistoryUtils", () => ({
  extractChatDate: jest.fn(),
  extractChatLastAccessedAtMs: jest.fn(),
  extractChatTitle: jest.fn(),
  filterChatHistoryFiles: jest.fn(),
}));

jest.mock("@/utils/recentUsageManager", () => ({
  RecentUsageManager: jest.fn(),
}));

jest.mock("@/utils/vaultAdapterUtils", () => ({
  listMarkdownFiles: jest.fn(),
  patchFrontmatter: jest.fn(),
  resolveFileByPath: jest.fn(),
  trashFile: jest.fn(),
}));

// Extend the obsidian mock with PluginSettingTab which is not in the shared mock
jest.mock("obsidian", () => {
  const actual = jest.requireActual<object>("obsidian");
  return {
    ...actual,
    PluginSettingTab: class PluginSettingTab {
      app: unknown;
      plugin: unknown;
      containerEl: HTMLElement;
      constructor(app: unknown, plugin: unknown) {
        this.app = app;
        this.plugin = plugin;
        this.containerEl = window.document.createElement("div");
      }
      display() {}
      hide() {}
    },
    Plugin: class Plugin {
      app: unknown;
      manifest: unknown;
      constructor() {}
      addCommand() {}
      addRibbonIcon() {}
      addSettingTab() {}
      registerView() {}
      loadData() {
        return Promise.resolve({});
      }
      saveData() {
        return Promise.resolve();
      }
    },
  };
});

// Mock React and Radix for CortexView / SettingsPage (they import JSX)
jest.mock("@radix-ui/react-tooltip", () => ({}));

jest.mock("@/context", () => ({
  EventTargetContext: {},
}));

jest.mock("@/utils/react/createPluginRoot", () => ({
  createPluginRoot: jest.fn(),
}));

jest.mock("@/components/Chat", () => ({
  default: jest.fn(),
}));

jest.mock("@/components/chat-components/ChatViewLayout", () => ({
  ChatViewLayout: jest.fn(),
}));

jest.mock("@/settings/v2/SettingsMainV2", () => ({
  default: jest.fn(),
}));

// ---------------------------------------------------------------------------
// Actual imports under test
// ---------------------------------------------------------------------------

import CortexPlugin from "@/main";
import CortexView from "@/components/CortexView";
import { CortexSettingTab } from "@/settings/SettingsPage";
import type { CortexSettings } from "@/settings/model";
import { DEFAULT_SETTINGS } from "@/constants";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("Class renames — Req 8.1–8.5", () => {
  /**
   * Req 8.1: The plugin SHALL rename the main plugin class from CopilotPlugin to CortexPlugin.
   */
  it("CortexPlugin is defined (Req 8.1)", () => {
    expect(CortexPlugin).toBeDefined();
  });

  /**
   * Req 8.2 / 8.5: The plugin SHALL rename the view class from CopilotView to CortexView
   * and rename the source file accordingly.
   */
  it("CortexView is defined (Req 8.2, 8.5)", () => {
    expect(CortexView).toBeDefined();
  });

  /**
   * Req 8.3: The plugin SHALL rename the settings tab class from CopilotSettingTab to CortexSettingTab.
   */
  it("CortexSettingTab is defined (Req 8.3)", () => {
    expect(CortexSettingTab).toBeDefined();
  });

  /**
   * Req 8.4: The plugin SHALL rename the settings interface from CopilotSettings to CortexSettings.
   * Since CortexSettings is a TypeScript interface, we verify it via DEFAULT_SETTINGS shape.
   */
  it("CortexSettings type exists — verified via DEFAULT_SETTINGS shape (Req 8.4)", () => {
    // DEFAULT_SETTINGS is typed as CortexSettings; if the type were absent the
    // import would fail at compile time. We assert the object is defined and
    // has the expected structural properties.
    const settings: CortexSettings = DEFAULT_SETTINGS;
    expect(settings).toBeDefined();
    expect(typeof settings.defaultSaveFolder).toBe("string");
    expect(typeof settings.customPromptsFolder).toBe("string");
    expect(typeof settings.memoryFolderName).toBe("string");
    expect(typeof settings.userSystemPromptsFolder).toBe("string");
    expect(typeof settings.projectsFolder).toBe("string");
  });

  /**
   * Absence of old Copilot* symbols — the module default export must be
   * CortexPlugin, not CopilotPlugin. We verify the class name.
   */
  it("CortexPlugin class name is 'CortexPlugin', not 'CopilotPlugin'", () => {
    expect(CortexPlugin.name).toBe("CortexPlugin");
  });

  it("CortexView class name is 'CortexView', not 'CopilotView'", () => {
    expect(CortexView.name).toBe("CortexView");
  });

  it("CortexSettingTab class name is 'CortexSettingTab', not 'CopilotSettingTab'", () => {
    expect(CortexSettingTab.name).toBe("CortexSettingTab");
  });
});

describe("Default folder paths — Req 5.1–5.6", () => {
  /**
   * Req 5.1: The plugin SHALL use `cortex` as the default root folder name.
   */
  it("defaultSaveFolder equals 'cortex' (Req 5.1)", () => {
    expect(DEFAULT_SETTINGS.defaultSaveFolder).toBe("cortex");
  });

  /**
   * Req 5.2: The plugin SHALL use `cortex/cortex-conversations` as the default chat history folder.
   * Note: DEFAULT_SETTINGS does not expose chatHistoryFolder directly; the constant
   * DEFAULT_CHAT_HISTORY_FOLDER is used internally. The defaultSaveFolder covers Req 5.1.
   * We verify the customPromptsFolder for Req 5.3 and other path fields for 5.4–5.6.
   */
  it("customPromptsFolder contains 'cortex' (Req 5.3)", () => {
    expect(DEFAULT_SETTINGS.customPromptsFolder).toContain("cortex");
  });

  it("customPromptsFolder does not contain 'copilot' (Req 5.3)", () => {
    expect(DEFAULT_SETTINGS.customPromptsFolder).not.toContain("copilot");
  });

  /**
   * Req 5.4: The plugin SHALL use `cortex/memory` as the default memory folder.
   */
  it("memoryFolderName contains 'cortex' (Req 5.4)", () => {
    expect(DEFAULT_SETTINGS.memoryFolderName).toContain("cortex");
  });

  it("memoryFolderName does not contain 'copilot' (Req 5.4)", () => {
    expect(DEFAULT_SETTINGS.memoryFolderName).not.toContain("copilot");
  });

  /**
   * Req 5.5: The plugin SHALL use `cortex/system-prompts` as the default system prompts folder.
   */
  it("userSystemPromptsFolder contains 'cortex' (Req 5.5)", () => {
    expect(DEFAULT_SETTINGS.userSystemPromptsFolder).toContain("cortex");
  });

  it("userSystemPromptsFolder does not contain 'copilot' (Req 5.5)", () => {
    expect(DEFAULT_SETTINGS.userSystemPromptsFolder).not.toContain("copilot");
  });

  /**
   * Req 5.6: The plugin SHALL use `cortex/projects` as the default projects folder.
   */
  it("projectsFolder contains 'cortex' (Req 5.6)", () => {
    expect(DEFAULT_SETTINGS.projectsFolder).toContain("cortex");
  });

  it("projectsFolder does not contain 'copilot' (Req 5.6)", () => {
    expect(DEFAULT_SETTINGS.projectsFolder).not.toContain("copilot");
  });

  /**
   * Exact value assertions for all path defaults.
   */
  it("defaultSaveFolder exact value is 'cortex'", () => {
    expect(DEFAULT_SETTINGS.defaultSaveFolder).toBe("cortex");
  });

  it("customPromptsFolder exact value is 'cortex/cortex-custom-prompts'", () => {
    expect(DEFAULT_SETTINGS.customPromptsFolder).toBe("cortex/cortex-custom-prompts");
  });

  it("memoryFolderName exact value is 'cortex/memory'", () => {
    expect(DEFAULT_SETTINGS.memoryFolderName).toBe("cortex/memory");
  });

  it("userSystemPromptsFolder exact value is 'cortex/system-prompts'", () => {
    expect(DEFAULT_SETTINGS.userSystemPromptsFolder).toBe("cortex/system-prompts");
  });

  it("projectsFolder exact value is 'cortex/projects'", () => {
    expect(DEFAULT_SETTINGS.projectsFolder).toBe("cortex/projects");
  });
});
