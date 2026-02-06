const lottoNumbersContainer = document.querySelector('.lotto-numbers');
const generateBtn = document.getElementById('generate-btn');

if (lottoNumbersContainer && generateBtn) {
    function generateLottoNumbers() {
        const numbers = new Set();
        while (numbers.size < 6) {
            const randomNumber = Math.floor(Math.random() * 45) + 1;
            numbers.add(randomNumber);
        }
        return Array.from(numbers);
    }

    function displayNumbers(numbers) {
        lottoNumbersContainer.innerHTML = '';
        numbers.forEach(number => {
            const numberElement = document.createElement('div');
            numberElement.classList.add('lotto-number');
            numberElement.textContent = number;
            lottoNumbersContainer.appendChild(numberElement);
        });
    }

    generateBtn.addEventListener('click', () => {
        const lottoNumbers = generateLottoNumbers();
        displayNumbers(lottoNumbers);
    });
}


// Theme Toggle Functionality
const themeToggleButton = document.getElementById('theme-toggle');

function applyTheme(theme) {
    document.body.classList.toggle('dark-mode', theme === 'dark');
}

function toggleTheme() {
    const isDarkMode = document.body.classList.contains('dark-mode');
    const newTheme = isDarkMode ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
}

// Initial theme setup
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        applyTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        applyTheme('dark'); // Use system preference if no saved theme
    } else {
        applyTheme('light'); // Default to light mode
    }

    if (themeToggleButton) {
        themeToggleButton.addEventListener('click', toggleTheme);
    }
});


// Web Component: Fun Tool Card
class FunToolCard extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        const template = document.createElement('template');
        template.innerHTML = `
            <style>
                :host {
                    display: block;
                    background-color: var(--bg-color-medium, #fff);
                    border-radius: 8px;
                    box-shadow: var(--shadow-light, 0 2px 4px rgba(0, 0, 0, 0.1));
                    padding: 20px;
                    text-align: center;
                    transition: transform 0.2s ease-in-out, box-shadow 0.2s;
                }
                :host(:hover) {
                    transform: translateY(-5px);
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
                }
                .card-header {
                    color: var(--primary-color, #007bff);
                    font-size: 1.3em;
                    margin-bottom: 10px;
                }
                .card-image {
                    max-width: 100%;
                    height: 150px;
                    object-fit: cover;
                    border-radius: 4px;
                    margin-bottom: 15px;
                }
                .card-description {
                    font-size: 0.95em;
                    margin-bottom: 15px;
                    color: var(--text-color-light, #333);
                }
                .card-button {
                    display: inline-block;
                    padding: 8px 15px;
                    background-color: var(--accent-color, #28a745);
                    color: white;
                    border: none;
                    border-radius: 5px;
                    font-size: 0.9em;
                    cursor: pointer;
                    text-decoration: none;
                    transition: background-color 0.3s, transform 0.2s;
                    font-weight: 600;
                }
                .card-button:hover {
                    background-color: #218838;
                    transform: translateY(-2px);
                }

                /* Dark mode adjustments */
                :host(.dark-mode) {
                    background-color: var(--card-bg-dark, #3a3a3a);
                }
                :host(.dark-mode:hover) {
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4);
                }
                :host(.dark-mode) .card-description {
                    color: var(--text-color-dark, #f4f4f4);
                }
            </style>
            <h3 class="card-header"><slot name="title"></slot></h3>
            <img class="card-image" src="" alt="Tool Image">
            <p class="card-description"><slot name="description"></slot></p>
            <a class="card-button"><slot name="button-text">자세히 보기</slot></a>
        `;
        
        shadow.appendChild(template.content.cloneNode(true));
        
        this.imgElement = shadow.querySelector('.card-image');
        this.buttonElement = shadow.querySelector('.card-button');
    }

    static get observedAttributes() {
        return ['image-src', 'image-alt', 'link-href', 'button-text'];
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'image-src' && this.imgElement) {
            this.imgElement.src = newValue;
        }
        if (name === 'image-alt' && this.imgElement) {
            this.imgElement.alt = newValue;
        }
        if (name === 'link-href' && this.buttonElement) {
            this.buttonElement.href = newValue;
        }
        if (name === 'button-text' && this.buttonElement) {
            const slot = this.shadowRoot.querySelector('slot[name="button-text"]');
            if (slot) {
                slot.textContent = newValue;
            }
        }
    }

    connectedCallback() {
        // Apply dark mode class if body has it
        const observer = new MutationObserver(() => {
            if (document.body.classList.contains('dark-mode')) {
                this.classList.add('dark-mode');
            } else {
                this.classList.remove('dark-mode');
            }
        });
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        if (document.body.classList.contains('dark-mode')) {
            this.classList.add('dark-mode');
        }
    }
}

customElements.define('fun-tool-card', FunToolCard);