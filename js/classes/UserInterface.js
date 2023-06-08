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

export { UserInterface };
