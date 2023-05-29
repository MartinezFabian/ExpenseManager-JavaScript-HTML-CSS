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

  registerEventListeners();

  function registerEventListeners() {
    form.addEventListener("submit", addExpense);
  }

  function addExpense(e) {
    e.preventDefault(); //prevenir el comportamiento predeterminado del evento submit

    const expenseName = document.querySelector("#expense").value;
    const quantity = document.querySelector("#quantity").value;

    //validamos el nombre del gasto y la cantidad

    if (expenseName === "" || quantity === "") {
      UserInterface.showAlert("Ambos campos son obligatorios", "error");
      return;
    } else if (quantity <= 0 || isNaN(quantity)) {
      UserInterface.showAlert("La monto ingresado no es un valor válido", "error");
      return;
    }

    UserInterface.showAlert("Agregando gasto...");
  }
}
