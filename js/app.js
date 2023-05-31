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

class UserInterface {
  static insertBudget(budget) {
    const { userBudget, budgetRemaining } = budget;

    //agregar presupuesto y presupuesto restante al HTML
    document.querySelector("#user-budget").textContent = `Presupuesto: $${userBudget}`;
    document.querySelector("#budget-remaining").textContent = `Restante: $${budgetRemaining}`;
  }

  static checkRemainingBudget(budget) {
    const divBudgetRemaining = document.querySelector("#budget-remaining-container");

    const { userBudget, budgetRemaining } = budget;

    // comprobar si el presupuesto restante es el 25% o menos del presupuesto inicial
    if (userBudget / 4 >= budgetRemaining) {
      //eliminamos la clase que agrega colores verdes o amarillos
      divBudgetRemaining.classList.remove(
        "results__budget--remaining-25",
        "results__budget--remaining-50"
      );

      //agregamos la clase que agrega colores rojos
      divBudgetRemaining.classList.add("results__budget--remaining-75");

      // comprobar si el presupuesto restante es el 50% o menos del presupuesto inicial
    } else if (userBudget / 2 >= budgetRemaining) {
      //eliminamos la clase que agrega colores verdes o rojos
      divBudgetRemaining.classList.remove(
        "results__budget--remaining-25",
        "results__budget--remaining-75"
      );

      //agregamos la clase que agrega colores amarillos
      divBudgetRemaining.classList.add("results__budget--remaining-50");
    } else {
      //eliminamos la clase que agrega colores rojos o amarillos
      divBudgetRemaining.classList.remove(
        "results__budget--remaining-75",
        "results__budget--remaining-50"
      );

      //agregamos la clase que agrega colores verdes
      divBudgetRemaining.classList.add("results__budget--remaining-25");
    }
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
  const expenseList = document.querySelector(".table__body");
  const btnResetBudget = document.querySelector("#reset-budget");

  //objetos
  let budget;

  //funciones

  getDataLocalStorage();

  function getDataLocalStorage() {
    // Verificar si hay datos almacenados en el local storage con la clave budget
    if (localStorage.getItem("expenses")) {
      // Obtener los datos almacenados y convertirlos de nuevo a un objeto
      let expenses = JSON.parse(localStorage.getItem("expenses"));
      let userBudget = JSON.parse(localStorage.getItem("userBudget"));
      let budgetRemaining = JSON.parse(localStorage.getItem("budgetRemaining"));

      budget = new Budget(userBudget);
      budget.expenses = expenses;
      budget.budgetRemaining = budgetRemaining;

      // agregar los gastos al HTML
      UserInterface.insertExpenses(budget.expenses);

      //actualizar presupuesto restante
      UserInterface.insertBudget(budget);

      // comprobar el presupuesto restante para cambiar colores
      UserInterface.checkRemainingBudget(budget);
    } else {
      //solicitar presupuesto al usuario y crear una instancia de budget
      budget = new Budget(getBudget());

      //agregar presupuesto y presupuesto restante al HTML
      UserInterface.insertBudget(budget);
    }
  }

  //solicitar presupuesto al usuario
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

    expenseList.addEventListener("click", (e) => {
      //si se hizo click en alguno de los buttons eliminar
      if (e.target.classList.contains("button--remove")) {
        const expenseElement = e.target.parentElement.parentElement;
        //llamamos a removeExpense con el id del elemento a eliminar
        removeExpense(expenseElement.dataset.id);
      }
    });

    btnResetBudget.addEventListener("click", () => {
      //limpia todos los datos del local storage
      localStorage.clear();
      //recarga la página
      location.reload();
    });
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

    // comprobar el presupuesto restante para cambiar colores
    UserInterface.checkRemainingBudget(budget);

    //actualizar en local storage
    syncLocalStorage();
  }

  function removeExpense(id) {
    // eliminamos el gasto con el id del array expenses del objeto budget
    budget.deleteExpense(Number(id));

    // actualizar los gastos en el HTML
    UserInterface.insertExpenses(budget.expenses);

    //actualizar presupuesto restante
    UserInterface.insertBudget(budget);

    // comprobar el presupuesto restante para cambiar colores
    UserInterface.checkRemainingBudget(budget);

    //actualizar en local storage
    syncLocalStorage();
  }

  //Guarda el objeto budget en local storage
  function syncLocalStorage() {
    localStorage.setItem("expenses", JSON.stringify(budget.expenses));
    localStorage.setItem("userBudget", JSON.stringify(budget.userBudget));
    localStorage.setItem("budgetRemaining", JSON.stringify(budget.budgetRemaining));
  }
}
