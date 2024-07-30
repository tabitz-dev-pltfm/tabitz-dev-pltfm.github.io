export function showText() {
    document.getElementById("root").innerText = localStroage.getItem("variable");
}
