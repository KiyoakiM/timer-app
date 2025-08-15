class Timer {
    constructor() {
        this.totalSeconds = 0;
        this.currentSeconds = 0;
        this.intervalId = null;
        this.isRunning = false;
        this.isPaused = false;
        
        this.initializeElements();
        this.bindEvents();
        this.updateDisplay();
    }
    
    initializeElements() {
        this.minutesDisplay = document.getElementById('minutes');
        this.secondsDisplay = document.getElementById('seconds');
        this.minuteInput = document.getElementById('minuteInput');
        this.secondInput = document.getElementById('secondInput');
        this.setTimerBtn = document.getElementById('setTimer');
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
    }
    
    bindEvents() {
        this.setTimerBtn.addEventListener('click', () => this.setTimer());
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        
        this.minuteInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.setTimer();
        });
        
        this.secondInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.setTimer();
        });
    }
    
    setTimer() {
        if (this.isRunning) {
            alert('Please stop the current timer before setting a new one.');
            return;
        }
        
        const minutes = parseInt(this.minuteInput.value) || 0;
        const seconds = parseInt(this.secondInput.value) || 0;
        
        if (minutes === 0 && seconds === 0) {
            alert('Please enter a valid time.');
            return;
        }
        
        if (minutes > 59 || seconds > 59) {
            alert('Please enter valid minutes (0-59) and seconds (0-59).');
            return;
        }
        
        this.totalSeconds = (minutes * 60) + seconds;
        this.currentSeconds = this.totalSeconds;
        this.updateDisplay();
        this.updateButtonStates();
        
        this.minuteInput.value = '';
        this.secondInput.value = '';
    }
    
    start() {
        if (this.currentSeconds === 0) {
            alert('Please set a timer first.');
            return;
        }
        
        if (this.isRunning) return;
        
        this.isRunning = true;
        this.isPaused = false;
        this.updateButtonStates();
        
        this.intervalId = setInterval(() => {
            this.currentSeconds--;
            this.updateDisplay();
            
            if (this.currentSeconds <= 0) {
                this.timerComplete();
            }
        }, 1000);
    }
    
    pause() {
        if (!this.isRunning) return;
        
        this.isRunning = false;
        this.isPaused = true;
        clearInterval(this.intervalId);
        this.updateButtonStates();
    }
    
    reset() {
        this.isRunning = false;
        this.isPaused = false;
        clearInterval(this.intervalId);
        this.currentSeconds = this.totalSeconds;
        this.updateDisplay();
        this.updateButtonStates();
    }
    
    timerComplete() {
        this.isRunning = false;
        this.isPaused = false;
        clearInterval(this.intervalId);
        this.currentSeconds = 0;
        this.updateDisplay();
        this.updateButtonStates();
        
        this.playAlarm();
        alert('Time\'s up!');
    }
    
    updateDisplay() {
        const minutes = Math.floor(this.currentSeconds / 60);
        const seconds = this.currentSeconds % 60;
        
        this.minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        this.secondsDisplay.textContent = seconds.toString().padStart(2, '0');
        
        if (this.currentSeconds <= 10 && this.currentSeconds > 0 && this.isRunning) {
            this.minutesDisplay.style.color = '#ff4444';
            this.secondsDisplay.style.color = '#ff4444';
        } else {
            this.minutesDisplay.style.color = 'white';
            this.secondsDisplay.style.color = 'white';
        }
    }
    
    updateButtonStates() {
        this.startBtn.disabled = this.isRunning || this.currentSeconds === 0;
        this.pauseBtn.disabled = !this.isRunning;
        this.resetBtn.disabled = this.currentSeconds === this.totalSeconds && !this.isPaused;
        this.setTimerBtn.disabled = this.isRunning;
    }
    
    playAlarm() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.5);
        
        setTimeout(() => {
            const oscillator2 = audioContext.createOscillator();
            const gainNode2 = audioContext.createGain();
            
            oscillator2.connect(gainNode2);
            gainNode2.connect(audioContext.destination);
            
            oscillator2.frequency.setValueAtTime(600, audioContext.currentTime);
            gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime);
            
            oscillator2.start();
            oscillator2.stop(audioContext.currentTime + 0.5);
        }, 600);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Timer();
});