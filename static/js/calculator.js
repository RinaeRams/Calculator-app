class Calculator {
    constructor() {
        this.display = document.getElementById('display');
        this.historyDisplay = document.getElementById('history-display');
        this.memoryIndicator = document.getElementById('memory-indicator');
        this.memoryValue = document.getElementById('memory-value');
        this.historyPanel = document.getElementById('history-panel');
        this.historyToggle = document.getElementById('history-toggle');
        this.historyList = document.getElementById('history-list');
        this.errorModal = document.getElementById('error-modal');
        this.errorMessage = document.getElementById('error-message');
        this.scientificFunctions = document.getElementById('scientific-functions');
        
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = '';
        this.waitingForOperand = false;
        this.isScientificMode = false;
        this.memory = 0;
        
        this.initializeEventListeners();
        this.loadHistory();
        this.updateMemoryDisplay();
    }
    
    initializeEventListeners() {
        // Button clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('.btn')) {
                this.handleButtonClick(e.target);
            }
        });
        
        // Keyboard support
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardInput(e);
        });
        
        // Mode toggle
        document.getElementById('basic-mode').addEventListener('click', () => {
            this.toggleMode(false);
        });
        
        document.getElementById('scientific-mode').addEventListener('click', () => {
            this.toggleMode(true);
        });
        
        // History toggle
        this.historyToggle.addEventListener('click', () => {
            this.toggleHistory();
        });
        
        // Clear history
        document.getElementById('clear-history').addEventListener('click', () => {
            this.clearHistory();
        });
        
        // Modal close
        document.getElementById('modal-close').addEventListener('click', () => {
            this.closeModal();
        });
        
        // Click outside modal to close
        this.errorModal.addEventListener('click', (e) => {
            if (e.target === this.errorModal) {
                this.closeModal();
            }
        });
    }
    
    handleButtonClick(button) {
        const action = button.dataset.action;
        const value = button.dataset.value;
        
        // Add button press animation
        button.classList.add('pressed');
        setTimeout(() => button.classList.remove('pressed'), 100);
        
        if (action) {
            this.handleAction(action);
        } else if (value) {
            this.handleInput(value);
        }
    }
    
    handleKeyboardInput(e) {
        const key = e.key;
        
        // Prevent default for calculator keys
        if (/[0-9+\-*/.=]/.test(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace') {
            e.preventDefault();
        }
        
        // Number keys
        if (/[0-9.]/.test(key)) {
            this.handleInput(key);
        }
        
        // Operator keys
        switch (key) {
            case '+':
                this.handleInput('+');
                break;
            case '-':
                this.handleInput('-');
                break;
            case '*':
                this.handleInput('*');
                break;
            case '/':
                this.handleInput('/');
                break;
            case '=':
            case 'Enter':
                this.handleAction('calculate');
                break;
            case 'Escape':
                this.handleAction('clear-all');
                break;
            case 'Backspace':
                this.handleAction('backspace');
                break;
            case '(':
                this.handleInput('(');
                break;
            case ')':
                this.handleInput(')');
                break;
            case '^':
                this.handleInput('^');
                break;
            case '%':
                this.handleInput('%');
                break;
        }
    }
    
    handleInput(value) {
        if (this.waitingForOperand) {
            this.currentInput = value;
            this.waitingForOperand = false;
        } else {
            this.currentInput = this.currentInput === '0' ? value : this.currentInput + value;
        }
        
        this.updateDisplay();
        this.updateHistoryDisplay();
    }
    
    handleAction(action) {
        switch (action) {
            case 'clear-all':
                this.clearAll();
                break;
            case 'clear-entry':
                this.clearEntry();
                break;
            case 'backspace':
                this.backspace();
                break;
            case 'calculate':
                this.calculate();
                break;
            case 'memory-store':
                this.memoryStore();
                break;
            case 'memory-recall':
                this.memoryRecall();
                break;
            case 'memory-clear':
                this.memoryClear();
                break;
            case 'memory-add':
                this.memoryAdd();
                break;
            case 'memory-subtract':
                this.memorySubtract();
                break;
        }
    }
    
    clearAll() {
        this.currentInput = '0';
        this.previousInput = '';
        this.operator = '';
        this.waitingForOperand = false;
        this.updateDisplay();
        this.updateHistoryDisplay();
    }
    
    clearEntry() {
        this.currentInput = '0';
        this.updateDisplay();
    }
    
    backspace() {
        if (this.currentInput.length > 1) {
            this.currentInput = this.currentInput.slice(0, -1);
        } else {
            this.currentInput = '0';
        }
        this.updateDisplay();
    }
    
    async calculate() {
        try {
            this.showLoading(true);
            
            const expression = this.currentInput;
            const response = await fetch('/api/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ expression })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                this.currentInput = data.result.toString();
                this.updateDisplay();
                this.updateHistoryDisplay(`${expression} = ${data.result}`);
                this.loadHistory(); // Refresh history
                this.waitingForOperand = true;
            } else {
                this.showError(data.error);
            }
        } catch (error) {
            this.showError('Connection error. Please try again.');
        } finally {
            this.showLoading(false);
        }
    }
    
    async memoryStore() {
        try {
            const value = parseFloat(this.currentInput);
            const response = await fetch('/api/memory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ operation: 'store', value })
            });
            
            const data = await response.json();
            if (response.ok) {
                this.memory = data.memory;
                this.updateMemoryDisplay();
            }
        } catch (error) {
            this.showError('Memory operation failed');
        }
    }
    
    async memoryRecall() {
        try {
            const response = await fetch('/api/memory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ operation: 'recall' })
            });
            
            const data = await response.json();
            if (response.ok) {
                this.currentInput = data.memory.toString();
                this.updateDisplay();
                this.waitingForOperand = true;
            }
        } catch (error) {
            this.showError('Memory operation failed');
        }
    }
    
    async memoryClear() {
        try {
            const response = await fetch('/api/memory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ operation: 'clear' })
            });
            
            const data = await response.json();
            if (response.ok) {
                this.memory = data.memory;
                this.updateMemoryDisplay();
            }
        } catch (error) {
            this.showError('Memory operation failed');
        }
    }
    
    async memoryAdd() {
        try {
            const value = parseFloat(this.currentInput);
            const response = await fetch('/api/memory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ operation: 'add', value })
            });
            
            const data = await response.json();
            if (response.ok) {
                this.memory = data.memory;
                this.updateMemoryDisplay();
            }
        } catch (error) {
            this.showError('Memory operation failed');
        }
    }
    
    async memorySubtract() {
        try {
            const value = parseFloat(this.currentInput);
            const response = await fetch('/api/memory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ operation: 'subtract', value })
            });
            
            const data = await response.json();
            if (response.ok) {
                this.memory = data.memory;
                this.updateMemoryDisplay();
            }
        } catch (error) {
            this.showError('Memory operation failed');
        }
    }
    
    toggleMode(isScientific) {
        this.isScientificMode = isScientific;
        
        // Update mode buttons
        document.getElementById('basic-mode').classList.toggle('active', !isScientific);
        document.getElementById('scientific-mode').classList.toggle('active', isScientific);
        
        // Toggle scientific functions
        this.scientificFunctions.classList.toggle('active', isScientific);
    }
    
    toggleHistory() {
        const isActive = this.historyPanel.classList.contains('active');
        this.historyPanel.classList.toggle('active');
        this.historyToggle.classList.toggle('active');
        
        if (!isActive) {
            this.loadHistory();
        }
    }
    
    async loadHistory() {
        try {
            const response = await fetch('/api/history');
            const data = await response.json();
            
            if (response.ok) {
                this.displayHistory(data.history);
            }
        } catch (error) {
            console.error('Failed to load history');
        }
    }
    
    displayHistory(history) {
        if (history.length === 0) {
            this.historyList.innerHTML = '<p class="no-history">No calculations yet</p>';
            return;
        }
        
        this.historyList.innerHTML = history
            .reverse()
            .map(item => `<div class="history-item" onclick="calculator.useHistoryItem('${item}')">${item}</div>`)
            .join('');
    }
    
    useHistoryItem(item) {
        // Extract result from history item (format: "expression = result")
        const result = item.split(' = ')[1];
        if (result) {
            this.currentInput = result;
            this.updateDisplay();
            this.waitingForOperand = true;
        }
    }
    
    async clearHistory() {
        try {
            const response = await fetch('/api/history', {
                method: 'DELETE'
            });
            
            if (response.ok) {
                this.displayHistory([]);
            }
        } catch (error) {
            this.showError('Failed to clear history');
        }
    }
    
    updateDisplay() {
        // Format large numbers
        let displayValue = this.currentInput;
        if (!isNaN(displayValue) && displayValue.length > 12) {
            displayValue = parseFloat(displayValue).toExponential(6);
        }
        
        this.display.value = displayValue;
        
        // Auto-resize font for long numbers
        const fontSize = Math.min(2.5, Math.max(1.5, 30 / displayValue.length));
        this.display.style.fontSize = `${fontSize}rem`;
    }
    
    updateHistoryDisplay(calculation = '') {
        if (calculation) {
            this.historyDisplay.textContent = calculation;
        } else {
            this.historyDisplay.textContent = this.currentInput;
        }
    }
    
    updateMemoryDisplay() {
        this.memoryValue.textContent = this.memory;
        this.memoryIndicator.classList.toggle('active', this.memory !== 0);
    }
    
    showError(message) {
        this.errorMessage.textContent = message;
        this.errorModal.classList.add('active');
        
        // Auto-close after 3 seconds
        setTimeout(() => {
            this.closeModal();
        }, 3000);
    }
    
    closeModal() {
        this.errorModal.classList.remove('active');
    }
    
    showLoading(show) {
        if (show) {
            this.display.classList.add('loading');
        } else {
            this.display.classList.remove('loading');
        }
    }
}

// Utility functions for advanced features
class CalculatorUtils {
    static formatNumber(num) {
        if (Math.abs(num) < 1e-10) return '0';
        if (Math.abs(num) >= 1e10 || (Math.abs(num) < 1e-4 && Math.abs(num) > 0)) {
            return num.toExponential(6);
        }
        return num.toString();
    }
    
    static isValidExpression(expr) {
        try {
            // Basic validation
            const validChars = /^[0-9+\-*/.()^%\s]+$/;
            return validChars.test(expr);
        } catch {
            return false;
        }
    }
    
    static addThousandsSeparator(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
}

// Theme manager for dark/light mode
class ThemeManager {
    constructor() {
        this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.init();
    }
    
    init() {
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            this.isDark = e.matches;
            this.updateTheme();
        });
        
        this.updateTheme();
    }
    
    updateTheme() {
        document.body.classList.toggle('dark-theme', this.isDark);
    }
    
    toggle() {
        this.isDark = !this.isDark;
        this.updateTheme();
    }
}

// Animation manager for enhanced UX
class AnimationManager {
    static rippleEffect(element, event) {
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    static bounceIn(element) {
        element.style.animation = 'bounceIn 0.6s ease-out';
        setTimeout(() => {
            element.style.animation = '';
        }, 600);
    }
}

// Add ripple animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    @keyframes bounceIn {
        0% {
            transform: scale(0.3);
            opacity: 0;
        }
        50% {
            transform: scale(1.05);
        }
        70% {
            transform: scale(0.9);
        }
        100% {
            transform: scale(1);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Initialize the calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.calculator = new Calculator();
    window.themeManager = new ThemeManager();
    
    // Add ripple effects to buttons
    document.addEventListener('click', (e) => {
        if (e.target.matches('.btn')) {
            AnimationManager.rippleEffect(e.target, e);
        }
    });
    
    // Add bounce animation to calculator on load
    setTimeout(() => {
        AnimationManager.bounceIn(document.querySelector('.calculator-wrapper'));
    }, 100);
});

// Service Worker registration for PWA capabilities (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}