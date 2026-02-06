const { BudgetGuard } = require("../src/budget.js");

describe("BudgetGuard", () => {
  it("tracks spend within a budget", () => {
    const budget = new BudgetGuard(3);

    expect(budget.canSpend(2)).toBe(true);
    budget.spend(2);

    expect(budget.canSpend(1)).toBe(true);
    budget.spend(1);

    expect(budget.canSpend(1)).toBe(false);
  });

  it("throws when spending beyond limit", () => {
    const budget = new BudgetGuard(1);

    expect(() => budget.spend(2)).toThrow("Budget exceeded");
  });
});
