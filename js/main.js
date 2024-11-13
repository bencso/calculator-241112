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
                if (currentNumber === "") {
                    currentNumber = "0" + value;
                } else {
                    currentNumber += value;
                }
                console.debug(currentNumber);
                history.textContent = currentNumber;
                result.textContent = "";
                break;
            case "CE":
                currentNumber = "";
                history.textContent = "";
                result.textContent = "";
                break;
            case "=":
                history.textContent = currentNumber + "=";
                currentNumber = eval(currentNumber).toFixed(5).replace(/\.?0+$/, "");
                result.textContent = currentNumber;
                break;
            case "C":
                currentNumber = "";
                result.textContent = currentNumber;
                break;
            case "sqrt":
                currentNumber = Math.sqrt(currentNumber);
                result.textContent = currentNumber;
                break;
            case "pow":
                currentNumber = Math.pow(currentNumber, 2);
                result.textContent = currentNumber;
                break;
            default:
                currentNumber += value;
                console.table(value, currentNumber);
                result.textContent += value;
                break;
        }
    });
});