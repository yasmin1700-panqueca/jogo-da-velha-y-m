/* =========================================================
   JOGO DA VELHA
========================================================= */


/* =========================================================
   ELEMENTOS
========================================================= */

const menu = document.getElementById("menu");
const difficultyMenu = document.getElementById("difficultyMenu");
const game = document.getElementById("game");

const btnDoisJogadores =
    document.getElementById("btnDoisJogadores");

const btnCPU =
    document.getElementById("btnCPU");

const btnVoltarDifficulty =
    document.getElementById("btnVoltarDifficulty");

const btnMenu =
    document.getElementById("btnMenu");

const btnResultMenu =
    document.getElementById("btnResultMenu");

const btnNextRound =
    document.getElementById("btnNextRound");

const cells =
    document.querySelectorAll(".cell");

const turnText =
    document.getElementById("turnText");

const gameMode =
    document.getElementById("gameMode");

const scoreXElement =
    document.getElementById("scoreX");

const scoreOElement =
    document.getElementById("scoreO");

const resultOverlay =
    document.getElementById("resultOverlay");

const resultText =
    document.getElementById("resultText");


/* =========================================================
   ESTADO DO JOGO
========================================================= */

let board = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
];

let currentPlayer = "X";

let gameModeType = "players";

let difficulty = "easy";

let gameOver = false;

let scores = {
    X: 0,
    O: 0
};


/* =========================================================
   COMBINAÇÕES VENCEDORAS
========================================================= */

const winningCombinations = [

    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]

];


/* =========================================================
   TROCA DE TELA
========================================================= */

function showScreen(screen) {

    menu.classList.remove("active");

    difficultyMenu.classList.remove("active");

    game.classList.remove("active");

    screen.classList.add("active");
}


/* =========================================================
   DOIS JOGADORES
========================================================= */

btnDoisJogadores.addEventListener("click", () => {

    gameModeType = "players";

    gameMode.textContent = "DOIS JOGADORES";

    scores.X = 0;
    scores.O = 0;

    updateScore();

    showScreen(game);

    startRound();

});


/* =========================================================
   CONTRA CPU
========================================================= */

btnCPU.addEventListener("click", () => {

    showScreen(difficultyMenu);

});


/* =========================================================
   ESCOLHA DE DIFICULDADE
========================================================= */

document
    .querySelectorAll("[data-difficulty]")
    .forEach(button => {

        button.addEventListener("click", () => {

            difficulty =
                button.dataset.difficulty;

            gameModeType = "cpu";

            gameMode.textContent =
                "CONTRA CPU — " +
                getDifficultyName();

            scores.X = 0;
            scores.O = 0;

            updateScore();

            showScreen(game);

            startRound();

        });

    });


/* =========================================================
   NOME DA DIFICULDADE
========================================================= */

function getDifficultyName() {

    if (difficulty === "easy") {
        return "FÁCIL";
    }

    if (difficulty === "medium") {
        return "MÉDIO";
    }

    return "DIFÍCIL";
}


/* =========================================================
   VOLTAR
========================================================= */

btnVoltarDifficulty.addEventListener("click", () => {

    showScreen(menu);

});


btnMenu.addEventListener("click", () => {

    resultOverlay.classList.remove("show");

    showScreen(menu);

});


btnResultMenu.addEventListener("click", () => {

    resultOverlay.classList.remove("show");

    showScreen(menu);

});


/* =========================================================
   INICIAR RODADA
========================================================= */

function startRound() {

    board = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ];

    currentPlayer = "X";

    gameOver = false;

    resultOverlay.classList.remove("show");

    renderBoard();

    updateTurn();

}


/* =========================================================
   RENDERIZAR TABULEIRO
========================================================= */

function renderBoard() {

    cells.forEach((cell, index) => {

        cell.textContent = board[index];

        cell.classList.remove(
            "x",
            "o",
            "filled",
            "winner"
        );

        if (board[index] !== "") {

            cell.classList.add("filled");

            if (board[index] === "X") {
                cell.classList.add("x");
            } else {
                cell.classList.add("o");
            }

        }

    });

}


/* =========================================================
   CLIQUE NAS CASAS
========================================================= */

cells.forEach(cell => {

    cell.addEventListener("click", () => {

        const index =
            Number(cell.dataset.index);

        if (gameOver) {
            return;
        }

        if (board[index] !== "") {
            return;
        }

        // CPU não pode ser controlada pelo jogador
        if (
            gameModeType === "cpu" &&
            currentPlayer === "O"
        ) {
            return;
        }

        makeMove(index);

    });

});


/* =========================================================
   FAZER JOGADA
========================================================= */

function makeMove(index) {

    board[index] = currentPlayer;

    renderBoard();

    const result = checkGame();

    if (result !== null) {

        finishRound(result);

        return;

    }

    currentPlayer =
        currentPlayer === "X"
            ? "O"
            : "X";

    updateTurn();


    // CPU joga automaticamente
    if (
        gameModeType === "cpu" &&
        currentPlayer === "O" &&
        !gameOver
    ) {

        setTimeout(() => {

            cpuMove();

        }, 450);

    }

}


/* =========================================================
   ATUALIZAR TEXTO DA VEZ
========================================================= */

function updateTurn() {

    if (gameModeType === "cpu") {

        if (currentPlayer === "X") {

            turnText.textContent =
                "SUA VEZ — X";

        } else {

            turnText.textContent =
                "VEZ DA CPU — O";

        }

    } else {

        turnText.textContent =
            "VEZ DO JOGADOR " +
            currentPlayer;

    }

}


/* =========================================================
   VERIFICAR VITÓRIA / EMPATE
========================================================= */

function checkGame() {

    for (
        const combination of winningCombinations
    ) {

        const [a, b, c] =
            combination;

        if (
            board[a] !== "" &&
            board[a] === board[b] &&
            board[a] === board[c]
        ) {

            return {
                winner: board[a],
                combination: combination
            };

        }

    }


    // Se não houver casas vazias
    if (!board.includes("")) {

        return {
            winner: "draw"
        };

    }

    return null;

}


/* =========================================================
   FINALIZAR RODADA
========================================================= */

function finishRound(result) {

    gameOver = true;

    if (result.winner === "draw") {

        resultText.textContent =
            "EMPATE!";

    } else {

        const winner =
            result.winner;

        scores[winner]++;

        updateScore();

        highlightWinner(
            result.combination
        );

        if (
            gameModeType === "cpu"
        ) {

            if (winner === "X") {

                resultText.textContent =
                    "VOCÊ VENCEU!";

            } else {

                resultText.textContent =
                    "A CPU VENCEU!";

            }

        } else {

            resultText.textContent =
                "JOGADOR " +
                winner +
                " VENCEU!";

        }

    }

    setTimeout(() => {

        resultOverlay.classList.add("show");

    }, 350);

}


/* =========================================================
   DESTACAR LINHA VENCEDORA
========================================================= */

function highlightWinner(combination) {

    combination.forEach(index => {

        cells[index]
            .classList.add("winner");

    });

}


/* =========================================================
   ATUALIZAR PLACAR
========================================================= */

function updateScore() {

    scoreXElement.textContent =
        scores.X;

    scoreOElement.textContent =
        scores.O;

}


/* =========================================================
   PRÓXIMA RODADA
========================================================= */

btnNextRound.addEventListener("click", () => {

    startRound();

});


/* =========================================================
   CPU
========================================================= */

function cpuMove() {

    if (gameOver) {
        return;
    }

    let move;

    if (difficulty === "easy") {

        move =
            getRandomMove();

    }

    else if (difficulty === "medium") {

        move =
            getMediumMove();

    }

    else {

        move =
            getBestMove();

    }


    if (move !== null) {

        makeMove(move);

    }

}


/* =========================================================
   FÁCIL
   Escolhe uma casa aleatória.
========================================================= */

function getRandomMove() {

    const available =
        getAvailableMoves();

    if (available.length === 0) {
        return null;
    }

    const randomIndex =
        Math.floor(
            Math.random() *
            available.length
        );

    return available[randomIndex];

}


/* =========================================================
   MÉDIO
   Prioridade:

   1. Ganhar
   2. Bloquear jogador
   3. Centro
   4. Canto
   5. Aleatório
========================================================= */

function getMediumMove() {

    // Tenta ganhar
    let move =
        findWinningMove("O");

    if (move !== null) {
        return move;
    }


    // Tenta bloquear
    move =
        findWinningMove("X");

    if (move !== null) {
        return move;
    }


    // Centro
    if (board[4] === "") {
        return 4;
    }


    // Cantos
    const corners =
        [0, 2, 6, 8]
            .filter(index =>
                board[index] === ""
            );

    if (corners.length > 0) {

        return corners[
            Math.floor(
                Math.random() *
                corners.length
            )
        ];

    }


    return getRandomMove();

}


/* =========================================================
   ENCONTRAR JOGADA VENCEDORA
========================================================= */

function findWinningMove(player) {

    const available =
        getAvailableMoves();

    for (
        const index of available
    ) {

        board[index] = player;

        const won =
            checkWinnerOnly(player);

        board[index] = "";

        if (won) {
            return index;
        }

    }

    return null;

}


/* =========================================================
   VERIFICAR APENAS VITÓRIA
========================================================= */

function checkWinnerOnly(player) {

    return winningCombinations.some(
        combination => {

            return combination.every(
                index =>
                    board[index] === player
            );

        }
    );

}


/* =========================================================
   JOGADAS DISPONÍVEIS
========================================================= */

function getAvailableMoves() {

    const moves = [];

    for (
        let i = 0;
        i < board.length;
        i++
    ) {

        if (board[i] === "") {
            moves.push(i);
        }

    }

    return moves;

}


/* =========================================================
   DIFÍCIL
   Minimax.

   A CPU analisa todas as possibilidades
   e joga da maneira mais eficiente possível.
========================================================= */

function getBestMove() {

    let bestScore = -Infinity;

    let move = null;

    const available =
        getAvailableMoves();

    for (
        const index of available
    ) {

        board[index] = "O";

        const score =
            minimax(
                board,
                0,
                false
            );

        board[index] = "";

        if (score > bestScore) {

            bestScore = score;

            move = index;

        }

    }

    return move;

}


/* =========================================================
   MINIMAX
========================================================= */

function minimax(
    position,
    depth,
    isMaximizing
) {

    if (checkWinnerOnly("O")) {

        return 10 - depth;

    }

    if (checkWinnerOnly("X")) {

        return depth - 10;

    }

    if (
        !position.includes("")
    ) {

        return 0;

    }


    if (isMaximizing) {

        let bestScore =
            -Infinity;

        const moves =
            getAvailableMoves();

        for (
            const index of moves
        ) {

            position[index] = "O";

            const score =
                minimax(
                    position,
                    depth + 1,
                    false
                );

            position[index] = "";

            bestScore =
                Math.max(
                    bestScore,
                    score
                );

        }

        return bestScore;

    }

    else {

        let bestScore =
            Infinity;

        const moves =
            getAvailableMoves();

        for (
            const index of moves
        ) {

            position[index] = "X";

            const score =
                minimax(
                    position,
                    depth + 1,
                    true
                );

            position[index] = "";

            bestScore =
                Math.min(
                    bestScore,
                    score
                );

        }

        return bestScore;

    }

}