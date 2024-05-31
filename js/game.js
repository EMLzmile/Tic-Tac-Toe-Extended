function TicTacToeGame(size) {
  this.requiredMatches;
  this.difficult;
  this.board = new Board(this, size);
  this.winner = null;
  this.winnerName;

  this.initGame = (mode) => {
    this.player1 = mode.player1;
    this.player2 = mode.player2;
    this.difficult = mode.difficult;
    this.requiredMatches = mode.match;
    this.board.initializeBoard();

    const who = Math.floor(Math.random() * 11);

    if (who % 2 == 1) {
      this.currentPlayer = this.player1;
    } else {
      this.currentPlayer = this.player2;
    }
    setTimeout(this.nextTour, 3000);
  }

  this.nextTour = () => {
    const verf = this.checkForWin();

    if (verf == -1) {
      this.winnerName = "Match nul";
      this.winner = this.player1.tour;
      this.winner.classList.add("drawn");
      console.log(this.winnerName)
    } else if (verf == 1) {
      this.isWin(this.currentPlayer);
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
        setTimeout(()=>{
        while (!this.currentPlayer.play() && arret < 1) arret++;
        this.nextTour();
        }, 1500);
        console.log('name : ' + this.currentPlayer.playerName)
      }
    }
  }

  this.isWin = (player) => {
    this.winner = player.tour;
    this.winnerName = player.playerName;
    this.winner.classList.add("winning");
  }

  this.checkForWin = () => {
    // this.board.allWorth();
    if (this.board.isPlain()) {
      console.log("It is plain");
      return -1;
    } else if (this.currentPlayer.win) {
      return 1;
    } else {
      // console.log("Continued to play")
      return 0;
    }
  }

  this.restart = (mode) => {
    this.board.reset();
    this.player1.playerCells.clear();
    this.player2.playerCells.clear();
    this.currentPlayer.win = false;

    if (this.winner) {
      this.winner.classList.remove("winning", "drawn");
      this.winner = null;
    }
    this.initGame(mode);
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
        }, 30 * att);
        att++;
      }
    }
  }

  this.eventCellElement = function eventCellElement() {};

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

    for (let value of boardValues) {
      const me = value.coord().toString();

      if (me == elA.toString()) {
        if (value2 != null)
          return [value.boardCellElement, ...value2];

        return [value.boardCellElement];
      }
    }
  }

  this.getBoardCell = function getBoardCell(el) {
    if (el instanceof Array) {
      let cell;
      this.boardCells.values().some((cellItem) => {
        if (el.toString() === cellItem.coord().toString()) {
          cell = cellItem;
          return cellItem;
        }
      });
      // console.log(cell);
      return cell;
    } else {
      throw new Error("Ne peut pas recevoir autre chose qu'un Array en argument");
      return null;
    }
  }

  this.isValidPos = (cellPos) => {
    const a = cellPos[0],
      b = cellPos[1];
    if (a >= 0 && b < this.boardSize)
      if (a < this.boardSize && b > 0) return true;


    return false;
  }

  this.updateCell = function updateCell(cell, mark) {

    this.directions.forEach(dir => {

      let neighborLenght = Math.floor(this.game.requiredMatches / 2);

      const neighborPos = [...cell.coord()];

      while (this.isValidPos(neighborPos) && neighborLenght > 0) {

        neighborPos[0] += dir[0];
        neighborPos[1] += dir[1];

        const neighbor = this.getBoardCell(neighborPos);

        if (neighbor && !neighbor.isMarked()) {
          neighbor.worth[mark]++;
        } else {
          break;
        }
        neighborLenght--;
      }

    });

  }

  this.update = function update(cell, mark) {
    this.updateCell(cell, mark);
    // return [min, max];
  }

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
}

function BoardCell(coord, cell) {
  this.a = coord[0];
  this.b = coord[1];
  this.boardCellElement = cell;
  this.playerMarkSymbol = null;
  this.worth = { rond: 0, cross: 0 };

  this.isMarked = () => this.playerMarkSymbol !== null;

  this.marked = function(mark) {
    if (this.isMarked()) return false;

    this.boardCellElement.classList.add(mark);
    this.playerMarkSymbol = mark;
    return true;
  }

  this.coord = () => [this.a, this.b];

  this.isEqual = (other) => this.a === other.a && this.b == other.b;

  this.clear = () => {
    this.boardCellElement.remove();
    this.playerMarkSymbol = null;
    this.a = null;
    this.b = null;
  }
}

class PlayerMark {
  constructor(game, name = "Player", mark) {
    this.playerName = name;
    this.playerMarkSymbol = mark;
    this.playerCells = new Set();
    this.index = this.playerMarkSymbol == "rond" ? 0 : 1;
    this.game = game;
    this.win = false;

    this.tour = document.querySelector(".player-mark");
  }

  isEqual = (other) => (this.playerMarkSymbol === other.playerMarkSymbol) ? true : false;

  registerPlayedCell = (element) => {
    this.playerCells.add(element);
    this.game.currentCell = element;

    this.game.board.update(element, this.playerMarkSymbol);

    const surroundPlays = this.checkSurroundingPlays(element);

    for (const surround of surroundPlays) {
      let dist = this.distance(surround[0], surround[1]);
      // console.log(surround[0], surround[1]);
      if (dist >= this.game.requiredMatches) {
        this.win = true;
        this.game.board.getCellElements(...surround)
          .forEach(cellule => {
            cellule.classList.add("winning")
          });
        this.game.nextTour();
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
    } else if (elA instanceof BoardCell && elB instanceof Array) {
      a = Math.abs(elA.a - elB[0]);
      b = Math.abs(elA.b - elB[1]);
    } else if (elA instanceof Array && elB instanceof BoardCell) {
      a = Math.abs(elA[0] - elB.a);
      b = Math.abs(elA[0] - elB.b);
    } else if (elA instanceof Array && elB instanceof Array) {
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
    if (elA instanceof BoardCell && elB instanceof BoardCell) {
      x = elA.a - elB.a;
      y = elA.b - elB.b;
    } else if (elA instanceof BoardCell && elB instanceof Array) {
      x = elA.a - elB[0];
      y = elA.b - elB[1];
    } else if (elA instanceof Array && elB instanceof BoardCell) {
      x = elA[0] - elB.a;
      y = elA[0] - elB.b;
    } else if (elA instanceof Array && elB instanceof Array) {
      x = elA[0] - elB[0];
      y = elA[1] - elB[1];
    } else {
      console.error(
        `Erreur : Mauvaises valeurs fournies\n
        Méthode direction\n
        Class PlayerMark`
      );
      x = 0;
      y = 0;
    }

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

}

class IAPlayer extends PlayerMark {
  constructor(game, mark) {
    super(game, "Zmile IA", mark);
    this.strategies = [
      this.defensiveStrategy,
      this.offensiveStrategy
    ];
  }

  play() {
    // Choisir une stratégie en fonction du niveau
    // let strategy = this.strategies[game.difficult];

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
        // console.log(cell.a, cell.b);
        return cellule;
      }
    });

    // console.log(cellules);

    let bestMove = this.tactique(cellules);
    console.log(bestMove.coord())

    return super.play(bestMove);
  }

  #hasard = () => Math.floor(Math.random() * 8);

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

    if (danger >= asset || danger + 2 >= this.game.requiredMatches) {
      bestMove = this.checkMoveToPlays(dangers);
    } else if (danger < asset || asset + 2 >= this.game.requiredMatches) {
      bestMove = this.checkMoveToPlays(assets);
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

    let bestElements = this.#bestDirection(availableCells)

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