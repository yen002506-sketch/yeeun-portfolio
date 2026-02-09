document.addEventListener('DOMContentLoaded', () => {
    // Project section load check
    const projects = document.querySelectorAll('.project-item');
    console.log('Project section loaded:', projects.length, 'items');

    // --- Fix for GNB Navigation hijacking by introduce.js ---
    const gnbLinks = document.querySelectorAll('.gnb a');

    gnbLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (!href || href === '#') return;

            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                e.preventDefault();

                // Set global flag to prevent other scroll spies (like introduce.js) from intercepting
                window.isGnbNavigating = true;

                // Adjust scroll position to center the cards better
                // Using window.scrollTo for precise offset control instead of scrollIntoView
                const headerOffset = 87; // Header height approx
                const elementPosition = targetSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.scrollY - headerOffset + 170; // Add 170px extra scroll down

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                // Reset flag after enough time for scroll to complete
                setTimeout(() => {
                    window.isGnbNavigating = false;
                }, 1500);
            }
        });
    });
});
