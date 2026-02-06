function evaluateGuardrails({ intent, confidence, policy }) {
  const reasons = [];
  const minConfidence = policy?.minConfidence ?? 0.7;
  const blockedIntents = new Set(policy?.blockedIntents ?? []);
  const escalateIntents = new Set(policy?.escalateIntents ?? []);
  const requireHumanOnLowConfidence = policy?.requireHumanOnLowConfidence ?? true;

  if (blockedIntents.has(intent)) {
    reasons.push("intent_blocked");
    return { status: "block", reasons };
  }

  if (Number.isFinite(confidence) && confidence < minConfidence) {
    reasons.push("low_confidence");
    if (requireHumanOnLowConfidence) {
      return { status: "escalate", reasons };
    }
  }

  if (escalateIntents.has(intent)) {
    reasons.push("intent_requires_human");
    return { status: "escalate", reasons };
  }

  return { status: "allow", reasons };
}

module.exports = { evaluateGuardrails };
