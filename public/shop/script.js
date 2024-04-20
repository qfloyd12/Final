document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.getElementById('navLinks');
    const colorFilter = document.getElementById('color');
    const sizeFilter = document.getElementById('size');
    const brandFilter = document.getElementById('brand');

    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

  
    function loadAndFilterProducts() {
        fetch('products.json') 
            .then(response => response.json())
            .then(data => {
                const filteredData = filterProducts(data);
                displayProducts(filteredData);
            })
            .catch(error => {
                console.error('Error loading the product images:', error);
            });
    }

    
    function filterProducts(data) {
        return {
            ...data,
            imageColumns: data.imageColumns.map(column => ({
                ...column,
                images: column.images.filter(image => {
                    const colorMatches = colorFilter.value === 'all' || image.color === colorFilter.value;
                    const sizeMatches = sizeFilter.value === 'all' || image.size.includes(sizeFilter.value); // Assumes size is an array or similar structure in your data
                    const brandMatches = brandFilter.value === 'all' || image.brand === brandFilter.value;
                    return colorMatches && sizeMatches && brandMatches;
                })
            }))
        };
    }


    function displayProducts(data) {
        const imageRow = document.getElementById('imageRow');
        imageRow.innerHTML = ''; 
        data.imageColumns.forEach(column => {
            const imageColumn = document.createElement('div');
            imageColumn.className = 'image-column';
            column.images.forEach(image => {
                const imgElement = document.createElement('img');
                imgElement.src = image.src;
                imgElement.alt = image.alt;
                imageColumn.appendChild(imgElement);
            });
            imageRow.appendChild(imageColumn);
        });
    }

    
    loadAndFilterProducts();

  
    colorFilter.addEventListener('change', loadAndFilterProducts);
    sizeFilter.addEventListener('change', loadAndFilterProducts);
    brandFilter.addEventListener('change', loadAndFilterProducts);
});
