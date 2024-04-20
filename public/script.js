document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            const newArrivalsContainer = document.getElementById('newArrivalsContainer');
            data.newArrivals.forEach(item => {
                const imageContainer = document.createElement('div');
                imageContainer.classList.add('image-container');

                const img = document.createElement('img');
                img.setAttribute('src', `images/${item.imageName}`);
                
                const hoverText = document.createElement('div');
                hoverText.classList.add('hover-text');
                hoverText.textContent = item.hoverText;

                imageContainer.appendChild(img);
                imageContainer.appendChild(hoverText);

                newArrivalsContainer.appendChild(imageContainer);
            });
        });
});