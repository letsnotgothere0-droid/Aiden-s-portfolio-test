/* ---------------- MOCK BACKEND ---------------- */
const DB_KEY = 'aiden_portfolio_db';

const mockBackendAPI = async (data) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const existingData = localStorage.getItem(DB_KEY);
                const db = existingData ? JSON.parse(existingData) : [];
                db.push(data);
                localStorage.setItem(DB_KEY, JSON.stringify(db));
                resolve({ status: 200 });
            } catch (e) {
                reject({ status: 500 });
            }
        }, 1000);
    });
};

window.viewDatabase = () => {
    const data = JSON.parse(localStorage.getItem(DB_KEY) || '[]');
    if (data.length === 0) {
        alert("Database is empty.");
    } else {
        console.table(data);
    }
};

/* ---------------- FRONTEND ---------------- */

// Initialize Lucide Icons
lucide.createIcons();

// Update Year
document.getElementById('year').textContent = new Date().getFullYear();

// Reveal animations
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(el => revealObserver.observe(el));

// Contact form
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toISOString()
    };

    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending...';

    try {
        await mockBackendAPI(formData);
        formStatus.textContent = "Message sent successfully!";
        formStatus.classList.remove('hidden', 'text-red-500');
        formStatus.classList.add('text-green-500');
        contactForm.reset();
    } catch {
        formStatus.textContent = "Failed to send message.";
        formStatus.classList.remove('hidden', 'text-green-500');
        formStatus.classList.add('text-red-500');
    }

    submitBtn.disabled = false;
    submitBtn.innerHTML = `<span>Send Message</span> <i data-lucide="send" class="w-4 h-4"></i>`;
    lucide.createIcons(); // Re-init icons after HTML change
});

/* ---------------- TYPING EFFECT ---------------- */
const words = [
  "Traditional + Digital Artist.",
  "Aspiring Game Developer.",
  "AI Enthusiast.",
  "Jayantian.",
  "Computer Science Student.",
  "Fantasy Fiction Writer."
];

let wordIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById("typing-text");

function typeEffect() {
  const currentWord = words[wordIndex];
  
  if (isDeleting) {
    charIndex--;
    typingElement.textContent = currentWord.substring(0, charIndex);
  } else {
    charIndex++;
    typingElement.textContent = currentWord.substring(0, charIndex);
  }

  let speed = isDeleting ? 50 : 100;

  if (!isDeleting && charIndex === currentWord.length) {
    speed = 2000; // Pause at end of word
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    wordIndex = (wordIndex + 1) % words.length;
    speed = 500; // Pause before typing next word
  }

  setTimeout(typeEffect, speed);
}

// Start typing loop
typeEffect();

/* ---------------- CUSTOM CURSOR ---------------- */
const cursor = document.getElementById('custom-cursor');

if (cursor) {
  // 1. Tell the body we are ready to use the custom cursor
  document.body.classList.add('js-cursor-enabled');

  let mouseX = 0, mouseY = 0;
  let cursorX = 0, cursorY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateCursor() {
    // Smooth trailing effect
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;

    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  }

  animateCursor();

  // 2. Hover states for all links and buttons
  const interactives = document.querySelectorAll('a, button, .interactive');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
  });
}