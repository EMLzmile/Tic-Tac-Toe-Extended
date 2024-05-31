import { TicTacToeGame, PlayerMark, IAPlayer } from './game.js';

const tictacApp = document.querySelector(".tictac-app");
const restart = document.querySelector("#restart");
const resume = document.querySelector("#resume");
const exitGame = document.querySelector("#exit-game");
const toggle = document.querySelector("#toggle-menu");
const nav = document.querySelector(".nav-right");
const start = document.querySelector("#start");
const singleplayer = document.querySelector("#singleplayer");
const multiplayer = document.querySelector("#multiplayer");
const exitApp = document.querySelector("#exit-app");
const home = document.querySelector("#home");

const gameStuces = new TicTacToeGame(10);

let j1 = {
    name: "EMLzmile",
    mark: "rond"
}
let j2 = {
    playerName: "Zmile IA",
    mark: "cross"
}

const PvP = {
  player1: new PlayerMark(gameStuces, j1.name, j1.mark),
  player2: new PlayerMark(gameStuces, j2.name, j2.mark),
  difficult: "Normal",
  match: 4
}

const PvA = {
  player1: new PlayerMark(gameStuces, j1.name, j1.mark),
  player2: new IAPlayer(gameStuces, "cross"),
  difficult: "Normal",
  match: 4
}

if (tictacApp.classList.contains("invisible")) {
    // toggle.parentElement.classList.add("invisible");
}

let mode = PvA;
// console.log(gameStuces);

resume.addEventListener("click", () => {
    nav.classList.remove("nav-right-appear");
});

restart.addEventListener("click", () => {
    nav.classList.remove("nav-right-appear");
    gameStuces.restart(mode);
});

toggle.addEventListener("click", () => {
    nav.classList.toggle("nav-right-appear");
});

multiplayer.addEventListener("click", () => {
    tictacApp.classList.remove("invisible");
    toggle.parentElement.classList.remove("invisible");
    tictacApp.classList.add("game-appear");
    toggle.parentElement.classList.add("header-appear");
    mode=PvP;
    setTimeout(() => gameStuces.initGame(mode), 1000);
    
    home.classList.add("invisible");
});

singleplayer.addEventListener("click", () => {
    tictacApp.classList.remove("invisible");
    toggle.parentElement.classList.remove("invisible");
    tictacApp.classList.add("game-appear");
    toggle.parentElement.classList.add("header-appear");
    
    mode = PvA;
    
    setTimeout(() => gameStuces.initGame(mode), 1000);
    
    home.classList.add("invisible");
});

exitGame.addEventListener("click", () => {
    tictacApp.classList.add("invisible");
    hideElements(toggle.parentElement);
    
    tictacApp.classList.remove("game-appear");
    toggle.parentElement.classList.remove("header-appear");
    home.classList.remove("invisible");
    nav.classList.remove("nav-right-appear");

});
exitApp.addEventListener("click", () => {
  if(window.confirm("Êtes-vous sûr de quitter ?"))
    window.close();
  // console.log(close());
})
