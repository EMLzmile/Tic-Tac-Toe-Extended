function TicTacToeGame() {
  this.requiredMatches;
  this.winner = null;
  this.moves = [];
  this.winnerName;
  this.currentMove;
  
  let match = 1;
  let resultW = document.getElementById("win");
  let resultL = document.getElementById("lose");

  this.initGame = (mode) => {
    this.mode = mode.mode || "PvA";
    this.board = new Board(this, mode.size || 10);
    this.player1 = mode.player1;
    this.player2 = mode.player2;
    this.requiredMatches = mode.match || 5;
    this.board.initializeBoard();
    document.getElementById("match").innerHTML = match;

    const who = Math.floor(Math.random() * 11);

    if (who % 2 == 1) {
      this.currentPlayer = this.player1;
    } else {
      this.currentPlayer = this.player2;
    }
    setTimeout(this.nextTour, 4000);
  }

  this.nextTour = () => {
    const verf = this.checkForWin();
    const lastPlay = this.moves[this.moves.length-1];
    
    if(this.board.isValidPos(this.currentPlayer.lastMove.coord())) {
      if(lastPlay)
        lastPlay.move.boardCellElement.classList.remove("recent")
      this.moves.push({
        player: this.currentPlayer,
        move: this.currentPlayer.lastMove
      });
      this.currentPlayer.lastMove.boardCellElement.classList.add("recent");
    }
    
    
    if (verf == 1) {
      console.log('ousbeee')
      this.isWin(this.currentPlayer);
    } else if (verf == -1) {
      const result = document.getElementById(`drawn`);
      result.innerHTML++;

      this.winnerName = "Match nul";
      this.winner = this.player1.tour;
      this.winner.classList.add("drawn");
      console.log(this.winnerName)
    } else {
      this.currentPlayer.tour.classList.remove(`current-player${this.currentPlayer.index}`);

      if (this.currentPlayer.isEqual(this.player2)) {
        this.currentPlayer = this.player1;
      } else {
        this.currentPlayer = this.player2;
      }

      this.currentPlayer.tour.classList.add(`current-player${this.currentPlayer.index}`);
      if (this.currentPlayer instanceof IAPlayer) {
        let arret = 0;
        setTimeout(() => {
          while (!this.currentPlayer.play() && arret < 15) arret++;
          this.nextTour();
        }, 1000);
      }
    }
  }

  this.isWin = (player) => {
    let result;
    if (player.constructor === PlayerMark) {
      resultW.innerHTML++;
    } else if(this.mode == "PvA") {
      resultL.innerHTML++;
    }

    this.winner = player.tour;
    this.winnerName = player.playerName;
    this.winner.classList.add("win");
  }

  this.checkForWin = () => {
    // this.board.allWorth();
    if (this.board.isPlain() && !this.currentPlayer.win) {
      console.log("It is plain");
      return -1;
    } else if (this.currentPlayer.win) {
      return 1;
    } else {
      return 0;
    }
  }

  this.restart = (mode) => {
    this.board.reset();
    this.player1.playerCells.clear();
    this.player1.tour.classList.remove("current-player0", "current-player1")
    this.player2.playerCells.clear();
    this.currentPlayer.win = false;

    if (this.winner) {
      this.winner.classList.remove("win", "drawn");
      this.winner = null;
    } else {
      match--;
    }
    match++;
    this.initGame(mode);
  }

  this.exit = () => {
    this.board.clear();
    this.player1.clear();
    this.player2.clear();
    if (this.winner) {
      this.winner.classList.remove("win", "drawn");
      this.winner = null;
    } else {
      resultL.innerHTML++;
    }
    match++;
    // this = null;
  }
}

function Board(game, size) {
  this.boardSize = size || 10;
  this.boardCells = new Set();
  this.game = game;
  this.directions = [
    [0, 1], [0, -1],
    [1, 1], [-1, -1],
    [1, 0], [-1, 0],
    [-1, 1], [1, -1]
  ];

  let board = document.querySelector("#board");

  this.initializeBoard = function initializeBoard() {
    let att = 0;
    for (let j = this.boardSize - 1; j >= 0; j--) {
      for (let i = 0; i < this.boardSize; i++) {
        setTimeout(() => {
          const div = document.createElement("div");
          div.classList.add("case");
          board.appendChild(div);

          const cell = new BoardCell([i, j], div);
          this.boardCells.add(cell);

          const kases = this.boardCells;

          this.eventCellElement = function eventCellElement() {
            if (game.winner !== null) {
              for (let cellule of kases) {
                cellule.boardCellElement.removeEventListener("click", this.eventCellElement);
              }
            } else if (game.currentPlayer.play(cell)) {
              game.nextTour();
            }
          }

          div.addEventListener("click", this.eventCellElement);

        }, (200 / this.boardSize) * att);

        att++;
      }
    }

    setTimeout(() => this.initializeNeighbors(), 3000);
  }

  this.eventCellElement = function eventCellElement() {};

  this.initializeNeighbors = function initializeNeighbors() {
    this.boardCells.forEach(cell => {
      this.directions.forEach(dir => {
        let neighborLenght = Math.floor(this.game.requiredMatches / 2);

        const neighborPos = [...cell.coord()];

        let d = '';

        while (this.isValidPos(neighborPos) && neighborLenght > 0) {
          neighborPos[0] += dir[0];
          neighborPos[1] += dir[1];

          if (dir[0] == 0 && dir[1]) {
            d = 'V'
          } else if (dir[1] == 0 && dir[0]) {
            d = 'H'
          } else if (dir[0] == dir[1]) {
            d = 'OD'
          } else {
            d = 'OG'
          }

          const neighbor = this.getBoardCell(neighborPos);

          if (neighbor) {
            cell.addNeighbors(d, neighbor);
          } else {
            break;
          }

          neighborLenght--;
        }
      });
    });
  }

  this.updateNeighbors = function updateNeighbors() {
    this.boardCells.forEach(cell => {
      const mark = cell.playerMarkSymbol;

      if (mark)
        for (const dir in cell.neighbors) {
          let suite = false;
          cell.neighbors[dir].forEach(neighbor => {
            if (mark == neighbor.playerMarkSymbol) {
              // return el;
              cell.addNeighbors(dir, ...neighbor.neighbors[dir]);
              neighbor.addNeighbors(dir, ...cell.neighbors[dir]);
            }

            suite = true;
          });
        }
    });
  }

  this.getCellElements = function getCellElements(elA, elB = null) {
    let boardValues = this.boardCells.values();
    let value2 = null;
    let a = elA[0],
      b = elA[1];

    if (elB === null) elB = elA;
    else {
      if (new PlayerMark().distance(elA, elB) > 0) {
        if (a < elB[0]) {
          a++;
        } else if (a > elB[0]) {
          a--;
        }

        if (b < elB[1]) {
          b++;
        } else if (b > elB[1]) {
          b--;
        }
        value2 = [...this.getCellElements(elB, [a, b])];
      }
    }

    const value = this.getBoardCell(elA);

    if (value) {
      if (value2)
        return [value.boardCellElement, ...value2];

      return [value.boardCellElement];
    }

  }

  this.getBoardCell = function getBoardCell(el) {
    if (Array.isArray(el)) {
      let cell;
      this.boardCells.values().some((cellItem) => {
        if (el.toString() === cellItem.coord().toString()) {
          cell = cellItem;
          return cellItem;
        }
      });

      return cell;
    } else {
      throw new Error("Ne peut pas recevoir autre chose qu'un Array en argument");
      return null;
    }
  }

  this.isValidPos = (cellPos) => {
    const a = cellPos[0],
      b = cellPos[1];

    return (a >= 0 && a < this.boardSize) && (b >= 0 && b < this.boardSize);
  }

  this.updateCell = function updateCell(cell, mark) {
    console.log(cell.coord().toString());

    // this.directions.forEach(dir => {

    //   let neighborLenght = Math.floor(this.game.requiredMatches / 2);

    //   const neighborPos = [...cell.coord()];
    //   let previousNeighbor = this.getBoardCell(neighborPos);
    //   let suite = false;
    //   let value = 1;

    //   while (this.isValidPos(neighborPos) && neighborLenght > 0) {

    //     neighborPos[0] += dir[0];
    //     neighborPos[1] += dir[1];

    //     const neighbor = this.getBoardCell(neighborPos);

    //     if (neighbor) {
    //       if (!neighbor.isMarked()) {
    //         if (!suite) neighbor.worth[mark] += value;
    //         else if (neighbor.worth[mark]) neighbor.worth[mark] -= value;
    //       } else if (previousNeighbor.playerMarkSymbol === mark && neighbor.playerMarkSymbol === mark) {
    //         // if(mark === previousNeighbor.mark)
    //         value++;
    //         neighborLenght++;
    //       } else {
    //         suite = true;
    //         // value = 1;
    //       }
    //     } else {
    //       break;
    //     }
    //     previousNeighbor = neighbor;
    //     neighborLenght--;
    //     console.log(
    //       neighborPos.toString(),
    //       'reste : ' + neighborLenght,
    //       'worth : ' + neighbor.worth[mark],
    //       value
    //     );
    //   }

    // });

    cell.neighbors.forEach(neighbor => {
      if (!neighbor.isMarked()) {
        neighbor.worth[mark] += 1;
      } else {
        neighbor.worth[mark] = 0;
      }
    })

  }

  // this.update = function update(cell, mark) {
  //   this.updateCell(cell, mark);
  //   // Ré-évaluer le score des voisins modifiés
  //   // Object.values(this.neighbors).forEach(neighbor => {
  //   //   this.updateCell(neighbor);
  //   // });

  //   // return [min, max];
  // }

  this.allWorth = function allWorth() {
    this.boardCells.forEach(cell => {
      if (cell.worth.rond || cell.worth.cross)
        console.log(`x=${cell.a}, y=${cell.b} => ${cell.worth.rond}, ${cell.worth.cross}`)
    })
  }

  this.add = function add(element) {
    return this.case.add(element);
  }

  this.isPlain = function isPlain() {
    let count = 0;
    this.boardCells.forEach(cell => {
      if (cell.isMarked()) {
        count++;
      }
    });
    if (count >= Math.pow(this.boardSize, 2)) {
      return true;
    }
    return false;
  }

  this.reset = function reset() {
    for (let cellule of this.boardCells) {
      cellule.clear();
    }
  }

  this.clear = function clear() {
    this.reset();
    this.boardCells.clear();
  }
}

function BoardCell(coord = [-1, -1], cell = document.createElement("div")) {
  this.a = coord[0];
  this.b = coord[1];
  this.boardCellElement = cell;
  this.playerMarkSymbol = null;
  this.neighbors = {
    H: [],
    V: [],
    OD: [],
    OG: []
  };
  this.worth = { rond: 0, cross: 0 };

  this.isMarked = () => this.playerMarkSymbol !== null;

  this.marked = function(mark) {
    if (this.isMarked()) return false;

    this.boardCellElement.classList.add(mark);
    this.playerMarkSymbol = mark;

    this.update();
    return true;
  }

  this.coord = () => [this.a, this.b];

  this.isEqual = (other) => this.a === other.a && this.b == other.b;

  this.addNeighbors = function(dir, ...cells) {
    cells.forEach(cell => {
      if (0 > this.neighbors[dir].indexOf(cell))
        this.neighbors[dir].push(cell);
    });
    this.neighbors[dir].sort((a, b) => a.a - b.a || a.b - b.b);
  }

  this.removeNeighbors = function(dir, cell) {
    this.neighbors[dir] = this.neighbors[dir].filter(el => {
      if (!cell.isEqual(el)) {
        return el;
      }
    })
  }

  this.update = function update() {
    console.log(this.coord());
    this.worth.rond = 0;
    this.worth.cross = 0;

    const mark = this.playerMarkSymbol;

    for (const dir in this.neighbors) {
      let value = 1;

      for (const neighbor of this.neighbors[dir]) {
        if (!neighbor.isMarked())
          neighbor.worth[mark] += value;
        else {
          if (neighbor.playerMarkSymbol == mark) {
            value++;
          } else {
            neighbor.worth[mark] = 0;
          }
        }
      }
      // console.log(...this.neighbors[dir].toString());
    }

  }

  this.clear = () => {
    this.boardCellElement.remove();
    this.playerMarkSymbol = null;
    this.a = null;
    this.b = null;
  }
}

class PlayerMark {
  constructor(game = new TicTacToeGame(), name = "Player", mark = "rond") {
    this.playerName = name;
    this.playerMarkSymbol = mark;
    this.playerCells = new Set();
    this.index = this.playerMarkSymbol == "rond" ? 0 : 1;
    this.game = game;
    this.win = false;
    this.lastMove = new BoardCell();

    this.tour = document.querySelector(".player-mark");
  }

  isEqual = (other) => (this.playerMarkSymbol === other.playerMarkSymbol) ? true : false;

  registerPlayedCell = (element) => {
    this.playerCells.add(element);
    this.lastMove = element;

    this.game.board.updateNeighbors(element);

    const surroundPlays = this.checkSurroundingPlays(element);

    for (const surround of surroundPlays) {
      let dist = this.distance(surround[0], surround[1]) + 1;

      if (dist >= this.game.requiredMatches) {
        this.win = true;
        this.game.board.getCellElements(...surround)
          .forEach(cellule => {
            cellule.classList.add("win")
          });
        // break;
      }
    }
  }

  checkSurroundingPlays = (element) => {
    let i = element.a,
      j = element.b;
    let minMax = [element.coord(), element.coord()];
    let lien = [];


    minMax = this.hasMe([i + 1, j]) ?
      (this.hasMe([i - 1, j]) ? [[i + 1, j], [i - 1, j]] : [[i + 1, j], element.coord()]) :
      (this.hasMe([i - 1, j]) ? [element.coord(), [i - 1, j]] : [element.coord(), element.coord()]);

    lien[0] = this.parcours(minMax[0], minMax[1]);

    minMax = this.hasMe([i + 1, j + 1]) ?
      (this.hasMe([i - 1, j - 1]) ? [[i + 1, j + 1], [i - 1, j - 1]] : [[i + 1, j + 1], element.coord()]) :
      (this.hasMe([i - 1, j - 1]) ? [element.coord(), [i - 1, j - 1]] : [element.coord(), element.coord()]);

    lien[1] = this.parcours(minMax[0], minMax[1]);

    minMax = this.hasMe([i + 1, j - 1]) ?
      (this.hasMe([i - 1, j + 1]) ? [[i + 1, j - 1], [i - 1, j + 1]] : [[i + 1, j - 1], element.coord()]) :
      (this.hasMe([i - 1, j + 1]) ? [element.coord(), [i - 1, j + 1]] : [element.coord(), element.coord()]);

    lien[2] = this.parcours(minMax[0], minMax[1])

    minMax = this.hasMe([i, j + 1]) ?
      (this.hasMe([i, j - 1]) ? [[i, j + 1], [i, j - 1]] : [[i, j + 1], element.coord()]) :
      (this.hasMe([i, j - 1]) ? [element.coord(), [i, j - 1]] : [element.coord(), element.coord()]);

    lien[3] = this.parcours(minMax[0], minMax[1])

    return lien;
  }

  parcours = (max, min) => {
    switch (this.direction(min, max)) {
      case "OD":
        for (let i = 0; i < this.game.requiredMatches; i++) {
          if (this.hasMe([max[0] + 1, max[1] + 1])) {
            max[0]++;
            max[1]++;
          } else {
            break;
          }
        }
        for (let i = 0; i < this.game.requiredMatches; i++) {
          if (this.hasMe([min[0] - 1, min[1] - 1])) {
            min[0]--;
            min[1]--;
          } else {
            break;
          }
        }
        break;
      case "H":
        for (let i = 0; i < this.game.requiredMatches; i++) {
          if (this.hasMe([max[0] + 1, max[1]])) {
            max[0]++;
          } else {
            break;
          }
        }
        for (let i = 0; i < this.game.requiredMatches; i++) {
          if (this.hasMe([min[0] - 1, min[1]])) {
            min[0]--;
          } else {
            break;
          }
        }
        break;
      case "V":
        for (let i = 0; i < this.game.requiredMatches; i++) {
          if (this.hasMe([max[0], max[1] + 1])) {
            max[1]++;
          } else {
            break;
          }
        }
        for (let i = 0; i < this.game.requiredMatches; i++) {
          if (this.hasMe([min[0], min[1] - 1])) {
            min[1]--;
          } else {
            break;
          }
        }
        break;
      case "OG":
        for (let i = 0; i < this.game.requiredMatches; i++) {
          if (this.hasMe([max[0] + 1, max[1] - 1])) {
            max[0]++;
            max[1]--;
          } else {
            break;
          }
        }
        for (let i = 0; i < this.game.requiredMatches; i++) {
          if (this.hasMe([min[0] - 1, min[1] + 1])) {
            min[0]--;
            min[1]++;
          } else {
            break;
          }
        }
        break;

      case null:
        // return min;
        break;

      default:
        console.error('Erreur inattendu !')
        break;
    }

    return [min, max];
  }

  distance = (elA, elB) => {
    let a = Infinity,
      b = -Infinity;

    if (elA instanceof BoardCell && elB instanceof BoardCell) {
      a = Math.abs(elA.a - elB.a);
      b = Math.abs(elA.b - elB.b);
    } else if (elA instanceof BoardCell && Array.isArray(elB)) {
      a = Math.abs(elA.a - elB[0]);
      b = Math.abs(elA.b - elB[1]);
    } else if (Array.isArray(elA) && elB instanceof BoardCell) {
      a = Math.abs(elA[0] - elB.a);
      b = Math.abs(elA[0] - elB.b);
    } else if (Array.isArray(elA) && Array.isArray(elB)) {
      a = Math.abs(elA[0] - elB[0]);
      b = Math.abs(elA[1] - elB[1]);
    } else {
      console.error(
        `Erreur : Mauvaises valeurs fournies\n
        Méthode distance\n
        Class PlayerMark`
      );
    }

    // retourne a si b=0 ou a=b
    // retourne b si a=0
    // 0 dans le cas échéant 
    return (b == 0 || a == b) ? a : ((a == 0) ? b : 0);
  }

  hasMe = (el) => {
    const allCellElements = this.playerCells.values();

    return allCellElements.some((cell) => {
      if (el.toString() == cell.coord().toString()) {
        return cell;
      }
    })
  }

  play(cell) {
    const response = cell.marked(this.playerMarkSymbol);
    if (response) {
      this.registerPlayedCell(cell);
    }
    return response;
  }

  direction = (elA, elB) => {
    let x, y;
    
    if (elA instanceof BoardCell) {
      elA = elA.coord();
    } else if (!Array.isArray(elA)) {
      throw new error(`Mauvaises valeurs fournies`);
    }
    
    if (elB instanceof BoardCell) {
      elB = elB.coord();
    } else if (!Array.isArray(elB)) {
      throw new error(`Mauvaises valeurs fournies`);
    }
    
    x = elA[0] - elB[0];
    y = elA[1] - elB[1];
    
    // if (elA instanceof BoardCell && elB instanceof BoardCell) {
    //   x = elA.a - elB.a;
    //   y = elA.b - elB.b;
    // } else if (elA instanceof BoardCell && Array.isArray(elB)) {
    //   x = elA.a - elB[0];
    //   y = elA.b - elB[1];
    // } else if (Array.isArray(elA) && elB instanceof BoardCell) {
    //   x = elA[0] - elB.a;
    //   y = elA[0] - elB.b;
    // } else if (Array.isArray(elA) && Array.isArray(elB)) {
    //   x = elA[0] - elB[0];
    //   y = elA[1] - elB[1];
    // } else {
    //   throw new error(`Mauvaises valeurs fournies`);
    //   x = 0;
    //   y = 0;
    // }

    if (x == 0 && (y > 0 || y < 0)) {
      return 'V';
    } else if ((x > 0 || x < 0) && y == 0) {
      return 'H';
    } else if ((x - y == 0 || x + y == 0) && x != 0) {
      if (x == y) {
        return 'OD';
      } else {
        return 'OG';
      }
    } else {
      return null;
    }
  }

  clear = () => {
    this.playerName = "";
    this.playerCells.clear();
    this.win = false;
    this.tour.classList.remove(`current-player${this.index}`)
    this.playerMarkSymbol = "";
  }

}

class IAPlayer extends PlayerMark {
  constructor(game, mark, difficult = "normal") {
    super(game, "Zmile IA", mark);
    this.level = { easy: -1, normal: 0, hard: 1 } [difficult.toLowerCase()];
    console.log(this.level)
  }

  play() {
    // Choisir une stratégie en fonction du niveau
    // let strategy = this.strategies[this.level];

    // Appliquer la stratégie
    // let bestMove = strategy.call(this);

    let cellValues = [...this.game.board.boardCells.values()];

    cellValues = cellValues.filter(cell => {
      if (cell.worth.rond > 0 || cell.worth.cross > 0) {
        return cell;
      }
    });

    const cellules = cellValues.map((cell) => {
      const cellule = {
        asset: 0,
        danger: 0,
        cellPos: [0, 0]
      };
      const dangerMark = this.mark == "rond" ? "cross" : "rond";
      if (cell.worth.rond > 0 || cell.worth.cross > 0) {
        cellule.asset = cell.worth[this.mark] || 0;
        cellule.danger = cell.worth[dangerMark] || 0;
        cellule.cellPos = cell.coord();

        return cellule;
      }
    });

    let bestMove = this.tactique(cellules);
    console.log(bestMove.coord())

    return super.play(bestMove);
  }

  #hasard = () => Math.floor(Math.random() * this.game.requiredMatches);

  tactique = (cellValues = []) => {
    let bestMove;
    let danger = 0,
      asset = 0;
    const dangers = [[this.#hasard(), this.#hasard()]],
      assets = [[this.#hasard(), this.#hasard()]];


    cellValues.forEach(cellItem => {
      if (cellItem.danger > danger) {
        danger = cellItem.danger;
        dangers.splice(0, dangers.length, cellItem.cellPos);
      } else if (cellItem.danger == danger) {
        dangers.push(cellItem.cellPos)
      }

      if (cellItem.asset > asset) {
        asset = cellItem.asset;
        assets.splice(0, assets.length, cellItem.cellPos);
      } else if (cellItem.asset == asset) {
        assets.push(cellItem.cellPos);
      }
    });

    if (danger < asset || asset + 2 >= this.game.requiredMatches) {
      bestMove = this.checkMoveToPlays(assets);
    } else if (danger >= asset || danger >= this.game.requiredMatches - 2) {
      bestMove = this.checkMoveToPlays(dangers);
    } else {
      bestMove = this.checkMoveToPlays(dangers);
    }

    return bestMove;
  }

  checkMoveToPlays = (availableCells = []) => {
    // Analyser les positions gagnantes potentielles
    // et jouer à l'offensive
    let bestMove = this.game.board.getBoardCell(availableCells[0]);
    let bestFutur = this.futurDirect(availableCells[0]);

    if (availableCells.length == 1)
      return bestMove;

    let bestElements = this.#bestDirection(availableCells);

    for (let cellPos of bestElements) {
      let newFutur = this.futurDirect(cellPos);

      if (newFutur > bestFutur) {
        bestFutur = newFutur;
        bestMove = this.game.board.getBoardCell(cellPos);
      }
    }

    return bestMove;
  }

  #bestDirection(elementsPos = []) {
    let bestDir = [0, 'V', elementsPos[0]];

    elementsPos.forEach(currentPos => {
      let V = 0,
        H = 0,
        OD = 0,
        OG = 0;
      let currentDir = [0, 'V'];

      for (let otherPos of elementsPos) {
        const dir = this.direction(otherPos, currentPos);

        switch (dir) {
          case 'V':
            V++;
            break;
          case 'H':
            H++;
            break;
          case 'OD':
            OD++;
            break;
          case 'OG':
            OG++;
            break;

          default:
            break;
        }

        if (V > currentDir[0]) {
          currentDir[0] = V;
          currentDir[1] = 'V';
        }
        if (H > currentDir[0]) {
          currentDir[0] = H;
          currentDir[1] = 'H';
        }
        if (OD > currentDir[0]) {
          currentDir[0] = OD;
          currentDir[1] = 'OD';
        }
        if (OG > currentDir[0]) {
          currentDir[0] = OG;
          currentDir[1] = 'OG';
        }
      }

      if (currentDir[0] > bestDir[0]) {
        bestDir[0] = currentDir[0];
        bestDir[1] = currentDir[1];
        bestDir[2] = currentPos;
      }
    });

    let bestElements = elementsPos.filter((currentPos) => {
      if (this.direction(currentPos, bestDir[2]) == bestDir[1]) {
        return currentPos;
      }
    })


    return bestElements;
  }

  futurDirect(cellPos) {
    return Math.floor(Math.random() * 3) - 1;
  }
}

export { TicTacToeGame, PlayerMark, IAPlayer }