"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Dispatch, FormEvent, SetStateAction } from "react";

type StageId = "accessibility" | "visual" | "validation";

type MessageSeverity = "info" | "warning" | "urgent" | "legal";

interface CourtMessage {
  id: string;
  sender: string;
  body: string;
  severity: MessageSeverity;
  timestamp: number;
  resolved: boolean;
  relatedStage?: StageId;
}

const stageOrder: StageId[] = ["accessibility", "visual", "validation"];

const severityStyles: Record<MessageSeverity, string> = {
  info: "border-blue-400 bg-blue-50 text-blue-800 dark:border-blue-500 dark:bg-blue-900/40 dark:text-blue-100",
  warning:
    "border-amber-400 bg-amber-50 text-amber-900 dark:border-amber-500 dark:bg-amber-900/40 dark:text-amber-100",
  urgent:
    "border-red-500 bg-red-50 text-red-900 dark:border-red-600 dark:bg-red-900/50 dark:text-red-100",
  legal:
    "border-purple-600 bg-purple-50 text-purple-900 dark:border-purple-600 dark:bg-purple-900/60 dark:text-purple-100",
};

const getEscalationDelay = () => {
  const envValue = process.env.NEXT_PUBLIC_COURTROOM_ESCALATION_MS;
  const parsed = envValue ? Number(envValue) : NaN;
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }
  return 120_000; // 2 minutes
};

const getDistractionBounds = () => {
  const minEnv = process.env.NEXT_PUBLIC_COURTROOM_DISTRACTION_MIN_MS;
  const maxEnv = process.env.NEXT_PUBLIC_COURTROOM_DISTRACTION_MAX_MS;
  const minParsed = minEnv ? Number(minEnv) : NaN;
  const maxParsed = maxEnv ? Number(maxEnv) : NaN;
  const min = Number.isFinite(minParsed) && minParsed > 0 ? minParsed : 20_000;
  const max = Number.isFinite(maxParsed) && maxParsed > min ? maxParsed : 30_000;
  return { min, max };
};

const distractionPool = [
  {
    sender: "Project Manager",
    body: "Sprint retro in 5 minutes. Are you done with sprint 1?",
  },
  {
    sender: "Family",
    body: "Can you pick up the kids after work today?",
  },
  {
    sender: "Agile Coach",
    body: "Change the title colour to red before stand-up please.",
  },
  {
    sender: "Security Operations",
    body: "Reminder: review yesterday's penetration test notes.",
  },
  {
    sender: "Finance",
    body: "Your invoice is pending approval. Double-check billable hours.",
  },
];

const stageDetails: Record<
  StageId,
  {
    title: string;
    summary: string;
    objective: string;
  }
> = {
  accessibility: {
    title: "Stage 1 - Accessibility Audit",
    summary:
      "Your image gallery shipped without alternative text. Accessibility compliance is at risk.",
    objective:
      "Add descriptive alt text to the featured image so screen readers can describe the content.",
  },
  visual: {
    title: "Stage 2 - Agile Change Requests",
    summary:
      "Design requested a high-contrast headline update to improve readability for low-vision users.",
    objective: "Select an appropriate inline styling approach that meets contrast requirements.",
  },
  validation: {
    title: "Stage 3 - Security Hardening",
    summary:
      "Login form lacks validation and sanitisation. Attackers are already probing the endpoint.",
    objective:
      "Enable robust validation rules to prevent injection attacks and protect user data.",
  },
};

const accessibilityMessages = {
  initial: {
    sender: "Accessibility Officer",
    body: "Fix alt in img1 before the release goes live.",
    severity: "warning" as MessageSeverity,
  },
  urgent: {
    sender: "Accessibility Officer",
    body: "Urgent fix alt in img1. We are breaching the Disability Act.",
    severity: "urgent" as MessageSeverity,
  },
  legal: {
    sender: "Judge",
    body: "You ignored accessibility guidelines. The court fines you for breaching the Disability Act.",
    severity: "legal" as MessageSeverity,
  },
};

const validationMessages = {
  initial: {
    sender: "Security Analyst",
    body: "Fix input validation on the login form immediately.",
    severity: "warning" as MessageSeverity,
  },
  urgent: {
    sender: "Security Analyst",
    body: "Urgent fix input validation. We are moments away from a data breach.",
    severity: "urgent" as MessageSeverity,
  },
  legal: {
    sender: "Judge",
    body: "Neglecting input validation broke the laws of tort. Damages are awarded against you.",
    severity: "legal" as MessageSeverity,
  },
};

const formatSeconds = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const randomBetween = (min: number, max: number) => {
  const diff = max - min;
  return Math.floor(Math.random() * diff) + min;
};

const escapeHtml = (input: string) =>
  input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
interface AccessibilityStageProps {
  altAnswer: string;
  altError: string | null;
  onAltChange: Dispatch<SetStateAction<string>>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function AccessibilityStage({
  altAnswer,
  altError,
  onAltChange,
  onSubmit,
}: AccessibilityStageProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" aria-describedby="stage1-details">
      <p id="stage1-details" className="text-sm text-gray-100">
        The featured hero image currently renders as{" "}
        <code className="rounded bg-black/30 px-2 py-1 text-xs text-amber-100">
          {"<img src=\"ceremony.jpg\">"}
        </code>{" "}
        which leaves screen reader users without context.
      </p>
      <label className="block text-sm font-semibold text-white" htmlFor="altDescription">
        Describe the hero image
      </label>
      <textarea
        id="altDescription"
        className="w-full rounded-lg border border-white/20 bg-black/30 p-3 text-white focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        rows={3}
        value={altAnswer}
        onChange={(event) => onAltChange(event.target.value)}
        placeholder="e.g. Judge speaking in a courtroom with the university emblem behind."
      />
      {altError ? <p className="text-sm text-rose-200">{altError}</p> : null}
      <button
        type="submit"
        className="rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-emerald-50 transition hover:bg-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-300"
      >
        Apply Alt Text
      </button>
    </form>
  );
}

interface VisualStageProps {
  colorChoice: string;
  colorError: string | null;
  onChoiceChange: Dispatch<SetStateAction<string>>;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function VisualStage({ colorChoice, colorError, onChoiceChange, onSubmit }: VisualStageProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" aria-describedby="stage2-details">
      <p id="stage2-details" className="text-sm text-gray-100">
        The agile coach needs the heading to be accessible. Choose the implementation that delivers
        WCAG-compliant contrast without introducing new defects.
      </p>
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-white">Select the update strategy</legend>
        <label className="flex items-start gap-3 rounded-lg border border-white/20 bg-black/30 p-3 text-white transition hover:bg-black/40">
          <input
            type="radio"
            name="colour-strategy"
            value="css-class"
            checked={colorChoice === "css-class"}
            onChange={() => onChoiceChange("css-class")}
            className="mt-1"
          />
          <span>
            Introduce a new CSS class and hope the LMS keeps your stylesheet ("may break on
            Moodle").
          </span>
        </label>
        <label className="flex items-start gap-3 rounded-lg border border-white/20 bg-black/30 p-3 text-white transition hover:bg-black/40">
          <input
            type="radio"
            name="colour-strategy"
            value="inline-high-contrast"
            checked={colorChoice === "inline-high-contrast"}
            onChange={() => onChoiceChange("inline-high-contrast")}
            className="mt-1"
          />
          <span>
            Apply inline style{" "}
            <code className="rounded bg-white/20 px-2 py-1 text-xs text-white">
              {"style=\"color:#b40000;font-weight:700\""}
            </code>{" "}
            for guaranteed contrast on Moodle.
          </span>
        </label>
        <label className="flex items-start gap-3 rounded-lg border border-white/20 bg-black/30 p-3 text-white transition hover:bg-black/40">
          <input
            type="radio"
            name="colour-strategy"
            value="javascript"
            checked={colorChoice === "javascript"}
            onChange={() => onChoiceChange("javascript")}
            className="mt-1"
          />
          <span>Use JavaScript to mutate DOM styles on load ("fails if scripts are sandboxed").</span>
        </label>
      </fieldset>
      {colorError ? <p className="text-sm text-rose-200">{colorError}</p> : null}
      <button
        type="submit"
        className="rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-emerald-50 transition hover:bg-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-300"
      >
        Confirm Colour Update
      </button>
    </form>
  );
}

interface ValidationStageProps {
  validationOptions: {
    required: boolean;
    length: boolean;
    sanitise: boolean;
  };
  validationError: string | null;
  onToggle: (option: "required" | "length" | "sanitise") => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function ValidationStage({
  validationOptions,
  validationError,
  onToggle,
  onSubmit,
}: ValidationStageProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4" aria-describedby="stage3-details">
      <p id="stage3-details" className="text-sm text-gray-100">
        Attackers are attempting SQL injection through the login form. Enable the safeguards that
        block malicious payloads before production traffic resumes.
      </p>
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold text-white">Enable safeguards</legend>
        <label className="flex items-center gap-3 rounded-lg border border-white/20 bg-black/30 p-3 text-white transition hover:bg-black/40">
          <input
            type="checkbox"
            checked={validationOptions.required}
            onChange={() => onToggle("required")}
            className="h-4 w-4"
          />
          Require email and password inputs before submission.
        </label>
        <label className="flex items-center gap-3 rounded-lg border border-white/20 bg-black/30 p-3 text-white transition hover:bg-black/40">
          <input
            type="checkbox"
            checked={validationOptions.length}
            onChange={() => onToggle("length")}
            className="h-4 w-4"
          />
          Enforce maximum length of 64 characters to stop buffer attacks.
        </label>
        <label className="flex items-center gap-3 rounded-lg border border-white/20 bg-black/30 p-3 text-white transition hover:bg-black/40">
          <input
            type="checkbox"
            checked={validationOptions.sanitise}
            onChange={() => onToggle("sanitise")}
            className="h-4 w-4"
          />
          Sanitise input values before hitting the API.
        </label>
      </fieldset>
      {validationError ? <p className="text-sm text-rose-200">{validationError}</p> : null}
      <button
        type="submit"
        className="rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-emerald-50 transition hover:bg-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-300"
      >
        Apply Validation Rules
      </button>
    </form>
  );
}
export default function CourtRoomPage() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [completedStages, setCompletedStages] = useState<StageId[]>([]);
  const [messages, setMessages] = useState<CourtMessage[]>([]);
  const [countdown, setCountdown] = useState(0);
  const [minutesInput, setMinutesInput] = useState("10");
  const [secondsInput, setSecondsInput] = useState("00");
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerError, setTimerError] = useState<string | null>(null);
  const [altAnswer, setAltAnswer] = useState("");
  const [altError, setAltError] = useState<string | null>(null);
  const [colorChoice, setColorChoice] = useState("");
  const [colorError, setColorError] = useState<string | null>(null);
  const [validationOptions, setValidationOptions] = useState({
    required: false,
    length: false,
    sanitise: false,
  });
  const [validationError, setValidationError] = useState<string | null>(null);
  const [courtSummoned, setCourtSummoned] = useState(false);
  const [summonedStage, setSummonedStage] = useState<StageId | null>(null);
  const [celebrationVisible, setCelebrationVisible] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  const escalationDelay = useMemo(() => getEscalationDelay(), []);
  const distractionBounds = useMemo(() => getDistractionBounds(), []);

  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const distractionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const stageTimeoutsRef = useRef<Record<StageId, NodeJS.Timeout[]>>({
    accessibility: [],
    visual: [],
    validation: [],
  });
  const escalationScheduledRef = useRef<Set<StageId>>(new Set());
  const messageCounterRef = useRef(0);

  const activeStage = stageOrder[currentStageIndex];

  const stageProgress = useMemo(() => {
    return stageOrder.map((stage) => ({
      id: stage,
      title: stageDetails[stage].title,
      completed: completedStages.includes(stage),
    }));
  }, [completedStages]);

  const buildOutputHtml = useCallback(() => {
    const stageItems = stageProgress
      .map(
        (stage) =>
          `<li><strong>${escapeHtml(stage.title)}</strong> - ${
            stage.completed ? "Completed" : "In progress"
          }</li>`,
      )
      .join("");

    const messageItems =
      messages.length === 0
        ? "<li>No messages recorded.</li>"
        : messages
            .map((message) => {
              const related = message.relatedStage
                ? ` <em>(${escapeHtml(stageDetails[message.relatedStage].title)})</em>`
                : "";
              return `<li><strong>${escapeHtml(
                message.sender,
              )}</strong>${related} [${new Date(message.timestamp).toLocaleString()}] - ${escapeHtml(
                message.body,
              )}${message.resolved ? " (resolved)" : ""}</li>`;
            })
            .join("");

    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Court Room Session Summary</title>
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; padding: 2rem; background: #f7f7f7; color: #1a202c; }
      h1 { font-size: 1.75rem; margin-bottom: 1rem; }
      h2 { margin-top: 1.5rem; font-size: 1.25rem; }
      ul { margin-left: 1.25rem; }
      li { margin-bottom: 0.5rem; }
      .meta { font-style: italic; color: #4a5568; }
    </style>
  </head>
  <body>
    <h1>Court Room Session Summary</h1>
    <p class="meta">Timer remaining: ${formatSeconds(countdown)}</p>
    <section>
      <h2>Stages</h2>
      <ul>${stageItems}</ul>
    </section>
    <section>
      <h2>Messages</h2>
      <ul>${messageItems}</ul>
    </section>
  </body>
</html>`;
  }, [countdown, messages, stageProgress]);

  const handleSaveOutput = useCallback(async () => {
    setSaveStatus("saving");
    setSaveError(null);
    try {
      const payload = {
        scenario: "court-room",
        html: buildOutputHtml(),
      };

      const response = await fetch("/api/outputs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let reason = "Failed to save output.";
        try {
          const data = await response.json();
          if (data?.error) {
            reason = data.error;
          }
        } catch {
          // ignore parse error
        }
        throw new Error(reason);
      }

      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 4000);
    } catch (error) {
      setSaveStatus("error");
      setSaveError(error instanceof Error ? error.message : "Failed to save output.");
    }
  }, [buildOutputHtml]);
  const pushMessage = useCallback(
    (message: Omit<CourtMessage, "id" | "timestamp" | "resolved"> & { relatedStage?: StageId }) => {
      messageCounterRef.current += 1;
      const id = `${Date.now()}-${messageCounterRef.current}`;
      setMessages((prev) => [
        ...prev,
        {
          id,
          sender: message.sender,
          body: message.body,
          severity: message.severity,
          timestamp: Date.now(),
          resolved: false,
          relatedStage: message.relatedStage,
        },
      ]);
    },
    []
  );

  const resolveStageMessages = useCallback((stageId: StageId) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.relatedStage === stageId ? { ...message, resolved: true } : message
      )
    );
  }, []);

  const clearStageTimeouts = useCallback((stageId: StageId) => {
    stageTimeoutsRef.current[stageId].forEach((timeout) => {
      clearTimeout(timeout);
    });
    stageTimeoutsRef.current[stageId] = [];
  }, []);

  const triggerCourtSummons = useCallback(
    (stageId: StageId) => {
      setCourtSummoned(true);
      setSummonedStage(stageId);
      const details = stageDetails[stageId];
      pushMessage({
        sender: "Court Clerk",
        body: `The court is now in session for "${details.title}".`,
        severity: "legal",
        relatedStage: stageId,
      });
    },
    [pushMessage]
  );

  const scheduleEscalation = useCallback(
    (stageId: StageId) => {
      if (escalationScheduledRef.current.has(stageId)) {
        return;
      }
      escalationScheduledRef.current.add(stageId);

      const stageMessages =
        stageId === "accessibility" ? accessibilityMessages : validationMessages;

      const initialTimeout = setTimeout(() => {
        pushMessage({
          ...stageMessages.initial,
          relatedStage: stageId,
        });
      }, 2_000);

      const urgentTimeout = setTimeout(() => {
        pushMessage({
          ...stageMessages.urgent,
          relatedStage: stageId,
        });
      }, escalationDelay);

      const legalTimeout = setTimeout(() => {
        pushMessage({
          ...stageMessages.legal,
          relatedStage: stageId,
        });
        triggerCourtSummons(stageId);
      }, escalationDelay * 2);

      stageTimeoutsRef.current[stageId] = [initialTimeout, urgentTimeout, legalTimeout];
    },
    [escalationDelay, pushMessage, triggerCourtSummons]
  );

  const scheduleNextDistraction = useCallback(() => {
    const delay = randomBetween(distractionBounds.min, distractionBounds.max);
    distractionTimeoutRef.current = setTimeout(() => {
      const nextIndex = Math.floor(Math.random() * distractionPool.length);
      const distraction = distractionPool[nextIndex];
      pushMessage({
        sender: distraction.sender,
        body: distraction.body,
        severity: "info",
      });
      scheduleNextDistraction();
    }, delay);
  }, [distractionBounds, pushMessage]);

  const stopTimer = useCallback(() => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setTimerRunning(false);
  }, []);

  const handleStartTimer = useCallback(() => {
    const minutes = Number(minutesInput);
    const seconds = Number(secondsInput);
    if (!Number.isFinite(minutes) || !Number.isFinite(seconds) || minutes < 0 || seconds < 0) {
      setTimerError("Enter a valid positive duration.");
      return;
    }
    const totalSeconds = Math.floor(minutes) * 60 + Math.floor(seconds);
    if (totalSeconds <= 0) {
      setTimerError("Timer duration must be greater than zero.");
      return;
    }
    setTimerError(null);
    setCountdown(totalSeconds);
    setTimerRunning(true);

    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownRef.current) {
            clearInterval(countdownRef.current);
            countdownRef.current = null;
          }
          setTimerRunning(false);
          pushMessage({
            sender: "Timer",
            body: "Countdown reached zero. Time is up.",
            severity: "urgent",
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1_000);
  }, [minutesInput, secondsInput, pushMessage]);

  const handlePauseTimer = useCallback(() => {
    stopTimer();
  }, [stopTimer]);

  const handleResetTimer = useCallback(() => {
    stopTimer();
    setCountdown(0);
    setTimerError(null);
  }, [stopTimer]);

  const markStageComplete = useCallback(
    (stageId: StageId) => {
      if (completedStages.includes(stageId)) {
        return;
      }
      setCompletedStages((prev) => [...prev, stageId]);
      resolveStageMessages(stageId);
      clearStageTimeouts(stageId);
      if (summonedStage === stageId) {
        setCourtSummoned(false);
        setSummonedStage(null);
      }

      if (stageId === activeStage) {
        setCurrentStageIndex((prevIndex) => {
          const nextIndex = prevIndex + 1;
          if (nextIndex >= stageOrder.length) {
            setCelebrationVisible(true);
            return prevIndex;
          }
          return nextIndex;
        });
      }
    },
    [
      activeStage,
      clearStageTimeouts,
      completedStages,
      resolveStageMessages,
      summonedStage,
    ]
  );

  const handleAltSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const trimmed = altAnswer.trim();
      if (trimmed.length < 8) {
        setAltError("Provide a meaningful description (at least 8 characters).");
        return;
      }
      if (!/[a-zA-Z]/.test(trimmed)) {
        setAltError("Use descriptive words, not just symbols or numbers.");
        return;
      }
      setAltError(null);
      pushMessage({
        sender: "Accessibility Officer",
        body: "Alt text applied correctly. Accessibility check cleared.",
        severity: "info",
        relatedStage: "accessibility",
      });
      markStageComplete("accessibility");
    },
    [altAnswer, markStageComplete, pushMessage]
  );

  const handleColorSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (colorChoice !== "inline-high-contrast") {
        setColorError("Select the high-contrast inline style to satisfy the brief.");
        return;
      }
      setColorError(null);
      pushMessage({
        sender: "Agile Coach",
        body: "Title colour update approved. Proceed to the next task.",
        severity: "info",
        relatedStage: "visual",
      });
      markStageComplete("visual");
    },
    [colorChoice, markStageComplete, pushMessage]
  );

  const handleValidationSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!validationOptions.required || !validationOptions.sanitise) {
        setValidationError("Enable required fields and sanitisation to pass the audit.");
        return;
      }
      setValidationError(null);
      pushMessage({
        sender: "Security Analyst",
        body: "Input validation enforced. Attack surface reduced.",
        severity: "info",
        relatedStage: "validation",
      });
      markStageComplete("validation");
    },
    [markStageComplete, pushMessage, validationOptions.required, validationOptions.sanitise]
  );

  const toggleValidationOption = useCallback((option: "required" | "length" | "sanitise") => {
    setValidationOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  }, []);

  useEffect(() => {
    scheduleNextDistraction();
    return () => {
      if (distractionTimeoutRef.current) {
        clearTimeout(distractionTimeoutRef.current);
      }
    };
  }, [scheduleNextDistraction]);

  useEffect(() => {
    const stage = stageOrder[currentStageIndex];
    if (stage === "accessibility" || stage === "validation") {
      scheduleEscalation(stage);
      return () => {
        clearStageTimeouts(stage);
      };
    }
    return undefined;
  }, [clearStageTimeouts, currentStageIndex, scheduleEscalation]);

  useEffect(() => {
    return () => {
      stopTimer();
      stageOrder.forEach((stage) => clearStageTimeouts(stage));
      if (distractionTimeoutRef.current) {
        clearTimeout(distractionTimeoutRef.current);
      }
    };
  }, [clearStageTimeouts, stopTimer]);

  useEffect(() => {
    if (celebrationVisible) {
      const timeout = setTimeout(() => {
        setCelebrationVisible(false);
      }, 6_000);
      return () => clearTimeout(timeout);
    }
    return undefined;
  }, [celebrationVisible]);

  const renderStageContent = () => {
    switch (activeStage) {
      case "accessibility":
        return (
          <AccessibilityStage
            altAnswer={altAnswer}
            altError={altError}
            onAltChange={setAltAnswer}
            onSubmit={handleAltSubmit}
          />
        );
      case "visual":
        return (
          <VisualStage
            colorChoice={colorChoice}
            colorError={colorError}
            onChoiceChange={setColorChoice}
            onSubmit={handleColorSubmit}
          />
        );
      case "validation":
        return (
          <ValidationStage
            validationOptions={validationOptions}
            validationError={validationError}
            onToggle={toggleValidationOption}
            onSubmit={handleValidationSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-black text-white shadow-2xl">
        <div
          className="absolute inset-0 bg-cover bg-center"
          aria-hidden="true"
          style={{ backgroundImage: "url('/courtroom-background.svg')" }}
        />
        <img
          src="/courtroom-background.svg"
          alt="Court room illustration"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-white/30 dark:bg-black/40 backdrop-blur-sm" aria-hidden="true" />
        <div className="relative z-10 space-y-10 p-8 md:p-12">
          <header className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Court Room: Ship Code Under Pressure
            </h2>
            <p className="max-w-3xl text-base text-gray-200">
              Set your timer, handle relentless distractions, and resolve each engineering crisis
              before a summons lands on your desk. Ignore critical compliance tasks and the judge
              will make an appearance.
            </p>
          </header>

          <section aria-label="Timer controls" className="rounded-2xl bg-black/40 p-6 shadow-lg">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-semibold text-white">Manual Timer</h3>
                <p className="text-sm text-gray-300">
                  Configure your sprint window. Pause when you are interrupted. Reset if the judge
                  gives you mercy.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <label className="text-sm font-semibold text-gray-300" htmlFor="timer-minutes">
                  Minutes
                </label>
                <input
                  id="timer-minutes"
                  type="number"
                  min={0}
                  value={minutesInput}
                  onChange={(event) => setMinutesInput(event.target.value)}
                  className="w-20 rounded-lg border border-white/30 bg-black/40 p-2 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <label className="text-sm font-semibold text-gray-300" htmlFor="timer-seconds">
                  Seconds
                </label>
                <input
                  id="timer-seconds"
                  type="number"
                  min={0}
                  max={59}
                  value={secondsInput}
                  onChange={(event) => setSecondsInput(event.target.value)}
                  className="w-20 rounded-lg border border-white/30 bg-black/40 p-2 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handleStartTimer}
                    className="rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white transition hover:bg-blue-600 focus-visible:ring-2 focus-visible:ring-blue-300"
                  >
                    {timerRunning ? "Restart" : "Start"}
                  </button>
                  <button
                    type="button"
                    onClick={handlePauseTimer}
                    className="rounded-lg bg-yellow-500 px-4 py-2 font-semibold text-white transition hover:bg-yellow-600 focus-visible:ring-2 focus-visible:ring-yellow-300"
                    disabled={!timerRunning && countdown === 0}
                  >
                    Pause
                  </button>
                  <button
                    type="button"
                    onClick={handleResetTimer}
                    className="rounded-lg bg-slate-600 px-4 py-2 font-semibold text-white transition hover:bg-slate-500 focus-visible:ring-2 focus-visible:ring-slate-300"
                  >
                    Reset
                  </button>
                </div>
                <div className="ml-auto rounded-xl bg-white/10 px-5 py-2 text-3xl font-mono">
                  {formatSeconds(countdown)}
                </div>
              </div>
            </div>
            {timerError ? <p className="pt-3 text-sm text-rose-200">{timerError}</p> : null}
          </section>

          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <section
              aria-live="polite"
              className="space-y-6 rounded-2xl bg-black/40 p-6 shadow-lg backdrop-blur"
            >
              <header>
                <h3 className="text-2xl font-semibold text-white">
                  {stageDetails[activeStage].title}
                </h3>
                <p className="text-sm text-gray-300">{stageDetails[activeStage].summary}</p>
              </header>
              <p className="rounded-xl border border-white/10 bg-white/10 p-4 text-sm text-gray-100">
                {stageDetails[activeStage].objective}
              </p>
              {renderStageContent()}
            </section>

            <aside
              className="space-y-4 rounded-2xl bg-black/40 p-6 shadow-lg backdrop-blur"
              aria-label="Incoming communications"
            >
              <header className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img src="/icons/messages.svg" alt="" className="h-8 w-8" aria-hidden="true" />
                  <div>
                    <h3 className="text-xl font-semibold text-white">Messages</h3>
                    <span className="text-xs uppercase tracking-wide text-gray-300">
                      Live updates
                    </span>
                  </div>
                </div>
              </header>
              <div
                className="max-h-[520px] space-y-3 overflow-y-auto pr-1"
                aria-live="assertive"
                aria-atomic="false"
              >
                {messages.length === 0 ? (
                  <p className="text-sm text-gray-300">No distractions yet. Stay focused.</p>
                ) : (
                  messages.map((message) => (
                    <article
                      key={message.id}
                      className={`rounded-xl border p-4 shadow transition ${
                        severityStyles[message.severity]
                      } ${message.resolved ? "opacity-60" : "opacity-100"}`}
                    >
                      <header className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold">{message.sender}</h4>
                        <time
                          className="text-xs font-mono"
                          dateTime={new Date(message.timestamp).toISOString()}
                        >
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </time>
                      </header>
                      <p className="mt-2 text-sm">{message.body}</p>
                      <footer className="mt-3 flex items-center gap-3 text-xs">
                        {message.relatedStage ? (
                          <span className="rounded-full bg-black/30 px-2 py-1 text-[10px] uppercase tracking-wide">
                            {stageDetails[message.relatedStage].title}
                          </span>
                        ) : null}
                        {!message.resolved ? (
                          <button
                            type="button"
                            className="ml-auto rounded-full bg-white/20 px-3 py-1 font-semibold hover:bg-white/30 focus-visible:ring-2 focus-visible:ring-white/40"
                            onClick={() =>
                              setMessages((prev) =>
                                prev.map((entry) =>
                                  entry.id === message.id ? { ...entry, resolved: true } : entry
                                )
                              )
                            }
                          >
                            Mark handled
                          </button>
                        ) : (
                          <span className="ml-auto rounded-full bg-black/20 px-3 py-1 font-semibold">
                            Resolved
                          </span>
                        )}
                      </footer>
                    </article>
                  ))
                )}
              </div>
            </aside>
          </div>

          <section
            aria-label="Stage progress"
            className="space-y-4 rounded-2xl bg-black/40 p-6 shadow-lg backdrop-blur"
          >
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white">Persist Session</h3>
                  <p className="text-sm text-gray-300">
                    Save a snapshot of the current Court Room session to the database.
                  </p>
                </div>
                <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
                  <button
                    type="button"
                    onClick={handleSaveOutput}
                    className="rounded-lg bg-emerald-500 px-4 py-2 font-semibold text-emerald-50 transition hover:bg-emerald-600 focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={saveStatus === "saving"}
                  >
                    <span className="flex items-center gap-2">
                      <img
                        src="/icons/save.svg"
                        alt=""
                        className="h-5 w-5"
                        aria-hidden="true"
                      />
                      {saveStatus === "saving" ? "Saving..." : "Save Session Snapshot"}
                    </span>
                  </button>
                  <div className="text-sm" aria-live="polite">
                    {saveStatus === "success" ? (
                    <span className="text-emerald-200">Snapshot saved.</span>
                  ) : null}
                  {saveStatus === "error" ? (
                    <span className="text-rose-200">
                      {saveError ?? "Unable to save. Please try again."}
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {stageProgress.map((stage) => (
                <div
                  key={stage.id}
                  className={`rounded-xl border border-white/20 p-4 transition ${
                    stage.completed ? "bg-emerald-600/80" : "bg-black/30"
                  }`}
                >
                  <h4 className="text-sm font-semibold text-white">{stage.title}</h4>
                  <p className="mt-2 text-xs uppercase tracking-wide">
                    {stage.completed ? "Completed" : "In progress"}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {courtSummoned && summonedStage ? (
        <div
          role="alert"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
        >
          <div className="max-w-xl space-y-6 rounded-3xl border border-purple-500 bg-black/90 p-8 text-white shadow-2xl">
            <header className="space-y-2 text-center">
              <h3 className="text-3xl font-bold uppercase tracking-widest text-purple-200">
                Court Summons
              </h3>
              <p className="text-sm text-purple-100">
                You are fined for ignoring {stageDetails[summonedStage].title}.
              </p>
            </header>
            <p className="text-sm text-gray-200">
              Resolve the outstanding task immediately and click "Return to coding" once you have
              applied the fix.
            </p>
            <button
              type="button"
              className="w-full rounded-lg bg-purple-500 px-4 py-2 text-lg font-semibold text-white transition hover:bg-purple-600 focus-visible:ring-2 focus-visible:ring-purple-300"
              onClick={() => setCourtSummoned(false)}
            >
              Return to coding
            </button>
          </div>
        </div>
      ) : null}

      {celebrationVisible ? (
        <div
          role="status"
          className="rounded-3xl border border-emerald-500 bg-emerald-500/20 p-6 text-center text-emerald-900 shadow-lg dark:text-emerald-100"
        >
          <h3 className="text-2xl font-semibold">Court adjourned!</h3>
          <p className="mt-2 text-sm">
            All compliance issues resolved. Export your HTML confidently knowing the court is off
            your back.
          </p>
        </div>
      ) : null}
    </div>
  );
}
