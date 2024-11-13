const dialog = document.querySelector("dialog");
const openDialogButton = document.querySelector(".open-dialog");
const closeDialogButton = document.querySelector(".close-dialog");
const history = document.querySelector(".history");
const result = document.querySelector(".result");
const buttons = document.querySelectorAll(".btn");

let currentNumber = "";
let lastActionWasEvaluation = false;
let currentOperation = "";

openDialogButton.addEventListener("click", () => dialog.showModal());
closeDialogButton.addEventListener("click", () => dialog.close());

buttons.forEach((button) => {
  button.addEventListener("click", () =>
    handleButtonClick(button.getAttribute("value"))
  );
});

document.addEventListener("keydown", handleKeyDown);

//TODO: Amikor 0.X-et írunk, akkkor a 0-t ne törölje ki, csak akkor törölje a 0-t, ha a 0 után egy számjegy jön.
function handleButtonClick(value) {
  if (lastActionWasEvaluation && !isNaN(value)) {
    resetCurrentNumber();
  }

  switch (value) {
    case "+":
    case "-":
    case "*":
    case "/":
      currentOperation += currentNumber + value;
      currentNumber = "";
      updateDisplay(currentOperation, "0");
      break;
    case "CE":
      if (currentNumber.length > 0) {
        currentNumber = currentNumber.slice(0, -1);
        result.textContent = currentNumber;
      }
      break;
    case "=":
      currentOperation += currentNumber;
      const evaluatedResult = eval(currentOperation)
        .toFixed(5)
        .replace(/\.?0+$/, "");
      updateDisplay(`${currentOperation}=`, evaluatedResult);
      saveHistory();
      resetAfterEvaluation(evaluatedResult);
      break;
    case "C":
      currentNumber = "";
      currentOperation = "";
      updateDisplay("", "0");
      break;
    case "pow":
      currentNumber = Math.pow(currentNumber, 2);
      updateDisplay(`${currentNumber}^2=`, currentNumber);
      saveHistory();
      lastActionWasEvaluation = true;
      break;
    case "sign":
      currentNumber = -currentNumber;
      result.textContent = currentNumber;
      break;
    default:
      if (lastActionWasEvaluation) {
        resetCurrentNumber();
      }
      result.textContent = result.textContent.replace(/0/g, "") + value;
      currentNumber += value;
      break;
  }
}

function handleKeyDown(e) {
  const keyMap = {
    Enter: "=",
    Delete: "CE",
    Backspace: "C",
  };
  const key = keyMap[e.key] || e.key;
  const allowedKeys = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "+",
    "-",
    "*",
    "/",
    ".",
    "=",
  ];
  if (allowedKeys.includes(key)) {
    document.querySelector(`[value="${key}"]`).click();
  }
}

function saveHistory() {
  let savedHistory = JSON.parse(localStorage.getItem("history")) || [];
  if (savedHistory.length >= 5) {
    savedHistory.pop();
  }
  const formattedCalculation = history.textContent
    .split("=")[0]
    .replace(/\b0+(\d)/g, "$1");
  savedHistory.unshift({
    calculation: formattedCalculation,
    result: result.textContent,
  });
  localStorage.setItem("history", JSON.stringify(savedHistory));
}


//TODO: Normális history megjelenítés
function loadHistory() {
    const savedHistory = JSON.parse(localStorage.getItem("history")) || [];
    const historyList = document.createElement("ul");
    historyList.classList.add("history-list");
    historyList.innerHTML = savedHistory
        .map((item) => `<li>${item.calculation}=${item.result}</li>`)
        .join("");
    history.appendChild(historyList);
}


function clearHistory() {
  localStorage.removeItem("history");
  history.innerHTML = "";
}

function updateDisplay(historyText, resultText) {
  history.textContent = historyText.replace(/\b0+(\d)/g, "$1");
  result.textContent = resultText;
}

function resetCurrentNumber() {
  currentNumber = "";
  result.textContent = "";
  lastActionWasEvaluation = false;
}

function resetAfterEvaluation(evaluatedResult) {
  currentNumber = evaluatedResult;
  lastActionWasEvaluation = true;
  currentOperation = "";
}
