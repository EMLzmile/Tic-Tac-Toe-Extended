import { TicTacToeGame } from './main.js';

const tictacApp = document.querySelector(".tictac-app");
const restart = document.querySelector("#restart");
const resume = document.querySelector("#resume");
const toggle = document.querySelector("#toggle-menu");
const nav = document.querySelector(".nav-right");
const start = document.querySelector("#start");
const multiplayer = document.querySelector("#multiplayer");
const home = document.querySelector("#home");


let joueur1 = {
    playerName: "Unknown",
    playerMarkSymbol: "rond"
}
let joueur2 = {
    playerName: "Zmile IA",
    playerMarkSymbol: "cross"
}

if (tictacApp.classList.contains("invisible")) {
    // toggle.parentElement.classList.add("invisible");
}
const gameStuces = new TicTacToeGame(4);
// console.log(gameStuces);

resume.addEventListener("click", () => {
    nav.classList.remove("nav-right-appear");
});
restart.addEventListener("click", () => {
    nav.classList.remove("nav-right-appear");
    gameStuces.restart();
});
toggle.addEventListener("click", () => {
    nav.classList.toggle("nav-right-appear");
});
multiplayer.addEventListener("click", () => {
    tictacApp.classList.remove("invisible");
    toggle.parentElement.classList.remove("invisible");
    tictacApp.classList.add("game-appear");
    toggle.parentElement.classList.add("header-appear");

    setTimeout(() => gameStuces.initGame(joueur1, joueur2), 1000);
    home.classList.add("invisible");
})
