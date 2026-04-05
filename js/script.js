const mario = document.querySelector(".mario");
const pipe = document.querySelector(".pipe");
const gameBoard = document.querySelector(".game-board");

let score = 0;
let gameSpeed = 1.5;
let isGameOver = false;
let loop;

const jump = () => {
  if (isGameOver) return;

  mario.classList.add("jump");

  setTimeout(() => {
    mario.classList.remove("jump");
  }, 500);
};

const updateScore = () => {
  score++;
  const scoreElement = document.getElementById("score");
  if (scoreElement) {
    scoreElement.textContent = `Pontos: ${score}`;
  }
};

const resetGame = () => {
  score = 0;
  isGameOver = false;
  gameSpeed = 1.5;

  // Reinicia completamente o Mario
  mario.src = "../img/mario-gif.gif";
  mario.style.width = "110px";
  mario.style.marginLeft = "0";
  mario.style.bottom = "0";
  mario.style.animation = "";
  mario.style.display = "block";

  // Reinicia o cano
  pipe.style.animation = "";
  pipe.style.right = "-80px";
  pipe.style.left = "";
  pipe.style.display = "block";

  // Reseta o score
  const scoreElement = document.getElementById("score");
  if (scoreElement) {
    scoreElement.textContent = "Pontos: 0";
  }

  // Esconde game over
  const gameOverElement = document.getElementById("game-over");
  if (gameOverElement) {
    gameOverElement.style.display = "none";
  }

  // Força o navegador a recarregar a imagem
  setTimeout(() => {
    mario.src = "../img/mario-gif.gif?t=" + Date.now();
  }, 100);

  startGame();
};

const startGame = () => {
  loop = setInterval(() => {
    if (isGameOver) return;

    const pipePosition = pipe.offsetLeft;
    const marioPosition = +window
      .getComputedStyle(mario)
      .bottom.replace("px", "");

    if (pipePosition <= 50 && pipePosition > 0 && marioPosition < 90) {
      gameOver();
    } else if (pipePosition < -50) {
      updateScore();

      if (score % 5 === 0) {
        gameSpeed = Math.max(0.8, gameSpeed - 0.1);
        pipe.style.animationDuration = `${gameSpeed}s`;
      }
    }
  }, 15);
};

const gameOver = () => {
  isGameOver = true;

  pipe.style.animation = "none";
  pipe.style.left = `${pipe.offsetLeft}px`;

  mario.style.animation = "none";
  mario.style.bottom = `${window.getComputedStyle(mario).bottom}`;

  mario.src = "../img/gif-morto.gif";
  mario.style.width = "100px";
  mario.style.marginLeft = "5px";

  clearInterval(loop);

  const gameOverElement = document.getElementById("game-over");
  if (gameOverElement) {
    gameOverElement.style.display = "block";
    gameOverElement.innerHTML = `
            <h2>Game Over!</h2>
            <p>Pontuação final: ${score}</p>
            <button onclick="resetGame()">Jogar Novamente</button>
        `;
  }
};

document.addEventListener("keydown", (e) => {
  if (e.code === "Space" || e.code === "ArrowUp") {
    e.preventDefault();
    jump();
  }
});

document.addEventListener("click", (e) => {
  if (e.target.closest(".game-board") && !e.target.closest("button")) {
    jump();
  }
});

startGame();

//menor ou igual <=
//maior ou igual >=
