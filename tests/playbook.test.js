const { EnterprisePlaybook } = require("../src/playbook.js");

describe("EnterprisePlaybook", () => {
  it("routes to tools when allowed", () => {
    const playbook = new EnterprisePlaybook({
      budgetLimit: 5,
      policy: { minConfidence: 0.7 },
      tools: {
        faq: (input) => ({ reply: `Hello ${input.customer}` })
      }
    });

    const result = playbook.handle({
      intent: "faq",
      confidence: 0.9,
      customer: "Morgan",
      estimatedCost: 2
    });

    expect(result.channel).toBe("tool");
    expect(result.output.reply).toBe("Hello Morgan");
    expect(result.remainingBudget).toBe(3);
  });

  it("blocks when budget is exceeded", () => {
    const playbook = new EnterprisePlaybook({
      budgetLimit: 1,
      policy: { minConfidence: 0.7 },
      tools: {
        faq: () => ({ reply: "ok" })
      }
    });

    const result = playbook.handle({
      intent: "faq",
      confidence: 0.9,
      estimatedCost: 2
    });

    expect(result.channel).toBe("blocked");
    expect(result.reasons).toContain("budget_exceeded");
  });
});
