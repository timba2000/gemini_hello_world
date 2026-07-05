// -------------------------------------------------------------
// BATTLESHIPS HEADLESS CLI TEST RUNNER
// -------------------------------------------------------------

// Verify jsdom is installed, exit gracefully with instructions if not
try {
    require('jsdom');
} catch (e) {
    console.error("\x1b[31m%s\x1b[0m", "==================================================================");
    console.error("\x1b[31m%s\x1b[0m", "ERROR: 'jsdom' is required to run the command-line test harness.");
    console.error("\x1b[36m%s\x1b[0m", "Please run: npm install  (to install dependencies first)");
    console.error("\x1b[31m%s\x1b[0m", "==================================================================");
    process.exit(1);
}

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// Reading files
const htmlCode = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
const appCode = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');

// Mock Web Audio Context since JSDOM lacks audio hardware support
class MockAudioContext {
    constructor() { this.state = 'suspended'; }
    resume() { this.state = 'running'; return Promise.resolve(); }
    createOscillator() { 
        return { 
            type: '', 
            frequency: { 
                setValueAtTime() {}, 
                exponentialRampToValueAtTime() {}, 
                linearRampToValueAtTime() {} 
            }, 
            connect() {}, 
            start() {}, 
            stop() {} 
        }; 
    }
    createGain() { 
        return { 
            gain: { 
                setValueAtTime() {}, 
                exponentialRampToValueAtTime() {} 
            }, 
            connect() {} 
        }; 
    }
    createBufferSource() { 
        return { 
            buffer: {}, 
            connect() {}, 
            start() {}, 
            stop() {} 
        }; 
    }
    createBiquadFilter() { 
        return { 
            type: '', 
            frequency: { 
                setValueAtTime() {}, 
                exponentialRampToValueAtTime() {} 
            }, 
            connect() {} 
        }; 
    }
    createBuffer() { 
        return { 
            getChannelData() { return new Float32Array(100); } 
        }; 
    }
    get currentTime() { return 0; }
    get sampleRate() { return 44100; }
    get destination() { return {}; }
}

console.log("\x1b[36m%s\x1b[0m", "[CLI TEST] Launching Headless JSDOM Environment...");

const dom = new JSDOM(htmlCode, {
    runScripts: 'dangerously',
    resources: 'usable'
});

const { window } = dom;

// Bind global variables to mock node environment
global.window = window;
global.document = window.document;
global.navigator = window.navigator;

// Inject browser mocks
window.AudioContext = MockAudioContext;
window.webkitAudioContext = MockAudioContext;
window.requestAnimationFrame = (callback) => setTimeout(callback, 16);
window.cancelAnimationFrame = (id) => clearTimeout(id);

// Mock Canvas 2D Context for ambient background telemetry render calls
window.HTMLCanvasElement.prototype.getContext = function(type) {
    if (type === '2d') {
        return {
            fillRect: () => {},
            clearRect: () => {},
            fillText: () => {},
            beginPath: () => {},
            moveTo: () => {},
            lineTo: () => {},
            stroke: () => {},
            fillStyle: '',
            strokeStyle: '',
            lineWidth: 0,
            font: ''
        };
    }
    return null;
};

// Load app.js into global JSDOM window
const scriptEl = window.document.createElement('script');
scriptEl.textContent = appCode;
window.document.body.appendChild(scriptEl);

// Manually trigger DOMContentLoaded so event listener fires inside JSDOM context
const domLoadedEvent = new window.Event('DOMContentLoaded');
window.document.dispatchEvent(domLoadedEvent);

// Track test assertions
let assertionsCount = 0;
let assertionsFailed = 0;

function assert(condition, message) {
    assertionsCount++;
    if (condition) {
        console.log(`\x1b[32m  ✓ PASS: ${message}\x1b[0m`);
    } else {
        assertionsFailed++;
        console.error(`\x1b[31m  ✗ FAIL: ${message}\x1b[0m`);
    }
}

// -------------------------------------------------------------
// HEADLESS SUITE EXECUTION
// -------------------------------------------------------------
async function runCliSuite() {
    try {
        console.log("\x1b[35m%s\x1b[0m", "\n[SUITE 0] UI Load Verification");
        const playerGrid = window.document.getElementById('player-grid');
        const enemyGrid = window.document.getElementById('enemy-grid');
        const deployCard = window.document.getElementById('deployment-card');
        
        assert(playerGrid !== null, "Player grid element exists");
        const playerCells = playerGrid.querySelectorAll('.cell');
        assert(playerCells.length === 100, `Player grid contains 100 cells (Count: ${playerCells.length})`);

        assert(enemyGrid !== null, "Enemy grid element exists");
        const enemyCells = enemyGrid.querySelectorAll('.cell');
        assert(enemyCells.length === 100, `Enemy grid contains 100 cells (Count: ${enemyCells.length})`);

        assert(deployCard && !deployCard.classList.contains('hidden'), "Deployment card is visible on load");

        // -------------------------------------------------------------
        console.log("\x1b[35m%s\x1b[0m", "\n[SUITE 1] Ship Manual Placement & Rotate");
        
        const rotateBtn = window.document.getElementById('rotate-btn');
        assert(rotateBtn !== null, "Rotate Ship button exists");
        rotateBtn.click(); // Set to vertical
        
        // Place Carrier vertically at A1 (0, 0)
        const cellA1 = playerGrid.querySelector('[data-row="0"][data-col="0"]');
        assert(cellA1 !== null, "Cell A1 exists");
        cellA1.click();
        
        const overlays = playerGrid.querySelectorAll('.placed-ship-overlay');
        assert(overlays.length === 1, "Manual placement overlay created");

        // -------------------------------------------------------------
        console.log("\x1b[35m%s\x1b[0m", "\n[SUITE 2] Auto-Deploy Integration");
        
        const randomBtn = window.document.getElementById('random-btn');
        assert(randomBtn !== null, "Auto Deploy button exists");
        randomBtn.click();
        
        const allOverlays = playerGrid.querySelectorAll('.placed-ship-overlay');
        assert(allOverlays.length === 5, `All 5 ships deployed (Placed overlays: ${allOverlays.length})`);

        const startBtn = window.document.getElementById('start-game-btn');
        assert(startBtn !== null, "Start Game button exists");
        assert(!startBtn.hasAttribute('disabled'), "Start Game button is enabled");

        // -------------------------------------------------------------
        console.log("\x1b[35m%s\x1b[0m", "\n[SUITE 3] Phase Transition Checks");
        startBtn.click();

        const phaseDisplay = window.document.getElementById('phase-display');
        assert(phaseDisplay.textContent.includes('YOUR TURN'), `Phase transitioned to Battle: "${phaseDisplay.textContent}"`);
        
        assert(deployCard.classList.contains('hidden'), "Deployment card is hidden in Battle phase");
        
        const battleCard = window.document.getElementById('battle-status-card');
        assert(battleCard && !battleCard.classList.contains('hidden'), "Battle integrity card is visible");

        // -------------------------------------------------------------
        console.log("\x1b[35m%s\x1b[0m", "\n[SUITE 4] Fire Engagement Cycle");
        
        const targetCell = enemyGrid.querySelector('[data-row="1"][data-col="1"]');
        assert(targetCell !== null, "Target cell B3 (1, 1) exists");
        targetCell.click();

        const cellHit = targetCell.classList.contains('hit');
        const cellMiss = targetCell.classList.contains('miss');
        assert(cellHit || cellMiss, `Shot registered on enemy board (Result: ${cellHit ? 'HIT' : 'MISS'})`);

        // Check if phase display indicates enemy radar scan
        assert(phaseDisplay.textContent.includes('RADAR'), "Turn correctly cycled to ENEMY RADAR SCANNING");

        // -------------------------------------------------------------
        console.log("\x1b[35m%s\x1b[0m", "\n==================================================================");
        if (assertionsFailed === 0) {
            console.log("\x1b[32m%s\x1b[0m", `SUCCESS: All ${assertionsCount} headless test assertions passed!`);
            process.exit(0);
        } else {
            console.error("\x1b[31m%s\x1b[0m", `FAILURE: ${assertionsFailed} of ${assertionsCount} assertions failed.`);
            process.exit(1);
        }

    } catch (err) {
        console.error("\x1b[31m%s\x1b[0m", `CLI TEST HARNESS CRASHED WITH ERROR: ${err.stack}`);
        process.exit(1);
    }
}

runCliSuite();
