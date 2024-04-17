document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.getElementById('navLinks');
    
    hamburger.addEventListener('click', function() {
        navLinks.classList.toggle('active');
    });

    fetch('content.json')
    .then(response => response.json())
    .then(data => {
        const contentData = data.content;
        
        const imageColumn = document.querySelector('.image-column');
        const img = document.createElement('img');
        img.src = contentData.image.src;
        img.alt = contentData.image.alt;
        imageColumn.appendChild(img);
        
        const textColumn = document.querySelector('.text-column');
        contentData.textSections.forEach(section => {
            const h2 = document.createElement('h2');
            h2.textContent = section.title;
            textColumn.appendChild(h2);
            
            if(section.paragraphs) {
                section.paragraphs.forEach(paragraph => {
                    const p = document.createElement('p');
                    p.textContent = paragraph;
                    textColumn.appendChild(p);
                });
            }
            
            if(section.list) {
                const ol = document.createElement('ol');
                ol.className = 'custom-list';
                section.list.forEach(item => {
                    const li = document.createElement('li');
                    li.textContent = item;
                    ol.appendChild(li);
                });
                textColumn.appendChild(ol);
            }
        });
    });
});
