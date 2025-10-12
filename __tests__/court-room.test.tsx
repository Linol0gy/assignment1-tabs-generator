import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CourtRoomPage from "@/app/court-room/page";
import { beforeEach, afterEach, describe, expect, it } from "vitest";

const sleep = (ms: number) =>
  act(
    () =>
      new Promise<void>((resolve) => {
        setTimeout(resolve, ms);
      })
  );

describe("CourtRoomPage", () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_COURTROOM_ESCALATION_MS = "3000";
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_COURTROOM_ESCALATION_MS;
  });

  it("allows the accessibility stage to be resolved before the court intervenes", async () => {
    const user = userEvent.setup();

    render(<CourtRoomPage />);

    const descriptionField = screen.getByLabelText(/describe the hero image/i);
    await user.type(descriptionField, "Judge speaking to a class about accessibility law");
    await user.click(screen.getByRole("button", { name: /apply alt text/i }));

    expect(
      await screen.findByRole("heading", {
        level: 3,
        name: /Stage 2 - Agile Change Requests/i,
      })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Alt text applied correctly\. Accessibility check cleared\./i)
    ).toBeInTheDocument();

    await sleep(3500);

    expect(screen.queryByText(/court fines you for breaching the disability act/i)).toBeNull();
  });

  it("issues urgent warnings and a summons when validation is ignored", async () => {
    const user = userEvent.setup();

    render(<CourtRoomPage />);

    const descriptionField = screen.getByLabelText(/describe the hero image/i);
    await user.type(descriptionField, "Hero banner showing the university moot court");
    await user.click(screen.getByRole("button", { name: /apply alt text/i }));

    const inlineOption = screen.getByRole("radio", { name: /apply inline style/i });
    await user.click(inlineOption);
    await user.click(screen.getByRole("button", { name: /confirm colour update/i }));

    expect(
      await screen.findByRole("heading", {
        level: 3,
        name: /Stage 3 - Security Hardening/i,
      })
    ).toBeInTheDocument();

    await sleep(2200);
    expect(
      await screen.findByText(/Fix input validation on the login form immediately/i)
    ).toBeInTheDocument();

    await sleep(1200);
    expect(
      await screen.findByText(/Urgent fix input validation/i)
    ).toBeInTheDocument();

    await sleep(3200);

    const summons = await screen.findByRole("alert");
    expect(summons).toHaveTextContent(/Court Summons/i);
    expect(
      screen.getByText(/Neglecting input validation broke the laws of tort/i)
    ).toBeInTheDocument();
  });
});
