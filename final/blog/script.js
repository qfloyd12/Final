document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.getElementById('navLinks');

    // Toggling the navigation links on small screens
    hamburger.addEventListener('click', () => {
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
                const html = data.sneakers.map(sneaker => `
                    <div class="sneaker">
                        <img src="${sneaker.image}" alt="${sneaker.alt}">
                        <h2>${sneaker.name}</h2>
                        <p>${sneaker.releaseDate}</p>
                        <p>${sneaker.description}</p>
                    </div>
                `).join('');
                sneakerSection.innerHTML = html;
            } else {
                console.error('Sneaker section div not found.');
            }
        })
        .catch(err => console.error('Failed to fetch sneakers:', err));  // Log any errors in the fetch process
});
