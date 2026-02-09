document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.art-slider-container');
    const list = document.querySelector('.art-list');

    if (slider && list) {
        // 1. Duplicate list for infinite loop illusion
        // Clone 4 times to ensure enough buffer for wide screens
        const originalContent = list.innerHTML;
        list.innerHTML = originalContent + originalContent + originalContent + originalContent;

        // 2. Drag to Scroll Logic
        let isDown = false;
        let startX;
        let scrollLeft;

        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
            isHovered = false; // Resume auto scroll on leave
        });

        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
        });

        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // Scroll-fast
            slider.scrollLeft = scrollLeft - walk;
        });

        // 3. Auto Scroll Logic (Infinite Loop)
        let isHovered = false;
        let autoScrollSpeed = 1; // Adjust speed here

        // Pause on hover
        slider.addEventListener('mouseenter', () => {
            isHovered = true;
        });

        // Touch support for mobile pause
        slider.addEventListener('touchstart', () => {
            isHovered = true;
        });
        slider.addEventListener('touchend', () => {
            isHovered = false;
        });

        function animate() {
            if (!isDown && !isHovered) {
                slider.scrollLeft += autoScrollSpeed;

                // Infinite Loop Reset
                // When we've scrolled past one set (1/4 of total), reset by subtracting that width
                // This ensures seamless looping without jumps
                const singleSetWidth = slider.scrollWidth / 4;
                if (slider.scrollLeft >= singleSetWidth) {
                    slider.scrollLeft -= singleSetWidth;
                }
            }
            requestAnimationFrame(animate);
        }

        animate();
    }
});
