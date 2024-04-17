document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.getElementById('navLinks');

    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    fetch('sneaker-news.json')
        .then(response => response.json())
        .then(data => {
            const sneakerSection = document.querySelector('.sneaker-news');
            data.sneakers.forEach(sneaker => {
                const sneakerDiv = document.createElement('div');
                sneakerDiv.className = 'sneaker';

                const img = document.createElement('img');
                img.src = sneaker.imgSrc;
                img.alt = sneaker.alt;
                sneakerDiv.appendChild(img);

                const title = document.createElement('h2');
                title.textContent = sneaker.title;
                sneakerDiv.appendChild(title);

                const releaseDate = document.createElement('p');
                releaseDate.textContent = sneaker.releaseDate;
                sneakerDiv.appendChild(releaseDate);

                const description = document.createElement('p');
                description.textContent = sneaker.description;
                sneakerDiv.appendChild(description);

                sneakerSection.appendChild(sneakerDiv);
            });
        });
});
