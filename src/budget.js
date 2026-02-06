class BudgetGuard {
  constructor(limit) {
    if (!Number.isFinite(limit) || limit <= 0) {
      throw new Error("Budget limit must be a positive number");
    }
    this.limit = limit;
    this.spent = 0;
  }

  canSpend(cost) {
    if (!Number.isFinite(cost) || cost < 0) {
      return false;
    }
    return this.spent + cost <= this.limit;
  }

  spend(cost) {
    if (!this.canSpend(cost)) {
      throw new Error("Budget exceeded");
    }
    this.spent += cost;
    return this.spent;
  }
}

module.exports = { BudgetGuard };
