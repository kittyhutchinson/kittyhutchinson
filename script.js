// Smooth scroll for navigation links
const navLinks = document.querySelectorAll('nav a[href^="#"]');
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 60,
                behavior: 'smooth'
            });
        }
    });
});

// Animate elements on scroll
function animateOnScroll() {
    const animatedSections = document.querySelectorAll('.about, .portfolio, .contact');
    animatedSections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            section.style.opacity = 1;
            section.style.transform = 'none';
        }
    });
}
window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Placeholder for contact form submission
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for reaching out! This is a placeholder.');
        contactForm.reset();
    });
}

// Dark mode toggle variable
let enableDarkMode = true; // Set to true to activate dark mode

function applyDarkMode() {
    if (enableDarkMode) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}
applyDarkMode();


// Fade-in on scroll
document.addEventListener('DOMContentLoaded', function() {
    // Dynamic Gallery Loading
    const galleryGrid = document.querySelector('.gallery-grid');
    if (galleryGrid) {
        // Assuming image names are img1.jpg, img2.jpg, etc., in the gallery folder
        // You would typically fetch these from a server or have a predefined list
        const imageNames = [
            'IMG_0197.jpg',
            'IMG_0226.jpg',
            'IMG_0616.jpg',
            'IMG_1130.jpg',
            'IMG_3234.jpg',
            'IMG_7906.jpg',
            'IMG_9523.jpg',
            'IMG_9526.jpg',
            'IMG_9548.jpg',
            'Screenshot 2025-01-30 at 20.54.54.jpg',
            'Screenshot 2025-01-30 at 21.24.55.jpg',
            'image.jpg'
        ];

        imageNames.forEach(name => {
            const galleryItem = document.createElement('div');
            galleryItem.classList.add('gallery-item');

            const img = document.createElement('img');
            img.src = `gallery/${name}`;
            img.alt = `Gallery Image ${name}`;

            galleryItem.appendChild(img);
            galleryGrid.appendChild(galleryItem);
        });
    }

    const sections = document.querySelectorAll('.fade-in-section');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});