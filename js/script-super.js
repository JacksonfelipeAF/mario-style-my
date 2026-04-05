// MARIO SUPER EDITION - COM TODAS AS MELHORIAS!

const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const gameBoard = document.querySelector('.game-board');

// Detecta qual arquivo HTML está sendo usado
const isMainPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';
const imgPath = isMainPage ? 'img/' : '../img/';

// Inicializa sistemas
const soundManager = new SoundManager();
const scoreManager = new ScoreManager();
const particleSystem = new ParticleSystem();

// Variáveis do jogo
let score = 0;
let lives = 3;
let level = 1;
let gameSpeed = 1.5;
let isGameOver = false;
let isInvincible = false;
let loop;
let powerUpActive = false;

// Elementos UI
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const highScoreElement = document.getElementById('high-score');
const levelElement = document.getElementById('level');

// Inicializa UI
function initializeUI() {
    if (scoreElement) scoreElement.textContent = `Pontos: ${score}`;
    if (livesElement) livesElement.textContent = `Vidas: ${'❤️'.repeat(lives)}`;
    if (highScoreElement) highScoreElement.textContent = `Recorde: ${scoreManager.getHighScore()}`;
    if (levelElement) levelElement.textContent = `Nível: ${level}`;
}

// Sistema de pulo
const jump = () => {
    if (isGameOver) return;
    
    soundManager.play('jump');
    mario.classList.add('jump');
    
    // Cria partículas no pulo
    const marioRect = mario.getBoundingClientRect();
    const boardRect = gameBoard.getBoundingClientRect();
    particleSystem.burst(
        marioRect.left - boardRect.left + 55,
        marioRect.top - boardRect.top + 100,
        5,
        '#87CEEB'
    );
    
    setTimeout(() => {
        mario.classList.remove('jump');
    }, 500);
};

// Atualiza score
const updateScore = () => {
    score++;
    soundManager.play('point');
    
    if (scoreElement) scoreElement.textContent = `Pontos: ${score}`;
    
    // Partículas de pontos
    const scoreRect = scoreElement.getBoundingClientRect();
    particleSystem.burst(scoreRect.left, scoreRect.top, 8, '#FFD700');
    
    // Aumenta nível a cada 10 pontos
    if (score % 10 === 0) {
        levelUp();
    }
    
    // Aumenta velocidade a cada 5 pontos
    if (score % 5 === 0) {
        gameSpeed = Math.max(0.5, gameSpeed - 0.1);
        pipe.style.animationDuration = `${gameSpeed}s`;
    }
};

// Sistema de nível
const levelUp = () => {
    level++;
    soundManager.play('powerUp');
    
    if (levelElement) levelElement.textContent = `Nível: ${level}`;
    
    // Efeitos de level up
    gameBoard.style.animation = 'levelUp 0.5s ease';
    setTimeout(() => {
        gameBoard.style.animation = '';
    }, 500);
    
    // Adiciona vida a cada 2 níveis
    if (level % 2 === 0 && lives < 5) {
        lives++;
        updateLives();
    }
};

// Atualiza vidas
const updateLives = () => {
    if (livesElement) {
        livesElement.textContent = `Vidas: ${'❤️'.repeat(lives)}`;
        livesElement.style.animation = 'hurt 0.5s ease';
        setTimeout(() => {
            livesElement.style.animation = '';
        }, 500);
    }
};

// Sistema de dano
const takeDamage = () => {
    if (isInvincible) return;
    
    lives--;
    soundManager.play('hurt');
    updateLives();
    
    // Torna invencível por 2 segundos
    isInvincible = true;
    mario.style.opacity = '0.5';
    
    // Efeito de dano
    mario.style.animation = 'hurt 0.5s ease';
    setTimeout(() => {
        mario.style.animation = '';
    }, 500);
    
    setTimeout(() => {
        isInvincible = false;
        mario.style.opacity = '1';
    }, 2000);
    
    if (lives <= 0) {
        gameOver();
    }
};

// Game Over
const gameOver = () => {
    isGameOver = true;
    soundManager.play('gameOver');
    
    pipe.style.animation = 'none';
    pipe.style.left = `${pipe.offsetLeft}px`;
    
    mario.style.animation = 'none';
    mario.style.bottom = `${window.getComputedStyle(mario).bottom}`;
    
    mario.src = imgPath + 'gif-morto.gif';
    mario.style.width = '100px';
    mario.style.marginLeft = '5px';
    
    clearInterval(loop);
    
    // Salva score
    const isNewRecord = scoreManager.setHighScore(score);
    scoreManager.addScore(score);
    
    // Mostra game over
    const gameOverElement = document.getElementById('game-over');
    if (gameOverElement) {
        gameOverElement.style.display = 'block';
        gameOverElement.innerHTML = `
            <h2>Game Over!</h2>
            <p>Pontuação final: ${score}</p>
            <p>Nível alcançado: ${level}</p>
            ${isNewRecord ? '<p style="color: #FFD700;">🏆 NOVO RECORDE! 🏆</p>' : ''}
            <p>Recorde: ${scoreManager.getHighScore()}</p>
            <button onclick="resetGame()">Jogar Novamente</button>
            <button onclick="showHighScores()">Melhores Pontuações</button>
        `;
    }
};

// Reset do jogo
const resetGame = () => {
    score = 0;
    lives = 3;
    level = 1;
    gameSpeed = 1.5;
    isGameOver = false;
    isInvincible = false;
    powerUpActive = false;
    
    // Reinicia Mario
    mario.src = imgPath + 'mario-gif.gif';
    mario.style.width = '110px';
    mario.style.marginLeft = '0';
    mario.style.bottom = '0';
    mario.style.animation = '';
    mario.style.display = 'block';
    mario.style.opacity = '1';
    
    // Reinicia cano
    pipe.style.animation = '';
    pipe.style.right = '-80px';
    pipe.style.left = '';
    pipe.style.display = 'block';
    
    // Reseta UI
    initializeUI();
    
    // Esconde game over
    const gameOverElement = document.getElementById('game-over');
    if (gameOverElement) {
        gameOverElement.style.display = 'none';
    }
    
    // Força recarregamento da imagem
    setTimeout(() => {
        mario.src = imgPath + 'mario-gif.gif?t=' + Date.now();
    }, 100);
    
    startGame();
};

// Mostra melhores pontuações
const showHighScores = () => {
    const topScores = scoreManager.getTopScores();
    const gameOverElement = document.getElementById('game-over');
    
    if (gameOverElement) {
        gameOverElement.innerHTML = `
            <h2>🏆 Melhores Pontuações 🏆</h2>
            ${topScores.length > 0 ? topScores.map((score, index) => 
                `<p>${index + 1}º - ${score} pontos</p>`
            ).join('') : '<p>Nenhuma pontuação ainda</p>'}
            <button onclick="resetGame()">Voltar ao Jogo</button>
        `;
    }
};

// Loop principal do jogo
const startGame = () => {
    loop = setInterval(() => {
        if (isGameOver) return;
        
        const pipePosition = pipe.offsetLeft;
        const marioPosition = +window.getComputedStyle(mario).bottom.replace('px', '');
        
        // Detecção de colisão
        if (pipePosition <= 50 && pipePosition > 0 && marioPosition < 90) {
            takeDamage();
        } else if (pipePosition < -50) {
            updateScore();
        }
    }, 15);
};

// Controles
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        e.preventDefault();
        jump();
    }
    
    // Cheat codes para testes
    if (e.code === 'KeyI' && e.ctrlKey) {
        // Ctrl+I = Invencibilidade
        isInvincible = !isInvincible;
        mario.style.opacity = isInvincible ? '0.7' : '1';
    }
    
    if (e.code === 'KeyL' && e.ctrlKey) {
        // Ctrl+L = Adicionar vida
        if (lives < 5) {
            lives++;
            updateLives();
        }
    }
});

document.addEventListener('click', (e) => {
    if (e.target.closest('.game-board') && !e.target.closest('button')) {
        jump();
    }
});

// Adiciona estilos CSS dinâmicos
const style = document.createElement('style');
style.textContent = `
    @keyframes levelUp {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
    
    @keyframes hurt {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Inicia o jogo
initializeUI();
startGame();
