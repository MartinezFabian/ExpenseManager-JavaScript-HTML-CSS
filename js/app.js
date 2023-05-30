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

  set budgetRemaining(budgetRemaining) {
    this.#budgetRemaining = budgetRemaining;
  }

  addExpense(expense) {
    this.#expenses.push(expense);
    this.calculateRemaining();
  }

  get expenses() {
    return this.#expenses;
  }

  calculateRemaining() {
    let budgetSpent = this.#expenses.reduce((total, expense) => total + expense.amount, 0);

    this.budgetRemaining = (this.userBudget - budgetSpent).toFixed(1);
  }
}

class UserInterface {
  static insertBudget(budget) {
    const { userBudget, budgetRemaining } = budget;

    //agregar presupuesto y presupuesto restante al HTML
    document.querySelector("#user-budget").textContent = `Presupuesto: $${userBudget}`;
    document.querySelector("#budget-remaining").textContent = `Restante: $${budgetRemaining}`;
  }

  static insertExpenses(expenses) {
    const expenseList = document.querySelector(".table__body");

    // limpiamos los gastos actuales en el HTML para evitar duplicados
    UserInterface.clearHTML(expenseList);

    //por cada gasto en el array gastos creamos un elemento HTML
    expenses.forEach((expense) => {
      const { id, name, amount } = expense;

      expenseList.insertAdjacentHTML(
        "afterbegin",
        `
        <tr data-id="${id}" class="table__body-row">
          <td class="table__body-cell">${name}</td>
          <td class="table__body-cell">$${amount}</td>
          <td class="table__body-cell">
            <button class="button button--remove">&times</button>
          </td>
        </tr>
      `
      );
    });
  }

  static clearHTML(expenseList) {
    // si el elemento expenseList tiene un primer hijo
    while (expenseList.firstChild) {
      //eliminar el primer hijo del elemento expenseList
      expenseList.removeChild(expenseList.firstChild);
    }
  }

  static showAlert(message, type) {
    let existAlert = document.querySelector(".alert");

    //si ya existe una alerta actualmente salir de la función
    if (existAlert) {
      return;
    }

    //crear alerta
    const alertElement = document.createElement("DIV");
    alertElement.classList.add("alert");

    if (type === "error") {
      alertElement.classList.add("alert--error");
    } else {
      alertElement.classList.add("alert--success");
    }

    //agregar mensaje
    alertElement.textContent = message;

    //agregar alerta al contenedor
    const sectionAddExpenses = document.querySelector(".main__add-expenses");
    sectionAddExpenses.appendChild(alertElement);

    //luego de 2 segundos eliminar la alerta
    setTimeout(() => {
      alertElement.remove();
    }, 2000);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  main();
});

function main() {
  // variables/constantes
  const form = document.querySelector("#form");

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

  registerEventListeners();

  function registerEventListeners() {
    form.addEventListener("submit", addExpense);
  }

  function addExpense(e) {
    e.preventDefault(); //prevenir el comportamiento predeterminado del evento submit

    const expenseName = document.querySelector("#expense").value;
    const amount = document.querySelector("#amount").value;

    //validamos el nombre del gasto y el monto

    if (expenseName === "" || amount === "") {
      UserInterface.showAlert("Ambos campos son obligatorios", "error");
      return;
    } else if (amount <= 0 || isNaN(amount)) {
      UserInterface.showAlert("La monto ingresado no es un valor válido", "error");
      return;
    } else if (budget.budgetRemaining - amount < 0) {
      UserInterface.showAlert(
        "No tienes suficiente presupuesto disponible para este gasto",
        "error"
      );
      return;
    }

    //si el nombre del gasto y el monto son valores validos

    UserInterface.showAlert("Agregando gasto...");
    form.reset();

    // generar un objeto gasto

    const expense = {
      id: Date.now(),
      name: expenseName,
      amount: Number(amount),
    };

    //agregamos el objeto gasto al array expenses del objeto budget

    budget.addExpense(expense);

    // agregar los gastos al HTML
    UserInterface.insertExpenses(budget.expenses);

    //actualizar presupuesto restante
    UserInterface.insertBudget(budget);
  }
}
