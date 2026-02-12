

document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const whaleSection = document.getElementById('whale');
  const scrollLine = document.getElementById('scrollLine'); // The fill line

  // 1. Hero Start Button Scroll
  if (startBtn && whaleSection) {
    startBtn.addEventListener('click', () => {
      whaleSection.scrollIntoView({
        behavior: 'smooth'
      });
    });
  }

  // 2. Timeline Line Animation
  // We want the line to fill up as we scroll through the #whale section.

  window.addEventListener('scroll', () => {
    if (!whaleSection || !scrollLine) return;

    const sectionTop = whaleSection.offsetTop;
    const sectionHeight = whaleSection.offsetHeight;
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    // Determine how much we've scrolled into the section.
    // Start filling when the section top reaches the middle of viewport or is entering.
    // Let's say we want it to fill from 0% to 100% as the scroll position moves from Section Start to Section End.

    // Calculation:
    // start point: scrollY > sectionTop - windowHeight/2
    // end point: scrollY > sectionTop + sectionHeight - windowHeight/2

    const startTrigger = sectionTop - windowHeight * 0.6; // Start slightly before
    const endTrigger = sectionTop + sectionHeight - windowHeight * 0.6;

    let progress = (scrollY - startTrigger) / (endTrigger - startTrigger);

    // Clamp between 0 and 1
    if (progress < 0) progress = 0;
    if (progress > 1) progress = 1;

    scrollLine.style.height = `${progress * 115}%`;
  });

  // 3. Hero Star Background Animation
  const canvas = document.getElementById("space");
  if (canvas) {
    const ctx = canvas.getContext("2d");

    function resize() {
      // 캔버스 크기를 부모(.hero) 크기나 윈도우 크기에 맞춤
      // 여기서는 윈도우 크기로 설정 (Hero가 100vh이므로)
      // Mobile optimization: Ignore veritcal resize caused by address bar
      if (window.innerWidth <= 768 && window.innerWidth === canvas.width) {
          return; 
      }
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const particles = [];
    const COUNT = 120; // 130개로 조정

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.3 + 0.7,
        vx: (Math.random() - 0.5) * 0.02,
        vy: (Math.random() - 0.5) * 0.02,
        alpha: Math.random(),
        da: (Math.random() - 0.5) * 0.15  // ⭐ 깜빡임 속도 대폭 증가
      });
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // 반짝임 효과 (투명도 범위를 0.5 ~ 1.0으로 넓혀서 반짝임이 잘 보이게)
        p.alpha += p.da;
        if (p.alpha < 0.5 || p.alpha > 1.9) p.da = -p.da;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

        let a = p.alpha;
        if (a > 1) a = 1;
        if (a < 0) a = 0; // clamp safety

        // 빛나는 느낌 (Glow) 추가
        ctx.shadowBlur = 5;
        ctx.shadowColor = `rgba(255, 255, 200, ${a})`;

        // 색상을 더 진한 노란빛으로, 투명도는 유지
        ctx.fillStyle = `rgba(255, 255, 220, ${a})`;
        ctx.fill();

        // Shadow reset for performance if needed, but we clearRect anyway.
        ctx.shadowBlur = 0; // Reset for next iteration if not all need glow, but here all stars glow.
      }

      requestAnimationFrame(draw);
    }

    draw();
  }

  // --- Hero Shooting Star Logic ---
  function createShootingStar() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const star = document.createElement('div');
    star.classList.add('shooting-star');

    // Random Position (Mainly top right area for diagonal fall)
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 70 + '%'; // Don't start too low

    // Random Scale
    const scale = Math.random() * 0.5 + 0.5;
    star.style.transform = `scale(${scale})`; // Base scale, animation handles translate

    // Random Duration (Much Slower falling speed, but fades out fast due to CSS)
    const duration = Math.random() * 2 + 5; // 5s ~ 7s
    star.style.animation = `shooting ${duration}s linear forwards`;

    hero.appendChild(star);

    // Cleanup
    setTimeout(() => {
      star.remove();
    }, duration * 1000);
  }

  // Create star every 4 seconds to ensure only one is distinct at a time
  setInterval(() => {
    createShootingStar();
  }, 3500);



  // 4. Whale Middle Section Animation (Sequential SVG + Text)
  const whaleMiddle = document.getElementById('whaleMiddle');
  if (whaleMiddle) {
    const linePath = document.querySelector('.wm-line .draw-path');
    const whalePath = document.querySelector('.wm-whale .draw-path');
    const textWrap = document.querySelector('.wm-text-wrap');

    // Init Paths
    let lineLen = 0;
    let whaleLen = 0;

    if (linePath) {
      lineLen = linePath.getTotalLength();
      linePath.style.strokeDasharray = lineLen;
      linePath.style.strokeDashoffset = lineLen;
    }
    if (whalePath) {
      whaleLen = whalePath.getTotalLength();
      whalePath.style.strokeDasharray = whaleLen;
      whalePath.style.strokeDashoffset = whaleLen;
    }

    window.addEventListener('scroll', () => {
      const sectionTop = whaleMiddle.offsetTop;
      const sectionHeight = whaleMiddle.offsetHeight;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Disable on mobile/tablet
      if (window.innerWidth <= 1024) return;

      // Trigger Range
      // start: Start animation when section is entering viewport (e.g., halfway up)
      const start = sectionTop - windowHeight * 0.5;
      const end = sectionTop + sectionHeight - windowHeight; // Stop pinning/animating when bottom reached

      let progress = (scrollY - start) / (end - start);
      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;

      // Sequence:
      // 0.0 - 0.75: Whale Draw (Center)
      // 0.75 - 1.0: Text Reveal

      // 1. Line (REMOVED / Skipped)
      if (linePath) {
        // Keeps line hidden or fully drawn effectively ignored since it's commented out in HTML
        linePath.style.strokeDashoffset = 0;
      }

      // 2. Whale (0% -> 75%) -> Range 0.75
      if (whalePath) {
        let p2 = progress / 0.75;
        if (p2 > 1) p2 = 1;
        if (p2 < 0) p2 = 0;
        whalePath.style.strokeDashoffset = whaleLen * (1 - p2);
      }

      // 3. Text Reveal (75% -> 100%)
      if (progress > 0.75) {
        textWrap.classList.add('wm-active');
      } else {
        textWrap.classList.remove('wm-active');
      }
    });
  }

  // 5. Mood Card Scroll Animation (Sticky & Sequential)
  const subWhale = document.querySelector('.sub-whale');
  const moodCards = document.querySelectorAll('.sub-whale .innercard ul li.card');

  if (subWhale && moodCards.length > 0) {
    window.addEventListener('scroll', () => {
      const sectionTop = subWhale.offsetTop;
      const sectionHeight = subWhale.offsetHeight;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;

      // Disable on mobile/tablet
      if (window.innerWidth <= 1024) return;

      // Calculate progress within the section
      // We want the pinning to happen while we scroll through.
      // Progress 0: Section Top touches Viewport Top (Sticky starts)
      // Progress 1: Section Bottom touches Viewport Bottom (Sticky ends)

      const start = sectionTop;
      const end = sectionTop + sectionHeight - windowHeight;

      let progress = (scrollY - start) / (end - start);

      if (progress < 0) progress = 0;
      if (progress > 1) progress = 1;

      // Sequential triggers based on progress
      // Total 6 cards. Let's spread them out from 0.1 to 0.9

      const thresholds = [0.1, 0.25, 0.4, 0.55, 0.7, 0.85];

      moodCards.forEach((card, index) => {
        if (progress > thresholds[index]) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });
    });
  }

  // --- 6. About Me Section (Horizontal Scroll) ---
  const aboutMeSection = document.querySelector('.about-me');
  const amViewport = document.querySelector('.am-viewport');
  const amScene = document.querySelector('.am-scene');
  const amPathDraw = document.querySelector('.am-path-draw');
  const amMilestones = document.querySelectorAll('.am-milestone');

  // Intro Elements
  const introLinePath = document.querySelector('.intro-whale-line path');
  const introUnderline = document.querySelector('.intro-content .main-copy .underline');

  // Scene Width (Content Width) 4500px from HTML/CSS
  const SCENE_W = 4500;

  // Calculate path length
  let amPathLen = 0;
  if (amPathDraw) {
    amPathLen = amPathDraw.getTotalLength();
    amPathDraw.style.strokeDasharray = amPathLen;
    amPathDraw.style.strokeDashoffset = amPathLen;
  }

  // Intro Path Length
  let introPathLen = 0;
  if (introLinePath) {
    introPathLen = introLinePath.getTotalLength();
    introLinePath.style.strokeDasharray = introPathLen;
    introLinePath.style.strokeDashoffset = introPathLen; // Start hidden
  }
  // Intro Underline Init
  if (introUnderline) {
    introUnderline.style.width = '0%'; // Start width 0
  }

  // Set container height for scroll space
  // shift = SCENE_W - vw
  // height = shift + vh
  // Hold duration: Stay for 3 screen heights (Longer intro)
  // Re-define constants for consistency if needed, but we use init function.

  let amState = { startY: 0, endY: 0, shift: 0, introHold: 0 };

  function initAboutMe() {
    if (!aboutMeSection) return;
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

    // We need offsetTop relative to document. 
    // Since resize might shift things, calculate dynamically or on resize.
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

    // Re-calc lengths on resize if needed
    if (introLinePath) {
      introPathLen = introLinePath.getTotalLength();
      introLinePath.style.strokeDasharray = introPathLen;
      // Reset offset handled in scroll
    }
  }

  /* 
  // --- MOVED TO jabout-me.js to avoid conflicts ---
  
  // Init
  initAboutMe();

  // Entrance Animation Observer
  if (aboutMeSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          aboutMeSection.classList.add('in-view');
        }
      });
    }, {
      threshold: 0.1 // Trigger when 10% visible
    });
    observer.observe(aboutMeSection);
  }

  window.addEventListener('resize', () => {
    initAboutMe();
  });

  window.addEventListener('scroll', () => {
    if (!aboutMeSection) return;
    const scrollY = window.scrollY;
    // ... (logic moved to jabout-me.js) ...
  });
  */

  // --- Hamburger Menu Logic ---
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-menu .mo-gnb li a');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    // Close menu when a link is clicked
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });
  }

});

// --- Top Button Logic ---
const topBtn = document.getElementById('topBtn');

window.addEventListener('scroll', () => {
  if (!topBtn) return;
  if (window.scrollY > 500) {
    topBtn.classList.add('active');
  } else {
    topBtn.classList.remove('active');
  }
});

function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}
