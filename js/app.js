// clases

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

  addExpense(expense) {
    this.#expenses.push(Number(expense));
  }
}

class UserInterface {
  static insertBudget(budget) {
    const { userBudget, budgetRemaining } = budget;

    //agregar presupuesto y presupuesto restante al HTML
    document.querySelector("#user-budget").textContent = `Presupuesto: $${userBudget}`;
    document.querySelector("#budget-remaining").textContent = `Restante: $${budgetRemaining}`;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  main();
});

function main() {
  // variables/constantes
  const form = document.querySelector("#form");
  const expenseList = document.querySelector(".table__body");

  //objetos
  const budget = new Budget(getBudget());
  UserInterface.insertBudget(budget);

  //funciones

  function getBudget() {
    let userBudget;

    do {
      userBudget = prompt("¿Cuál es tu presupuesto? Asegúrate de ingresar un número válido.");
    } while (userBudget === "" || userBudget === null || isNaN(userBudget) || userBudget <= 0);

    return Number(userBudget);
  }
}
