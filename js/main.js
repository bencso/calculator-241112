const dialog = document.querySelector("dialog");
const openDialogButton = document.querySelector(".open-dialog");
const closeDialogButton = document.querySelector(".close-dialog");
const minimizeDialogButton = document.querySelector(".minimize-dialog");
const history = document.querySelector(".history");
const result = document.querySelector(".result");
const buttons = document.querySelectorAll(".btn");

let currentNumber = "";
let lastActionWasEvaluation = false;
let currentOperation = "";

openDialogButton.addEventListener("click", () => dialog.showModal());
closeDialogButton.addEventListener("click", () => dialog.close());
//TODO: Outlook minimiza stílusa alapján készüljön
minimizeDialogButton.addEventListener("click", () => dialog.close());

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    handleButtonClick(button.value);
  });
});

document.addEventListener("keydown", handleKeyDown);

function handleButtonClick(value) {
  if (lastActionWasEvaluation && !isNaN(value)) {
    resetCurrentNumber();
  }

  switch (value) {
    case "+":
    case "-":
    case "*":
    case "/":
      if (lastActionWasEvaluation) {
        currentOperation = result.textContent + value;
      } else {
        const lastChar = currentOperation.slice(-1);
        if (
          lastChar !== "+" &&
          lastChar !== "-" &&
          lastChar !== "*" &&
          lastChar !== "/"
        ) {
          currentOperation += currentNumber + value;
        }
      }
      currentNumber = "";
      updateDisplay(currentOperation, "0");
      lastActionWasEvaluation = false;
      break;
    case "CE":
      if (currentNumber.length > 0) {
        currentNumber = currentNumber.slice(0, -1);
        result.textContent = currentNumber;
      }
      if (currentNumber.length === 0) {
        result.textContent = "0";
      }
      break;
    case "=":
      currentOperation += currentNumber;
      const evaluatedResult = eval(currentOperation)
        .toFixed(5)
        .replace(/\b0+(\d)/g, "$1");
      updateDisplay(`${currentOperation}=`, evaluatedResult);
      resetAfterEvaluation(evaluatedResult);
      currentOperation = evaluatedResult;
      console.table({
        currentNumber,
        currentOperation,
        result,
        evaluatedResult,
      });
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
      currentNumber = -parseFloat(result.textContent);
      result.textContent = currentNumber;
      break;
    default:
      if (lastActionWasEvaluation) {
        resetCurrentNumber();
      }
      if (currentNumber.length >= 10) {
        return;
      }
      result.textContent = result.textContent.replace(/^0+(?=\d)/, "") + value;
      currentNumber += value;
      break;
  }
}

function handleKeyDown(e) {
  const keyMap = {
    Enter: "=",
    Backspace: "CE",
    Escape: "C",
  };
  const key = keyMap[e.key] || e.key.toLowerCase();
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
    const button = document.querySelector(`[value="${key}"]`);
    if (button) {
      button.classList.add("active");
      setTimeout(() => button.classList.remove("active"), 200);
      button.click();
    }
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
  result.textContent = resultText.replace(/^0+/, "");
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

function maximizeCalculator() {
  const calculator = document.querySelector("dialog");
  calculator.classList.toggle("maximized");
}
