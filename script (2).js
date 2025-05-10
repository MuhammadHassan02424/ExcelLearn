// Initialize Bootstrap Tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Modal Toggles
document.querySelector('.login-btn').addEventListener('click', () => {
    const loginModal = new bootstrap.Modal(document.getElementById('loginModal'));
    loginModal.show();
});

document.querySelector('.signup-btn').addEventListener('click', () => {
    const signupModal = new bootstrap.Modal(document.getElementById('signupModal'));
    signupModal.show();
});

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    darkModeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    localStorage.setItem('darkMode', isDarkMode);
});

// Load Dark Mode Preference
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}

// Course Filtering
document.getElementById('course-filter').addEventListener('change', function() {
    const category = this.value;
    document.querySelectorAll('.course-item').forEach(item => {
        item.style.display = category === 'all' || item.dataset.category === category ? 'block' : 'none';
    });
});

// Course Search (Debounced)
let searchTimeout;
document.getElementById('course-search').addEventListener('input', function() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        const query = this.value.toLowerCase();
        document.querySelectorAll('.course-item').forEach(item => {
            const title = item.querySelector('.card-title').textContent.toLowerCase();
            const description = item.querySelector('.card-text').textContent.toLowerCase();
            item.style.display = title.includes(query) || description.includes(query) ? 'block' : 'none';
        });
    }, 300);
});

// FAQ Search (Debounced)
let faqSearchTimeout;
document.getElementById('faq-search').addEventListener('input', function() {
    clearTimeout(faqSearchTimeout);
    faqSearchTimeout = setTimeout(() => {
        const query = this.value.toLowerCase();
        document.querySelectorAll('.faq-item').forEach(item => {
            const question = item.querySelector('.accordion-button').textContent.toLowerCase();
            item.style.display = question.includes(query) ? 'block' : 'none';
        });
    }, 300);
});

// Quiz Functionality
const quizzes = {
    'full-stack-development': [
        { question: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Text Machine Language', 'Hyper Tabular Markup Language'], answer: 'Hyper Text Markup Language' },
        { question: 'Which is a JavaScript framework?', options: ['React', 'Django', 'Flask'], answer: 'React' }
    ],
    'ai-machine-learning': [
        { question: 'What is a neural network?', options: ['A database system', 'A machine learning model', 'A programming language'], answer: 'A machine learning model' },
        { question: 'What library is used for ML in Python?', options: ['TensorFlow', 'Express', 'Ruby on Rails'], answer: 'TensorFlow' }
    ],
    'data-science': [
        { question: 'What is Pandas used for?', options: ['Data analysis', 'Web development', 'Game development'], answer: 'Data analysis' },
        { question: 'Which tool is for visualization?', options: ['Matplotlib', 'React', 'Node.js'], answer: 'Matplotlib' }
    ],
    'cybersecurity': [
        { question: 'What is ethical hacking?', options: ['Hacking for malicious purposes', 'Hacking to test security', 'Hacking to steal data'], answer: 'Hacking to test security' },
        { question: 'What is cryptography?', options: ['Data encryption', 'Data visualization', 'Data storage'], answer: 'Data encryption' }
    ],
    'cloud-computing': [
        { question: 'What is AWS?', options: ['A cloud platform', 'A programming language', 'A database system'], answer: 'A cloud platform' },
        { question: 'What is serverless computing?', options: ['Computing without servers', 'Using physical servers', 'Using local servers'], answer: 'Computing without servers' }
    ]
};

document.querySelectorAll('.open-quiz').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const course = this.dataset.course;
        const quiz = quizzes[course];
        if (!quiz) {
            alert('Quiz not available for this course.');
            return;
        }
        const quizModal = new bootstrap.Modal(document.getElementById('quizModal'));
        const quizTitle = document.getElementById('quizModalLabel');
        const quizQuestions = document.getElementById('quizQuestions');

        quizTitle.textContent = `Quiz: ${course.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`;
        quizQuestions.innerHTML = '';
        quiz.forEach((q, index) => {
            const questionDiv = document.createElement('div');
            questionDiv.className = 'mb-3';
            questionDiv.innerHTML = `
                <p class="fw-semibold">${index + 1}. ${q.question}</p>
                ${q.options.map((opt, optIndex) => `
                    <div class="form-check">
                        <input class="form-check-input" type="radio" name="q${index}" value="${opt}" id="q${index}-${optIndex}" required>
                        <label class="form-check-label" for="q${index}-${optIndex}">${opt}</label>
                    </div>
                `).join('')}
            `;
            quizQuestions.appendChild(questionDiv);
        });

        document.getElementById('quizForm').dataset.course = course;
        quizModal.show();
    });
});

document.getElementById('quizForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const course = this.dataset.course;
    const quiz = quizzes[course];
    let score = 0;
    let allAnswered = true;
    quiz.forEach((q, index) => {
        const selected = document.querySelector(`input[name="q${index}"]:checked`);
        if (!selected) {
            allAnswered = false;
        } else if (selected.value === q.answer) {
            score++;
        }
    });
    if (!allAnswered) {
        alert('Please answer all questions before submitting.');
        return;
    }
    alert(`You scored ${score} out of ${quiz.length}! ${score === quiz.length ? 'Perfect score!' : 'Keep practicing!'}`);
    bootstrap.Modal.getInstance(document.getElementById('quizModal')).hide();
    this.reset();
});

// Course Progress Simulation
document.querySelectorAll('.open-enrollment-form').forEach(button => {
    button.addEventListener('click', function() {
        const course = this.dataset.course;
        const progressBar = document.querySelector(`#${course} .progress-bar`);
        if (progressBar) {
            progressBar.style.width = '20%';
            progressBar.setAttribute('aria-valuenow', '20');
            progressBar.textContent = '20%';
        }
    });
});

// Enrollment Form Submissions
document.querySelectorAll('form[id^="enrollmentForm-"]').forEach(form => {
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Enrollment submitted successfully!');
        bootstrap.Modal.getInstance(this.closest('.modal')).hide();
        this.reset();
    });
});

// Login Form Submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Login submitted successfully!');
    bootstrap.Modal.getInstance(document.getElementById('loginModal')).hide();
    this.reset();
});

// Signup Form Submission
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Signup submitted successfully!');
    bootstrap.Modal.getInstance(document.getElementById('signupModal')).hide();
    this.reset();
});

// Contact Form Submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    if (this.checkValidity()) {
        alert('Message sent successfully!');
        this.reset();
    } else {
        this.reportValidity();
    }
});

// Newsletter Form Submission
document.getElementById('newsletterForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('newsletterEmail').value;
    if (/^\S+@\S+\.\S+$/.test(email)) {
        const newsletterModal = new bootstrap.Modal(document.getElementById('newsletterModal'));
        newsletterModal.show();
        this.reset();
    } else {
        alert('Please enter a valid email address.');
    }
});

// Live Chat Simulation
document.getElementById('chatToggle').addEventListener('click', function() {
    const chatBox = document.getElementById('chatBox');
    chatBox.classList.toggle('d-none');
    if (!chatBox.classList.contains('d-none') && !chatBox.querySelector('.chat-messages').innerHTML) {
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'bg-light p-2 mb-2 rounded';
        welcomeMessage.textContent = `Support: Welcome to ExcelLearn! How can we help you? (${new Date().toLocaleTimeString()})`;
        chatBox.querySelector('.chat-messages').appendChild(welcomeMessage);
    }
});

document.getElementById('chatSend').addEventListener('click', function() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatBox').querySelector('.chat-messages');
    if (chatInput.value.trim()) {
        const message = document.createElement('div');
        message.className = 'bg-light p-2 mb-2 rounded';
        message.textContent = `You: ${chatInput.value} (${new Date().toLocaleTimeString()})`;
        chatMessages.appendChild(message);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        chatInput.value = '';
    }
});

// Review System
let reviews = JSON.parse(localStorage.getItem('reviews')) || {};
document.querySelectorAll('.open-reviews').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const course = this.dataset.course;
        const reviewsModal = new bootstrap.Modal(document.getElementById('reviewsModal'));
        const reviewsTitle = document.getElementById('reviewsModalLabel');
        const reviewList = document.getElementById('reviewList');

        reviewsTitle.textContent = `Reviews for ${course.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}`;
        reviewList.innerHTML = (reviews[course] && reviews[course].length) ? reviews[course].map(r => `
            <div class="border-bottom pb-2 mb-2">
                <strong>${r.name}</strong>
                <p>${r.text}</p>
            </div>
        `).join('') : '<p>No reviews yet for this course. Be the first to share your experience!</p>';

        document.getElementById('reviewForm').dataset.course = course;
        reviewsModal.show();
    });
});

document.getElementById('reviewForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const course = this.dataset.course;
    const name = document.getElementById('reviewerName').value.trim();
    const text = document.getElementById('reviewText').value.trim();
    if (name && text) {
        if (!reviews[course]) reviews[course] = [];
        reviews[course].push({ name, text });
        localStorage.setItem('reviews', JSON.stringify(reviews));
        alert('Review submitted successfully!');
        bootstrap.Modal.getInstance(document.getElementById('reviewsModal')).hide();
        this.reset();
    } else {
        alert('Please fill out both name and review fields.');
    }
});

// Course Comparison
const courseData = {
    'full-stack-development': { name: 'Full Stack Development', price: '$499', duration: '12 Weeks', topics: 'HTML, CSS, JavaScript, React, Node.js, Database Design, DevOps' },
    'ai-machine-learning': { name: 'AI & Machine Learning', price: '$699', duration: '16 Weeks', topics: 'Python, Neural Networks, Computer Vision, NLP' },
    'data-science': { name: 'Data Science', price: '$599', duration: '14 Weeks', topics: 'Pandas, Data Visualization, Statistical Modeling, Big Data' },
    'cybersecurity': { name: 'Cybersecurity', price: '$549', duration: '10 Weeks', topics: 'Network Security, Ethical Hacking, Cryptography, Incident Response' },
    'cloud-computing': { name: 'Cloud Computing', price: '$649', duration: '12 Weeks', topics: 'Cloud Architecture, AWS, Azure, Serverless Computing' }
};

document.querySelectorAll('.compare-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
        const selectedCourses = Array.from(document.querySelectorAll('.compare-checkbox:checked')).map(cb => cb.dataset.course);
        const compareTableBody = document.querySelector('#compareTable tbody');
        compareTableBody.innerHTML = selectedCourses.map(course => `
            <tr>
                <td>${courseData[course].name}</td>
                <td>${courseData[course].price}</td>
                <td>${courseData[course].duration}</td>
                <td>${courseData[course].topics}</td>
            </tr>
        `).join('');
    });
});

// Keyboard Navigation for Modals
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            bootstrap.Modal.getInstance(modal).hide();
        }
    });
});

// Form Keyboard Submission
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            form.querySelector('button[type="submit"]').click();
        }
    });
});