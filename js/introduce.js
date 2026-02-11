// introduce.js (복붙용)
document.addEventListener('DOMContentLoaded', () => {
  const introSection = document.querySelector('.introduce');
  const introLinePath = document.querySelector('.intro-line-path');
  const textTop = document.querySelector('.intro-text-group.top');
  const textBottom = document.querySelector('.intro-text-group.bottom');
  const starEnd = document.querySelector('.intro-star-end');
  const overlay = document.querySelector('.intro-white-overlay');
  const introEndSection = document.querySelector('.introduce-end');

  if (!introSection || !introLinePath) return;

  // ✅ overlay를 화면 전체 덮도록 강제 (CSS 수정 없이도 동작하게)
  if (overlay) {
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.zIndex = '9999';
    overlay.style.pointerEvents = 'none';
    overlay.style.background = '#fff';
    overlay.style.opacity = '0';
    overlay.style.transition = 'opacity .05s linear';
  }

  // Initialize line length
  const lineLen = introLinePath.getTotalLength();
  introLinePath.style.strokeDasharray = lineLen;
  introLinePath.style.strokeDashoffset = lineLen;

  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  let snapped = false;

  function onScroll() {
    // 1024px guard removed here to allow animation

    const rect = introSection.getBoundingClientRect();
    const sectionHeight = introSection.offsetHeight;
    const viewportHeight = window.innerHeight;

    // progress 0~1
    const scrolled = -rect.top;
    const scrollableDistance = sectionHeight - viewportHeight;
    let progress = scrolled / (scrollableDistance || 1);
    progress = clamp(progress, 0, 1);

    // Draw Line (Start after 15% scroll)
    const lineProgress = clamp((progress - 0.15) / 0.85, 0, 1);
    introLinePath.style.strokeDashoffset = lineLen * (1 - lineProgress);

    // Trigger Text
    if (textTop) textTop.classList.toggle('active', progress > 0.2);
    if (textBottom) textBottom.classList.toggle('active', progress > 0.6);

    // Trigger Star
    if (starEnd) starEnd.classList.toggle('active', progress > 0.95);

    // White Overlay (0.85~1.0)
    if (overlay) {
      const o = clamp((progress - 0.95) / 0.05, 0, 1);
      overlay.style.opacity = String(o);
    }

    // ✅ 끝에서: 완전 하얗게 → introduce-end로 이동
    // 1024px 이하에서는 강제 이동(Snap) 하지 않음 (Animation은 동작하되 스크롤 자유)
    if (!snapped && progress > 0.985) {
      // GNB 이동 중이면 강제 스크롤 하지 않음
      if (window.isGnbNavigating) {
        snapped = true;
        return;
      }

      snapped = true;

      if (overlay) overlay.style.opacity = '1';

      if (window.innerWidth > 1024) { // Only snap on Desktop
        if (introEndSection) {
          setTimeout(() => {
            introEndSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 120);
        }
      }
    }

    // 다시 위로 올라가면 재진입 가능
    if (snapped && progress < 0.9) {
      snapped = false;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  // --- Profile Animation Observer ---
  const endContentWrap = document.querySelector('.end-content-wrap');
  if (endContentWrap) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          endContentWrap.classList.add('active');
        }
      });
    }, {
      threshold: 0.3 // Trigger when 30% visible
    });
    observer.observe(endContentWrap);
  }
});