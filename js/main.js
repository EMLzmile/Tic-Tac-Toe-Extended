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
const footer = document.querySelector(".about-container > footer");
// console.log(footer.firstChild)
const gameStuces = new TicTacToeGame();

let j1 = {
  name: "EMLzmile",
  mark: "rond"
}
let j2 = {
  playerName: "Zmile IA",
  mark: "cross"
}

const playerMark = document.querySelector(".player-mark");

// playerMark.addEventListener("change", (e) => {
//     const mark = e.target;
//     if (mark.classList.length > 1) {
//       console.log(mark.classList[2]);
//       const result = document.getElementById(`${mark.classList[2]}`)
//       result.innerHTML = 1*result.innerText+ 1;
//     }
//     console.log("hum")
// });

if (tictacApp.classList.contains("invisible")) {
  // toggle.parentElement.classList.add("invisible");
}

let mode;
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
  // choiceMode();
});

multiplayer.addEventListener("click", () => {
  const PvP = {
    mode: "PvP",
    player1: new PlayerMark(gameStuces, j1.name, j1.mark),
    player2: new PlayerMark(gameStuces, j2.name, j2.mark),
    size: 8,
    match: 4
  }

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
  const PvA = {
    mode: "PvA",
    player1: new PlayerMark(gameStuces, j1.name, j1.mark),
    player2: new IAPlayer(gameStuces, "cross", "Normal"),
    size: 8,
    match: 4
  }

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
  if (confirm("Voulez-vous vraiment quitter la partie ?")) {
    finPause();
    tictacApp.classList.add("invisible");
    toggle.parentElement.classList.add("invisible");

    document.getElementById("board").classList.remove(`x${mode.size}`)

    tictacApp.classList.remove("game-appear");
    toggle.parentElement.classList.remove("header-appear");
    home.classList.remove("invisible");
    gameStuces.exit();
  }
  // gameStuces = null;
});

exitApp.addEventListener("click", () => {
  if (window.confirm("Êtes-vous sûr de quitter ?"))
    window.close();
  // console.log(close());
})

function choiceMode() {
  const popup = document.createElement("div");
  const formPopup = document.createElement("form");
  const h1Popup = document.createElement("h1");
  const inputPopup = document.createElement("input");
  const btnPopup = document.createElement("button");

  h1Popup.classList.add("h1-popup");
  h1Popup.innerHTML = "Your Name:"
  inputPopup.classList.add("input-popup");
  inputPopup.value = "Player1"
  btnPopup.classList.add("btn-popup");
  btnPopup.innerHTML = "OK"

  formPopup.method = "post";
  // formPopup.className = formPopup.className.concat(" form-popup flex-around");
  console.log(addClass(formPopup, "form-popup", "flex-column-wrap", "flex-around"));
  formPopup.appendChild(h1Popup);
  formPopup.appendChild(inputPopup);
  formPopup.appendChild(btnPopup);

  popup.className = popup.className.concat(" popup");
  popup.appendChild(formPopup);

  document.querySelector(".container").appendChild(popup);
}

function pause() {
  nav.classList.add("nav-appear");
  footer.classList.add("footer-appear");
}

function finPause() {
  nav.classList.remove("nav-appear");
  footer.classList.remove("footer-appear");
}

function addClass(element, ...classes) {
  for (const classe of classes) {
    element.className = element.className.concat(` ${classe}`);
  }
  return element.className;
}