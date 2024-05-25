function TicTacToeGame(requiredMatches, difficult, size) {
    this.requiredMatches = requiredMatches || 4;
    this.difficult = difficult || "normal";
    this.board = new Board(this, size);
    this.winner = null;

    this.initGame = (player1 = { playerName: "Android 1", playerMarkSymbol: "rond" }, player2 = { playerName: undefined, playerMarkSymbol: undefined }) => {
        this.player1 = new PlayerMark(this, player1.playerName, player1.playerMarkSymbol);
        this.player2 = new PlayerMark(this, player2.playerName, player2.playerMarkSymbol);
        this.board.initializeBoard();

        const who = Math.floor(Math.random() * 11);

        if (who % 2 == 1) {
            this.currentPlayer = this.player1;
        } else {
            this.currentPlayer = this.player2;
        }
        setTimeout(this.nextTour, 3000)
        // this.nextTour();
    }

    this.nextTour = () => {
        this.currentPlayer.tour.classList.remove(`current-player${this.currentPlayer.index}`);

        if (this.currentPlayer.isEqual(this.player2)) {
            this.currentPlayer = this.player1;
        } else {
            this.currentPlayer = this.player2;
        }

        this.currentPlayer.tour.classList.add(`current-player${this.currentPlayer.index}`);
    }

    this.checkForWin = (player) => {
        this.winner = player;
        player.tour.classList.add("winning");
    }

    this.restart = () => {
        this.board.reset();
        this.player1.playerCells.clear();
        this.player2.playerCells.clear();

        if (this.winner) {
            this.winner.tour.classList.remove("winning");
            this.winner = null;
        }
        this.initGame(this.player1, this.player2);
        console.log(this.player1, "\n", this.player2)

    }




}

function Board(game, size) {
    this.boardSize = size || 10;
    this.boardCells = new Set();

    let board = document.querySelector("#board");

    this.initializeBoard = function initializeBoard() {
        for (let j = this.boardSize - 1; j >= 0; j--) {
            for (let i = 0; i < this.boardSize; i++) {
                setTimeout(() => {
                    const div = document.createElement("div");
                    div.classList.add("case");
                    setTimeout(() => board.appendChild(div), 100 + 200 * i);

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
                }, 500);
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

    this.add = function add(element) {
        return this.case.add(element);
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
        this.playerMarkSymbol = '';
        this.a = null;
        this.b = null;
    }
}

function PlayerMark(game, name = "Zmile IA", mark = "rond") {
    this.playerName = name;
    this.playerMarkSymbol = mark;
    this.playerCells = new Set();
    this.index = this.playerMarkSymbol == "rond" ? 0 : 1;


    this.tour = document.querySelector(".player-mark");

    this.isEqual = (other) => (this.playerMarkSymbol === other.playerMarkSymbol) ? true : false;

    this.registerPlayedCell = (element) => {
        this.playerCells.add(element);

        this.checkSurroundingPlays(element);
    }


    this.checkSurroundingPlays = (element) => {
        let i = element.a,
            j = element.b;
        let minMax = [element.coord(), element.coord()];
        let lien = [],
            ecart = [0];

        const hasMe = (el) => this.hasMe(el);

        minMax = this.hasMe([i + 1, j]) ?
            (this.hasMe([i - 1, j]) ? [[i + 1, j], [i - 1, j]] : [[i + 1, j], element.coord()]) :
            (this.hasMe([i - 1, j]) ? [element.coord(), [i - 1, j]] : [element.coord(), element.coord()]);

            [ecart[0], lien[0]] = parcours(minMax[0], minMax[1]);

        minMax = this.hasMe([i + 1, j + 1]) ?
            (this.hasMe([i - 1, j - 1]) ? [[i + 1, j + 1], [i - 1, j - 1]] : [[i + 1, j + 1], element.coord()]) :
            (this.hasMe([i - 1, j - 1]) ? [element.coord(), [i - 1, j - 1]] : [element.coord(), element.coord()]);

            [ecart[1], lien[1]] = parcours(minMax[0], minMax[1]);

        minMax = this.hasMe([i + 1, j - 1]) ?
            (this.hasMe([i - 1, j + 1]) ? [[i + 1, j - 1], [i - 1, j + 1]] : [[i + 1, j - 1], element.coord()]) :
            (this.hasMe([i - 1, j + 1]) ? [element.coord(), [i - 1, j + 1]] : [element.coord(), element.coord()]);

            [ecart[2], lien[2]] = parcours(minMax[0], minMax[1])

        minMax = this.hasMe([i, j + 1]) ?
            (this.hasMe([i, j - 1]) ? [[i, j + 1], [i, j - 1]] : [[i, j + 1], element.coord()]) :
            (this.hasMe([i, j - 1]) ? [element.coord(), [i, j - 1]] : [element.coord(), element.coord()]);

            [ecart[3], lien[3]] = parcours(minMax[0], minMax[1])

        function parcours(max, min) {
            let a = max[0] - min[0];
            let b = max[1] - min[1];

            switch ([(b < 0 ? false : a > 0), (b > 0)].toString()) {
                case "true,true":
                    for (let i = 0; i < game.requiredMatches; i++) {
                        if (hasMe([max[0] + 1, max[1] + 1])) {
                            max[0]++;
                            max[1]++;
                        } else {
                            break;
                        }
                    }

                    for (let i = 0; i < game.requiredMatches; i++) {
                        if (hasMe([min[0] - 1, min[1] - 1])) {
                            min[0]--;
                            min[1]--;
                        } else {
                            break;
                        }
                    }
                    break;
                case "true,false":
                    for (let i = 0; i < game.requiredMatches; i++) {
                        if (hasMe([max[0] + 1, max[1]])) {
                            max[0]++;
                        } else {
                            break;
                        }
                    }
                    for (let i = 0; i < game.requiredMatches; i++) {
                        if (hasMe([min[0] - 1, min[1]])) {
                            min[0]--;
                        } else {
                            break;
                        }
                    }
                    break;
                case "false,true":
                    for (let i = 0; i < game.requiredMatches; i++) {
                        if (hasMe([max[0], max[1] + 1])) {
                            max[1]++;
                        } else {
                            break;
                        }
                    }
                    for (let i = 0; i < game.requiredMatches; i++) {
                        if (hasMe([min[0], min[1] - 1])) {
                            min[1]--;
                        } else {
                            break;
                        }
                    }
                    break;
                case "false,false":
                    if (b === 0) {
                        break;
                    }

                    for (let i = 0; i < game.requiredMatches; i++) {
                        if (hasMe([max[0] + 1, max[1] - 1])) {
                            max[0]++;
                            max[1]--;
                        } else {
                            break;
                        }
                    }
                    for (let i = 0; i < game.requiredMatches; i++) {
                        if (hasMe([min[0] - 1, min[1] + 1])) {
                            min[0]--;
                            min[1]++;
                        } else {
                            break;
                        }
                    }
                    break;

                default:
                    console.log('Erreur inattendu !')
                    break;
            }

            return [distance(min, max), [min, max]];
        }

        let index = 0;

        for (let dist of ecart) {
            if (dist >= game.requiredMatches) {
                game.checkForWin(this);
                game.board.getCellElements(...lien[index]).forEach(cellule => {
                    cellule.classList.add("winning");
                });
                game.nextTour();
            }
            index++;
        }

        return lien;
    }

    function distance(elA, elB) {
        const a = Math.abs(elB[0] - elA[0]);
        const b = Math.abs(elB[1] - elA[1]);

        return (b == 0 || a == b) ? a : ((a == 0) ? b : 0);
    }

    this.distance = (elA, elB) => distance(elA, elB);

    this.hasMe = (el) => {
        const allCellElements = this.playerCells.values();

        return allCellElements.some((cell) => {
            if (el.toString() == cell.coord().toString()) {
                return cell;
            }
        })
    }

    this.play = (cell) => {
        const response = cell.marked(this.playerMarkSymbol);
        if (response) {
            this.registerPlayedCell(cell);
        }
        return response;
    }
}

function IAPlayer() {
    PlayerMark.call(new TicTacToeGame());
    this.tactique = () => {
            let bestMove=9;
            function attaque() {
                console.log("attaque");
            }
            function defense() {
                console.log("defense");
            }
            return bestMove;
    }
}

IAPlayer.prototype = Object.create(PlayerMark.prototype);


export { TicTacToeGame }
