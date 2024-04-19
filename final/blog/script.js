document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.getElementById('navLinks');
    const sneakerFormModal = document.getElementById('sneaker-form-modal');
    const sneakerForm = document.getElementById('sneaker-form');
    const hamburger = document.querySelector('.hamburger');
    const addButton = document.getElementById('add-link');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    addButton.addEventListener('click', () => {
        sneakerFormModal.style.display = 'block';
    });

    document.getElementById('image').addEventListener('change', event => {
        const file = event.target.files[0];
        const imgPreview = document.getElementById('image-preview'); 
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                imgPreview.src = e.target.result;
                imgPreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    });

    sneakerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        submitSneakerForm();
    });

    fetchSneakers();
});

function submitSneakerForm() {
    const formData = new FormData(document.getElementById('sneaker-form'));
    formData.append('image', document.getElementById('image').files[0]);

    fetch('/api/sneakers', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert('Sneaker added successfully');
        sneakerFormModal.style.display = 'none'; 
        fetchSneakers();
    })
    .catch(error => {
        console.error('Error adding sneaker:', error);
    });
}

function fetchSneakers() {
    fetch('/api/sneakers')
    .then(response => response.json())
    .then(data => {
        const sneakerSection = document.querySelector('.sneaker-news');
        sneakerSection.innerHTML = data.sneakers.map(sneaker => `
            <div class="sneaker">
                <img src="${sneaker.image}" alt="${sneaker.name}" style="width: 100%;">
                <h2>${sneaker.name}</h2>
                <p>${sneaker.releaseDate}</p>
                <p>${sneaker.description}</p>
                <button onclick="editSneaker('${sneaker.id}')">Edit</button>
                <button onclick="deleteSneaker('${sneaker.id}')">Delete</button>
            </div>
        `).join('');
    })
    .catch(err => console.error('Failed to fetch sneakers:', err));
}

function editSneaker(id) {
    fetch(`/api/sneakers/${id}`)
    .then(response => response.json())
    .then(sneaker => {
        sneakerFormModal.style.display = 'block';
        document.getElementById('name').value = sneaker.name;
        document.getElementById('releaseDate').value = sneaker.releaseDate;
        document.getElementById('description').value = sneaker.description;
        const imgPreview = document.getElementById('image-preview'); 
        imgPreview.src = sneaker.image;
        imgPreview.style.display = 'block';
    })
    .catch(err => console.error('Failed to fetch sneaker details:', err));
}

function deleteSneaker(id) {
    fetch(`/api/sneakers/${id}`, { method: 'DELETE' })
    .then(() => {
        alert('Sneaker deleted successfully');
        fetchSneakers();
    })
    .catch(err => console.error('Error deleting sneaker:', err));
}

window.onclick = function(event) {
    if (event.target === sneakerFormModal) {
        sneakerFormModal.style.display = 'none';
    }
};
