import { TicTacToeGame, PlayerMark, IAPlayer } from './game.js';

const tictacApp = document.querySelector(".tictac-app");
const restart = document.querySelector("#restart");
const resume = document.querySelector("#resume");
const exitGame = document.querySelector("#exit-game");
const toggle = document.querySelector("#toggle-menu");
const nav = document.querySelector(".nav");
const start = document.querySelector("#start");
const singleplayer = document.querySelector("#singleplayer");
const multiplayer = document.querySelector("#multiplayer");
const exitApp = document.querySelector("#exit-app");
const home = document.querySelector("#home");
const footer = document.querySelector(".container > footer");

const gameStuces = new TicTacToeGame();

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
  size: 8,
  match: 4
}

const PvA = {
  player1: new PlayerMark(gameStuces, j1.name, j1.mark),
  player2: new IAPlayer(gameStuces, "cross"),
  difficult: "Normal",
  size: 10,
  match: 5
}

if (tictacApp.classList.contains("invisible")) {
  // toggle.parentElement.classList.add("invisible");
}

let mode = PvA;
// console.log(gameStuces);

resume.addEventListener("click", finPause);

restart.addEventListener("click", () => {
  finPause();
  gameStuces.restart(mode);
});

toggle.addEventListener("click", () => {
  if (nav.className.includes("-appear")) {
    finPause();
  } else {
    pause();
  }
});

multiplayer.addEventListener("click", () => {
  tictacApp.classList.remove("invisible");
  toggle.parentElement.classList.remove("invisible");
  tictacApp.classList.add("game-appear");
  toggle.parentElement.classList.add("header-appear");

  mode = PvP;

  const size = mode.match > 3 ? mode.size : 3;
  document.getElementById("board").classList.add(`x${size}`)

  setTimeout(() => gameStuces.initGame(mode), 1000);

  home.classList.add("invisible");
});

singleplayer.addEventListener("click", () => {
  tictacApp.classList.remove("invisible");
  toggle.parentElement.classList.remove("invisible");
  tictacApp.classList.add("game-appear");
  toggle.parentElement.classList.add("header-appear");

  mode = PvA;

  const size = mode.size > 3 ? mode.size : 3;
  document.getElementById("board").classList.add(`x${size}`)

  setTimeout(() => gameStuces.initGame(mode), 1000);

  home.classList.add("invisible");
});

exitGame.addEventListener("click", () => {
  finPause();
  tictacApp.classList.add("invisible");
  toggle.parentElement.classList.add("invisible");

  tictacApp.classList.remove("game-appear");
  toggle.parentElement.classList.remove("header-appear");
  home.classList.remove("invisible");
  gameStuces.exit();
  gameStuces = null;
});

exitApp.addEventListener("click", () => {
  if (window.confirm("Êtes-vous sûr de quitter ?"))
    window.close();
  // console.log(close());
})

function pause() {
  nav.classList.add("nav-appear");
  footer.classList.remove("footer-appear");
}

function finPause() {
  nav.classList.remove("nav-appear");
  footer.classList.add("footer-appear");
}