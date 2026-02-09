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

        // ✅ 여기 숫자만 올리면 "카드가 보이는 시작 위치"가 더 아래로 내려감
        const headerOffset = 87;     // Header height approx
        const extraOffset = 300;     // ⭐ 기존 170 → 더 밑으로 보고 싶으면 250~350 추천

        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset + extraOffset;

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

  // --- Sticky Header Synchronization ---
  const projectSection = document.querySelector('.project');
  const projectHeader = document.querySelector('.project-header');
  const lastCard = document.querySelector('.last-card-track .project-card');

  if (projectSection && projectHeader && lastCard) {
    function syncHeader() {
      // Get the sticky offset set in CSS (250px)
      const stickyTop = 250;

      const cardRect = lastCard.getBoundingClientRect();

      // If card is moving up (top < stickyTop), move header up
      if (cardRect.top < stickyTop) {
        const offset = cardRect.top - stickyTop;
        projectHeader.style.transform = `translateY(${offset}px)`;
      } else {
        projectHeader.style.transform = 'translateY(0)';
      }
    }

    window.addEventListener('scroll', syncHeader, { passive: true });
    window.addEventListener('resize', syncHeader);
    syncHeader(); // Initial check
  }
});