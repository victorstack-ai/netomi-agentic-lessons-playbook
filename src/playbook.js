const { BudgetGuard } = require("./budget.js");
const { routeTask } = require("./router.js");

class EnterprisePlaybook {
  constructor({ policy, tools, budgetLimit }) {
    this.policy = policy ?? {};
    this.tools = tools ?? {};
    this.budget = new BudgetGuard(budgetLimit ?? 10);
  }

  handle(caseInput) {
    const intent = caseInput.intent ?? "unknown";
    const confidence = caseInput.confidence ?? 0;
    const estimatedCost = caseInput.estimatedCost ?? 1;

    if (!this.budget.canSpend(estimatedCost)) {
      return {
        channel: "blocked",
        output: null,
        reasons: ["budget_exceeded"],
        remainingBudget: this.budget.limit - this.budget.spent
      };
    }

    const route = routeTask({
      intent,
      confidence,
      policy: this.policy,
      tools: this.tools
    });

    if (route.channel !== "tool") {
      return {
        channel: route.channel,
        output: null,
        reasons: route.reasons,
        remainingBudget: this.budget.limit - this.budget.spent
      };
    }

    this.budget.spend(estimatedCost);
    const output = route.handler(caseInput);

    return {
      channel: route.channel,
      output,
      reasons: route.reasons,
      remainingBudget: this.budget.limit - this.budget.spent
    };
  }
}

module.exports = { EnterprisePlaybook };
