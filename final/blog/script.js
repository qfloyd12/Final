document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.getElementById('navLinks');

    // Toggling the navigation links on small screens
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    // Fetching sneakers from the server's API endpoint
    fetch('/api/sneakers')
        .then(response => {
            if (!response.ok) {  // Check if response came back fine
                throw new Error('Network response was not ok');
            }
            return response.json();  // Parse JSON data from the response
        })
        .then(data => {
            console.log('Received data:', data);  // Log the data to debug what is received
            const sneakerSection = document.querySelector('.sneaker-news');
            if (sneakerSection) {
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
            } else {
                console.error('Sneaker section div not found.');
            }
        })
        .catch(err => console.error('Failed to fetch sneakers:', err));  // Log any errors in the fetch process
});
