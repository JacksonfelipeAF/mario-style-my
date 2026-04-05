// Sistema de Efeitos Sonoros
class SoundManager {
    constructor() {
        this.sounds = {
            jump: this.createSound(800, 0.1, 0.1, 'square'),
            gameOver: this.createSound(200, 0.3, 0.3, 'sawtooth'),
            point: this.createSound(1200, 0.1, 0.1, 'sine'),
            powerUp: this.createSound(1600, 0.2, 0.2, 'triangle'),
            hurt: this.createSound(150, 0.2, 0.2, 'square')
        };
    }

    createSound(frequency, duration, volume, type = 'sine') {
        return () => {
            try {
                const audioContext = new (window.AudioContext || window.webkitAudioContext)();
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.value = frequency;
                oscillator.type = type;
                
                gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + duration);
            } catch (e) {
                // Silently fail if audio context is not supported
            }
        };
    }

    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }
}

// Sistema de High Score
class ScoreManager {
    constructor() {
        this.highScore = this.getHighScore();
    }

    getHighScore() {
        return parseInt(localStorage.getItem('marioHighScore') || '0');
    }

    setHighScore(score) {
        if (score > this.highScore) {
            this.highScore = score;
            localStorage.setItem('marioHighScore', score.toString());
            return true; // New record!
        }
        return false;
    }

    getTopScores() {
        const scores = JSON.parse(localStorage.getItem('marioTopScores') || '[]');
        return scores.sort((a, b) => b - a).slice(0, 5);
    }

    addScore(score) {
        let scores = JSON.parse(localStorage.getItem('marioTopScores') || '[]');
        scores.push(score);
        scores = scores.sort((a, b) => b - a).slice(0, 5);
        localStorage.setItem('marioTopScores', JSON.stringify(scores));
    }
}

// Sistema de Partículas
class ParticleSystem {
    constructor() {
        this.particles = [];
    }

    createParticle(x, y, color = '#FFD700', size = 4) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.backgroundColor = color;
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        
        document.querySelector('.game-board').appendChild(particle);
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 2 + Math.random() * 3;
        const lifetime = 500 + Math.random() * 500;
        
        this.animateParticle(particle, angle, velocity, lifetime);
    }

    animateParticle(particle, angle, velocity, lifetime) {
        let elapsed = 0;
        const animate = () => {
            elapsed += 16;
            const progress = elapsed / lifetime;
            
            const x = Math.cos(angle) * velocity * (1 - progress) * 50;
            const y = Math.sin(angle) * velocity * (1 - progress) * 50 - progress * 100;
            
            particle.style.transform = `translate(${x}px, ${y}px)`;
            particle.style.opacity = 1 - progress;
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                particle.remove();
            }
        };
        
        requestAnimationFrame(animate);
    }

    burst(x, y, count = 10, color = '#FFD700') {
        for (let i = 0; i < count; i++) {
            setTimeout(() => this.createParticle(x, y, color), i * 20);
        }
    }
}
