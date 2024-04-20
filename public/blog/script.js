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

    sneakerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        submitSneakerForm();
    });

    fetchSneakers();
});

function toggleForm() {
    const modal = document.getElementById('sneaker-form-modal');
    modal.style.display = (modal.style.display === 'block' ? 'none' : 'block');
}

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

function editSneaker(sneakerId) {
    const modal = document.getElementById('edit-sneaker-form-modal');
    modal.style.display = 'block';

    fetch(`/api/sneakers/${sneakerId}`)
    .then(response => response.json())
    .then(data => {
        document.getElementById('edit-id').value = sneakerId;
        document.getElementById('edit-name').value = data.name;
        document.getElementById('edit-releaseDate').value = data.releaseDate;
        document.getElementById('edit-description').value = data.description;

        const imagePreview = document.getElementById('edit-image-preview');
        if (data.image) {
            imagePreview.src = data.image;
            imagePreview.style.display = 'block';
        }
    })
    .catch(err => console.error('Failed to fetch sneaker details:', err));
}

document.getElementById('edit-sneaker-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const formData = new FormData(this);
    formData.append('image', document.getElementById('edit-image').files[0]);

    fetch(`/api/sneakers/${document.getElementById('edit-id').value}`, {
        method: 'PUT',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert('Sneaker updated successfully');
        toggleEditForm();
        fetchSneakers(); // Refresh the list
    })
    .catch(error => {
        console.error('Error updating sneaker:', error);
    });
});

function toggleEditForm() {
    const modal = document.getElementById('edit-sneaker-form-modal');
    modal.style.display = (modal.style.display === 'block' ? 'none' : 'block');
}

window.onclick = function(event) {
    const sneakerFormModal = document.getElementById('sneaker-form-modal');
    const editSneakerFormModal = document.getElementById('edit-sneaker-form-modal');
    if (event.target === sneakerFormModal || event.target === editSneakerFormModal) {
        sneakerFormModal.style.display = 'none';
        editSneakerFormModal.style.display = 'none';
    }
};
