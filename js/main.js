const dialog = document.querySelector("dialog");

document.querySelector(".open-dialog").addEventListener("click", function () {
    dialog.showModal();
});

document.querySelector(".close-dialog").addEventListener("click", function () {
    dialog.close();
});

//Mathematic functions
const history = document.querySelector(".history");
const result = document.querySelector(".result");
const buttons = document.querySelectorAll(".btn");

let currentNumber = "";
buttons.forEach(function (button) {
    button.addEventListener("click", function () {
        let value = button.getAttribute("value");
        switch (value) {
            case "+":
            case "-":
            case "*":
            case "/":
                currentNumber += value;
                history.textContent = currentNumber;
                result.textContent = "0";
                break;
            case "CE":
                if(currentNumber.length>0){
                currentNumber = currentNumber.slice(0, -1);
                result.textContent = currentNumber;
                }
                break;
            case "=":
                history.textContent = currentNumber + "=";
                currentNumber = eval(currentNumber).toFixed(5).replace(/\.?0+$/, "");
                result.textContent = currentNumber;
                break;
            case "C":
                currentNumber = "";
                history.textContent = "";
                result.textContent = "0";
                break;
            case "sqrt":
                currentNumber = Math.sqrt(currentNumber);
                result.textContent = currentNumber;
                break;
            case "pow":
                currentNumber = Math.pow(currentNumber, 2);
                result.textContent = currentNumber;
                break;
            case "sign":
                currentNumber = -currentNumber;
                result.textContent = currentNumber;
                break;
            default:
                if(currentNumber === "0" || result.textContent === "0") {
                    result.textContent = "";
                }
                currentNumber += value;
                result.textContent += value;
                break;
        }
    });
});

// Keyboard support
document.addEventListener("keydown", function (e) {
    let key = e.key;
    let allowedKeys = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "+", "-", "*", "/", ".", "Enter", "Backspace", "Delete"];
    if (allowedKeys.includes(key)) {
        if (key === "Enter") key = "=";
        if (key === "Delete") key = "CE";
        if (key === "Backspace") key = "C";
        let button = document.querySelector(`[value="${key}"]`);
        button.click();
    }
});
