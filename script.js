const display = document.getElementById("display");

let currentInput = "";
let firstValue = null;
let operator = null;
let waitingForSecondValue = false;

function updateDisplay(value) {
  display.textContent = value === "" ? "0" : value;
}

function inputNumber(number) {
  if (waitingForSecondValue) {
    currentInput = number;
    waitingForSecondValue = false;
  } else {
    currentInput = currentInput === "0" ? number : currentInput + number;
  }

  updateDisplay(currentInput);
}

function inputOperator(nextOperator) {
  const inputValue = Number(currentInput);

  if (operator && waitingForSecondValue) {
    operator = nextOperator;
    return;
  }

  if (firstValue === null) {
    firstValue = inputValue;
  } else if (operator) {
    const result = calculate(firstValue, inputValue, operator);

    if (result === "Error") {
      updateDisplay(result);
      resetCalculator();
      return;
    }

    updateDisplay(result);
    firstValue = result;
  }

  operator = nextOperator;
  waitingForSecondValue = true;
}

function calculate(a, b, op) {
  switch (op) {
    case "+": return a + b;
    case "-": return a - b;
    case "*": return a * b;
    case "/": return b === 0 ? "Error" : a / b;
    default: return b;
  }
}

function performEquals() {
  if (operator === null || firstValue === null || currentInput === "") {
    return;
  }

  const secondValue = Number(currentInput);
  const result = calculate(firstValue, secondValue, operator);

  updateDisplay(result);

  if (result === "Error") {
    resetCalculator();
    return;
  }

  currentInput = String(result);
  firstValue = null;
  operator = null;
  waitingForSecondValue = false;
}

function resetCalculator() {
  currentInput = "";
  firstValue = null;
  operator = null;
  waitingForSecondValue = false;
}

document.querySelectorAll(".number").forEach((button) => {
  button.addEventListener("click", () => {
    inputNumber(button.dataset.value);
  });
});

document.querySelectorAll(".operator").forEach((button) => {
  button.addEventListener("click", () => {
    inputOperator(button.dataset.operator);
  });
});

document.querySelector('[data-action="equals"]').addEventListener("click", performEquals);

document.querySelector('[data-action="clear"]').addEventListener("click", () => {
  resetCalculator();
  updateDisplay("0");
});

document.addEventListener("keydown", (event) => {
  if (/^[0-9]$/.test(event.key)) inputNumber(event.key);
  if (["+", "-", "*", "/"].includes(event.key)) inputOperator(event.key);
  if (event.key === "Enter" || event.key === "=") performEquals();
  if (event.key === "Escape" || event.key.toLowerCase() === "c") {
    resetCalculator();
    updateDisplay("0");
  }
});
