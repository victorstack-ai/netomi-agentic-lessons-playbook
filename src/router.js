const { evaluateGuardrails } = require("./guardrails.js");

function routeTask({ intent, confidence, policy, tools }) {
  const guardrail = evaluateGuardrails({ intent, confidence, policy });
  if (guardrail.status === "block") {
    return {
      channel: "blocked",
      handler: null,
      reasons: guardrail.reasons
    };
  }

  if (guardrail.status === "escalate") {
    return {
      channel: "human",
      handler: null,
      reasons: guardrail.reasons
    };
  }

  const handler = tools?.[intent] ?? tools?.default ?? null;
  return {
    channel: handler ? "tool" : "fallback",
    handler,
    reasons: guardrail.reasons
  };
}

module.exports = { routeTask };
