import { UserInterface } from "../classes/UserInterface.js";
import { Budget } from "../classes/Budget.js";
import { form } from "./selectors.js";

let budget;

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
    UserInterface.showAlert("No tienes suficiente presupuesto disponible para este gasto", "error");
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

export { getDataLocalStorage, addExpense, getBudget, removeExpense, syncLocalStorage };
