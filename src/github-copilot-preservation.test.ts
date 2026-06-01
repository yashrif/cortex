/**
 * Unit tests for GitHub Copilot provider preservation.
 *
 * Verifies that the plugin rename (Copilot → Cortex) did NOT alter any
 * identifiers, labels, or component names that refer to the *external*
 * GitHub Copilot LLM provider.
 *
 * Validates: Requirements 2.6, 8.7, 9.2
 */

// ---------------------------------------------------------------------------
// Mocks for heavy transitive dependencies pulled in by GitHubCopilotAuth
// ---------------------------------------------------------------------------

// Mock the settings model to avoid pulling in the full settings singleton
jest.mock("@/settings/model", () => ({
  getSettings: jest.fn(() => ({})),
  useSettingsValue: jest.fn(() => ({
    githubCopilotToken: "",
    githubCopilotAccessToken: "",
    githubCopilotTokenExpiresAt: 0,
  })),
  updateSetting: jest.fn(),
}));

// Mock the GitHub Copilot provider (network / OAuth logic not needed here)
jest.mock("@/LLMProviders/githubCopilot/GitHubCopilotProvider", () => ({
  GitHubCopilotProvider: {
    getInstance: jest.fn(() => ({
      getAuthState: jest.fn(() => ({ status: "unauthenticated" })),
      startDeviceCodeFlow: jest.fn(),
      cancelAuth: jest.fn(),
      listModels: jest.fn(),
    })),
  },
}));

// Mock the auth-cancelled error helper
jest.mock("@/LLMProviders/githubCopilot/errors", () => ({
  isAuthCancelledError: jest.fn(() => false),
}));

// Mock UI components that have their own deep dependency trees
jest.mock("@/components/ui/button", () => ({ Button: () => null }));
jest.mock("@/components/ui/collapsible", () => ({
  Collapsible: () => null,
  CollapsibleContent: () => null,
}));
jest.mock("@/components/ui/help-tooltip", () => ({ HelpTooltip: () => null }));
jest.mock("@/settings/v2/components/ModelImporter", () => ({ ModelImporter: () => null }));

// Mock lucide-react icons
jest.mock("lucide-react", () => ({
  ChevronDown: () => null,
  ChevronUp: () => null,
  Loader2: () => null,
  Copy: () => null,
}));

// ---------------------------------------------------------------------------
// Imports under test (after mocks are registered)
// ---------------------------------------------------------------------------

import { ChatModelProviders, ProviderInfo, ProviderSettingsKeyMap } from "@/constants";
import { GitHubCopilotAuth } from "@/settings/v2/components/GitHubCopilotAuth";

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe("GitHub Copilot provider preservation", () => {
  /**
   * Req 2.6, 8.7 — The enum value for the GitHub Copilot provider must remain
   * "github-copilot" so that existing serialised model configurations continue
   * to resolve correctly.
   */
  it('ChatModelProviders.GITHUB_COPILOT === "github-copilot"', () => {
    expect(ChatModelProviders.GITHUB_COPILOT).toBe("github-copilot");
  });

  /**
   * Req 9.2 — The human-readable label shown in the UI for the GitHub Copilot
   * provider must remain "GitHub Copilot" (not "GitHub Cortex" or similar).
   */
  it('ProviderInfo[ChatModelProviders.GITHUB_COPILOT].label === "GitHub Copilot"', () => {
    expect(ProviderInfo[ChatModelProviders.GITHUB_COPILOT].label).toBe("GitHub Copilot");
  });

  /**
   * Req 9.2 — The provider host must still point at the GitHub Copilot API
   * domain (githubcopilot.com), not a cortex or other domain.
   */
  it('ProviderInfo[ChatModelProviders.GITHUB_COPILOT].host contains "githubcopilot.com"', () => {
    expect(ProviderInfo[ChatModelProviders.GITHUB_COPILOT].host).toContain("githubcopilot.com");
  });

  /**
   * Req 8.7 — The settings key used to store the GitHub Copilot token must
   * remain "githubCopilotToken" so that persisted settings are not broken.
   */
  it('ProviderSettingsKeyMap["github-copilot"] === "githubCopilotToken"', () => {
    expect(ProviderSettingsKeyMap["github-copilot"]).toBe("githubCopilotToken");
  });

  /**
   * Req 8.7 — The GitHubCopilotAuth component must still be exported from its
   * original path and must be a defined (non-null) value so that the settings
   * UI can render it.
   */
  it("GitHubCopilotAuth is defined (component was not removed or renamed)", () => {
    expect(GitHubCopilotAuth).toBeDefined();
    expect(typeof GitHubCopilotAuth).toBe("function");
  });
});
