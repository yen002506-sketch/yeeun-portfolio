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
    introUnderline.style.width = '0%'; // Start width 0
}

// Set container height for scroll space
let amState = { startY: 0, endY: 0, shift: 0, introHold: 0 };

function initAboutMe() {
    if (!aboutMeSection) return;

    // Disable horizontal scroll setup on mobile/tablet
    if (window.innerWidth <= 1024) {
        aboutMeSection.style.height = 'auto'; // Reset height

        // Mobile: Just reset height, no animation observer needed
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

    // --- Star Generation (Added) ---
    const amBg = document.querySelector('.am-bg');
    if (amBg && amBg.children.length < 10) { // Only generate if not already populated (roughly)
        // Clear existing just in case or keep them
        amBg.innerHTML = '';
        const STAR_COUNT = 50;

        for (let i = 0; i < STAR_COUNT; i++) {
            const star = document.createElement('div');
            star.classList.add('star-deco');

            // Randomly assign yellow class (approx 30%)
            if (Math.random() > 0.7) {
                star.classList.add('yellow');
            }

            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 100}%`;

            // Larger size for visibility
            const size = Math.random() * 4 + 3; // 3px ~ 7px
            star.style.width = `${size}px`;
            star.style.height = `${size}px`;

            star.style.animationDuration = `${Math.random() * 2 + 1.5}s`; // Faster twinkling
            star.style.animationDelay = `${Math.random() * 5}s`;

            amBg.appendChild(star);
        }
    }
}

// Init
initAboutMe();

// Entrance Animation Observer
if (amIntro) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                aboutMeSection.classList.add('in-view');
            }
        });
    }, {
        threshold: 0.4 // Trigger when 40% of intro is visible
    });
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
    if (!aboutMeSection) return;
    const scrollY = window.scrollY;
    const vw = window.innerWidth;

    // Check if within About Me scroll range
    if (scrollY >= amState.startY && scrollY <= amState.endY + window.innerHeight) {
        const dist = scrollY - amState.startY;

        let x = 0;
        let progress = 0; // for main path drawing

        if (dist < amState.introHold) {
            // Phase 1: Hold Intro & Fill Intro Lines
            x = 0;
            progress = 0;

            // --- Added: Intro Line Filling Logic ---
            let introProg = dist / amState.introHold;
            if (introProg < 0) introProg = 0;
            if (introProg > 1) introProg = 1;

            // Speed up factor for Whale Line
            let fastProg = introProg * 5;
            if (fastProg > 1) fastProg = 1;

            // 1. Whale Line (Draws as you scroll down the hold) -> Multi-path support
            if (introLinePaths.length > 0) {
                introLinePaths.forEach((path, index) => {
                    const totalLen = introPathLens[index];
                    path.style.strokeDashoffset = totalLen * (1 - fastProg);
                });
            }

            // 2. Underline (Expands 0% -> 100%)
            if (introUnderline) {
                introUnderline.style.width = `${introProg * 100}%`;
            }

            // 3. Arrow Line (Draws after Whale Line)
            // Whale finishes at 0.2 (fastProg=1). Let arrow start at 0.3, end at 0.4 (Faster)
            let arrowProg = (introProg - 0.3) / 0.1;
            if (arrowProg < 0) arrowProg = 0;
            if (arrowProg > 1) arrowProg = 1;

            if (arrowPath) {
                arrowPath.style.strokeDashoffset = arrowPathLen * (1 - arrowProg);
            }

            // 3. Reveal Milestones


        } else {
            // Phase 2: Horizontal Move
            // Intro Animation is done (filled)
            if (introLinePaths.length > 0) {
                introLinePaths.forEach((path) => {
                    path.style.strokeDashoffset = 0;
                });
            }
            if (introUnderline) introUnderline.style.width = '100%';
            if (arrowPath) arrowPath.style.strokeDashoffset = 0;

            // Normalized distance after hold, relative to scrollLength
            const moveDist = dist - amState.introHold;

            let moveProgress = 0;
            if (amState.scrollLength > 0) {
                moveProgress = moveDist / amState.scrollLength;
            }

            if (moveProgress < 0) moveProgress = 0;
            if (moveProgress > 1) moveProgress = 1;

            x = -moveProgress * amState.shift;
            progress = moveProgress; // Use same progress for SVG
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
                const totalLen = amPathLens[index];
                path.style.strokeDashoffset = totalLen * (1 - drawProg);
            });
        }

        // Trigger Milestones
        const scrollX = -x; // Convert negative translate to positive scroll distance
        const triggerPoint = scrollX + (vw * 0.75); // Trigger when element is at 75% of viewport

        amMilestones.forEach(ms => {
            const leftVal = parseFloat(ms.style.left);
            if (leftVal < triggerPoint) {
                ms.classList.add('active');
            } else {
                ms.classList.remove('active');
            }
        });

    } else if (scrollY < amState.startY) {
        // Reset (Before section)
        if (amScene) amScene.style.transform = `translate3d(0, 0, 0)`;

        // Reset Main Paths
        if (amPathDraws.length > 0) {
            amPathDraws.forEach((path, index) => {
                path.style.strokeDashoffset = amPathLens[index];
            });
        }

        amMilestones.forEach(ms => ms.classList.remove('active'));

        // Reset Intro Anims
        if (introLinePaths.length > 0) {
            introLinePaths.forEach((path, index) => {
                path.style.strokeDashoffset = introPathLens[index];
            });
        }
        if (arrowPath) arrowPath.style.strokeDashoffset = arrowPathLen;


    } else if (scrollY > amState.endY + window.innerHeight) {
        // Finish state (After section)
        if (amScene) amScene.style.transform = `translate3d(${-amState.shift}px, 0, 0)`;

        // Finish Main Paths
        if (amPathDraws.length > 0) {
            amPathDraws.forEach((path) => {
                path.style.strokeDashoffset = 0;
            });
        }

        amMilestones.forEach(ms => ms.classList.add('active'));

        // Ensure Intro Anims are finished
        if (introLinePaths.length > 0) {
            introLinePaths.forEach((path) => {
                path.style.strokeDashoffset = 0;
            });
        }
        if (arrowPath) arrowPath.style.strokeDashoffset = 0;

    }
});