document.addEventListener('DOMContentLoaded', () => {
    // Clone Coding interactions
    const cloneItems = document.querySelectorAll('.clone-item');

    cloneItems.forEach(item => {
        // Optional: Add click listener for navigation or detail view
        item.addEventListener('click', () => {
            console.log('Clicked:', item.querySelector('.clone-text-default').innerText);
            // window.location.href = '...'; 
        });

        // Optional: Smooth transition logic via JS if CSS isn't enough
        // Currently CSS :hover handles the main effect.

        // Example: Add 'active' class on click to keep it open?
        // item.addEventListener('mouseenter', () => {
        //     cloneItems.forEach(others => others.classList.remove('active'));
        //     item.classList.add('active');
        // });
    });
});
