import { form, expenseList, btnResetBudget } from "../utils/selectors.js";
import { addExpense, removeExpense, getDataLocalStorage } from "../utils/app-functions.js";

class App {
  constructor() {
    this.initApp();
  }

  initApp() {
    getDataLocalStorage(); // Verificar si hay datos almacenados en el local storage

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
}

export { App };
