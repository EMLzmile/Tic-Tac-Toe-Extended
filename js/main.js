import { TicTacToeGame, PlayerMark, IAPlayer } from './game.js';


//Load webpage before action
document.addEventListener('DOMContentLoaded', () => {
  // Get home elements
  const home = document.querySelector("#home");
  const singleplayer = document.querySelector("#singleplayer");
  const multiplayer = document.querySelector("#multiplayer");
  const exitApp = document.querySelector("#exit-app");

  // Get game elements
  const tictacApp = document.querySelector(".tictac-app");
  const playerNames = document.querySelectorAll(".name-player");
  const board = document.querySelector("#board");
  const toggle = document.querySelector("#toggle-menu");

  // Get nav-pause elements
  const nav = document.querySelector(".nav");
  const resume = document.querySelector("#resume");
  const restart = document.querySelector("#restart");
  const exitGame = document.querySelector("#exit-game");
  const footer = document.querySelector(".about-container > footer");

  const gameStuces = new TicTacToeGame();

  const sizes = {
    "3": [
      { value: "3", text: "3x3" }
  ],
    "4": [
      { value: "6", text: "6x6" },
      { value: "8", text: "8x8" },
      { value: "10", text: "10x10" },
      { value: "12", text: "12x12" }
  ],
    "5": [
      { value: "10", text: "10x10" },
      { value: "12", text: "12x12" }
  ],
    "6": [
      { value: "12", text: "12x12" }
  ]
  };

  const modeGame = {
      mode: "pva",
      player1: new PlayerMark(gameStuces,"Player1", "rond"),
      player2: new PlayerMark(gameStuces, "Player2", "cross"),
      size: 3,
      match: 3,
      setGameMode: function (mode, player1, player2, size, match) {
        this.mode = mode;
        this.player1 = player1;
        this.player2 = player2;
        this.size = size;
        this.match = match;
      }
    }
  let numPopup = 0;


  let mode="pva";

  singleplayer.addEventListener("click", () => {
    mode = "pva";

    createPopup();
  });
  
  multiplayer.addEventListener("click", () => {
    mode = "pvp";
    
    createPopup();
  });

  exitApp.addEventListener("click", () => {
    if (window.confirm("Êtes-vous sûr de quitter ?"))
      window.close();
  })

  toggle.addEventListener("click", () => {
    if (nav.className.includes("-appear")) {
      finPause();
    } else {
      pause();
    }
    // choiceMode();
  });

  resume.addEventListener("click", finPause);

  restart.addEventListener("click", () => {
    finPause();

    gameStuces.restart(modeGame);
  });

  exitGame.addEventListener("click", () => {
    if (confirm("Voulez-vous vraiment quitter la partie ?")) {
      finPause();
      addClass(tictacApp,"invisible");
      addClass(toggle.parentElement,"invisible");

      board.classList.remove(`x${modeGame.size}`)

      tictacApp.classList.remove("game-appear");
      toggle.parentElement.classList.remove("header-appear");
      home.classList.remove("invisible");
      gameStuces.exit();
    }
    // gameStuces = null;
  });

  function pause() {
    addClass(nav,"nav-appear");
    addClass(footer,"footer-appear");
  }

  function finPause() {
    nav.classList.remove("nav-appear");
    footer.classList.remove("footer-appear");
  }

  function createPopup() {
    const popup = document.createElement("div");
    addClass(popup,"popup");

    numPopup++;

    const h2Popup = document.createElement("h2");
    if (mode === "pvp") {
      h2Popup.textContent = `Player${numPopup}`;
    } else {
      h2Popup.textContent = "Choice mode";
    }
    h2Popup.setAttribute("id", "title-popup");
    popup.appendChild(h2Popup);

    if (mode === "pva") {
      const labelInput = document.createElement("label");
      labelInput.setAttribute("for", "input-name");
      labelInput.innerText = "Player : "
      const inputPopup = document.createElement("input");
      inputPopup.setAttribute("id", "input-name");
      inputPopup.placeholder = "Your name";
      popup.append(labelInput, inputPopup);
    } else {
      const markGroup = document.createElement("div");
      addClass(markGroup,"mark-group");

      const labelRond = document.createElement("label");
      labelRond.setAttribute("for", "rond");
      labelRond.textContent = "O";
      const markO = document.createElement("input");
      markO.type = "radio";
      markO.checked = true;
      markO.name = "mark-player";
      markO.value = "rond";
      markO.setAttribute("id", "rond");
      const labelCross = document.createElement("label");
      labelCross.setAttribute("for", "cross");
      labelCross.textContent = "X";
      const markX = document.createElement("input");
      markX.type = "radio";
      markX.name = "mark-player";
      markX.value = "cross";
      markX.setAttribute("id", "cross");
      popup.appendChild(markGroup).append(markO, labelRond, markX, labelCross);
    }
    const labelMatchGame = document.createElement("label");
    labelMatchGame.setAttribute("for", "match-game");
    labelMatchGame.innerText = "Match to goal: "
    const matchGame = document.createElement("select");
    matchGame.setAttribute("id", "match-game");
    for (const match in sizes) {
      const choice = document.createElement("option");
      choice.value = match;
      choice.textContent = match;
      matchGame.appendChild(choice);
    }
    popup.append(labelMatchGame, matchGame);

    const labelSizeBoard = document.createElement("label");
    labelSizeBoard.setAttribute("for", "size");
    labelSizeBoard.innerText = "Size of board: "
    const sizeBoard = document.createElement("select");
    sizeBoard.setAttribute("id", "size");
    popup.append(labelSizeBoard, sizeBoard);

    const btnBox = document.createElement("div");
    addClass(btnBox,"btns-box");
    const btnConfirm = document.createElement("button");
    addClass(btnConfirm,"btn-confirm");
    btnConfirm.textContent = "Play";
    const btnCancel = document.createElement("button");
    addClass(btnCancel,"btn-cancel");
    btnCancel.textContent = "Cancel";
    btnBox.append(btnConfirm, btnCancel);
    addClass(btnBox,"flex-around");
    popup.appendChild(btnBox);

    document.querySelector(".container").prepend(popup);

    matchGame.addEventListener("change", updateSize);

    btnConfirm.addEventListener("click", start);
    btnCancel.addEventListener("click", function() {
      document.querySelector(".popup").remove();
    });
  }

  function updateSize() {
    let match = this.value;

    const sizeBoard = document.querySelector("#size");
    sizeBoard.innerHTML = "";

    sizes[match].forEach(function(option) {
      var optionElement = document.createElement("option");
      optionElement.value = option.value;
      optionElement.textContent = option.text;
      sizeBoard.appendChild(optionElement);
    });
  }

  function start() {
    let name = document.querySelector("#input-name");
    let match = document.querySelector("#match-game").value;
    let size = document.querySelector("#size").value;
    let mark = document.querySelector(".mark-group input:checked");
    if(mode == "pvp"){
      mark = mark.value || "rond";
      name = "Player1";
    }
    else {
      mark = Math.floor(Math.random()*2) == 0 ? "rond" : "cross";
      name = name ? name.value : "Player";
    }

    playerNames[0].innerHTML = name || "Player";
    // document.querySelector("")
    const player1 = new PlayerMark(gameStuces, name, mark);

    document.querySelector(".popup").remove();
    const mark2 = mark == "rond" ? "cross" : "rond";
    console.log(mark, mark2);
    var player2;
    if (mode == "pvp") {
      player2 = new PlayerMark(gameStuces, "Player2", mark2);
      playerNames[1].innerHTML = "Player2";
    } else {
      player2 = new IAPlayer(gameStuces, mark2, "normal");
      playerNames[1].innerHTML = "Zmile AI";
    }

    modeGame.setGameMode(mode, player1, player2, size, match);
    
    addClass(board, `x${size}`);

    tictacApp.classList.remove("invisible");
    toggle.parentElement.classList.remove("invisible");
    addClass(tictacApp, "game-appear");
    addClass(toggle.parentElement, "header-appear");

    setTimeout(() => gameStuces.initGame(modeGame), 1000);
    addClass(home, "invisible");
  }

  function addClass(element, ...classes) {
    for (const classe of classes) {
      element.className = element.className.concat(` ${classe}`);
    }
    return element.className;
  }
});