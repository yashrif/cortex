import * as fs from "fs";
import * as path from "path";

/**
 * Smoke tests for plugin metadata files.
 * Verifies that manifest.json and package.json have the correct Cortex branding.
 */

describe("manifest.json smoke tests", () => {
  let manifest: Record<string, unknown>;

  beforeAll(() => {
    const raw = fs.readFileSync(path.resolve(__dirname, "../manifest.json"), "utf-8");
    manifest = JSON.parse(raw) as Record<string, unknown>;
  });

  it("should have id === 'cortex' (Req 1.1)", () => {
    expect(manifest.id).toBe("cortex");
  });

  it("should have name === 'Cortex' (Req 1.2)", () => {
    expect(manifest.name).toBe("Cortex");
  });

  it("should have description containing 'Cortex' and not 'Copilot' (Req 1.3)", () => {
    const description = manifest.description as string;
    expect(description).toContain("Cortex");
    expect(description).not.toContain("Copilot");
  });
});

describe("package.json smoke tests", () => {
  let pkg: Record<string, unknown>;

  beforeAll(() => {
    const raw = fs.readFileSync(path.resolve(__dirname, "../package.json"), "utf-8");
    pkg = JSON.parse(raw) as Record<string, unknown>;
  });

  it("should have name === 'obsidian-cortex' (Req 1.4)", () => {
    expect(pkg.name).toBe("obsidian-cortex");
  });
});
