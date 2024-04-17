document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.getElementById('navLinks');

    
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    
    fetch('/blog/sneaker-news')
        .then(response => {
            
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(sneakers => { 
            const sneakerSection = document.querySelector('.sneaker-news');

            
            sneakerSection.innerHTML = '';

            
            sneakers.forEach(sneaker => {
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
        })
        .catch(error => {
            console.error('Error fetching sneaker news:', error);
        });
});
