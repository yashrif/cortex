/**
 * CSS class verification tests for the Cortex plugin rename.
 *
 * Asserts that plugin CSS class string literals use the `cortex-` prefix
 * and none use `copilot-`.
 *
 * Requirements: 3.2, 3.3
 */

import { CHAT_VIEWTYPE } from "@/constants";
import { processInlineCitations } from "@/LLMProviders/chainRunner/utils/citationUtils";
import { buildCopilotCollapsibleDomId } from "@/components/chat-components/collapsibleStateUtils";

// ===== Requirement 3.1: CHAT_VIEWTYPE uses cortex- prefix =====

describe("CHAT_VIEWTYPE constant", () => {
  it('equals "cortex-chat-view" (Req 3.1)', () => {
    expect(CHAT_VIEWTYPE).toBe("cortex-chat-view");
  });

  it("does not use the copilot- prefix", () => {
    expect(CHAT_VIEWTYPE).not.toContain("copilot-");
  });
});

// ===== Requirement 3.2, 3.3: citationUtils uses cortex- prefixed CSS classes =====

describe("citationUtils CSS class names", () => {
  /**
   * Build a minimal input that has a sources section so processInlineCitations
   * will render the collapsible <details> block containing the CSS classes.
   */
  const sampleInput = `Here is some content with a citation [^1].

#### Sources

[^1]: [[My Note]]`;

  it("output HTML contains cortex-sources class (not copilot-sources)", () => {
    const output = processInlineCitations(sampleInput);
    expect(output).toContain("cortex-sources");
    expect(output).not.toContain("copilot-sources");
  });

  it("output HTML contains cortex-sources__item class", () => {
    const output = processInlineCitations(sampleInput);
    expect(output).toContain("cortex-sources__item");
    expect(output).not.toContain("copilot-sources__item");
  });

  it("output HTML contains cortex-sources__index class", () => {
    const output = processInlineCitations(sampleInput);
    expect(output).toContain("cortex-sources__index");
    expect(output).not.toContain("copilot-sources__index");
  });

  it("output HTML contains cortex-sources__text class", () => {
    const output = processInlineCitations(sampleInput);
    expect(output).toContain("cortex-sources__text");
    expect(output).not.toContain("copilot-sources__text");
  });

  it("output HTML contains cortex-sources__summary class", () => {
    const output = processInlineCitations(sampleInput);
    expect(output).toContain("cortex-sources__summary");
    expect(output).not.toContain("copilot-sources__summary");
  });

  it("output HTML contains no copilot- prefixed class names at all", () => {
    const output = processInlineCitations(sampleInput);
    // Match any class="copilot-..." pattern
    expect(output).not.toMatch(/class="copilot-/);
  });
});

// ===== Requirement 3.3: collapsibleStateUtils export is still present =====

describe("collapsibleStateUtils exports", () => {
  it("buildCopilotCollapsibleDomId is exported and callable", () => {
    expect(typeof buildCopilotCollapsibleDomId).toBe("function");
  });

  it("buildCopilotCollapsibleDomId returns a non-empty string for valid inputs", () => {
    const result = buildCopilotCollapsibleDomId("msg-123", "section-key");
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });
});
