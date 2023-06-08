class Budget {
  #userBudget;
  #budgetRemaining;
  #expenses;

  constructor(userBudget) {
    this.#userBudget = userBudget;
    this.#budgetRemaining = userBudget;
    this.#expenses = [];
  }

  get userBudget() {
    return this.#userBudget;
  }

  set userBudget(userBudget) {
    this.#userBudget = userBudget;
  }

  get budgetRemaining() {
    return this.#budgetRemaining;
  }

  set budgetRemaining(budgetRemaining) {
    this.#budgetRemaining = budgetRemaining;
  }

  addExpense(expense) {
    this.#expenses.push(expense);
    this.calculateRemaining();
  }

  deleteExpense(id) {
    this.#expenses = this.#expenses.filter((expense) => expense.id !== id);
    this.calculateRemaining();
  }

  get expenses() {
    return this.#expenses;
  }

  set expenses(expenses) {
    this.#expenses = expenses;
  }

  calculateRemaining() {
    let budgetSpent = this.#expenses.reduce((total, expense) => total + expense.amount, 0);

    this.budgetRemaining = (this.userBudget - budgetSpent).toFixed(1);
  }
}

export { Budget };
