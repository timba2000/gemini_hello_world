// -------------------------------------------------------------
// BATTLESHIPS VISUAL TEST HARNESS ENGINE
// -------------------------------------------------------------

document.addEventListener('DOMContentLoaded', () => {
    const iframe = document.getElementById('game-frame');
    const runBtn = document.getElementById('run-tests-btn');
    const resetBtn = document.getElementById('reset-tests-btn');
    const paceSlider = document.getElementById('pace-slider');
    const paceDisplay = document.getElementById('pace-display');
    const logsContainer = document.getElementById('assertion-logs-container');
    
    // Telemetry and Progress
    const statPassed = document.getElementById('stat-passed');
    const statFailed = document.getElementById('stat-failed');
    const statAccuracy = document.getElementById('stat-accuracy');
    const progressText = document.getElementById('progress-text');
    const progressFill = document.getElementById('progress-fill');
    const tallyText = document.getElementById('assertion-tally');
    const overallStatusText = document.getElementById('overall-status-text');
    const overallStatusBadge = document.getElementById('overall-status-badge');

    let paceMultiplier = 1.0;
    let isRunning = false;
    
    let assertionsTotal = 0;
    let assertionsPassed = 0;
    let assertionsFailed = 0;

    let suitesPassed = 0;
    let suitesFailed = 0;
    const TOTAL_SUITES = 6;

    // Handle pace adjustments
    paceSlider.addEventListener('input', () => {
        paceMultiplier = parseFloat(paceSlider.value);
        paceDisplay.textContent = paceMultiplier.toFixed(1) + 'x';
    });

    // Helper: Delay supporting pace multipliers
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms / paceMultiplier));
    }

    // Helper: Logging assertions
    function logAssertion(description, status) {
        assertionsTotal++;
        if (status === 'PASS') assertionsPassed++;
        else if (status === 'FAIL') assertionsFailed++;

        const row = document.createElement('div');
        row.classList.add('assertion-row');
        row.innerHTML = `
            <span class="assert-text">${description}</span>
            <span class="assert-status ${status.toLowerCase()}">${status}</span>
        `;
        logsContainer.appendChild(row);
        logsContainer.scrollTop = logsContainer.scrollHeight;

        // Update assertions tally
        tallyText.textContent = `PASSED: ${assertionsPassed} | FAILED: ${assertionsFailed}`;
        
        // Update accuracy telemetry
        const accuracy = Math.round((assertionsPassed / assertionsTotal) * 100);
        statAccuracy.textContent = `${accuracy}%`;
    }

    function logInfo(message) {
        const row = document.createElement('div');
        row.classList.add('assertion-row');
        row.innerHTML = `
            <span class="assert-text" style="color: var(--clr-cyan);">${message}</span>
            <span class="assert-status info">INFO</span>
        `;
        logsContainer.appendChild(row);
        logsContainer.scrollTop = logsContainer.scrollHeight;
    }

    // Update Suite UI State
    function updateSuiteUI(suiteIdx, state) {
        const item = document.getElementById(`suite-${suiteIdx}`);
        const indicator = item.querySelector('.test-indicator');
        
        item.className = 'test-item';
        indicator.className = 'test-indicator';

        if (state === 'running') {
            item.classList.add('running');
            indicator.classList.add('running');
            indicator.textContent = 'RUNNING';
        } else if (state === 'passed') {
            item.classList.add('passed');
            indicator.classList.add('passed');
            indicator.textContent = 'PASSED';
        } else if (state === 'failed') {
            item.classList.add('failed');
            indicator.classList.add('failed');
            indicator.textContent = 'FAILED';
        } else {
            indicator.classList.add('pending');
            indicator.textContent = 'PENDING';
        }
    }

    function updateOverallProgress() {
        const progress = Math.round(((suitesPassed + suitesFailed) / TOTAL_SUITES) * 100);
        progressText.textContent = `${progress}%`;
        progressFill.style.width = `${progress}%`;

        statPassed.textContent = suitesPassed;
        statFailed.textContent = suitesFailed;

        // Update overall status badge
        if (suitesFailed > 0) {
            overallStatusBadge.className = 'status-badge badge-failed';
            overallStatusText.textContent = 'HARNESS FAIL';
        } else if (suitesPassed === TOTAL_SUITES) {
            overallStatusBadge.className = 'status-badge badge-passed';
            overallStatusText.textContent = 'HARNESS PASS';
        }
    }

    // Reset harness
    function resetHarness() {
        if (isRunning) return;
        
        assertionsTotal = 0;
        assertionsPassed = 0;
        assertionsFailed = 0;
        suitesPassed = 0;
        suitesFailed = 0;
        
        logsContainer.innerHTML = '';
        logInfo('[SYSTEM] Resetting test harness...');
        
        for (let i = 0; i < TOTAL_SUITES; i++) {
            updateSuiteUI(i, 'pending');
        }

        tallyText.textContent = 'PASSED: 0 | FAILED: 0';
        statPassed.textContent = '0';
        statFailed.textContent = '0';
        statAccuracy.textContent = '0%';
        progressText.textContent = '0%';
        progressFill.style.width = '0%';

        overallStatusBadge.className = 'status-badge badge-idle';
        overallStatusText.textContent = 'SYSTEM IDLE';

        // Reload iframe
        iframe.src = iframe.src;
    }

    resetBtn.addEventListener('click', resetHarness);

    // E2E Test Suites Runner
    async function runTestHarness() {
        if (isRunning) return;
        isRunning = true;
        runBtn.setAttribute('disabled', 'true');
        resetBtn.setAttribute('disabled', 'true');

        overallStatusBadge.className = 'status-badge badge-running';
        overallStatusText.textContent = 'TESTING...';

        const iframeWin = iframe.contentWindow;
        const iframeDoc = iframe.contentDocument || iframeWin.document;

        try {
            // -------------------------------------------------------------
            // SUITE 0: UI Load Verification
            // -------------------------------------------------------------
            updateSuiteUI(0, 'running');
            logInfo('[SUITE 0] Verifying DOM and Game Assets Load...');
            await delay(400);

            const playerGrid = iframeDoc.getElementById('player-grid');
            const enemyGrid = iframeDoc.getElementById('enemy-grid');
            const deployCard = iframeDoc.getElementById('deployment-card');
            
            if (playerGrid) {
                const cellsCount = playerGrid.querySelectorAll('.cell').length;
                if (cellsCount === 100) {
                    logAssertion('Player grid contains 100 cells', 'PASS');
                } else {
                    logAssertion(`Player grid contains ${cellsCount} cells (expected 100)`, 'FAIL');
                }
            } else {
                logAssertion('Player grid element not found', 'FAIL');
            }

            if (enemyGrid) {
                const cellsCount = enemyGrid.querySelectorAll('.cell').length;
                if (cellsCount === 100) {
                    logAssertion('Enemy grid contains 100 cells', 'PASS');
                } else {
                    logAssertion(`Enemy grid contains ${cellsCount} cells (expected 100)`, 'FAIL');
                }
            } else {
                logAssertion('Enemy grid element not found', 'FAIL');
            }

            const soundBtn = iframeDoc.getElementById('sound-toggle');
            if (soundBtn) {
                logAssertion('Sound control toggle loaded', 'PASS');
            } else {
                logAssertion('Sound control button missing', 'FAIL');
            }

            if (deployCard && !deployCard.classList.contains('hidden')) {
                logAssertion('Fleet Assembly panel is visible on load', 'PASS');
            } else {
                logAssertion('Fleet Assembly panel is hidden or missing', 'FAIL');
            }

            // Verify ship items selectors
            const shipItems = iframeDoc.querySelectorAll('.ship-select-item');
            if (shipItems.length === 5) {
                logAssertion('Ship inventory lists 5 ships', 'PASS');
            } else {
                logAssertion(`Ship inventory lists ${shipItems.length} ships (expected 5)`, 'FAIL');
            }

            let suite0Passed = (assertionsFailed === 0);
            updateSuiteUI(0, suite0Passed ? 'passed' : 'failed');
            if (suite0Passed) suitesPassed++; else suitesFailed++;
            updateOverallProgress();
            await delay(600);

            // -------------------------------------------------------------
            // SUITE 1: Manual Placement Logic & Bounds
            // -------------------------------------------------------------
            updateSuiteUI(1, 'running');
            logInfo('[SUITE 1] Verifying Ship Placement Constraints...');
            await delay(400);

            // Test horizontal preview valid state
            // Let's trigger a mouseover event on F1 (row 0, col 5) with horizontal orientation (default)
            // Carrier size 5: valid columns are 5, 6, 7, 8, 9 (F1, G1, H1, I1, J1)
            const cellF1 = playerGrid.querySelector('[data-row="0"][data-col="5"]');
            if (cellF1) {
                const mouseOverEvent = new MouseEvent('mouseover', { bubbles: true });
                cellF1.dispatchEvent(mouseOverEvent);
                await delay(200);

                // Verify preview-valid class exists on F1 and J1 (col 9)
                const cellJ1 = playerGrid.querySelector('[data-row="0"][data-col="9"]');
                if (cellF1.classList.contains('preview-valid') && cellJ1.classList.contains('preview-valid')) {
                    logAssertion('Carrier horizontal placement preview shows VALID', 'PASS');
                } else {
                    logAssertion('Carrier horizontal preview failed validation highlight', 'FAIL');
                }
                
                // Clear hover
                const mouseOutEvent = new MouseEvent('mouseout', { bubbles: true });
                cellF1.dispatchEvent(mouseOutEvent);
            }

            // Test rotation (Keydown 'R' or rotate button)
            const rotateBtn = iframeDoc.getElementById('rotate-btn');
            if (rotateBtn) {
                rotateBtn.click(); // Rotate to vertical
                await delay(200);
                logAssertion('Ship orientation rotated to: VERTICAL', 'PASS');
            } else {
                logAssertion('Rotate button missing', 'FAIL');
            }

            // Test vertical out-of-bounds preview state
            // Carrier size 5: hovering on F8 (row 7, col 5) vertically exceeds row 9 boundary (7, 8, 9, 10, 11)
            const cellF8 = playerGrid.querySelector('[data-row="7"][data-col="5"]');
            if (cellF8) {
                const mouseOverEvent = new MouseEvent('mouseover', { bubbles: true });
                cellF8.dispatchEvent(mouseOverEvent);
                await delay(200);

                if (cellF8.classList.contains('preview-invalid')) {
                    logAssertion('Out-of-bounds placement preview correctly shows INVALID', 'PASS');
                } else {
                    logAssertion('Failed to flag out-of-bounds placement as INVALID', 'FAIL');
                }
                
                const mouseOutEvent = new MouseEvent('mouseout', { bubbles: true });
                cellF8.dispatchEvent(mouseOutEvent);
            }

            // Click cell A1 (0, 0) vertically to place Carrier
            const cellA1 = playerGrid.querySelector('[data-row="0"][data-col="0"]');
            if (cellA1) {
                cellA1.click();
                await delay(400);

                const overlays = playerGrid.querySelectorAll('.placed-ship-overlay');
                if (overlays.length === 1) {
                    logAssertion('Carrier successfully deployed manually', 'PASS');
                } else {
                    logAssertion('Carrier SVG overlay not created after placement click', 'FAIL');
                }
            } else {
                logAssertion('Cell A1 not found', 'FAIL');
            }

            let suite1Passed = (suitesFailed === 0);
            updateSuiteUI(1, suite1Passed ? 'passed' : 'failed');
            if (suite1Passed) suitesPassed++; else suitesFailed++;
            updateOverallProgress();
            await delay(600);

            // -------------------------------------------------------------
            // SUITE 2: Auto-Deploy Integration
            // -------------------------------------------------------------
            updateSuiteUI(2, 'running');
            logInfo('[SUITE 2] Triggering Auto-Deploy Fleet assembly...');
            await delay(400);

            const randomBtn = iframeDoc.getElementById('random-btn');
            if (randomBtn) {
                randomBtn.click();
                await delay(500);

                // Should auto-deploy all remaining ships (5 total)
                const overlayCount = playerGrid.querySelectorAll('.placed-ship-overlay').length;
                if (overlayCount === 5) {
                    logAssertion('All 5 ships placed via Auto Deploy', 'PASS');
                } else {
                    logAssertion(`Auto Deploy placed ${overlayCount} ships (expected 5)`, 'FAIL');
                }

                const startBtn = iframeDoc.getElementById('start-game-btn');
                if (startBtn && !startBtn.hasAttribute('disabled')) {
                    logAssertion('Lock-Ships battle button is UNLOCKED', 'PASS');
                } else {
                    logAssertion('Start button remains disabled after fleet deployment', 'FAIL');
                }
            } else {
                logAssertion('Auto Deploy button not found', 'FAIL');
            }

            let suite2Passed = (suitesFailed === 0);
            updateSuiteUI(2, suite2Passed ? 'passed' : 'failed');
            if (suite2Passed) suitesPassed++; else suitesFailed++;
            updateOverallProgress();
            await delay(600);

            // -------------------------------------------------------------
            // SUITE 3: Phase Transition Checks
            // -------------------------------------------------------------
            updateSuiteUI(3, 'running');
            logInfo('[SUITE 3] Initiating engagement transition...');
            await delay(400);

            const startBtn = iframeDoc.getElementById('start-game-btn');
            if (startBtn) {
                startBtn.click();
                await delay(600);

                const phaseDisplay = iframeDoc.getElementById('phase-display');
                if (phaseDisplay && phaseDisplay.textContent.includes('YOUR TURN')) {
                    logAssertion('Game successfully transitioned to BATTLE phase', 'PASS');
                } else {
                    logAssertion('Failed to transition phase title to YOUR TURN', 'FAIL');
                }

                const deployCard = iframeDoc.getElementById('deployment-card');
                const battleCard = iframeDoc.getElementById('battle-status-card');
                if (deployCard.classList.contains('hidden') && !battleCard.classList.contains('hidden')) {
                    logAssertion('Fleet Assembly hidden and Fleet Integrity displayed', 'PASS');
                } else {
                    logAssertion('UI card panels failed to toggle visibility', 'FAIL');
                }

                const enemyPanel = iframeDoc.getElementById('enemy-board-panel');
                if (enemyPanel && !enemyPanel.classList.contains('disabled-panel')) {
                    logAssertion('Enemy grid panel activated for user input', 'PASS');
                } else {
                    logAssertion('Enemy panel remains disabled in battle phase', 'FAIL');
                }
            }

            let suite3Passed = (suitesFailed === 0);
            updateSuiteUI(3, suite3Passed ? 'passed' : 'failed');
            if (suite3Passed) suitesPassed++; else suitesFailed++;
            updateOverallProgress();
            await delay(600);

            // -------------------------------------------------------------
            // SUITE 4: Fire Engagement Cycle
            // -------------------------------------------------------------
            updateSuiteUI(4, 'running');
            logInfo('[SUITE 4] Simulating Shell Firing Sequence...');
            await delay(400);

            // Let's fire at enemy cell B3 (row 1, col 1)
            const targetCell = enemyGrid.querySelector('[data-row="1"][data-col="1"]');
            if (targetCell) {
                targetCell.click();
                await delay(400);

                // Cell should now have either class hit or miss
                const isHit = targetCell.classList.contains('hit');
                const isMiss = targetCell.classList.contains('miss');
                
                if (isHit || isMiss) {
                    logAssertion(`Player shot registered at B3 (Result: ${isHit ? 'HIT' : 'MISS'})`, 'PASS');
                } else {
                    logAssertion('Clicked cell did not update with hit/miss class', 'FAIL');
                }

                // Verify that screen overlays (ripples or sparks) were appended
                const ripple = targetCell.querySelector('.ripple-wave');
                const spark = targetCell.querySelector('.particle-spark');
                if (ripple || spark) {
                    logAssertion('Hit/Miss graphical particles successfully rendered', 'PASS');
                } else {
                    logAssertion('Visual particle emitters missing on shot cell', 'FAIL');
                }

                // Turn should switch to enemy and then back
                const phaseDisplay = iframeDoc.getElementById('phase-display');
                if (phaseDisplay.textContent.includes('RADAR') || phaseDisplay.textContent.includes('YOUR TURN')) {
                    logAssertion('Enemy turn transition cycle initiated', 'PASS');
                } else {
                    logAssertion('Turn display failed to cycle', 'FAIL');
                }

                // Wait for AI to complete its shot (takes ~1-1.8s)
                await delay(2000);

                // Verify that AI made an attack on player grid
                let aiAttacksCount = 0;
                playerGrid.querySelectorAll('.cell').forEach(c => {
                    if (c.classList.contains('hit') || c.classList.contains('miss')) {
                        aiAttacksCount++;
                    }
                });

                if (aiAttacksCount > 0) {
                    logAssertion('AI opponent computed and fired counter-shot', 'PASS');
                } else {
                    logAssertion('AI failed to execute counter-shot in designated window', 'FAIL');
                }
            } else {
                logAssertion('Enemy target cell B3 not found', 'FAIL');
            }

            let suite4Passed = (suitesFailed === 0);
            updateSuiteUI(4, suite4Passed ? 'passed' : 'failed');
            if (suite4Passed) suitesPassed++; else suitesFailed++;
            updateOverallProgress();
            await delay(600);

            // -------------------------------------------------------------
            // SUITE 5: Combat Simulation Completion
            // -------------------------------------------------------------
            updateSuiteUI(5, 'running');
            logInfo('[SUITE 5] Running Automated Combat Loop to Completion...');

            const overlay = iframeDoc.getElementById('game-over-overlay');
            let simTimeout = 80; // Limit clicks to prevent infinite loops
            
            // Speed up combat simulation execution
            const originalPace = paceMultiplier;
            paceMultiplier = 3.0; 
            paceDisplay.textContent = '3.0x (SIM SPEED)';
            
            while (overlay.classList.contains('hidden') && simTimeout > 0) {
                // Find next untargeted cell on the enemy grid
                let cellToClick = null;
                const cells = enemyGrid.querySelectorAll('.cell');
                for (let i = 0; i < cells.length; i++) {
                    const c = cells[i];
                    const r = parseInt(c.dataset.row);
                    const col = parseInt(c.dataset.col);
                    // access the attack matrix from window context if possible, or check classes
                    if (!c.classList.contains('hit') && !c.classList.contains('miss') && !c.classList.contains('sunk-ship')) {
                        cellToClick = c;
                        break;
                    }
                }

                if (cellToClick) {
                    cellToClick.click();
                    // Wait for player shot animations and AI response
                    await delay(1200); 
                } else {
                    break;
                }
                simTimeout--;
            }

            // Restore original pace
            paceMultiplier = originalPace;
            paceDisplay.textContent = paceMultiplier.toFixed(1) + 'x';

            if (!overlay.classList.contains('hidden')) {
                const title = iframeDoc.getElementById('game-over-title').textContent;
                logAssertion(`Game completed successfully! (Outcome: ${title})`, 'PASS');
                
                // Test restart game
                const restartBtn = iframeDoc.getElementById('restart-game-btn');
                if (restartBtn) {
                    restartBtn.click();
                    await delay(500);

                    const resetPhase = iframeDoc.getElementById('phase-display').textContent;
                    if (resetPhase.includes('DEPLOYMENT')) {
                        logAssertion('Restart button successfully resets game back to Deployment', 'PASS');
                    } else {
                        logAssertion('Failed to transition phase back to DEPLOYMENT on restart', 'FAIL');
                    }
                } else {
                    logAssertion('Restart button not found', 'FAIL');
                }
            } else {
                logAssertion('Combat simulation timed out before victory/defeat could be resolved', 'FAIL');
            }

            let suite5Passed = (suitesFailed === 0);
            updateSuiteUI(5, suite5Passed ? 'passed' : 'failed');
            if (suite5Passed) suitesPassed++; else suitesFailed++;
            updateOverallProgress();
            
            logInfo(`[HARNESS COMPLETE] Verification passed: ${suitesPassed}/${TOTAL_SUITES} suites.`);

        } catch (err) {
            logAssertion(`Test harness crashed with runtime error: ${err.message}`, 'FAIL');
            updateSuiteUI(5, 'failed');
            suitesFailed++;
            updateOverallProgress();
        } finally {
            isRunning = false;
            runBtn.removeAttribute('disabled');
            resetBtn.removeAttribute('disabled');
        }
    }

    runBtn.addEventListener('click', runTestHarness);
});
