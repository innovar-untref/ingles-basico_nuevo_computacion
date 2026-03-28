const VOCABULARY = [
    { word: 'features', meaning: 'características', category: 'default' },
    { word: 'widely', meaning: 'ampliamente', category: 'default' },
    { word: 'range', meaning: 'rango', category: 'default' },
    { word: 'suitable', meaning: 'adecuado', category: 'default' },
    { word: 'as well as', meaning: 'así como', category: 'default' },
    { word: 'remain', meaning: 'permanecer', category: 'default' },
    { word: 'rather than', meaning: 'en lugar de', category: 'default' },
    { word: 'both', meaning: 'ambos', category: 'default' },
    { word: 'common', meaning: 'común', category: 'default' },
    { word: 'seamlessly', meaning: 'sin problemas', category: 'default' }
];

document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Menu Logic
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');
    if (hamburgerBtn && navLinks) {
        hamburgerBtn.addEventListener('click', () => {
            hamburgerBtn.classList.toggle('open');
            navLinks.classList.toggle('open');
        });
    }

    initNavigation();
    initDragAndDrop();
    
    initCrossword();
    initAILab();
    initHangman();
    initScramble();
    initTyping();
});

// 5. AI Lab Logic (Grid of Cards)
function initAILab() {
    const grid = document.getElementById('ai-word-grid');
    const modal = document.getElementById('prompt-modal');
    const modalTitle = document.getElementById('modal-word-title');
    const content = document.getElementById('prompt-content');
    
    const copyBtn = document.getElementById('copy-prompt');

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
    - Plataforma: Innovar UNTREF Videos (http://innovaruntref.com.ar) vinculado a universidades argentinas.
    - Videos Recomendados: 
        - BBC Learning English (@bbclearningenglish)
        - Aprende Inglés en YouTube (@inglesfácil)
K - KEY DETAILS (Detalles clave):
    1. Definición técnica precisa de "${item.word.toUpperCase()}" (EN/ES).
    2. 3 casos de uso reales en desarrollo/infraestructura.
    3. Analiza la pronunciación de "${item.word.toUpperCase()}" en YouGlish: ${youglishSearch}
E - EXPECTATIVA: Respuesta pedagógica, estructurada y profesional.
T - TONO: Académico y facilitador.

Instrucción final: Saluda como 'Docente de Inglés de Innovar UNTREF', presenta el contenido ROCKET y propón un 'INTERACTIVE CHALLENGE' técnico sobre "${item.word.toUpperCase()}", esperando mi respuesta antes de continuar.`;

            modalTitle.innerHTML = `<h3 style="color: var(--primary-color); margin-bottom: 0;">Practicando: ${item.word}</h3><p style="margin-top:5px; color: #666;">${item.meaning}</p>`;
            typeWriterEffect(content, prompt, 1);
            modal.classList.add('active');
            setTimeout(() => { modal.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
        };

        grid.appendChild(card);
    });

    
    

    copyBtn.onclick = () => {
        navigator.clipboard.writeText(content.textContent).then(() => {
            showFeedback('Prompt copiado');
        });
    };
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
    const activeSection = document.querySelector('.activity-section.active');
    if (!activeSection) return;
    
    const toast = activeSection.querySelector('.toast');
    if (!toast) return;

    toast.textContent = msg;
    toast.style.backgroundColor = type === 'success' ? 'var(--success-color)' : 'var(--error-color)';
    toast.classList.add('active');
    
    setTimeout(() => toast.classList.remove('active'), 3000);
}


// 1. Drag & Drop Logic
function initDragAndDrop() {
    const pool = document.getElementById('word-pool');
    const dropZonesContainer = document.querySelector('.drop-zones');

    function buildDrag() {
        pool.innerHTML = '';
        dropZonesContainer.innerHTML = '';
        updateStars('score-drag', 0, 1);

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

        updateStars('score-drag', correctCount, VOCABULARY.length);
        if (correctCount === VOCABULARY.length) {
            showFeedback('¡Excelente! Todas las parejas son correctas.');
        } else {
            showFeedback(`Emparejaste ${correctCount}/${VOCABULARY.length}.`, 'error');
        }
    });

    document.getElementById('reset-drag').addEventListener('click', buildDrag);
    buildDrag();
}

// 2. Fill in the Blanks Logic
function initFillBlanks() {
    const container = document.getElementById('fill-paragraph');
    const wordBankEl = document.getElementById('fill-word-bank');

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
        updateStars('score-fill', 0, 1);
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
        updateStars('score-fill', correct, inputs.length);
        if (correct === inputs.length) showFeedback('¡Excelente!');
        else showFeedback('Revisa los campos rojos.', 'error');
    });

    document.getElementById('reset-fill').addEventListener('click', buildFill);
    buildFill();
}

// 3. Crossword
function initCrossword() {
    const gridEl = document.getElementById('crossword-grid');
    const cluesEl = document.getElementById('clue-list');

    function buildCrossword() {
        const crosswordData = [
            { word: 'RATHERTHAN', x: 5, y: 10, dir: 'across', clue: 'en lugar de.' },
            { word: 'SEAMLESSLY', x: 9, y: 5, dir: 'down', clue: 'sin problemas.' },
            { word: 'ASWELLAS', x: 9, y: 7, dir: 'across', clue: 'así como.' },
            { word: 'SUITABLE', x: 15, y: 3, dir: 'down', clue: 'adecuado.' },
            { word: 'FEATURES', x: 12, y: 1, dir: 'down', clue: 'características.' },
            { word: 'COMMON', x: 6, y: 8, dir: 'across', clue: 'común.' },
            { word: 'REMAIN', x: 11, y: 2, dir: 'across', clue: 'permanecer.' },
            { word: 'WIDELY', x: 5, y: 13, dir: 'across', clue: 'ampliamente.' },
            { word: 'RANGE', x: 11, y: 2, dir: 'down', clue: 'rango.' },
            { word: 'BOTH', x: 15, y: 8, dir: 'across', clue: 'ambos.' }
        ];

        const GRID_SIZE = 20;
        gridEl.style.display = 'grid';
        gridEl.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 25px)`;
        gridEl.innerHTML = '';
        cluesEl.innerHTML = '';
        updateStars('score-crossword', 0, 1);

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
        updateStars('score-crossword', correct, inputs.length);
        if (correct === inputs.length) showFeedback('¡Excelente!');
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

    let chosenWord = '';
    let guessedLetters = [];
    let mistakes = 0;

    function resetGame() {
        const item = VOCABULARY[Math.floor(Math.random() * VOCABULARY.length)];
        chosenWord = item.word.toUpperCase().replace(/\s/g, '');
        guessedLetters = [];
        mistakes = 0;
        updateStars('score-hangman', 0, 1);
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
            showFeedback('¡Ganaste!');
            updateStars('score-hangman', 5, 5);
            disableButtons();
        }
        if (mistakes >= 6) {
            showFeedback(`Perdiste: ${chosenWord}`, 'error');
            updateStars('score-hangman', 0, 5);
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
        updateStars('score-scramble', 0, 1);
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
            showFeedback('¡Correcto! Excelente ortografía.', 'success');
            updateStars('score-scramble', 5, 5);
            setTimeout(nextWord, 2000);
        } else {
            showFeedback('Palabra incorrecta. ¡Intenta de nuevo!', 'error');
            builtWord = [];
            updateDisplay();
            // Enable all buttons
            lettersContainer.querySelectorAll('button').forEach(b => {
                b.disabled = false;
                b.style.opacity = '1';
            });
            updateStars('score-scramble', 0, 5);
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
    const aiRecEl = document.getElementById('typing-ai-recommendation');

    let time = 50;
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
        updateStars('score-typing', stars, 5);

        showFeedback(`Fin del reto: ${points} puntos`, points >= 5 ? 'success' : 'error');

        // AI Recommendation
        if (points > 0) {
            const aiPrompt = `Actúa como un Docente de Inglés de Innovar UNTREF (no un tutor).
MÉTODO ROCKET:
R - ROL: Docente de Inglés de Innovar UNTREF.
O - OBJETIVO: Crear una historia técnica de Ingeniería Informática y recomendar práctica lúdica.
C - RECURSOS INSTITUCIONALES (Vínculos Directos):
    - Videos: BBC Learning (https://youtube.com/@bbclearningenglish), Cambridge TV (https://youtube.com/@cambridgeenglishtv), British Council (https://youtube.com/@BritishCouncilLE).
    - Sitios: British Council (https://learnenglish.britishcouncil.org), BBC Learning English (https://www.bbc.co.uk/learningenglish), Cambridge English (https://www.cambridgeenglish.org).
K - KEY DETAILS:
    1. Incluir estos términos: ${VOCABULARY.map(v => v.word).join(', ')}.
    2. Recomendar juegos con vínculos directos:
       - Wordshake: https://learnenglish.britishcouncil.org/general-english/games/wordshake
       - Sushi Spell: https://learnenglish.britishcouncil.org/general-english/games/sushi-spell
       - BBC Gameshow: https://www.bbc.co.uk/learningenglish/english/features/gameshow
    3. Mencionar videos institucionales y YouGlish (https://youglish.com) para pronunciación.
E - EXPECTATIVA: Historia breve, técnica y educativa.
T - TONO: Profesional.`;
            aiRecEl.innerHTML = `
                <strong>🤖 Recomendación IA:</strong> ¡Excelente práctica! Como has acertado varias traducciones, te recomiendo usar este prompt para profundizar:<br><br>
                <code style="display:block; background:#eee; padding:10px; border-radius:5px; margin-bottom:10px;">${aiPrompt}</code>
                <button class="action-btn secondary" style="width:100%; margin-top:10px;" onclick="copyToClipboard('${aiPrompt.replace(/'/g, "\\'")}')">Copiar Recomendación IA</button>
            `;
            aiRecEl.classList.remove('hidden');
        }
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
        time = 50;
        pointsEl.textContent = points;
        timeEl.textContent = time;
        inputEl.disabled = false;
        aiRecEl.classList.add('hidden');
        startBtn.style.display = 'none';
        checkBtn.style.display = 'block';
        updateStars('score-typing', 0, 5);
        setNextWord();
        timer = setInterval(updateTime, 1000);
    };

    checkBtn.onclick = verifyWord;
    inputEl.onkeypress = (e) => {
        if (e.key === 'Enter') verifyWord();
    };
}

// Typewriter effect function
function typeWriterEffect(element, text, speed) {
    if (window.typeWriterInterval) clearInterval(window.typeWriterInterval);
    element.textContent = '';
    let i = 0;
    const charsPerTick = 4;
    window.typeWriterInterval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.substr(i, charsPerTick);
            i += charsPerTick;
            element.parentElement.scrollTop = element.parentElement.scrollHeight;
        } else {
            clearInterval(window.typeWriterInterval);
        }
    }, speed);
}

