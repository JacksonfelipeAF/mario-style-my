// Sistema de áudio avançado
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let masterVolume = 0.5;
let soundEnabled = true;

const playSound = (type, volume = 1) => {
  if (!soundEnabled) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  const adjustedVolume = volume * masterVolume;

  switch (type) {
    case "jump":
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        600,
        audioContext.currentTime + 0.1,
      );
      gainNode.gain.setValueAtTime(
        0.3 * adjustedVolume,
        audioContext.currentTime,
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.1,
      );
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
      break;

    case "score":
      oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
      gainNode.gain.setValueAtTime(
        0.3 * adjustedVolume,
        audioContext.currentTime,
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3,
      );
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      break;

    case "coin":
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        1200,
        audioContext.currentTime + 0.05,
      );
      gainNode.gain.setValueAtTime(
        0.2 * adjustedVolume,
        audioContext.currentTime,
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.1,
      );
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
      break;

    case "powerup":
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        900,
        audioContext.currentTime + 0.2,
      );
      gainNode.gain.setValueAtTime(
        0.4 * adjustedVolume,
        audioContext.currentTime,
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3,
      );
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      break;

    case "hurt":
      oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        100,
        audioContext.currentTime + 0.2,
      );
      gainNode.gain.setValueAtTime(
        0.4 * adjustedVolume,
        audioContext.currentTime,
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.2,
      );
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
      break;

    case "gameOver":
      oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        100,
        audioContext.currentTime + 0.5,
      );
      gainNode.gain.setValueAtTime(
        0.5 * adjustedVolume,
        audioContext.currentTime,
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5,
      );
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
      break;

    case "menu":
      oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(550, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(660, audioContext.currentTime + 0.2);
      gainNode.gain.setValueAtTime(
        0.2 * adjustedVolume,
        audioContext.currentTime,
      );
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3,
      );
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      break;
  }
};

// Sistema de partículas
class ParticleSystem {
  constructor() {
    this.container = document.getElementById("particles-container");
    this.particles = [];
  }

  createParticle(x, y, color = "#ffd700") {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.left = x + "px";
    particle.style.bottom = y + "px";
    particle.style.background = color;
    this.container.appendChild(particle);

    setTimeout(() => {
      particle.remove();
    }, 1000);
  }

  createExplosion(x, y, count = 10, color = "#ffd700") {
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        const offsetX = (Math.random() - 0.5) * 50;
        const offsetY = Math.random() * 30;
        this.createParticle(x + offsetX, y + offsetY, color);
      }, i * 50);
    }
  }
}

// Sistema de Power-ups
class PowerUpSystem {
  constructor() {
    this.container = document.getElementById("power-ups-container");
    this.activePowerUps = [];
    this.types = {
      mushroom: { icon: "🍄", effect: "extraLife", duration: 0 },
      star: { icon: "⭐", effect: "invincible", duration: 5000 },
      flower: { icon: "🌺", effect: "doublePoints", duration: 10000 },
    };
  }

  spawnPowerUp() {
    if (Math.random() > 0.3) return; // 30% chance

    const types = Object.keys(this.types);
    const type = types[Math.floor(Math.random() * types.length)];
    const powerUp = document.createElement("div");
    powerUp.className = "power-up";
    powerUp.innerHTML = this.types[type].icon;
    powerUp.style.right = "-50px";
    powerUp.style.bottom = Math.random() * 200 + 50 + "px";
    powerUp.dataset.type = type;

    this.container.appendChild(powerUp);

    const animation = powerUp.animate([{ right: "-50px" }, { right: "100%" }], {
      duration: 4000,
      easing: "linear",
    });

    animation.onfinish = () => powerUp.remove();
  }

  checkCollision(mario) {
    const powerUps = this.container.querySelectorAll(".power-up");
    const marioRect = mario.getBoundingClientRect();

    powerUps.forEach((powerUp) => {
      const powerUpRect = powerUp.getBoundingClientRect();

      if (this.isColliding(marioRect, powerUpRect)) {
        this.collectPowerUp(powerUp);
      }
    });
  }

  isColliding(rect1, rect2) {
    return !(
      rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom
    );
  }

  collectPowerUp(powerUp) {
    const type = powerUp.dataset.type;
    const powerUpData = this.types[type];

    playSound("powerup");
    particleSystem.createExplosion(
      parseInt(powerUp.style.right),
      parseInt(powerUp.style.bottom),
      15,
      "#ff6b6b",
    );

    this.activateEffect(powerUpData.effect, powerUpData.duration);
    powerUp.remove();
  }

  activateEffect(effect, duration) {
    switch (effect) {
      case "extraLife":
        if (lives < 5) {
          lives++;
          updateLives();
        }
        break;
      case "invincible":
        gameState.invincible = true;
        mario.style.filter = "hue-rotate(180deg)";
        setTimeout(() => {
          gameState.invincible = false;
          mario.style.filter = "none";
        }, duration);
        break;
      case "doublePoints":
        gameState.doublePoints = true;
        setTimeout(() => {
          gameState.doublePoints = false;
        }, duration);
        break;
    }
  }
}

// Sistema de Moedas
class CoinSystem {
  constructor() {
    this.container = document.getElementById("coins-container");
    this.coins = [];
  }

  spawnCoin() {
    if (Math.random() > 0.5) return; // 50% chance

    const coin = document.createElement("div");
    coin.className = "coin";
    coin.style.right = "-30px";
    coin.style.bottom = Math.random() * 250 + 50 + "px";

    this.container.appendChild(coin);
    this.coins.push(coin);

    const animation = coin.animate([{ right: "-30px" }, { right: "100%" }], {
      duration: 3500,
      easing: "linear",
    });

    animation.onfinish = () => {
      coin.remove();
      const index = this.coins.indexOf(coin);
      if (index > -1) this.coins.splice(index, 1);
    };
  }

  checkCollision(mario) {
    const marioRect = mario.getBoundingClientRect();

    this.coins.forEach((coin, index) => {
      const coinRect = coin.getBoundingClientRect();

      if (this.isColliding(marioRect, coinRect)) {
        this.collectCoin(coin, index);
      }
    });
  }

  isColliding(rect1, rect2) {
    return !(
      rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom
    );
  }

  collectCoin(coin, index) {
    playSound("coin");
    particleSystem.createExplosion(
      parseInt(coin.style.right),
      parseInt(coin.style.bottom),
      8,
      "#ffa500",
    );

    coins++;
    updateCoins();

    // A cada 10 moedas ganha uma vida
    if (coins % 10 === 0) {
      lives++;
      updateLives();
      playSound("powerup");
    }

    coin.remove();
    this.coins.splice(index, 1);
  }
}

// Sistema de Conquistas
class AchievementSystem {
  constructor() {
    this.achievements = this.loadAchievements();
    this.updateAchievementDisplay();
  }

  loadAchievements() {
    const saved = localStorage.getItem("marioAchievements");
    return saved
      ? JSON.parse(saved)
      : {
          "first-jump": { unlocked: false, progress: 0, total: 1 },
          "coin-collector": { unlocked: false, progress: 0, total: 50 },
          survivor: { unlocked: false, progress: 0, total: 5 },
          "high-scorer": { unlocked: false, progress: 0, total: 100 },
        };
  }

  saveAchievements() {
    localStorage.setItem(
      "marioAchievements",
      JSON.stringify(this.achievements),
    );
  }

  updateProgress(achievementId, amount = 1) {
    if (!this.achievements[achievementId]) return;

    const achievement = this.achievements[achievementId];
    if (achievement.unlocked) return;

    achievement.progress = Math.min(
      achievement.progress + amount,
      achievement.total,
    );

    if (achievement.progress >= achievement.total) {
      this.unlock(achievementId);
    }

    this.saveAchievements();
    this.updateAchievementDisplay();
  }

  unlock(achievementId) {
    this.achievements[achievementId].unlocked = true;
    playSound("powerup");
    this.showNotification(achievementId);
  }

  showNotification(achievementId) {
    const names = {
      "first-jump": "Primeiro Pulo",
      "coin-collector": "Colecionador de Moedas",
      survivor: "Sobrevivente",
      "high-scorer": "Mestre da Pontuação",
    };

    // Criar notificação visual
    const notification = document.createElement("div");
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #ffd700, #ff6b6b);
      color: white;
      padding: 15px 20px;
      border-radius: 10px;
      font-weight: bold;
      z-index: 10000;
      animation: slideIn 0.5s ease;
    `;
    notification.innerHTML = `🏆 Conquista Desbloqueada: ${names[achievementId]}`;

    document.body.appendChild(notification);

    setTimeout(() => {
      notification.style.animation = "slideOut 0.5s ease";
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  }

  updateAchievementDisplay() {
    Object.keys(this.achievements).forEach((id) => {
      const achievement = this.achievements[id];
      const element = document.querySelector(`[data-achievement="${id}"]`);

      if (element) {
        const progressBar = element.querySelector(".progress-bar");
        const progress = (achievement.progress / achievement.total) * 100;

        progressBar.style.width = progress + "%";

        if (achievement.unlocked) {
          element.classList.add("unlocked");
        }
      }
    });
  }
}

// Estado do jogo
const gameState = {
  currentScreen: "loading",
  isPaused: false,
  isGameOver: false,
  isInvincible: false,
  doublePoints: false,
  difficulty: "normal",
  level: 1,
  totalGamesPlayed: 0,
};

// Variáveis do jogo
let score = 0;
let lives = 3;
let coins = 0;
let highScore = localStorage.getItem("marioHighScore") || 0;
let gameSpeed = 1.5;
let loop;
let hasScored = false;

// Elementos do DOM
let mario, pipe, obstacle, gameBoard;
let particleSystem, powerUpSystem, coinSystem, achievementSystem;

// Inicialização
const init = () => {
  // Carregar configurações
  loadSettings();

  // Inicializar sistemas
  particleSystem = new ParticleSystem();
  powerUpSystem = new PowerUpSystem();
  coinSystem = new CoinSystem();
  achievementSystem = new AchievementSystem();

  // Obter elementos do DOM
  mario = document.querySelector(".mario");
  pipe = document.querySelector(".pipe");
  obstacle = document.querySelector(".obstacle");
  gameBoard = document.querySelector(".game-board");

  // Configurar eventos
  setupEventListeners();

  // Mostrar loading screen
  showLoadingScreen();
};

// Loading Screen
const showLoadingScreen = () => {
  const loadingScreen = document.getElementById("loading-screen");
  const progressBar = document.querySelector(".loading-progress");

  let progress = 0;
  const loadingInterval = setInterval(() => {
    progress += 10;
    progressBar.style.width = progress + "%";

    if (progress >= 100) {
      clearInterval(loadingInterval);
      setTimeout(() => {
        loadingScreen.style.display = "none";
        showMainMenu();
      }, 500);
    }
  }, 200);
};

// Menu Principal
const showMainMenu = () => {
  gameState.currentScreen = "menu";
  document.getElementById("main-menu").style.display = "flex";
  document.getElementById("game-container").style.display = "none";

  // Atualizar estatísticas
  document.getElementById("menu-high-score").textContent = highScore;
  document.getElementById("total-played").textContent =
    gameState.totalGamesPlayed;

  playSound("menu");
};

// Iniciar Novo Jogo
const startNewGame = () => {
  gameState.currentScreen = "game";
  gameState.isGameOver = false;
  gameState.isPaused = false;
  gameState.level = 1;
  gameState.totalGamesPlayed++;

  // Resetar variáveis
  score = 0;
  lives = 3;
  coins = 0;
  gameSpeed = getDifficultySpeed();
  hasScored = false;

  // Limpar sistemas
  powerUpSystem.container.innerHTML = "";
  coinSystem.container.innerHTML = "";
  particleSystem.container.innerHTML = "";

  // Resetar Mario completamente
  mario.src = "img/mario-gif.gif";
  mario.style.width = "110px";
  mario.style.marginLeft = "0";
  mario.style.bottom = "0";
  mario.style.display = "block";
  mario.classList.remove("jump");

  // Resetar obstáculos para posição inicial
  pipe.style.animation = "none";
  obstacle.style.animation = "none";
  pipe.style.right = "-80px";
  obstacle.style.right = "-80px";

  // Atualizar interface
  updateAllUI();

  // Mudar tela
  document.getElementById("main-menu").style.display = "none";
  document.getElementById("game-container").style.display = "block";

  // Pequeno delay para garantir que tudo está resetado
  setTimeout(() => {
    // Iniciar jogo
    startGame();
  }, 100);

  playSound("menu");
};

// Sistema de Jogo
const startGame = () => {
  loop = setInterval(() => {
    if (gameState.isPaused || gameState.isGameOver) return;

    const pipePosition = pipe.offsetLeft;
    const obstaclePosition = obstacle.offsetLeft;
    const marioPosition = +window
      .getComputedStyle(mario)
      .bottom.replace("px", "");

    // Verificar colisões
    if (!gameState.isInvincible) {
      if (pipePosition <= 50 && pipePosition > 0 && marioPosition < 90) {
        loseLife();
      } else if (
        obstaclePosition <= 50 &&
        obstaclePosition > 0 &&
        marioPosition < 90
      ) {
        loseLife();
      }
    }

    // Verificar pontos
    if (pipePosition <= 120 && pipePosition > 110 && !hasScored) {
      updateScore();
      hasScored = true;
    } else if (pipePosition > 120) {
      hasScored = false;
    }

    // Verificar power-ups e moedas
    powerUpSystem.checkCollision(mario);
    coinSystem.checkCollision(mario);

    // Spawn de elementos
    if (Math.random() < 0.005) powerUpSystem.spawnPowerUp();
    if (Math.random() < 0.01) coinSystem.spawnCoin();

    // Aumentar dificuldade
    if (score > 0 && score % 20 === 0) {
      levelUp();
    }
  }, 15);
};

const jump = () => {
  if (gameState.isPaused || gameState.isGameOver) return;

  playSound("jump");
  particleSystem.createParticle(50, 0, "#4ecdc4");

  achievementSystem.updateProgress("first-jump");

  mario.classList.add("jump");

  setTimeout(() => {
    mario.classList.remove("jump");
  }, 500);
};

const updateScore = () => {
  const points = gameState.doublePoints ? 2 : 1;
  score += points;

  playSound("score");
  particleSystem.createExplosion(100, 100, 5, "#ffd700");

  updateScoreDisplay();

  // Atualizar conquistas
  achievementSystem.updateProgress("high-scorer", points);

  // Atualizar high score
  if (score > highScore) {
    highScore = score;
    localStorage.setItem("marioHighScore", highScore);
    updateHighScore();
  }
};

const levelUp = () => {
  gameState.level++;
  gameSpeed = Math.max(0.5, gameSpeed - 0.1);
  pipe.style.animationDuration = `${gameSpeed}s`;
  obstacle.style.animationDuration = `${gameSpeed + 0.5}s`;

  updateLevel();
  achievementSystem.updateProgress("survivor");

  playSound("powerup");
  particleSystem.createExplosion(400, 200, 20, "#4ecdc4");
};

const loseLife = () => {
  if (gameState.isInvincible) return;

  lives--;
  playSound("hurt");
  particleSystem.createExplosion(50, 50, 15, "#ff6b6b");

  updateLives();

  // Pausar brevemente
  gameState.isPaused = true;
  mario.src = "img/gif-morto.gif";
  mario.style.width = "100px";
  mario.style.marginLeft = "5px";

  setTimeout(() => {
    if (lives > 0) {
      // Continuar jogo
      gameState.isPaused = false;
      mario.src = "img/mario-gif.gif";
      mario.style.width = "110px";
      mario.style.marginLeft = "0";

      // Resetar obstáculos
      pipe.style.animation = "none";
      obstacle.style.animation = "none";
      pipe.style.right = "-80px";
      obstacle.style.right = "-80px";

      setTimeout(() => {
        pipe.style.animation = `pipe ${gameSpeed}s infinite linear`;
        obstacle.style.animation = `obstacle ${gameSpeed + 0.5}s infinite linear`;
      }, 100);
    } else {
      gameOver();
    }
  }, 1000);
};

const gameOver = () => {
  gameState.isGameOver = true;
  clearInterval(loop);

  playSound("gameOver");
  particleSystem.createExplosion(400, 200, 30, "#ff6b6b");

  // Mostrar tela de game over
  document.getElementById("final-score").textContent = score;
  document.getElementById("final-high-score").textContent = highScore;
  document.getElementById("final-coins").textContent = coins;
  document.getElementById("final-level").textContent = gameState.level;
  document.getElementById("game-over").style.display = "block";
};

// Sistema de Pause
const togglePause = () => {
  if (gameState.currentScreen !== "game" || gameState.isGameOver) return;

  gameState.isPaused = !gameState.isPaused;

  if (gameState.isPaused) {
    document.getElementById("pause-menu").style.display = "flex";
    playSound("menu");
  } else {
    document.getElementById("pause-menu").style.display = "none";
  }
};

const resumeGame = () => {
  gameState.isPaused = false;
  document.getElementById("pause-menu").style.display = "none";
  playSound("menu");
};

const restartGame = () => {
  document.getElementById("pause-menu").style.display = "none";

  // Limpar loop anterior se existir
  if (loop) {
    clearInterval(loop);
  }

  // Resetar estado do jogo completamente
  gameState.isGameOver = false;
  gameState.isPaused = false;
  gameState.isInvincible = false;
  gameState.doublePoints = false;

  // Iniciar novo jogo
  startNewGame();
};

const backToMenu = () => {
  clearInterval(loop);
  document.getElementById("pause-menu").style.display = "none";
  document.getElementById("game-over").style.display = "none";
  document.getElementById("game-container").style.display = "none";
  showMainMenu();
};

// Sistema de Som
const toggleSound = () => {
  soundEnabled = !soundEnabled;
  const soundToggle = document.getElementById("sound-toggle");
  soundToggle.textContent = soundEnabled ? "🔊" : "🔇";

  if (soundEnabled) playSound("menu");
};

// Configurações
const showSettings = () => {
  document.getElementById("settings-modal").style.display = "flex";
  playSound("menu");
};

const closeSettings = () => {
  document.getElementById("settings-modal").style.display = "none";
};

const saveSettings = () => {
  const difficulty = document.getElementById("difficulty-select").value;
  const volume = document.getElementById("volume-slider").value;
  const quality = document.getElementById("quality-select").value;

  gameState.difficulty = difficulty;
  masterVolume = volume / 100;

  localStorage.setItem(
    "marioSettings",
    JSON.stringify({
      difficulty,
      volume,
      quality,
    }),
  );

  closeSettings();
  playSound("menu");
};

const loadSettings = () => {
  const settings = localStorage.getItem("marioSettings");
  if (settings) {
    const parsed = JSON.parse(settings);
    gameState.difficulty = parsed.difficulty || "normal";
    masterVolume = (parsed.volume || 50) / 100;

    document.getElementById("difficulty-select").value = gameState.difficulty;
    document.getElementById("volume-slider").value = parsed.volume || 50;
    document.getElementById("quality-select").value =
      parsed.quality || "medium";
  }
};

const getDifficultySpeed = () => {
  switch (gameState.difficulty) {
    case "easy":
      return 2.0;
    case "normal":
      return 1.5;
    case "hard":
      return 1.0;
    default:
      return 1.5;
  }
};

// Conquistas
const showAchievements = () => {
  document.getElementById("achievements-modal").style.display = "flex";
  achievementSystem.updateAchievementDisplay();
  playSound("menu");
};

const closeAchievements = () => {
  document.getElementById("achievements-modal").style.display = "none";
};

const showHighScores = () => {
  alert(
    `🏆 Recordes\n\nRecorde Atual: ${highScore}\nTotal de Jogos: ${gameState.totalGamesPlayed}`,
  );
  playSound("menu");
};

// Atualização de UI
const updateAllUI = () => {
  updateScoreDisplay();
  updateLives();
  updateCoins();
  updateLevel();
  updateHighScore();
};

const updateScoreDisplay = () => {
  const scoreElement = document.getElementById("score");
  if (scoreElement) {
    scoreElement.textContent = `Pontos: ${score}`;
  }
};

const updateLives = () => {
  const livesElement = document.getElementById("lives");
  if (livesElement) {
    const hearts = "❤️".repeat(lives) + "🖤".repeat(3 - lives);
    livesElement.textContent = `Vidas: ${hearts}`;
  }
};

const updateCoins = () => {
  const coinsElement = document.getElementById("coins");
  if (coinsElement) {
    coinsElement.textContent = `Moedas: ${coins}`;
  }
};

const updateLevel = () => {
  const levelElement = document.getElementById("level");
  if (levelElement) {
    levelElement.textContent = `Nível: ${gameState.level}`;
  }
};

const updateHighScore = () => {
  const highScoreElement = document.getElementById("high-score");
  if (highScoreElement) {
    highScoreElement.textContent = `Recorde: ${highScore}`;
  }
};

// Reset de Jogo
const resetGame = () => {
  document.getElementById("game-over").style.display = "none";

  // Limpar loop anterior se existir
  if (loop) {
    clearInterval(loop);
  }

  // Resetar estado do jogo completamente
  gameState.isGameOver = false;
  gameState.isPaused = false;
  gameState.isInvincible = false;
  gameState.doublePoints = false;

  // Iniciar novo jogo
  startNewGame();
};

// Configurar Event Listeners
const setupEventListeners = () => {
  // Controles do jogo - Teclado
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" || e.code === "ArrowUp") {
      e.preventDefault();
      jump();
    } else if (e.code === "Escape") {
      if (gameState.currentScreen === "game") {
        togglePause();
      }
    }
  });

  // Controles do jogo - Mouse
  document.addEventListener("click", (e) => {
    if (e.target.closest(".game-board") && !e.target.closest("button")) {
      jump();
    }
  });

  // Controles do jogo - Touch (Celular)
  let touchStartTime = 0;

  document.addEventListener(
    "touchstart",
    (e) => {
      touchStartTime = Date.now();

      // Impedir zoom e scroll durante o jogo
      if (
        e.target.closest(".game-board") &&
        gameState.currentScreen === "game"
      ) {
        e.preventDefault();
      }
    },
    { passive: false },
  );

  document.addEventListener(
    "touchend",
    (e) => {
      const touchDuration = Date.now() - touchStartTime;

      // Verificar se foi um toque rápido (não um zoom)
      if (
        touchDuration < 200 &&
        e.target.closest(".game-board") &&
        !e.target.closest("button")
      ) {
        e.preventDefault();
        jump();
      }
    },
    { passive: false },
  );

  // Impedir zoom com pinch no game board
  document.addEventListener(
    "touchmove",
    (e) => {
      if (e.target.closest(".game-board") && e.touches.length > 1) {
        e.preventDefault();
      }
    },
    { passive: false },
  );

  // Prevenir menu de contexto
  document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
  });

  // Otimizar viewport para mobile
  if ("ontouchstart" in window) {
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute(
        "content",
        "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no",
      );
    }
  }
};

// Adicionar estilos CSS para animações
const addDynamicStyles = () => {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOut {
      from { transform: translateX(0); opacity: 1; }
      to { transform: translateX(100%); opacity: 0; }
    }
  `;
  document.head.appendChild(style);
};

// Inicializar quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
  addDynamicStyles();
  init();
});

// Exportar funções para uso no HTML
window.startNewGame = startNewGame;
window.showHighScores = showHighScores;
window.showSettings = showSettings;
window.saveSettings = saveSettings;
window.closeSettings = closeSettings;
window.showAchievements = showAchievements;
window.closeAchievements = closeAchievements;
window.resumeGame = resumeGame;
window.restartGame = restartGame;
window.backToMenu = backToMenu;
window.togglePause = togglePause;
window.toggleSound = toggleSound;
window.resetGame = resetGame;
