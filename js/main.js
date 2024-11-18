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

openDialogButton.addEventListener("click", () => openModal());
closeDialogButton.addEventListener("click", () => closeDialog());
minimizeDialogButton.addEventListener("click", () => {
    dialog.close();
    const div = document.createElement('div');
    div.classList.add("minimazed-div");
    const main = document.querySelector("main");
    div.textContent = "calculator";
    div.addEventListener('click', closeMinimazed);
    main.appendChild(div);
});

function openModal() {
    if (document.querySelector("dialog").open) return;
    dialog.showModal();
    closeMinimazed();
}

function closeDialog() {
    dialog.close();
    clearHistory();
    handleClear();
}

function closeMinimazed() {
    const main = document.querySelector("main");
    const div = document.querySelector(".minimazed-div");
    main.removeChild(div);
    dialog.showModal();
}

buttons.forEach((button) => {
    button.addEventListener("click", () =>
        handleButtonClick(button.getAttribute("value"))
    );
});

document.addEventListener("keydown", handleKeyDown);

function handleButtonClick(value) {
    if (lastActionWasEvaluation && !isNaN(value)) {
        resetCurrentNumber();
        currentOperation = "";
    }

    switch (value) {
        case "+":
        case "-":
        case "*":
        case "/":
            handleOperator(value);
            break;
        case "CE":
            handleClearEntry();
            break;
        case "=":
            handleEvaluation();
            break;
        case "C":
            handleClear();
            break;
        case "pow":
            handlePower();
            break;
        case ".":
            if (currentNumber === "") {
                currentNumber = "0.";
            } else if (!currentNumber.includes(".")) {
                currentNumber += value;
            }
            result.textContent = currentNumber;
            adjustFontSize();
            break;
        case "sign":
            handleSignChange();
            break;
        default:
            handleNumberInput(value);
            break;
    }
}

function handleOperator(operator) {
    if (currentNumber === "" && currentOperation === "") return;
    if (lastActionWasEvaluation) {
        currentOperation = result.textContent + operator;
    } else {
        const lastChar = currentOperation.slice(-1);
        if (!["+", "-", "*", "/"].includes(lastChar)) {
            currentOperation += currentNumber + operator;
        } else if (currentNumber !== "") {
            currentOperation += currentNumber;
            currentOperation = eval(currentOperation).toString() + operator;
        } else if (lastChar !== operator) {
            currentOperation = currentOperation.slice(0, -1) + operator;
        }
    }
    updateDisplay(currentOperation, currentNumber);
    resetCurrentNumber(currentNumber);
    lastActionWasEvaluation = false;
}

function handleClearEntry() {
    if (currentNumber.length > 0) {
        currentNumber = currentNumber.slice(0, -1);
        if (currentNumber === "") currentNumber = "0";
        result.textContent = currentNumber;
        adjustFontSize();
    }
}

function handleEvaluation() {
    if (currentOperation && currentNumber) {
        currentOperation += currentNumber;
        let evaluatedResult = eval(currentOperation);
        //TODO: Legyen 5 tizedesjegyig kerekítve az eredmény? Vagy annyit irassunk ki ammenyi kifér a display-re?
        evaluatedResult = Number.isInteger(evaluatedResult) ?
            evaluatedResult.toString() :
            evaluatedResult.toFixed(5).replace(/\b0+(\d)/g, "$1");
        updateDisplay(`${currentOperation}=`, evaluatedResult);
        resetAfterEvaluation(evaluatedResult);
        currentOperation = "";
        currentNumber = evaluatedResult;
        adjustFontSize();
        saveHistory();
    }
}

function handleClear() {
    resetCurrentNumber();
    currentOperation = "";
    updateDisplay("", "0");
    result.textContent = "0";
    adjustFontSize();
}

function handlePower() {
    currentNumber = Math.pow(parseFloat(result.textContent), 2).toString();
    history.textContent = `${result.textContent}^2=`;
    result.textContent = currentNumber;
    adjustFontSize();
}

function handleSignChange() {
    currentNumber = -parseFloat(result.textContent);
    result.textContent = currentNumber;
    adjustFontSize();
}

function updateDisplay(historyText, resultText) {
    history.textContent = historyText.replace(/\b0+(\d)/g, "$1");
    if (!resultText.includes(".")) {
        result.textContent = resultText.replace(/0+/, "");
    } else {
        result.textContent = resultText;
    }
    adjustFontSize();
}

function handleNumberInput(value) {
    if (lastActionWasEvaluation) {
        resetCurrentNumber();
        currentOperation = "";
        lastActionWasEvaluation = false;
    }
    if (currentNumber.length < 30) {
        if (currentNumber === "0") {
            currentNumber = value;
        } else {
            currentNumber += value;
        }
        result.textContent = currentNumber;
        adjustFontSize();
    }
}

function handleKeyDown(e) {
    e.preventDefault();
    const keyMap = {
        Enter: "=",
        Backspace: "CE",
        Delete: "C",
        "+": "+",
        "-": "-",
        "*": "*",
        "/": "/",
        ".": ".",
        ",": ".",
    };
    const key = e.key in keyMap ? keyMap[e.key] : e.key;
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
        "CE",
        "C",
    ];
    if (allowedKeys.includes(key)) {
        const button = document.querySelector(`[value="${key}"]`);
        if (button) {
            button.classList.add("active");
            setTimeout(() => button.classList.remove("active"), 100);
            button.click();
        }
    }
}

function saveHistory() {
    let savedHistory = JSON.parse(localStorage.getItem("history")) || [];
    if (savedHistory.length >= 5) savedHistory.pop();
    const formattedCalculation = history.textContent
        .split("=")[0]
        .replace(/\b0+(\d)/g, "$1");
    savedHistory.unshift({
        calculation: formattedCalculation,
        result: result.textContent,
    });
    localStorage.setItem("history", JSON.stringify(savedHistory));
}

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
    adjustFontSize();
}

function resetCurrentNumber() {
    currentNumber = "";
    result.textContent = "0";
    adjustFontSize();
}

function resetAfterEvaluation(evaluatedResult) {
    currentNumber = evaluatedResult;
    lastActionWasEvaluation = true;
    currentOperation = "";
}

function maximizeCalculator() {
    const calculator = document.querySelector("dialog");
    calculator.classList.toggle("maximized");
    adjustFontSize();
}

function adjustFontSize() {
    const length = result.textContent.length;
    const isMax = document.querySelector("dialog").classList.contains("maximized");
    if (length <= 4 && !isMax) result.style.fontSize = "3rem";
    else if (length > 4 && length <= 8 && !isMax) result.style.fontSize = "2rem";
    else if (length > 8 && length <= 12 && !isMax) result.style.fontSize = "1.5rem";
    else if (length <= 13 && !isMax) result.style.fontSize = "1rem";
    else if (length <= 4) result.style.fontSize = "4rem";
    else if (length > 4 && length <= 8) result.style.fontSize = "3rem";
    else if (length > 8 && length <= 12) result.style.fontSize = "2.5rem";
    else if (length <= 13) result.style.fontSize = "2rem";
}