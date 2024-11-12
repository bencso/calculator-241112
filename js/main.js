const dialog = document.querySelector("dialog");

document.querySelector(".open-dialog").addEventListener("click", function() {
    dialog.showModal();
});

document.querySelector(".close-dialog").addEventListener("click", function() {
    dialog.close();
});