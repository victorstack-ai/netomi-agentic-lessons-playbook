const { evaluateGuardrails } = require("../src/guardrails.js");

describe("evaluateGuardrails", () => {
  it("blocks explicitly blocked intents", () => {
    const result = evaluateGuardrails({
      intent: "refund_high_value",
      confidence: 0.95,
      policy: { blockedIntents: ["refund_high_value"] }
    });

    expect(result.status).toBe("block");
    expect(result.reasons).toContain("intent_blocked");
  });

  it("escalates low confidence intents when required", () => {
    const result = evaluateGuardrails({
      intent: "faq",
      confidence: 0.4,
      policy: { minConfidence: 0.8, requireHumanOnLowConfidence: true }
    });

    expect(result.status).toBe("escalate");
    expect(result.reasons).toContain("low_confidence");
  });

  it("allows safe intents with sufficient confidence", () => {
    const result = evaluateGuardrails({
      intent: "faq",
      confidence: 0.9,
      policy: { minConfidence: 0.7 }
    });

    expect(result.status).toBe("allow");
    expect(result.reasons).toEqual([]);
  });
});
