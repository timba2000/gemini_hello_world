document.addEventListener('DOMContentLoaded', () => {
    const celebrateBtn = document.getElementById('celebrate-btn');
    const celebrationContainer = document.getElementById('celebration-container');

    const colors = [
        '#6366f1', // Indigo
        '#a855f7', // Purple
        '#ec4899', // Pink
        '#10b981', // Emerald
        '#f59e0b'  // Amber
    ];

    celebrateBtn.addEventListener('click', (e) => {
        // Button click effect (squish)
        celebrateBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            celebrateBtn.style.transform = 'translateY(-2px)';
        }, 100);

        // Get coordinates of the button
        const rect = celebrateBtn.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        // Spawn particles
        createFirework(x, y);
    });

    function createFirework(x, y) {
        const particleCount = 40;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            
            // Random color
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.backgroundColor = randomColor;
            
            // Position the particle at the click location
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            
            // Calculate random movement direction & distance
            const angle = Math.random() * Math.PI * 2;
            const velocity = 50 + Math.random() * 150;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            
            particle.style.setProperty('--tx', `${tx}px`);
            particle.style.setProperty('--ty', `${ty}px`);
            
            // Random sizes
            const size = 6 + Math.random() * 8;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            celebrationContainer.appendChild(particle);
            
            // Clean up particle after animation completes
            particle.addEventListener('animationend', () => {
                particle.remove();
            });
        }
    }
});
