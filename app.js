document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------
    // AUDIO SYNTHESIS SYSTEM (Web Audio API)
    // -------------------------------------------------------------
    let audioCtx = null;
    let soundEnabled = true;

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    const soundToggle = document.getElementById('sound-toggle');
    const soundOnIcon = document.getElementById('sound-on-icon');
    const soundOffIcon = document.getElementById('sound-off-icon');

    soundToggle.addEventListener('click', () => {
        soundEnabled = !soundEnabled;
        if (soundEnabled) {
            initAudio();
            soundOnIcon.classList.remove('hidden');
            soundOffIcon.classList.add('hidden');
            playSynthSound('click');
        } else {
            soundOnIcon.classList.add('hidden');
            soundOffIcon.classList.remove('hidden');
        }
    });

    function playSynthSound(type) {
        if (!soundEnabled) return;
        try {
            initAudio();
            const now = audioCtx.currentTime;

            if (type === 'click') {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);
                gain.gain.setValueAtTime(0.05, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.05);
            } 
            else if (type === 'sonar') {
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(880, now);
                osc.frequency.exponentialRampToValueAtTime(800, now + 0.4);
                
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
                
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 0.8);
            } 
            else if (type === 'miss') {
                // Synthesize water splash
                const bufferSize = audioCtx.sampleRate * 0.35; // 0.35s duration
                const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }

                const noise = audioCtx.createBufferSource();
                noise.buffer = buffer;

                const filter = audioCtx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(1000, now);
                filter.frequency.exponentialRampToValueAtTime(180, now + 0.3);

                const gain = audioCtx.createGain();
                gain.gain.setValueAtTime(0.15, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

                noise.connect(filter);
                filter.connect(gain);
                gain.connect(audioCtx.destination);

                noise.start(now);
                noise.stop(now + 0.35);
            } 
            else if (type === 'hit') {
                // Synthesize deep explosion sound
                const bufferSize = audioCtx.sampleRate * 0.6;
                const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }

                const noise = audioCtx.createBufferSource();
                noise.buffer = buffer;

                const lowpass = audioCtx.createBiquadFilter();
                lowpass.type = 'lowpass';
                lowpass.frequency.setValueAtTime(320, now);
                lowpass.frequency.exponentialRampToValueAtTime(40, now + 0.5);

                const gain = audioCtx.createGain();
                gain.gain.setValueAtTime(0.28, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

                noise.connect(lowpass);
                lowpass.connect(gain);
                gain.connect(audioCtx.destination);

                noise.start(now);
                noise.stop(now + 0.6);
            } 
            else if (type === 'sunk') {
                // Sunk ship sound (high-alert siren/chime)
                const notes = [293.66, 349.23, 440.00]; // D4, F4, A4
                notes.forEach((freq, idx) => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, now + idx * 0.1);
                    osc.frequency.linearRampToValueAtTime(freq * 1.5, now + idx * 0.1 + 0.3);
                    
                    gain.gain.setValueAtTime(0.08, now + idx * 0.1);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.4);
                    
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start(now + idx * 0.1);
                    osc.stop(now + idx * 0.1 + 0.4);
                });
            } 
            else if (type === 'victory') {
                const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
                notes.forEach((freq, idx) => {
                    const osc = audioCtx.createOscillator();
                    const gain = audioCtx.createGain();
                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, now + idx * 0.12);
                    
                    gain.gain.setValueAtTime(0.08, now + idx * 0.12);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.12 + 0.5);
                    
                    osc.connect(gain);
                    gain.connect(audioCtx.destination);
                    osc.start(now + idx * 0.12);
                    osc.stop(now + idx * 0.12 + 0.5);
                });
            } 
            else if (type === 'defeat') {
                // Somber descending slide
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(220, now);
                osc.frequency.linearRampToValueAtTime(90, now + 1.2);
                
                gain.gain.setValueAtTime(0.12, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
                
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                osc.start(now);
                osc.stop(now + 1.2);
            }
        } catch (e) {
            console.warn('Audio Context error: ', e);
        }
    }

    // -------------------------------------------------------------
    // THEME SYSTEM
    // -------------------------------------------------------------
    const themeToggle = document.getElementById('theme-toggle');
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        playSynthSound('click');
    });

    // -------------------------------------------------------------
    // GAME CORE STATE
    // -------------------------------------------------------------
    const GRID_SIZE = 10;
    
    // Ships metadata definition
    const SHIPS_DATA = [
        { name: 'Carrier', size: 5, key: 'carrier' },
        { name: 'Battleship', size: 4, key: 'battleship' },
        { name: 'Destroyer', size: 3, key: 'destroyer' },
        { name: 'Submarine', size: 3, key: 'submarine' },
        { name: 'Patrol Boat', size: 2, key: 'patrol' }
    ];

    const SHIP_SVGS = [
        // Carrier (index 0, size 5)
        `<svg viewBox="0 0 168 32" xmlns="http://www.w3.org/2000/svg">
            <path d="M 4 8 L 24 2 C 50 2, 130 2, 164 6 L 166 16 L 164 26 C 130 30, 50 30, 24 30 L 4 24 Z" fill="none" stroke="currentColor" stroke-width="1.5" />
            <line x1="28" y1="16" x2="155" y2="16" stroke="currentColor" stroke-dasharray="4,4" stroke-width="1" />
            <path d="M 32 10 L 110 10 L 124 24 L 38 24 Z" fill="rgba(6, 182, 212, 0.12)" stroke="currentColor" stroke-width="0.75" />
            <rect x="110" y="4" width="22" height="5" rx="1" fill="currentColor" />
            <rect x="114" y="2" width="10" height="2" rx="0.5" fill="currentColor" />
        </svg>`,
        // Battleship (index 1, size 4)
        `<svg viewBox="0 0 134 32" xmlns="http://www.w3.org/2000/svg">
            <path d="M 3 16 C 18 4, 110 4, 131 10 L 132 16 L 131 22 C 110 28, 18 28, 3 16 Z" fill="none" stroke="currentColor" stroke-width="1.5" />
            <path d="M 28 9 L 106 9 L 106 23 L 28 23 Z" fill="rgba(6, 182, 212, 0.08)" stroke="currentColor" stroke-width="0.75" />
            <circle cx="38" cy="16" r="4" fill="currentColor" />
            <line x1="38" y1="16" x2="48" y2="16" stroke="currentColor" stroke-width="2" />
            <circle cx="56" cy="16" r="4.5" fill="currentColor" />
            <line x1="56" y1="16" x2="68" y2="16" stroke="currentColor" stroke-width="2" />
            <circle cx="94" cy="16" r="4" fill="currentColor" />
            <line x1="94" y1="16" x2="84" y2="16" stroke="currentColor" stroke-width="2" />
            <rect x="70" y="10" width="14" height="12" rx="1" fill="rgba(6, 182, 212, 0.25)" stroke="currentColor" stroke-width="1" />
        </svg>`,
        // Destroyer (index 2, size 3)
        `<svg viewBox="0 0 100 32" xmlns="http://www.w3.org/2000/svg">
            <path d="M 3 16 C 16 5, 80 5, 97 11 L 98 16 L 97 21 C 80 27, 16 27, 3 16 Z" fill="none" stroke="currentColor" stroke-width="1.5" />
            <rect x="25" y="8" width="50" height="16" rx="2" fill="rgba(6, 182, 212, 0.12)" stroke="currentColor" stroke-width="0.75" />
            <circle cx="20" cy="16" r="3" fill="currentColor" />
            <line x1="20" y1="16" x2="28" y2="16" stroke="currentColor" stroke-width="1.5" />
            <circle cx="48" cy="16" r="4" fill="none" stroke="currentColor" stroke-width="1" />
            <line x1="48" y1="12" x2="48" y2="20" stroke="currentColor" stroke-width="0.75" />
            <rect x="62" y="11" width="10" height="10" rx="1" fill="currentColor" />
        </svg>`,
        // Submarine (index 3, size 3)
        `<svg viewBox="0 0 100 32" xmlns="http://www.w3.org/2000/svg">
            <path d="M 12 16 C 12 8, 88 8, 88 16 C 88 24, 12 24, 12 16 Z" fill="none" stroke="currentColor" stroke-width="1.5" />
            <path d="M 12 16 L 3 13 L 3 19 Z" fill="currentColor" />
            <line x1="2" y1="11" x2="2" y2="21" stroke="currentColor" stroke-width="1.5" />
            <path d="M 44 12 L 56 12 L 60 16 L 40 16 Z" fill="currentColor" />
            <line x1="50" y1="12" x2="50" y2="6" stroke="currentColor" stroke-width="1" />
            <line x1="68" y1="16" x2="76" y2="16" stroke="currentColor" stroke-width="2" />
        </svg>`,
        // Patrol Boat (index 4, size 2)
        `<svg viewBox="0 0 66 32" xmlns="http://www.w3.org/2000/svg">
            <path d="M 3 16 C 10 5, 52 5, 63 12 L 64 16 L 63 20 C 52 27, 10 27, 3 16 Z" fill="none" stroke="currentColor" stroke-width="1.5" />
            <path d="M 22 9 L 46 9 L 50 16 L 46 23 L 22 23 Z" fill="rgba(6, 182, 212, 0.15)" stroke="currentColor" stroke-width="1" />
            <circle cx="16" cy="16" r="2" fill="currentColor" />
            <line x1="16" y1="16" x2="22" y2="16" stroke="currentColor" stroke-width="1.5" />
        </svg>`
    ];

    let phase = 'placement'; // 'placement', 'battle', 'gameover'
    let activeTurn = 'player'; // 'player', 'enemy'
    
    // Boards structures
    // Grid values: null or ship object reference
    let playerBoard = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
    let enemyBoard = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
    
    // Attacks matrices: null, 'miss', 'hit', 'sunk'
    let playerAttacks = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
    let enemyAttacks = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));

    // Placed instances
    let playerShips = [];
    let enemyShips = [];

    // Placement variables
    let selectedShipIndex = 0; // Index in SHIPS_DATA
    let isVertical = false; // Horizontal is default

    // Tracking stats
    let totalShots = 0;
    let accurateHits = 0;

    // Difficulty
    let aiDifficulty = 'hard';

    // Smart AI hunting engine structure
    let aiHunter = {
        mode: 'hunt', // 'hunt', 'target'
        targetsQueue: [], // Queue of coordinates to attack next: {r, c}
        firstHit: null, // Origin hit coordinate of current target chain
        lastHit: null, // Last successful hit coordinate in the chain
        currentDir: null, // Current direction of search: 'N', 'S', 'E', 'W' or null
        checkedDirections: [] // Directions already failed in targeting mode
    };

    // -------------------------------------------------------------
    // GRID INITIALIZATION & COORDINATES UTIL
    // -------------------------------------------------------------
    const playerGridEl = document.getElementById('player-grid');
    const enemyGridEl = document.getElementById('enemy-grid');

    function createGrids() {
        // Clear only cell elements, preserving overlays
        const cellsP = playerGridEl.querySelectorAll('.cell');
        cellsP.forEach(cell => cell.remove());
        const cellsE = enemyGridEl.querySelectorAll('.cell');
        cellsE.forEach(cell => cell.remove());

        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                const cellPlayer = document.createElement('div');
                cellPlayer.classList.add('cell');
                cellPlayer.dataset.row = r;
                cellPlayer.dataset.col = c;
                playerGridEl.appendChild(cellPlayer);

                const cellEnemy = document.createElement('div');
                cellEnemy.classList.add('cell');
                cellEnemy.dataset.row = r;
                cellEnemy.dataset.col = c;
                enemyGridEl.appendChild(cellEnemy);
            }
        }
    }
    createGrids();

    function getCoordsString(r, c) {
        const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        return `${letters[c]}${r + 1}`;
    }

    // -------------------------------------------------------------
    // TACTICAL COM-CONSOLE LOGGING
    // -------------------------------------------------------------
    const consoleLogs = document.getElementById('console-logs');
    
    function logToConsole(message, type = 'system') {
        const entry = document.createElement('div');
        entry.classList.add('log-entry', type);
        entry.textContent = message;
        consoleLogs.appendChild(entry);
        consoleLogs.scrollTop = consoleLogs.scrollHeight;
    }

    // Randomize ping telemetry slightly over time
    const pingRateEl = document.getElementById('ping-rate');
    setInterval(() => {
        const ping = Math.floor(18 + Math.random() * 20);
        pingRateEl.textContent = `PING: ${ping}ms`;
    }, 4000);

    // -------------------------------------------------------------
    // SHIP PLACEMENT UTILITIES
    // -------------------------------------------------------------
    const difficultyButtons = document.querySelectorAll('.difficulty-btn');
    difficultyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (phase !== 'placement') return;
            difficultyButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            aiDifficulty = btn.dataset.difficulty;
            logToConsole(`[SYSTEM] AI difficulty set to: ${aiDifficulty.toUpperCase()}`, 'system');
            playSynthSound('click');
        });
    });

    const rotateBtn = document.getElementById('rotate-btn');
    const randomBtn = document.getElementById('random-btn');
    const startBtn = document.getElementById('start-game-btn');
    const shipItems = document.querySelectorAll('.ship-select-item');

    // Setup Rotate logic
    function rotateActiveShip() {
        if (phase !== 'placement') return;
        isVertical = !isVertical;
        logToConsole(`[SYSTEM] Ship rotation toggled to: ${isVertical ? 'VERTICAL' : 'HORIZONTAL'}`, 'system');
        playSynthSound('click');
        rotateBtn.innerHTML = isVertical ? 
            `<svg viewBox="0 0 24 24" width="18" height="18" class="btn-svg" style="transform: rotate(90deg);"><path fill="currentColor" d="M12,4V1L8,5L12,9V6A6,6 0 0,1 18,12C18,15.31 15.31,18 12,18C8.69,18 6,15.31 6,12H4A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z"/></svg> Rotate Ship (V)` :
            `<svg viewBox="0 0 24 24" width="18" height="18" class="btn-svg"><path fill="currentColor" d="M12,4V1L8,5L12,9V6A6,6 0 0,1 18,12C18,15.31 15.31,18 12,18C8.69,18 6,15.31 6,12H4A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z"/></svg> Rotate Ship (H)`;
    }

    rotateBtn.addEventListener('click', rotateActiveShip);
    window.addEventListener('keydown', (e) => {
        if (e.key === 'r' || e.key === 'R') {
            rotateActiveShip();
        }
    });

    // Ship selection handler
    shipItems.forEach(item => {
        item.addEventListener('click', () => {
            if (phase !== 'placement') return;
            const index = parseInt(item.dataset.shipIndex);
            
            // Check if this ship is already placed, allow replacing if desired, 
            // but for simplicity, we allow clicking only unplaced or changing active placement
            selectedShipIndex = index;
            updateShipSelectorUI();
            playSynthSound('click');
        });
    });

    function updateShipSelectorUI() {
        shipItems.forEach((item, idx) => {
            item.classList.remove('active');
            if (idx === selectedShipIndex) {
                item.classList.add('active');
            }
            
            const isPlaced = playerShips.some(s => s.index === idx);
            if (isPlaced) {
                item.classList.add('placed');
            } else {
                item.classList.remove('placed');
            }
        });
    }

    // Checking placement bounds and collisions
    function checkPlacementValidity(r, c, size, vertical, board) {
        if (vertical) {
            if (r + size > GRID_SIZE) return false;
            for (let i = 0; i < size; i++) {
                if (board[r + i][c] !== null) return false;
            }
        } else {
            if (c + size > GRID_SIZE) return false;
            for (let i = 0; i < size; i++) {
                if (board[r][c + i] !== null) return false;
            }
        }
        return true;
    }

    // Placing a ship on a board
    function placeShipOnBoard(r, c, shipData, index, vertical, board, listShips) {
        const size = shipData.size;
        const coordinates = [];
        
        const shipInstance = {
            name: shipData.name,
            size: size,
            index: index,
            vertical: vertical,
            coordinates: coordinates,
            hits: 0,
            sunk: false
        };

        if (vertical) {
            for (let i = 0; i < size; i++) {
                board[r + i][c] = shipInstance;
                coordinates.push({ r: r + i, c: c });
            }
        } else {
            for (let i = 0; i < size; i++) {
                board[r][c + i] = shipInstance;
                coordinates.push({ r: r, c: c + i });
            }
        }

        listShips.push(shipInstance);
        return true;
    }

    // Refresh UI colors of player grid to show placed ships
    function renderPlayerPlacedShips() {
        // Clear all ship block styling
        const cells = playerGridEl.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.classList.remove('ship-block');
        });

        // Add class to matching cells
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (playerBoard[r][c] !== null) {
                    const cellEl = playerGridEl.querySelector(`[data-row="${r}"][data-col="${c}"]`);
                    cellEl.classList.add('ship-block');
                }
            }
        }
        
        // Render 2D vector overlay ships
        renderShipsOverlays('player', playerShips);
    }

    // Render detailed glowing SVG ship silhouettes over the grids
    function renderShipsOverlays(boardId, listShips) {
        const container = document.querySelector(`#${boardId}-grid .ships-overlay-container`);
        if (!container) return;
        
        container.innerHTML = '';

        listShips.forEach(ship => {
            // For enemy board, only render overlays of completely SUNK ships!
            if (boardId === 'enemy' && !ship.sunk) return;

            const firstCoord = ship.coordinates[0];
            const r = firstCoord.r;
            const c = firstCoord.c;

            // Dimensions: each cell is 32px, gap is 2px
            const left = c * 34;
            const top = r * 34;
            const width = ship.size * 34 - 2;
            const height = 32;

            const overlay = document.createElement('div');
            overlay.classList.add('placed-ship-overlay');
            if (ship.vertical) {
                overlay.classList.add('vertical');
            }
            if (ship.sunk) {
                overlay.classList.add('sunk');
            }

            overlay.style.left = `${left}px`;
            overlay.style.top = `${top}px`;
            overlay.style.width = `${width}px`;
            overlay.style.height = `${height}px`;
            overlay.innerHTML = SHIP_SVGS[ship.index];

            container.appendChild(overlay);
        });
    }

    // Init laser targeting reticles that follow mouse moves over grid elements
    function initLaserTargeting() {
        [playerGridEl, enemyGridEl].forEach(gridEl => {
            const laserX = gridEl.querySelector('.laser-line-x');
            const laserY = gridEl.querySelector('.laser-line-y');
            const reticle = gridEl.querySelector('.laser-reticle');

            gridEl.addEventListener('mousemove', (e) => {
                const rect = gridEl.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                if (laserX && laserY && reticle) {
                    laserX.style.top = `${y}px`;
                    laserY.style.left = `${x}px`;
                    reticle.style.left = `${x}px`;
                    reticle.style.top = `${y}px`;
                }
            });
        });
    }

    // Canvas Background telemetry matrix columns & rolling ocean waves
    function initBackgroundCanvas() {
        const canvas = document.getElementById('ambient-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });
        
        const fontSize = 10;
        const columns = Math.floor(width / 24);
        const drops = Array(columns).fill(0).map(() => Math.random() * -100);
        const chars = "0123456789ABCDEF0110";
        let wavePhase = 0;
        
        function draw() {
            ctx.fillStyle = 'rgba(6, 8, 19, 0.2)'; 
            ctx.fillRect(0, 0, width, height);
            
            // 1. Draw matrix columns
            ctx.fillStyle = 'rgba(6, 182, 212, 0.04)'; 
            ctx.font = `${fontSize}px 'Share Tech Mono'`;
            
            for (let i = 0; i < drops.length; i++) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                const x = i * 24;
                const y = drops[i] * fontSize;
                
                ctx.fillText(char, x, y);
                
                if (y > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i] += 0.8;
            }
            
            // 2. Draw rolling ocean sonar waves
            ctx.strokeStyle = 'rgba(99, 102, 241, 0.08)'; 
            ctx.lineWidth = 1;
            ctx.beginPath();
            const baseline = height - 120;
            for (let x = 0; x < width; x += 5) {
                const y = baseline + Math.sin(x * 0.003 + wavePhase) * 20 + Math.cos(x * 0.001 - wavePhase) * 10;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();
            
            ctx.strokeStyle = 'rgba(6, 182, 212, 0.05)'; 
            ctx.beginPath();
            for (let x = 0; x < width; x += 5) {
                const y = (baseline + 30) + Math.sin(x * 0.004 - wavePhase * 1.5) * 15 + Math.cos(x * 0.002 + wavePhase) * 8;
                if (x === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.stroke();

            // Sonar grid bars
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.01)';
            for (let x = 0; x < width; x += 120) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, height);
                ctx.stroke();
            }
            
            wavePhase += 0.006;
            requestAnimationFrame(draw);
        }
        
        draw();
    }

    // Spawns continuous smoky emissions/embers above hit/destroyed cells
    function spawnPersistentSmoke(cellEl) {
        let emitter = cellEl.querySelector('.smoke-emitter');
        if (!emitter) {
            emitter = document.createElement('div');
            emitter.classList.add('smoke-emitter');
            cellEl.appendChild(emitter);
        }

        const intervalId = setInterval(() => {
            // Stop emitter loop if the cell was cleared, reset, or is no longer a hit
            if (!cellEl.parentNode || (!cellEl.classList.contains('hit') && !cellEl.classList.contains('sunk-ship'))) {
                clearInterval(intervalId);
                return;
            }

            // Spawn grey smoke
            const smoke = document.createElement('div');
            smoke.classList.add('smoke-particle');
            const angleSmoke = Math.random() * Math.PI * 2;
            const distSmoke = 4 + Math.random() * 8;
            smoke.style.setProperty('--tx', `${Math.cos(angleSmoke) * distSmoke}px`);
            smoke.style.setProperty('--ty', `${-12 - Math.random() * 16}px`);
            const sizeSmoke = 4 + Math.random() * 5;
            smoke.style.width = `${sizeSmoke}px`;
            smoke.style.height = `${sizeSmoke}px`;
            
            emitter.appendChild(smoke);
            smoke.addEventListener('animationend', () => smoke.remove());

            // Spawn glowing embers
            if (Math.random() > 0.45) {
                const ember = document.createElement('div');
                ember.classList.add('ember-particle');
                const angleEmber = -Math.PI / 2 + (Math.random() * 0.8 - 0.4);
                const speedEmber = 10 + Math.random() * 14;
                ember.style.setProperty('--tx', `${Math.cos(angleEmber) * speedEmber}px`);
                ember.style.setProperty('--ty', `${Math.sin(angleEmber) * speedEmber}px`);
                const sizeEmber = 2 + Math.random() * 2;
                ember.style.width = `${sizeEmber}px`;
                ember.style.height = `${sizeEmber}px`;
                
                emitter.appendChild(ember);
                ember.addEventListener('animationend', () => ember.remove());
            }
        }, 500);
    }

    // Placement Hover Preview system
    playerGridEl.addEventListener('mouseover', (e) => {
        if (phase !== 'placement') return;
        const cell = e.target.closest('.cell');
        if (!cell) return;

        const startR = parseInt(cell.dataset.row);
        const startC = parseInt(cell.dataset.col);
        const currentShip = SHIPS_DATA[selectedShipIndex];

        // Check if already placed
        const alreadyPlaced = playerShips.some(s => s.index === selectedShipIndex);
        if (alreadyPlaced) return;

        const isValid = checkPlacementValidity(startR, startC, currentShip.size, isVertical, playerBoard);
        const hoverClass = isValid ? 'preview-valid' : 'preview-invalid';

        // Apply visual preview
        for (let i = 0; i < currentShip.size; i++) {
            let pr = startR + (isVertical ? i : 0);
            let pc = startC + (isVertical ? 0 : i);
            if (pr < GRID_SIZE && pc < GRID_SIZE) {
                const targetCell = playerGridEl.querySelector(`[data-row="${pr}"][data-col="${pc}"]`);
                if (targetCell) {
                    targetCell.classList.add(hoverClass);
                }
            }
        }
    });

    playerGridEl.addEventListener('mouseout', (e) => {
        if (phase !== 'placement') return;
        const cells = playerGridEl.querySelectorAll('.cell');
        cells.forEach(c => {
            c.classList.remove('preview-valid', 'preview-invalid');
        });
    });

    playerGridEl.addEventListener('click', (e) => {
        if (phase !== 'placement') return;
        const cell = e.target.closest('.cell');
        if (!cell) return;

        const startR = parseInt(cell.dataset.row);
        const startC = parseInt(cell.dataset.col);
        const currentShip = SHIPS_DATA[selectedShipIndex];

        // Ensure not already placed
        const alreadyPlaced = playerShips.some(s => s.index === selectedShipIndex);
        if (alreadyPlaced) {
            logToConsole(`[SYSTEM] ${currentShip.name} has already been deployed. Clear or start battle.`, 'warning');
            return;
        }

        const isValid = checkPlacementValidity(startR, startC, currentShip.size, isVertical, playerBoard);
        if (!isValid) {
            playSynthSound('click'); // negative buzzer sound would be nice, but simple click suffices
            return;
        }

        placeShipOnBoard(startR, startC, currentShip, selectedShipIndex, isVertical, playerBoard, playerShips);
        playSynthSound('sonar');
        logToConsole(`[SYSTEM] Deployed ${currentShip.name} at coordinates: ${getCoordsString(startR, startC)}`, 'system');

        renderPlayerPlacedShips();
        updateShipSelectorUI();

        // Auto transition to next unplaced ship
        selectNextUnplacedShip();

        // Enable Start button if all 5 are deployed
        if (playerShips.length === SHIPS_DATA.length) {
            startBtn.removeAttribute('disabled');
        }
    });

    function selectNextUnplacedShip() {
        for (let i = 0; i < SHIPS_DATA.length; i++) {
            const placed = playerShips.some(s => s.index === i);
            if (!placed) {
                selectedShipIndex = i;
                updateShipSelectorUI();
                break;
            }
        }
    }

    // -------------------------------------------------------------
    // AUTO PLACEMENT (RANDOM)
    // -------------------------------------------------------------
    function randomPlaceShips(board, listShips) {
        // Reset local structures
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                board[r][c] = null;
            }
        }
        listShips.length = 0;

        SHIPS_DATA.forEach((shipData, index) => {
            let placed = false;
            while (!placed) {
                const r = Math.floor(Math.random() * GRID_SIZE);
                const c = Math.floor(Math.random() * GRID_SIZE);
                const vertical = Math.random() < 0.5;

                const valid = checkPlacementValidity(r, c, shipData.size, vertical, board);
                if (valid) {
                    placeShipOnBoard(r, c, shipData, index, vertical, board, listShips);
                    placed = true;
                }
            }
        });
    }

    randomBtn.addEventListener('click', () => {
        if (phase !== 'placement') return;
        randomPlaceShips(playerBoard, playerShips);
        playSynthSound('sonar');
        logToConsole('[SYSTEM] Fleet deployed automatically.', 'system');
        renderPlayerPlacedShips();
        updateShipSelectorUI();
        startBtn.removeAttribute('disabled');
    });

    // -------------------------------------------------------------
    // TRANSITION TO BATTLE PHASE
    // -------------------------------------------------------------
    startBtn.addEventListener('click', () => {
        if (phase !== 'placement') return;
        
        // Randomly place enemy ships
        randomPlaceShips(enemyBoard, enemyShips);
        
        // Update states
        phase = 'battle';
        activeTurn = 'player';
        
        // Sound and Interface transitions
        playSynthSound('sonar');
        logToConsole('[SYSTEM] Fleet deployment verified. Starting engagement protocol!', 'system');
        logToConsole('[SYSTEM] Radar Active. Target scanning enabled. FIRE WHEN READY.', 'system');

        document.getElementById('deployment-card').classList.add('hidden');
        document.getElementById('battle-status-card').classList.remove('hidden');
        document.getElementById('game-stats').classList.remove('hidden');
        document.getElementById('enemy-board-panel').classList.remove('disabled-panel');
        document.getElementById('phase-display').textContent = 'YOUR TURN';
        document.getElementById('phase-display').className = 'status-value player-turn animate-pulse';

        // Render clean player view and ensure radar target has no pre-placed visualizations
        renderPlayerPlacedShips();
        updateStatsDisplay();
    });

    // -------------------------------------------------------------
    // HIT & MISS GRAPHICAL SPECIAL EFFECTS
    // -------------------------------------------------------------
    function triggerBoardShake(boardId) {
        const boardEl = document.getElementById(boardId);
        if (!boardEl) return;
        boardEl.classList.remove('shake-board');
        // Force reflow
        void boardEl.offsetWidth;
        boardEl.classList.add('shake-board');
        setTimeout(() => {
            boardEl.classList.remove('shake-board');
        }, 450);
    }

    function createHitSparks(cellEl) {
        const sparkCount = 8;
        const colors = ['#f97316', '#ef4444', '#f59e0b', '#ec4899'];
        for (let i = 0; i < sparkCount; i++) {
            const spark = document.createElement('div');
            spark.classList.add('particle-spark');
            
            // Random direction and distance
            const angle = Math.random() * Math.PI * 2;
            const distance = 15 + Math.random() * 25;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            spark.style.setProperty('--tx', `${tx}px`);
            spark.style.setProperty('--ty', `${ty}px`);
            spark.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            
            cellEl.appendChild(spark);
            
            // Clean up particle
            spark.addEventListener('animationend', () => {
                spark.remove();
            });
        }
    }

    function createMissEffects(cellEl) {
        // Create ripple wave
        const ripple = document.createElement('div');
        ripple.classList.add('ripple-wave');
        cellEl.appendChild(ripple);
        ripple.addEventListener('animationend', () => {
            ripple.remove();
        });

        // Create 4 water splash droplets
        const splashCount = 4;
        for (let i = 0; i < splashCount; i++) {
            const drop = document.createElement('div');
            drop.classList.add('particle-splash');
            
            const angle = Math.random() * Math.PI * 2;
            const distance = 10 + Math.random() * 18;
            const tx = Math.cos(angle) * distance;
            const ty = Math.sin(angle) * distance;
            
            drop.style.setProperty('--tx', `${tx}px`);
            drop.style.setProperty('--ty', `${ty}px`);
            
            cellEl.appendChild(drop);
            drop.addEventListener('animationend', () => {
                drop.remove();
            });
        }
    }

    // -------------------------------------------------------------
    // PLAYER BATTLE MECHANICS (FIRE)
    // -------------------------------------------------------------
    enemyGridEl.addEventListener('click', (e) => {
        if (phase !== 'battle') return;
        if (activeTurn !== 'player') return;
        const cell = e.target.closest('.cell');
        if (!cell) return;

        const r = parseInt(cell.dataset.row);
        const c = parseInt(cell.dataset.col);

        // Check if already attacked
        if (playerAttacks[r][c] !== null) {
            logToConsole(`[SYSTEM] Coordinates ${getCoordsString(r, c)} have already been targeted.`, 'warning');
            return;
        }

        totalShots++;
        const ship = enemyBoard[r][c];

        if (ship) {
            // Hit!
            playerAttacks[r][c] = 'hit';
            accurateHits++;
            ship.hits++;
            cell.classList.add('hit');
            createHitSparks(cell);
            triggerBoardShake('enemy-board-panel');
            spawnPersistentSmoke(cell);
            playSynthSound('hit');
            logToConsole(`[PLAYER] HIT on coordinates ${getCoordsString(r, c)}!`, 'player');

            // Check if ship is sunk
            if (ship.hits === ship.size) {
                ship.sunk = true;
                playSynthSound('sunk');
                logToConsole(`[SYSTEM] Target sunk: Enemy ${ship.name}!`, 'system');
                
                // Color all cells of this ship as sunk
                ship.coordinates.forEach(coord => {
                    playerAttacks[coord.r][coord.c] = 'sunk';
                    const sCell = enemyGridEl.querySelector(`[data-row="${coord.r}"][data-col="${coord.c}"]`);
                    sCell.className = 'cell sunk-ship';
                    spawnPersistentSmoke(sCell);
                });

                // Render vector overlay for this sunk enemy ship on the enemy target grid
                renderShipsOverlays('enemy', enemyShips);

                // Update health list
                const rowEl = document.getElementById(`health-enemy-${ship.index}`);
                rowEl.classList.add('sunk');
                rowEl.querySelector('.recon-status').textContent = 'SUNK';
                rowEl.querySelector('.recon-status').className = 'recon-status sunk';
            }

            // Check Victory
            if (checkVictory(enemyShips)) {
                endGame('victory');
                return;
            }
        } else {
            // Miss
            playerAttacks[r][c] = 'miss';
            cell.classList.add('miss');
            createMissEffects(cell);
            playSynthSound('miss');
            logToConsole(`[PLAYER] MISS on coordinates ${getCoordsString(r, c)}.`, 'player');
        }

        updateStatsDisplay();
        
        // Pass Turn to AI
        setTurn('enemy');
    });

    function checkVictory(shipsList) {
        return shipsList.every(s => s.sunk);
    }

    function setTurn(turnOwner) {
        activeTurn = turnOwner;
        const phaseDisplay = document.getElementById('phase-display');
        const pBoard = document.getElementById('player-board-panel');
        const eBoard = document.getElementById('enemy-board-panel');

        if (turnOwner === 'player') {
            phaseDisplay.textContent = 'YOUR TURN';
            phaseDisplay.className = 'status-value player-turn animate-pulse';
            pBoard.classList.remove('active-turn-glow');
            eBoard.classList.add('active-turn-glow');
            eBoard.classList.remove('disabled-panel');
        } else {
            phaseDisplay.textContent = 'ENEMY RADAR SCANNING...';
            phaseDisplay.className = 'status-value enemy-turn animate-pulse';
            eBoard.classList.remove('active-turn-glow');
            pBoard.classList.add('active-turn-glow');
            eBoard.classList.add('disabled-panel');

            // Trigger AI attack with slight realistic delay
            setTimeout(executeAIOpponentTurn, 1000 + Math.random() * 800);
        }
    }

    function updateStatsDisplay() {
        const playerLive = playerShips.filter(s => !s.sunk).length;
        const enemyLive = enemyShips.filter(s => !s.sunk).length;
        document.getElementById('player-ships-sunk').textContent = `${playerLive} / 5`;
        document.getElementById('enemy-ships-sunk').textContent = `${enemyLive} / 5`;
    }

    // -------------------------------------------------------------
    // SMART AI TARGETING & HUNTING ENGINE
    // -------------------------------------------------------------
    function executeAIOpponentTurn() {
        if (phase !== 'battle') return;

        let target = null;

        if (aiDifficulty === 'easy') {
            // Easy AI: purely random unvisited targets
            target = getRandomUnvisitedTarget();
        } else if (aiDifficulty === 'medium') {
            // Medium AI: uses target queue if available, but with a 25% chance of making a random distraction/error shot.
            // Also, when hunting, it uses simple random hunting (not parity checkerboard).
            if (aiHunter.mode === 'target' && aiHunter.targetsQueue.length > 0 && Math.random() > 0.25) {
                target = aiHunter.targetsQueue.shift();
            } else {
                target = getRandomUnvisitedTarget();
            }
        } else {
            // Hard AI (Admiral): strict optimal search
            if (aiHunter.mode === 'target' && aiHunter.targetsQueue.length > 0) {
                target = aiHunter.targetsQueue.shift();
            } else {
                target = getHuntTarget();
            }
        }

        // Safety fallback: if no target could be found (which shouldn't happen)
        if (!target) {
            target = getRandomUnvisitedTarget();
        }

        const r = target.r;
        const c = target.c;
        const targetString = getCoordsString(r, c);
        const cellEl = playerGridEl.querySelector(`[data-row="${r}"][data-col="${c}"]`);
        
        const ship = playerBoard[r][c];

        if (ship) {
            // AI Hit!
            enemyAttacks[r][c] = 'hit';
            cellEl.classList.add('hit');
            createHitSparks(cellEl);
            triggerBoardShake('player-board-panel');
            spawnPersistentSmoke(cellEl);
            playSynthSound('hit');
            logToConsole(`[AI] HIT on your ${ship.name} at ${targetString}!`, 'enemy');

            ship.hits++;

            // Handle AI target queue management (only if Medium or Hard)
            if (aiDifficulty !== 'easy') {
                if (aiHunter.mode === 'hunt') {
                    aiHunter.mode = 'target';
                    aiHunter.firstHit = { r, c };
                    aiHunter.lastHit = { r, c };
                    aiHunter.currentDir = null;
                    aiHunter.checkedDirections = [];
                    queueValidNeighbors(r, c);
                } else {
                    // If in targeting mode and hit, we should lock direction if not already locked
                    if (aiDifficulty === 'hard') {
                        if (!aiHunter.currentDir && aiHunter.firstHit) {
                            aiHunter.currentDir = getDirection(aiHunter.firstHit, { r, c });
                            // Clean queue of items that don't match the line
                            filterQueueToLine(aiHunter.firstHit, aiHunter.currentDir);
                        }
                        aiHunter.lastHit = { r, c };
                        // Enqueue the next item in the successful direction
                        enqueueNextAlongDirection({ r, c }, aiHunter.currentDir);
                    } else {
                        // Medium AI just queues neighbors of the new hit to expand the search organically
                        queueValidNeighbors(r, c);
                    }
                }
            }

            // Check if ship is sunk
            if (ship.hits === ship.size) {
                ship.sunk = true;
                playSynthSound('sunk');
                logToConsole(`[SYSTEM] Alert: Your ${ship.name} was SUNK!`, 'warning');

                // Visual updates on player grid
                ship.coordinates.forEach(coord => {
                    enemyAttacks[coord.r][coord.c] = 'sunk';
                    const pCell = playerGridEl.querySelector(`[data-row="${coord.r}"][data-col="${coord.c}"]`);
                    pCell.className = 'cell sunk-ship';
                    spawnPersistentSmoke(pCell);
                });

                // Re-render player ships so the sunk ship appears with a red hull and glow
                renderShipsOverlays('player', playerShips);

                // Update UI health bars
                const rowEl = document.getElementById(`health-player-${ship.index}`);
                rowEl.classList.add('sunk');
                rowEl.querySelector('.health-bar').style.width = '0%';
                rowEl.querySelector('.health-status').textContent = 'SUNK';

                // Reset Hunter back to hunt mode since target is fully destroyed
                resetAIHunter();
            }

            // Check Defeat
            if (checkVictory(playerShips)) {
                endGame('defeat');
                return;
            }

        } else {
            // AI Miss
            enemyAttacks[r][c] = 'miss';
            cellEl.classList.add('miss');
            createMissEffects(cellEl);
            playSynthSound('miss');
            logToConsole(`[AI] Targeted ${targetString} - MISS.`, 'enemy');

            // If we missed in target mode, we may need to try opposite direction
            if (aiDifficulty === 'hard' && aiHunter.mode === 'target' && aiHunter.currentDir) {
                tryReverseAITargetDirection();
            }
        }

        updateStatsDisplay();
        setTurn('player');
    }

    function resetAIHunter() {
        aiHunter.mode = 'hunt';
        aiHunter.targetsQueue = [];
        aiHunter.firstHit = null;
        aiHunter.lastHit = null;
        aiHunter.currentDir = null;
        aiHunter.checkedDirections = [];
    }

    // Return hunt coordinate based on checkerboard parity pattern to maximize search coverage
    function getHuntTarget() {
        const available = [];
        
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (enemyAttacks[r][c] === null) {
                    // Parity pattern: attack alternate squares
                    if ((r + c) % 2 === 0) {
                        available.push({ r, c });
                    }
                }
            }
        }

        // If no parity cells left, pick any unvisited cell
        if (available.length === 0) {
            for (let r = 0; r < GRID_SIZE; r++) {
                for (let c = 0; c < GRID_SIZE; c++) {
                    if (enemyAttacks[r][c] === null) {
                        available.push({ r, c });
                    }
                }
            }
        }

        if (available.length > 0) {
            const index = Math.floor(Math.random() * available.length);
            return available[index];
        }
        return null;
    }

    function getRandomUnvisitedTarget() {
        for (let r = 0; r < GRID_SIZE; r++) {
            for (let c = 0; c < GRID_SIZE; c++) {
                if (enemyAttacks[r][c] === null) {
                    return { r, c };
                }
            }
        }
        return null;
    }

    function getDirection(from, to) {
        if (from.r === to.r) {
            return from.c < to.c ? 'E' : 'W';
        } else if (from.c === to.c) {
            return from.r < to.r ? 'S' : 'N';
        }
        return null;
    }

    function queueValidNeighbors(r, c) {
        const directions = [
            { r: -1, c: 0, d: 'N' }, // North
            { r: 1, c: 0, d: 'S' },  // South
            { r: 0, c: -1, d: 'W' }, // West
            { r: 0, c: 1, d: 'E' }   // East
        ];

        // Randomize direction selection order
        directions.sort(() => Math.random() - 0.5);

        directions.forEach(dir => {
            const nr = r + dir.r;
            const nc = c + dir.c;
            if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
                if (enemyAttacks[nr][nc] === null) {
                    aiHunter.targetsQueue.push({ r: nr, c: nc });
                }
            }
        });
    }

    function filterQueueToLine(origin, dir) {
        // Keep in queue only coords that align with the hit direction
        aiHunter.targetsQueue = aiHunter.targetsQueue.filter(coord => {
            if (dir === 'N' || dir === 'S') {
                return coord.c === origin.c;
            } else {
                return coord.r === origin.r;
            }
        });
    }

    function enqueueNextAlongDirection(lastHit, dir) {
        let nr = lastHit.r;
        let nc = lastHit.c;
        if (dir === 'N') nr--;
        else if (dir === 'S') nr++;
        else if (dir === 'E') nc++;
        else if (dir === 'W') nc--;

        if (nr >= 0 && nr < GRID_SIZE && nc >= 0 && nc < GRID_SIZE) {
            if (enemyAttacks[nr][nc] === null) {
                // Insert at front of queue to keep momentum
                aiHunter.targetsQueue.unshift({ r: nr, c: nc });
            }
        }
    }

    function tryReverseAITargetDirection() {
        const origin = aiHunter.firstHit;
        const dir = aiHunter.currentDir;
        if (!origin || !dir) return;

        // Try to reverse to opposite direction
        let revDir = null;
        if (dir === 'N') revDir = 'S';
        else if (dir === 'S') revDir = 'N';
        else if (dir === 'E') revDir = 'W';
        else if (dir === 'W') revDir = 'E';

        aiHunter.currentDir = revDir;
        aiHunter.targetsQueue = []; // Clear queue since we hit a miss, start fresh from origin in reverse
        enqueueNextAlongDirection(origin, revDir);
    }

    // -------------------------------------------------------------
    // GAME OVER & STATS DISPLAY
    // -------------------------------------------------------------
    const overlay = document.getElementById('game-over-overlay');
    const overlayTitle = document.getElementById('game-over-title');
    const overlayDesc = document.getElementById('game-over-desc');
    const restartBtn = document.getElementById('restart-game-btn');

    function endGame(outcome) {
        phase = 'gameover';
        overlay.classList.remove('hidden');

        // Stats summary calculation
        const accuracy = totalShots > 0 ? Math.round((accurateHits / totalShots) * 100) : 0;
        document.getElementById('stat-hits').textContent = accurateHits;
        document.getElementById('stat-shots').textContent = totalShots;
        document.getElementById('stat-accuracy').textContent = `${accuracy}%`;

        if (outcome === 'victory') {
            playSynthSound('victory');
            overlayTitle.textContent = 'VICTORY ACHIEVED';
            overlayTitle.style.color = 'var(--clr-cyan)';
            overlayDesc.textContent = 'Tactical simulation complete. You successfully sunk the enemy fleet and defended your zone!';
            logToConsole('[SYSTEM] VICTORY. Mission accomplished.', 'system');
        } else {
            playSynthSound('defeat');
            overlayTitle.textContent = 'DEFEAT IMMINENT';
            overlayTitle.style.color = 'var(--clr-red)';
            overlayDesc.textContent = 'Critical failure. Your fleet has been entirely destroyed by enemy bombardment.';
            logToConsole('[SYSTEM] DEFEAT. Fleet lost.', 'warning');
        }
    }

    // -------------------------------------------------------------
    // RESET GAME FLOW
    // -------------------------------------------------------------
    function restartGame() {
        phase = 'placement';
        activeTurn = 'player';
        selectedShipIndex = 0;
        isVertical = false;
        totalShots = 0;
        accurateHits = 0;
        
        aiDifficulty = 'hard';
        difficultyButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.difficulty === 'hard') {
                btn.classList.add('active');
            }
        });

        playerBoard = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
        enemyBoard = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
        playerAttacks = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
        enemyAttacks = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(null));
        
        playerShips = [];
        enemyShips = [];
        resetAIHunter();

        // Reset overlays/UI
        overlay.classList.add('hidden');
        document.getElementById('deployment-card').classList.remove('hidden');
        document.getElementById('battle-status-card').classList.add('hidden');
        document.getElementById('game-stats').classList.add('hidden');
        document.getElementById('enemy-board-panel').classList.add('disabled-panel');
        document.getElementById('phase-display').textContent = 'DEPLOYMENT PHASE';
        document.getElementById('phase-display').className = 'status-value highlight animate-pulse';

        // Clear health bars rows
        for (let i = 0; i < SHIPS_DATA.length; i++) {
            const pRow = document.getElementById(`health-player-${i}`);
            pRow.classList.remove('sunk');
            pRow.querySelector('.health-bar').style.width = '100%';
            pRow.querySelector('.health-status').textContent = 'ACTIVE';

            const eRow = document.getElementById(`health-enemy-${i}`);
            eRow.classList.remove('sunk');
            eRow.querySelector('.recon-status').textContent = 'UNDETECTED';
            eRow.querySelector('.recon-status').className = 'recon-status';
        }

        // Recreate clean grids
        createGrids();
        renderShipsOverlays('player', playerShips);
        renderShipsOverlays('enemy', enemyShips);
        updateShipSelectorUI();
        startBtn.setAttribute('disabled', 'true');
        
        // Re-setup placement controls display
        rotateBtn.innerHTML = `<svg viewBox="0 0 24 24" width="18" height="18" class="btn-svg"><path fill="currentColor" d="M12,4V1L8,5L12,9V6A6,6 0 0,1 18,12C18,15.31 15.31,18 12,18C8.69,18 6,15.31 6,12H4A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z"/></svg> Rotate Ship (R)`;

        // Reset console
        consoleLogs.innerHTML = '';
        logToConsole('[SYSTEM] Tactical session reset. Re-deploy fleet.', 'system');
        
        playSynthSound('sonar');
    }

    // Start canvas background & laser targeting crosshairs
    initBackgroundCanvas();
    initLaserTargeting();

    restartBtn.addEventListener('click', restartGame);
});
