document.addEventListener('DOMContentLoaded', () => {
    const swSection = document.querySelector('.skill-whalenew');
    const swLineTop = document.querySelector('.sw-line');
    const swWhalePaths = document.querySelectorAll('.sw-whale-path');
    const swWhaleArea = document.querySelector('.sw-whale-area');

    if (!swSection) return;

    // Initialize Paths
    swWhalePaths.forEach(path => {
        const len = path.getTotalLength();
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
        path.dataset.len = len;
    });

    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

    function onScroll() {
        const rect = swSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Calculate progress
        // Start animation earlier (when top hits 70% viewport)
        const startY = viewportHeight * 0.7;
        // End animation when it scrolls past
        const endY = -viewportHeight * 1.1;

        // Total Scroll Progress for this section
        let globalProgress = (startY - rect.top) / (startY - endY);
        globalProgress = clamp(globalProgress, 0, 1);

        // --- Sequence Configuration ---
        // 1. Top Line: 0% -> 30%
        // 2. Whale: 30% -> 100%

        const p1 = 0.4; // Top Line absolute end

        // 1. Top Line Animation
        let lineTopDraw = clamp(globalProgress / p1, 0, 1);
        if (swLineTop) {
            swLineTop.style.transform = `translateY(${(lineTopDraw - 1) * 100}%)`;
        }

        // 2. Whale Animation
        if (globalProgress > p1) {
            swWhaleArea.classList.add('show');
            // Map remaining progress (p1 to 1.0) to 0~1 for whale
            const whaleProgress = (globalProgress - p1) / (1.0 - p1);
            const whaleDraw = clamp(whaleProgress, 0, 1);

            swWhalePaths.forEach(path => {
                const len = parseFloat(path.dataset.len);
                path.style.strokeDashoffset = len * (1 - whaleDraw);
            });
        } else {
            swWhaleArea.classList.remove('show');
            swWhalePaths.forEach(path => {
                const len = parseFloat(path.dataset.len);
                path.style.strokeDashoffset = len;
            });
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll(); // Initial check

    // --- Area Bottom Animation (New Section) ---
    const abSection = document.querySelector('.areabottom');
    const abLine = document.querySelector('.ab-line');

    if (abSection && abLine) {
        function onScrollBottom() {
            const rect = abSection.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Start when section enters viewport (bottom of screen)
            const startY = viewportHeight;
            // End when section is halfway up the screen
            const endY = viewportHeight * 0.2;

            let progress = (startY - rect.top) / (startY - endY);
            progress = Math.min(Math.max(progress, 0), 1);

            // Animate line
            abLine.style.transform = `translateY(${(progress - 1) * 100}%)`;
        }
        window.addEventListener('scroll', onScrollBottom, { passive: true });
        window.addEventListener('resize', onScrollBottom);
        onScrollBottom(); // Initial check
    }
});
