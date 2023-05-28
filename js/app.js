document.addEventListener("DOMContentLoaded", () => {
  main();
});

function main() {
  // variables/constantes
  const form = document.querySelector("#form");
  const expenseList = document.querySelector(".table__body");

  //funciones

  function getBudget() {
    let userBudget;

    do {
      userBudget = prompt("¿Cuál es tu presupuesto? Asegúrate de ingresar un número válido.");
    } while (userBudget === "" || userBudget === null || isNaN(userBudget) || userBudget <= 0);

    return Number(userBudget);
  }

  console.log(getBudget());
}
