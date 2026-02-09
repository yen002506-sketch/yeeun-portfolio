document.addEventListener('DOMContentLoaded', () => {
    const skillSection = document.querySelector('.skill');
    const skillLines = document.querySelectorAll('.skill-line-path');
    const centerCircle = document.querySelector('.skill-center-circle');
    const skillTitle = document.querySelector('.skill-title');
    const skillIcons = document.querySelectorAll('.skill-icon-item');
    let titleTriggered = false;
    let iconsTriggered = false;

    if (!skillSection) return;

    // Check Total Lengths
    skillLines.forEach(path => {
        const len = path.getTotalLength();
        path.style.strokeDasharray = len;
        path.style.strokeDashoffset = len;
        path.dataset.len = len;
    });

    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

    function onScroll() {
        const rect = skillSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // 1. Sequence Trigger (Tintle -> Icons)
        // Ensure user sees the title first, then icons pop in automatically
        if (!titleTriggered && rect.top < viewportHeight * 0.75) {
            titleTriggered = true;

            // Show Title
            if (skillTitle) skillTitle.classList.add('show');

            // Show Icons after title appears (CHAINED animation)
            // Use a variable to clear timeout if user scrolls away quickly
            window.iconsSequenceTimeout = setTimeout(() => {
                if (!iconsTriggered) {
                    iconsTriggered = true;
                    skillIcons.forEach((icon, index) => {
                        setTimeout(() => {
                            icon.classList.add('show');
                        }, index * 100); // 100ms delay per icon
                    });
                }
            }, 400); // Wait 0.4s after title starts
        }

        // RESET Animation when out of view
        else if (rect.top > viewportHeight || rect.bottom < 0) {
            titleTriggered = false;
            iconsTriggered = false;

            if (skillTitle) skillTitle.classList.remove('show');
            skillIcons.forEach(icon => icon.classList.remove('show'));

            // Clear pending timeout to prevent icons appearing when out of view
            if (window.iconsSequenceTimeout) clearTimeout(window.iconsSequenceTimeout);

            // Reset lines (optional, but good for cleanliness)
            skillLines.forEach(path => {
                const len = parseFloat(path.dataset.len);
                path.style.strokeDashoffset = len;
            });
            centerCircle.classList.remove('active');
        }

        // Calculate progress based on section position in viewport
        // ...
        // 3. Line Drawing Animation
        // Start drawing as icons appear (sync with icons Trigger)
        const startY = viewportHeight * 0.5;
        // Finish drawing earlier so user sees the full connection easily
        const endY = -viewportHeight * 0.2;

        let progress = (startY - rect.top) / (startY - endY);
        progress = clamp(progress, 0, 1);

        const drawProg = progress;

        skillLines.forEach(path => {
            const len = parseFloat(path.dataset.len);
            path.style.strokeDashoffset = len * (1 - drawProg);
        });

        // Trigger Circle at end of line drawing
        if (drawProg > 0.9) {
            centerCircle.classList.add('active');
        } else {
            // Only remove active if reset logic didn't handle it or for precision
            if (rect.top > viewportHeight || rect.bottom < 0) {
                centerCircle.classList.remove('active');
            }
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    // Initial call
    onScroll();
});
