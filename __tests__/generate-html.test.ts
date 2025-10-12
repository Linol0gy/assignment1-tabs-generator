import { describe, expect, it } from "vitest";
import { generateTabsHTML, validateTabsData } from "@/lib/generateHTML";

describe("generateTabsHTML", () => {
  const sampleTabs = [
    { id: "escape", header: "Escape Room", content: "Solve the puzzles to unlock the exit." },
    { id: "court", header: "Court Room", content: "Handle compliance issues under pressure." },
    { id: "races", header: "Coding Races", content: "Complete algorithm sprints before time runs out." },
  ];

  it("renders all tab headers and contents for three representative scenarios", () => {
    const html = generateTabsHTML(sampleTabs);

    expect(html).toContain("Escape Room");
    expect(html).toContain("Court Room");
    expect(html).toContain("Coding Races");
    expect(html).toContain("Solve the puzzles to unlock the exit.");
    expect(html).toContain("Handle compliance issues under pressure.");
    expect(html).toContain("Complete algorithm sprints before time runs out.");

    // Ensure the generated document is a complete HTML shell
    expect(html.startsWith("<!DOCTYPE html>")).toBe(true);
    expect(html.endsWith("</html>")).toBe(true);
  });

  it("falls back to the empty template when no tabs are provided", () => {
    const html = generateTabsHTML([]);
    expect(html).toContain("No Tabs to Display");
    expect(validateTabsData(sampleTabs)).toBe(true);
    expect(validateTabsData([{ id: "1", header: "test" } as any])).toBe(false);
  });
});
