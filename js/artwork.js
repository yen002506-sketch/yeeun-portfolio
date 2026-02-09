document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.art-slider-container');
    const list = document.querySelector('.art-list');

    if (slider && list) {
        // 1. Duplicate list for infinite loop illusion
        // We clone the inner HTML to double the content
        list.innerHTML += list.innerHTML;

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
                // When we've scrolled past the original set (half of total width), reset to 0
                // Note: We use scrollWidth / 2 because we doubled the content.
                if (slider.scrollLeft >= slider.scrollWidth / 2) {
                    slider.scrollLeft = 0;
                }
            }
            requestAnimationFrame(animate);
        }

        animate();
    }
});
