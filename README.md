# Netomi Agentic Lessons Playbook

A tiny Node.js playbook that models enterprise scaling lessons for agentic systems:

- Guardrails that block or escalate sensitive intents
- Confidence gating for human-in-the-loop
- Tool routing with a safe fallback
- Budget enforcement to keep costs predictable

## Why this exists

The goal is to make Netomi-style enterprise lessons concrete in a runnable example. The playbook turns qualitative guidance into simple, testable mechanics.

## Quick start

```bash
npm install
npm run lint
npm test
```

## Usage

```js
const { EnterprisePlaybook } = require("./src/index.js");

const playbook = new EnterprisePlaybook({
  budgetLimit: 5,
  policy: {
    minConfidence: 0.75,
    blockedIntents: ["refund_high_value"],
    escalateIntents: ["legal_question"],
    requireHumanOnLowConfidence: true
  },
  tools: {
    faq: (input) => ({ response: `FAQ for ${input.customer}` }),
    default: () => ({ response: "queued for follow-up" })
  }
});

const result = playbook.handle({
  intent: "faq",
  confidence: 0.9,
  customer: "Ari",
  estimatedCost: 1
});

console.log(result);
```

## Extending

- Add new policy rules to `src/guardrails.js`
- Add more tools and routes in `src/router.js`
- Connect telemetry in `src/playbook.js` for audit trails
