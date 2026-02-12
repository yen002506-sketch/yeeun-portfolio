document.addEventListener('DOMContentLoaded', () => {
  // --- 6. About Me Section (Horizontal Scroll) ---
  const aboutMeSection = document.querySelector('.about-me');
  const amViewport = document.querySelector('.am-viewport');
  const amScene = document.querySelector('.am-scene');
  const amPathDraws = document.querySelectorAll('.am-path-draw, .am-path-draw2'); // Select both paths
  const amMilestones = document.querySelectorAll('.am-milestone');

  // Intro Elements
  const introLinePaths = document.querySelectorAll('.intro-whale-line path');
  const introUnderline = document.querySelector('.intro-content .main-copy .underline');
  const arrowPath = document.querySelector('.arrow-path-draw');

  // Scene Width (Content Width) 7000px
  const SCENE_W = 7000;

  // Target for Intro Animation
  const amIntro = document.querySelector('.am-intro');

  if (!aboutMeSection) return;

  // Calculate path lengths
  let amPathLens = [];
  if (amPathDraws.length > 0) {
    amPathDraws.forEach((path, index) => {
      const len = path.getTotalLength();
      amPathLens[index] = len;
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len;
    });
  }

  // Intro Path Lengths (Array)
  let introPathLens = [];
  if (introLinePaths.length > 0) {
    introLinePaths.forEach((path, index) => {
      const len = path.getTotalLength();
      introPathLens[index] = len;
      path.style.strokeDasharray = len;
      path.style.strokeDashoffset = len; // Start hidden
    });
  }

  let arrowPathLen = 0;

  // Intro Underline Init
  if (introUnderline) {
    introUnderline.style.width = '0%';
  }

  // Set container height for scroll space
  let amState = { startY: 0, endY: 0, shift: 0, introHold: 0, scrollLength: 0 };

  // ✅ 모바일에서는 아예 기능 끄기 (디자인/레이아웃 간섭 방지)
  let isDesktopMode = false;

  function initAboutMe() {
    if (!aboutMeSection) return;

    const isDesktop = window.innerWidth > 1024;
    isDesktopMode = isDesktop;

    // Disable horizontal scroll setup on mobile/tablet
    if (!isDesktop) {
      // 모바일: 높이/transform/offset 값들을 확실히 초기화해서 "깨짐" 방지
      aboutMeSection.style.height = 'auto';
      if (amScene) amScene.style.transform = 'translate3d(0,0,0)';

      // 인트로 라인/언더라인/화살표도 강제로 완료 상태 또는 안전 상태로 두기(선택)
      // -> 모바일에선 SVG 숨김 처리라 상관 없지만, 혹시 DOM이 남아있을 때 대비
      if (introLinePaths.length > 0) {
        introLinePaths.forEach((p, i) => (p.style.strokeDashoffset = introPathLens[i] ?? 0));
      }
      if (introUnderline) introUnderline.style.width = '0%';
      if (arrowPath) arrowPath.style.strokeDashoffset = arrowPathLen || 0;

      return;
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Hold duration: Stay for 3 screen heights
    const introHold = vh * 3;

    // Calculate shift
    const shift = Math.max(0, SCENE_W - vw);

    // Scroll Speed Factor: 3x slower
    const scrollSpeedFactor = 3;
    const scrollLength = shift * scrollSpeedFactor;

    const outputHeight = introHold + scrollLength + vh;
    aboutMeSection.style.height = outputHeight + 'px';

    const rect = aboutMeSection.getBoundingClientRect();
    const scrollTop = window.scrollY || window.pageYOffset;
    const startY = rect.top + scrollTop;

    amState = {
      startY: startY,
      introHold: introHold,
      shift: shift,
      scrollLength: scrollLength,
      endY: startY + introHold + scrollLength
    };

    // Re-calc lengths on resize
    if (amPathDraws.length > 0) {
      amPathDraws.forEach((path, index) => {
        const len = path.getTotalLength();
        amPathLens[index] = len;
        path.style.strokeDasharray = len;
      });
    }
    if (introLinePaths.length > 0) {
      introLinePaths.forEach((path, index) => {
        const len = path.getTotalLength();
        introPathLens[index] = len;
        path.style.strokeDasharray = len;
      });
    }
    if (arrowPath) {
      arrowPathLen = arrowPath.getTotalLength();
      arrowPath.style.strokeDasharray = arrowPathLen;
      arrowPath.style.strokeDashoffset = arrowPathLen;
    }

    // --- Star Generation (안전 버전) ---
    // ✅ innerHTML=''로 날려버리면, 혹시 구조가 들어있을 때 "이미지 사라짐"처럼 보일 수 있음
    const amBg = document.querySelector('.am-bg');
    if (amBg && !amBg.dataset.starsBuilt) {
      amBg.dataset.starsBuilt = '1';

      const STAR_COUNT = 50;
      for (let i = 0; i < STAR_COUNT; i++) {
        const star = document.createElement('div');
        star.classList.add('star-deco');

        if (Math.random() > 0.7) star.classList.add('yellow');

        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;

        const size = Math.random() * 4 + 3; // 3px ~ 7px
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        star.style.animationDuration = `${Math.random() * 2 + 1.5}s`;
        star.style.animationDelay = `${Math.random() * 5}s`;

        amBg.appendChild(star);
      }
    }
  }

  // Init
  initAboutMe();

  // Entrance Animation Observer
  if (amIntro) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            aboutMeSection.classList.add('in-view');
          }
        });
      },
      { threshold: 0.4 }
    );
    observer.observe(amIntro);

    // Fallback: Check immediately
    const rect = amIntro.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      aboutMeSection.classList.add('in-view');
    }
  }

  window.addEventListener('resize', () => {
    initAboutMe();
  });

  window.addEventListener('scroll', () => {
    // ✅ 모바일이면 스크롤 로직 자체를 돌리지 않음 (깨짐 방지 핵심)
    if (!isDesktopMode) return;

    const scrollY = window.scrollY;
    const vw = window.innerWidth;

    // Check if within About Me scroll range
    if (scrollY >= amState.startY && scrollY <= amState.endY + window.innerHeight) {
      const dist = scrollY - amState.startY;

      let x = 0;
      let progress = 0;

      if (dist < amState.introHold) {
        // Phase 1: Hold Intro & Fill Intro Lines
        x = 0;
        progress = 0;

        let introProg = dist / amState.introHold;
        if (introProg < 0) introProg = 0;
        if (introProg > 1) introProg = 1;

        let fastProg = introProg * 5;
        if (fastProg > 1) fastProg = 1;

        // Whale Line
        if (introLinePaths.length > 0) {
          introLinePaths.forEach((path, index) => {
            const totalLen = introPathLens[index] || 0;
            path.style.strokeDashoffset = totalLen * (1 - fastProg);
          });
        }

        // Underline
        if (introUnderline) {
          introUnderline.style.width = `${introProg * 100}%`;
        }

        // Arrow
        let arrowProg = (introProg - 0.3) / 0.1;
        if (arrowProg < 0) arrowProg = 0;
        if (arrowProg > 1) arrowProg = 1;

        if (arrowPath) {
          arrowPath.style.strokeDashoffset = arrowPathLen * (1 - arrowProg);
        }
      } else {
        // Phase 2: Horizontal Move
        if (introLinePaths.length > 0) {
          introLinePaths.forEach((path) => (path.style.strokeDashoffset = 0));
        }
        if (introUnderline) introUnderline.style.width = '100%';
        if (arrowPath) arrowPath.style.strokeDashoffset = 0;

        const moveDist = dist - amState.introHold;

        let moveProgress = 0;
        if (amState.scrollLength > 0) {
          moveProgress = moveDist / amState.scrollLength;
        }

        if (moveProgress < 0) moveProgress = 0;
        if (moveProgress > 1) moveProgress = 1;

        x = -moveProgress * amState.shift;
        progress = moveProgress;
      }

      // Move Scene
      if (amScene) amScene.style.transform = `translate3d(${x}px, 0, 0)`;

      // Draw Main Line (Multi-path)
      if (amPathDraws.length > 0) {
        const drawFactor = 0.8;
        let drawProg = progress * drawFactor;
        if (drawProg < 0) drawProg = 0;
        if (drawProg > 1) drawProg = 1;

        amPathDraws.forEach((path, index) => {
          const totalLen = amPathLens[index] || 0;
          path.style.strokeDashoffset = totalLen * (1 - drawProg);
        });
      }

      // Trigger Milestones
      const scrollX = -x;
      const triggerPoint = scrollX + vw * 0.75;

      amMilestones.forEach((ms) => {
        const leftVal = parseFloat(ms.style.left);
        if (!Number.isFinite(leftVal)) return; // ✅ 안전장치: left가 없으면 스킵

        if (leftVal < triggerPoint) ms.classList.add('active');
        else ms.classList.remove('active');
      });
    } else if (scrollY < amState.startY) {
      // Reset (Before section)
      if (amScene) amScene.style.transform = `translate3d(0, 0, 0)`;

      if (amPathDraws.length > 0) {
        amPathDraws.forEach((path, index) => {
          path.style.strokeDashoffset = amPathLens[index] || 0;
        });
      }

      amMilestones.forEach((ms) => ms.classList.remove('active'));

      if (introLinePaths.length > 0) {
        introLinePaths.forEach((path, index) => {
          path.style.strokeDashoffset = introPathLens[index] || 0;
        });
      }
      if (arrowPath) arrowPath.style.strokeDashoffset = arrowPathLen || 0;
    } else if (scrollY > amState.endY + window.innerHeight) {
      // Finish state (After section)
      if (amScene) amScene.style.transform = `translate3d(${-amState.shift}px, 0, 0)`;

      if (amPathDraws.length > 0) {
        amPathDraws.forEach((path) => (path.style.strokeDashoffset = 0));
      }

      amMilestones.forEach((ms) => ms.classList.add('active'));

      if (introLinePaths.length > 0) {
        introLinePaths.forEach((path) => (path.style.strokeDashoffset = 0));
      }
      if (arrowPath) arrowPath.style.strokeDashoffset = 0;
    }
  });
});