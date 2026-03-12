const VOCABULARY = [
    { word: 'skills', meaning: 'habilidades', category: 'skills' },
    { word: 'goods', meaning: 'mercancías', category: 'resources' },
    { word: 'accomplishment', meaning: 'logro', category: 'outcomes' },
    { word: 'resources', meaning: 'recursos', category: 'resources' },
    { word: 'available', meaning: 'disponible', category: 'resources' },
    { word: 'likewise', meaning: 'igualmente', category: 'connector' },
    { word: 'developments', meaning: 'desarrollos', category: 'outcomes' },
    { word: 'allowed', meaning: 'permitido', category: 'rules' },
    { word: 'due to', meaning: 'debido a', category: 'connector' },
    { word: 'improves', meaning: 'mejora', category: 'outcomes' },
    { word: 'worsens', meaning: 'empeora', category: 'outcomes' },
    { word: 'whether or', meaning: 'ya sea... o...', category: 'connector' }
];

document.addEventListener('DOMContentLoaded', () => {
    // --- Hamburger Menu Toggle ---
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');

    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('open');
            navLinks.classList.toggle('open');
        });
    }

    // --- Section Navigation ---
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.activity-section');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            navBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Show target section
            const target = btn.dataset.target;
            sections.forEach(s => s.classList.remove('active'));
            const targetSection = document.getElementById(target);
            if (targetSection) targetSection.classList.add('active');

            // Close hamburger menu on mobile after selection
            if (navLinks) navLinks.classList.remove('open');
            if (hamburgerBtn) hamburgerBtn.classList.remove('open');
        });
    });

    initDragAndDrop();
    // initFillBlanks(); <- Removed as requested
    initCrossword();
    initAILab();
    initHangman();
    initScramble();
    initTyping();

    // --- Result Modal Control ---
    const resultModal = document.getElementById('result-modal');
    const closeResultX = document.getElementById('close-result');
    const closeResultBtn = document.getElementById('close-result-btn');

    if (resultModal && closeResultX && closeResultBtn) {
        [closeResultX, closeResultBtn].forEach(el => {
            el.onclick = () => resultModal.classList.add('hidden');
        });
        window.addEventListener('click', (e) => {
            if (e.target === resultModal) resultModal.classList.add('hidden');
        });
    }
});

// 5. AI Lab Logic (Grid of Cards)
function initAILab() {
    const grid = document.getElementById('ai-word-grid');
    const modal = document.getElementById('prompt-modal');
    const modalTitle = document.getElementById('modal-word-title');
    const content = document.getElementById('prompt-content');
    const closeBtn = document.getElementById('close-modal');
    const copyBtn = document.getElementById('copy-prompt');

    if (!grid || !modal || !modalTitle || !content || !closeBtn || !copyBtn) return;

    grid.innerHTML = '';

    VOCABULARY.forEach(item => {
        const card = document.createElement('div');
        card.className = 'word-card';

        // YouGlish link for pronunciation and context
        const youglishSearch = `https://youglish.com/pronounce/${item.word}/english`;

        card.innerHTML = `
            <h3>${item.word}</h3>
            <p>${item.meaning}</p>
            <button class="prompt-btn-text">Generar Prompt</button>
            <div class="card-actions">
                <a href="${youglishSearch}" target="_blank" class="card-btn yg" title="Ver en YouGlish">YG</a>
            </div>
        `;

        card.querySelector('.prompt-btn-text').onclick = () => {
            const prompt = `Actúa como un Docente de Inglés de Innovar UNTREF (no un tutor).

MÉTODO ROCKET para el término: "${item.word.toUpperCase()}"
R - ROL: Eres Docente de Inglés de Innovar UNTREF, experto en Inglés Técnico para Ingeniería.
O - OBJETIVO: Que el estudiante domine "${item.word.toUpperCase()}" en un contexto de Ingeniería Informática.
C - RECURSOS INSTITUCIONALES (Vínculos Directos):
    - Innovar UNTREF: https://www.innovaruntref.com.ar
K - KEY DETAILS (Detalles clave):
    1. Definición técnica precisa de "${item.word.toUpperCase()}" (EN/ES).
    2. 3 casos de uso reales en desarrollo/infraestructura.
    3. Analiza la pronunciación de "${item.word.toUpperCase()}" en YouGlish: ${youglishSearch}
    4. Actividades lúdicas recomendadas con vínculos directos.
E - EXPECTATIVA: Respuesta pedagógica, estructurada y profesional.
T - TONO: Académico y facilitador.

Instrucción final: Saluda como 'Docente de Inglés de Innovar UNTREF', presenta el contenido ROCKET utilizando materiales de www.innovaruntref.com.ar y propón un 'INTERACTIVE CHALLENGE' técnico sobre "${item.word.toUpperCase()}".`;

            modalTitle.innerHTML = `<h3 style="color: var(--primary-color); margin-bottom: 0;">Practicando: ${item.word}</h3><p style="margin-top:5px; color: #666;">${item.meaning}</p>`;
            
            // Typewriter effect
            modal.classList.remove('hidden');
            typeWriterEffect(content, prompt, 1);
        };

        grid.appendChild(card);
    });

    closeBtn.onclick = () => {
        modal.classList.add('hidden');
        if (window.typeWriterInterval) clearInterval(window.typeWriterInterval);
    };
    window.onclick = (event) => { 
        if (event.target == modal) {
            modal.classList.add('hidden');
            if (window.typeWriterInterval) clearInterval(window.typeWriterInterval);
        }
    };

    copyBtn.onclick = () => {
        navigator.clipboard.writeText(content.textContent).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '¡Prompt Copiado!';
            copyBtn.style.backgroundColor = 'var(--success-color)';
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.backgroundColor = '';
            }, 2000);
            showFeedback('Prompt copiado');
        });
    };
}

function showResultPopup(message, count = 0, total = 0) {
    const modal = document.getElementById('result-modal');
    const body = document.getElementById('result-body');
    const starContainer = document.getElementById('result-stars');
    if (modal && body) {
        body.textContent = message;
        
        // Show stars in popup
        if (starContainer && total > 0) {
            updateStars('result-stars', count, total);
            starContainer.classList.remove('hidden');
        } else if (starContainer) {
            starContainer.classList.add('hidden');
        }

        modal.classList.remove('hidden');
    }
}

// Typewriter Effect Helper
function typeWriterEffect(element, text, speed) {
    if (window.typeWriterInterval) clearInterval(window.typeWriterInterval);
    element.textContent = '';
    let i = 0;
    const charsPerTick = 4; // Warp speed: append 4 characters at once
    window.typeWriterInterval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.substr(i, charsPerTick);
            i += charsPerTick;
            // Scroll to bottom as typing occurs
            element.parentElement.scrollTop = element.parentElement.scrollHeight;
        } else {
            clearInterval(window.typeWriterInterval);
        }
    }, speed);
}
// Helper for Scores
function updateStars(containerId, count, total) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';
    const starsToShow = Math.floor((count / total) * 5); // Scale to 5 stars
    for (let i = 0; i < starsToShow; i++) {
        const star = document.createElement('span');
        star.className = 'untref-star';
        star.textContent = '★';
        container.appendChild(star);
    }
}

// Navigation Logic
function initNavigation() {
    const btns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.activity-section');

    btns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.target;
            btns.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            btn.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });
}

// Toast Feedback
function showFeedback(msg, type = 'success') {
    const toast = document.getElementById('feedback-toast');
    toast.textContent = msg;
    toast.className = `toast ${type}`;
    toast.classList.remove('hidden');
    setTimeout(() => toast.classList.add('hidden'), 3000);
}

// 1. Drag & Drop Logic
function initDragAndDrop() {
    const pool = document.getElementById('word-pool');
    const dropZonesContainer = document.querySelector('.drop-zones');

    if (!pool || !dropZonesContainer) return;

    function buildDrag() {
        pool.innerHTML = '';
        dropZonesContainer.innerHTML = '';

        const meanings = VOCABULARY.map(v => ({ text: v.meaning, match: v.word }));
        const shuffledMeanings = [...meanings].sort(() => Math.random() - 0.5);

        shuffledMeanings.forEach(item => {
            const div = document.createElement('div');
            div.className = 'draggable';
            div.draggable = true;
            div.textContent = item.text;
            div.dataset.match = item.match;
            div.addEventListener('dragstart', (e) => {
                div.classList.add('dragging');
                e.dataTransfer.setData('text/plain', item.match);
            });
            div.addEventListener('dragend', () => div.classList.remove('dragging'));
            pool.appendChild(div);
        });

        VOCABULARY.forEach(item => {
            const zone = document.createElement('div');
            zone.className = 'drop-slot';
            zone.dataset.expected = item.word;
            zone.innerHTML = `<span class="slot-label">${item.word}</span> <div class="slot-content"></div>`;
            const content = zone.querySelector('.slot-content');
            zone.addEventListener('dragover', e => e.preventDefault());
            zone.addEventListener('drop', e => {
                e.preventDefault();
                const dragging = document.querySelector('.dragging');
                if (dragging && content.children.length === 0) {
                    content.appendChild(dragging);
                }
            });
            dropZonesContainer.appendChild(zone);
        });
    }

    document.getElementById('check-drag').addEventListener('click', () => {
        let correctCount = 0;
        const slots = document.querySelectorAll('.drop-slot');
        slots.forEach(slot => {
            const expected = slot.dataset.expected;
            const dropped = slot.querySelector('.draggable');
            if (dropped) {
                if (dropped.dataset.match === expected) {
                    dropped.style.backgroundColor = 'var(--success-color)';
                    correctCount++;
                } else {
                    dropped.style.backgroundColor = 'var(--error-color)';
                }
            }
        });
        if (correctCount === VOCABULARY.length) {
            showResultPopup('¡Excelente! Todas las parejas son correctas. (12/12)', correctCount, VOCABULARY.length);
        } else {
            showResultPopup(`Resultado: Emparejaste ${correctCount}/${VOCABULARY.length}.`, correctCount, VOCABULARY.length);
        }
    });

    document.getElementById('reset-drag').addEventListener('click', buildDrag);
    buildDrag();
}

// 2. Fill in the Blanks Logic
function initFillBlanks() {
    const container = document.getElementById('fill-paragraph');
    const wordBankEl = document.getElementById('fill-word-bank');

    if (!container || !wordBankEl) return;

    function buildFill() {
        const sentences = [
            `1. I have good technical <input class="fill-input" data-answer="skills">.`,
            `2. The shop sells common <input class="fill-input" data-answer="goods">.`,
            `3. We need more <input class="fill-input" data-answer="resources"> to work.`,
            `4. The computer is <input class="fill-input" data-answer="available"> now.`,
            `5. My computer <input class="fill-input" data-answer="improves"> with new RAM.`,
            `6. Finishing the project is a big <input class="fill-input" data-answer="accomplishment">.`,
            `7. There are new <input class="fill-input" data-answer="developments"> in tech.`,
            `8. I like pizza; <input class="fill-input" data-answer="likewise">, I like pasta.`,
            `9. The boss <input class="fill-input" data-answer="allowed"> a break.`,
            `10. My PC <input class="fill-input" data-answer="worsens"> <input class="fill-input" data-answer="due to"> the virus.`,
            `11. I don't know <input class="fill-input" data-answer="whether or"> it's A or B.`
        ];
        container.innerHTML = `<div class="fill-paragraph">${sentences.join(' ')}</div>`;
        const allAnswers = [...new Set(container.querySelectorAll('.fill-input'))].map(input => input.dataset.answer);
        wordBankEl.innerHTML = allAnswers.sort(() => Math.random() - 0.5).map(w => `<span class="bank-word">${w}</span>`).join('');
    }

    document.getElementById('check-fill').addEventListener('click', () => {
        const inputs = container.querySelectorAll('.fill-input');
        let correct = 0;
        inputs.forEach(input => {
            const answer = input.dataset.answer.toLowerCase();
            const userVal = input.value.toLowerCase().trim();
            if (userVal === answer) {
                input.style.borderColor = 'var(--success-color)';
                input.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
                correct++;
            } else {
                input.style.borderColor = 'var(--error-color)';
                input.style.backgroundColor = 'rgba(220, 53, 69, 0.1)';
                input.value = "";
                input.placeholder = `[${answer}]`;
            }
        });
        if (correct === inputs.length) {
            showResultPopup(`¡Excelente! Completaste todo correctamente. (${correct}/${inputs.length})`, correct, inputs.length);
        } else {
            showResultPopup(`Resultado: Completaste ${correct}/${inputs.length} correctamente.`, correct, inputs.length);
        }
    });

    document.getElementById('reset-fill').addEventListener('click', buildFill);
    buildFill();
}

// 3. Crossword
function initCrossword() {
    const gridEl = document.getElementById('crossword-grid');
    const cluesEl = document.getElementById('clue-list');

    if (!gridEl || !cluesEl) return;

    function buildCrossword() {
        const crosswordData = [
            { word: 'ACCOMPLISHMENT', x: 0, y: 2, dir: 'across', clue: 'Logro o éxito.' },
            { word: 'DEVELOPMENTS', x: 1, y: 10, dir: 'across', clue: 'Nuevos desarrollos.' },
            { word: 'SKILLS', x: 0, y: 0, dir: 'across', clue: 'Habilidades.' },
            { word: 'WHETHEROR', x: 0, y: 0, dir: 'down', clue: 'Ya sea... o...' },
            { word: 'RESOURCES', x: 4, y: 0, dir: 'down', clue: 'Recursos.' },
            { word: 'AVAILABLE', x: 8, y: 2, dir: 'down', clue: 'Disponible.' },
            { word: 'LIKEWISE', x: 10, y: 2, dir: 'down', clue: 'Igualmente.' },
            { word: 'GOODS', x: 0, y: 5, dir: 'across', clue: 'Mercancías.' },
            { word: 'ALLOWED', x: 6, y: 6, dir: 'across', clue: 'Permitido.' },
            { word: 'IMPROVES', x: 3, y: 8, dir: 'across', clue: 'Mejora.' },
            { word: 'WORSENS', x: 13, y: 2, dir: 'down', clue: 'Empeora.' },
            { word: 'DUETO', x: 10, y: 12, dir: 'across', clue: 'Debido a.' }
        ];

        const GRID_SIZE = 15;
        gridEl.style.display = 'grid';
        gridEl.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 30px)`;
        gridEl.innerHTML = '';
        cluesEl.innerHTML = '';

        const grid = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(null));

        crosswordData.forEach((item, index) => {
            for (let i = 0; i < item.word.length; i++) {
                const currX = item.dir === 'across' ? item.x + i : item.x;
                const currY = item.dir === 'across' ? item.y : item.y + i;
                if (currX < GRID_SIZE && currY < GRID_SIZE) {
                    if (!grid[currY][currX]) grid[currY][currX] = { char: item.word[i], num: null };
                    if (i === 0) {
                        grid[currY][currX].num = grid[currY][currX].num ? `${grid[currY][currX].num}/${index + 1}` : index + 1;
                    }
                }
            }
            const li = document.createElement('li');
            li.innerHTML = `<strong>${index + 1}.</strong> ${item.clue}`;
            cluesEl.appendChild(li);
        });

        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                if (grid[y][x]) {
                    const input = document.createElement('input');
                    input.maxLength = 1;
                    input.dataset.answer = grid[y][x].char;
                    if (grid[y][x].num) {
                        const num = document.createElement('span');
                        num.className = 'cell-num';
                        num.textContent = grid[y][x].num;
                        cell.appendChild(num);
                    }
                    cell.appendChild(input);
                } else cell.classList.add('empty-cell');
                gridEl.appendChild(cell);
            }
        }
    }

    document.getElementById('check-crossword').addEventListener('click', () => {
        const inputs = gridEl.querySelectorAll('input');
        let correct = 0;
        inputs.forEach(input => {
            if (input.value.toUpperCase() === input.dataset.answer) {
                input.style.backgroundColor = '#d4edda';
                correct++;
            } else input.style.backgroundColor = '#f8d7da';
        });
        if (correct === inputs.length) {
            showResultPopup(`¡Felicidades! Crucigrama completado (${correct}/${inputs.length})`, correct, inputs.length);
        } else {
            showResultPopup(`Llevas ${correct} de ${inputs.length} letras correctas.`, correct, inputs.length);
        }
    });

    document.getElementById('reset-crossword').addEventListener('click', buildCrossword);
    buildCrossword();
}

// 4. Hangman Logic
function initHangman() {
    const canvas = document.getElementById('hangman-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const wordDisplay = document.getElementById('word-display');
    const alphabetEl = document.getElementById('alphabet');
    const hintText = document.getElementById('hangman-hint');

    if (!wordDisplay || !alphabetEl || !hintText) return;

    let chosenWord = '';
    let guessedLetters = [];
    let mistakes = 0;

    function resetGame() {
        const item = VOCABULARY[Math.floor(Math.random() * VOCABULARY.length)];
        chosenWord = item.word.toUpperCase().replace(/\s/g, '');
        guessedLetters = [];
        mistakes = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawBase();
        updateDisplay();
        renderAlphabet();
        hintText.textContent = `Significado: ${item.meaning}`;
    }

    function drawBase() {
        ctx.strokeStyle = '#333'; ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(20, 230); ctx.lineTo(180, 230);
        ctx.moveTo(50, 230); ctx.lineTo(50, 20);
        ctx.lineTo(150, 20); ctx.lineTo(150, 50);
        ctx.stroke();
    }

    function drawHangman(step) {
        ctx.beginPath();
        switch (step) {
            case 1: ctx.arc(150, 70, 20, 0, Math.PI * 2); break;
            case 2: ctx.moveTo(150, 90); ctx.lineTo(150, 150); break;
            case 3: ctx.moveTo(150, 110); ctx.lineTo(120, 130); break;
            case 4: ctx.moveTo(150, 110); ctx.lineTo(180, 130); break;
            case 5: ctx.moveTo(150, 150); ctx.lineTo(120, 180); break;
            case 6: ctx.moveTo(150, 150); ctx.lineTo(180, 180); break;
        }
        ctx.stroke();
    }

    function updateDisplay() {
        wordDisplay.textContent = chosenWord.split('').map(l => guessedLetters.includes(l) ? l : '_').join(' ');
        if (!wordDisplay.textContent.includes('_') && chosenWord !== '') {
            showResultPopup('¡Ganaste! Adivinaste la palabra.', 5, 5);
            disableButtons();
        }
        if (mistakes >= 6) {
            showResultPopup(`Perdiste. La palabra era: ${chosenWord}`, 0, 5);
            disableButtons();
        }
    }

    function renderAlphabet() {
        alphabetEl.innerHTML = '';
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(char => {
            const btn = document.createElement('button');
            btn.className = 'letter-btn';
            btn.textContent = char;
            btn.onclick = () => {
                btn.disabled = true;
                if (chosenWord.includes(char)) {
                    guessedLetters.push(char);
                    btn.classList.add('correct');
                } else {
                    mistakes++;
                    btn.classList.add('wrong');
                    drawHangman(mistakes);
                }
                updateDisplay();
            };
            alphabetEl.appendChild(btn);
        });
    }

    function disableButtons() {
        alphabetEl.querySelectorAll('button').forEach(b => b.disabled = true);
    }
    document.getElementById('reset-hangman').onclick = resetGame;
    resetGame();
}

// 6. Word Scramble Logic (Clickable Tiles)
function initScramble() {
    const lettersContainer = document.getElementById('scramble-letters');
    const answerEl = document.getElementById('scramble-answer');
    const hintEl = document.getElementById('scramble-hint');
    const checkBtn = document.getElementById('check-scramble');
    const resetBtn = document.getElementById('reset-scramble');
    const scoreEl = document.getElementById('score-scramble');

    if (!lettersContainer || !answerEl || !hintEl || !checkBtn || !resetBtn) return;

    let currentWordObj = null;
    let builtWord = [];

    function nextWord() {
        currentWordObj = VOCABULARY[Math.floor(Math.random() * VOCABULARY.length)];
        const gameWord = currentWordObj.word.toUpperCase().replace(/\s/g, '_');
        const scrambledChars = gameWord.split('').sort(() => Math.random() - 0.5);

        // Ensure it's not the same as original
        if (scrambledChars.join('') === gameWord && gameWord.length > 1) {
            scrambledChars.reverse();
        }

        builtWord = [];
        updateDisplay();
        renderLetters(scrambledChars);

        hintEl.innerHTML = `<strong>Significado:</strong> ${currentWordObj.meaning} <br> <small>(Pista: Empieza con "${gameWord[0]}")</small>`;
    }

    function renderLetters(chars) {
        lettersContainer.innerHTML = '';
        chars.forEach((char, index) => {
            const btn = document.createElement('button');
            btn.className = 'bank-word'; // Using existing style
            btn.style.cursor = 'pointer';
            btn.style.padding = '0.8rem 1.2rem';
            btn.style.fontSize = '1.2rem';
            btn.textContent = char;
            btn.onclick = () => {
                builtWord.push(char);
                btn.disabled = true;
                btn.style.opacity = '0.3';
                updateDisplay();
            };
            lettersContainer.appendChild(btn);
        });
    }

    function updateDisplay() {
        const gameWord = currentWordObj.word.replace(/\s/g, '_');
        const display = builtWord.join(' ') + ' ' + Array(gameWord.length - builtWord.length).fill('_').join(' ');
        answerEl.textContent = display || '_ _ _';
    }

    checkBtn.onclick = () => {
        const target = currentWordObj.word.toUpperCase().replace(/\s/g, '_');
        if (builtWord.join('') === target) {
            showResultPopup('¡Correcto! Excelente ortografía.', 5, 5);
            setTimeout(nextWord, 2000);
        } else {
            showResultPopup('Palabra incorrecta. ¡Intenta de nuevo!', 0, 5);
            builtWord = [];
            updateDisplay();
            // Enable all buttons
            lettersContainer.querySelectorAll('button').forEach(b => {
                b.disabled = false;
                b.style.opacity = '1';
            });
        }
    };

    resetBtn.onclick = nextWord;
    nextWord();
}

// 7. Speed Typing Challenge Logic
function initTyping() {
    const wordEl = document.getElementById('typing-word');
    const inputEl = document.getElementById('typing-input');
    const timeEl = document.getElementById('typing-time');
    const pointsEl = document.getElementById('typing-points');
    const startBtn = document.getElementById('start-typing');
    const checkBtn = document.getElementById('check-typing');
    const scoreEl = document.getElementById('score-typing');

    if (!wordEl || !inputEl || !timeEl || !pointsEl || !startBtn || !checkBtn) return;

    let time = 15;
    let points = 0;
    let timer = null;
    let currentWordObj = null;

    function setNextWord() {
        currentWordObj = VOCABULARY[Math.floor(Math.random() * VOCABULARY.length)];
        wordEl.textContent = currentWordObj.word.toUpperCase();
        inputEl.value = '';
        inputEl.focus();
    }

    function updateTime() {
        time--;
        timeEl.textContent = time;
        if (time <= 0) {
            clearInterval(timer);
            gameOver();
        }
    }

    function gameOver() {
        inputEl.disabled = true;
        checkBtn.style.display = 'none';
        wordEl.textContent = 'GAME OVER';
        startBtn.style.display = 'block';
        startBtn.textContent = 'Reiniciar Reto';

        let stars = 0;
        if (points >= 10) stars = 5;
        else if (points >= 5) stars = 3;
        else if (points >= 2) stars = 1;

        showResultPopup(`Fin del reto: ${points} puntos`, stars, 5);
    }

    window.copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => showFeedback('Copiado a portapapeles'));
    };

    function verifyWord() {
        // Robust normalization: ignore accents, dots, spaces, and case
        const normalize = (str) => {
            return str.normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "") // Strip accents
                .toUpperCase()
                .replace(/[^A-Z]/g, ''); // Keep only letters
        };

        const userVal = normalize(inputEl.value);
        const targetVal = normalize(currentWordObj.meaning);

        if (userVal === targetVal && userVal !== "") {
            points++;
            pointsEl.textContent = points;
            time += 2; // Add 2 seconds bonus
            timeEl.textContent = time;
            showFeedback('¡Correcto!', 'success');
            setNextWord();
        } else {
            showFeedback('Incorrecto, ¡revisa la traducción!', 'error');
            inputEl.focus();
        }
    }

    startBtn.onclick = () => {
        points = 0;
        time = 15;
        pointsEl.textContent = points;
        timeEl.textContent = time;
        inputEl.disabled = false;
        startBtn.style.display = 'none';
        checkBtn.style.display = 'block';
        setNextWord();
        timer = setInterval(updateTime, 1000);
    };

    checkBtn.onclick = verifyWord;
    inputEl.onkeypress = (e) => {
        if (e.key === 'Enter') verifyWord();
    };
}
