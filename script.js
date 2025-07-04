const preloaderTextElement = document.querySelector('.preloader-text');
const phrases = [
    "Инициализация системы...",
    "Загрузка данных...",
    "Компиляция кода...",
    "Устанавливаем соединение...",
    "Добро пожаловать, кодер!",
    "Готовимся к запуску..."
];
let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingSpeed = 70;
const deletingSpeed = 40;
const delayBetweenPhrases = 1500;

function typeWriter() {
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
        preloaderTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
        charIndex--;
    } else {
        preloaderTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
        charIndex++;
    }

    let currentSpeed = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentPhrase.length) {
        currentSpeed = delayBetweenPhrases;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        currentSpeed = 500;
    }

    setTimeout(typeWriter, currentSpeed);
}

window.addEventListener('load', function() {
    typeWriter();

    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) {
            preloader.classList.add('hidden-preloader');
            preloader.addEventListener('transitionend', function() {
                preloader.remove();
            });
        }

        resizeCanvas();
        animateParticles();
    }, 3000);
});


document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('application-form');
    const submitBtn = document.getElementById('submitBtn');
    const skillsInput = document.getElementById('selectedSkills');
    const fixedHeaderBlock = document.querySelector('.fixed-header-block');
    const backgroundDynamicText = document.getElementById('background-dynamic-text');
    const mainContentHeader = document.querySelector('.container.mx-auto > .text-center.mb-8');
    const formOuterContainer = document.querySelector('.form-outer-container');

    let selectedSkills = new Set();

    const skillButtonsContainer = document.getElementById('skill-buttons');
    const otherLanguageInputGroup = document.getElementById('otherLanguageInputGroup');
    const otherLanguageInput = document.getElementById('otherLanguage');

    skillButtonsContainer.addEventListener('click', function(event) {
        const target = event.target;
        if (target.classList.contains('skill-button')) {
            const skill = target.dataset.skill;

            if (selectedSkills.has(skill)) {
                selectedSkills.delete(skill);
                target.classList.remove('active');
                if (skill === 'Другой') {
                    otherLanguageInputGroup.style.display = 'none';
                    otherLanguageInput.value = '';
                }
            } else {
                selectedSkills.add(skill);
                target.classList.add('active');
                if (skill === 'Другой') {
                    otherLanguageInputGroup.style.display = 'block';
                }
            }
            let skillsArray = Array.from(selectedSkills);
            if (selectedSkills.has('Другой') && otherLanguageInput.value.trim() !== '') {
                skillsArray = skillsArray.filter(s => s !== 'Другой');
                skillsArray.push(otherLanguageInput.value.trim());
            }
            skillsInput.value = skillsArray.join(',');
        }
    });

    otherLanguageInput.addEventListener('input', function() {
        if (selectedSkills.has('Другой')) {
            let skillsArray = Array.from(selectedSkills).filter(s => s !== 'Другой');
            if (otherLanguageInput.value.trim() !== '') {
                skillsArray.push(otherLanguageInput.value.trim());
            }
            skillsInput.value = skillsArray.join(',');
        }
    });

    document.querySelectorAll('.input-group input, .input-group textarea').forEach(element => {
        if (element.value !== '') {
            element.classList.add('not-empty');
        }
        element.addEventListener('input', () => {
            if (element.value !== '') {
                element.classList.add('not-empty');
            } else {
                element.classList.remove('not-empty');
            }
        });
    });

    document.querySelectorAll('textarea').forEach(textarea => {
        textarea.addEventListener('input', () => {
            textarea.style.height = 'auto';
            textarea.style.height = textarea.scrollHeight + 'px';
        });
        textarea.style.height = textarea.scrollHeight + 'px';
    });

    document.querySelectorAll('input[type="text"], input[type="number"], input[type="url"]').forEach(input => {
        input.addEventListener('focus', () => {
            input.style.paddingLeft = '20px';
            input.style.paddingRight = '20px';
        });
        input.addEventListener('blur', () => {
            input.style.paddingLeft = '16px';
            input.style.paddingRight = '16px';
        });
    });


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

    function getFormData() {
        return {
            name: document.getElementById('fullName').value.trim(),
            age: document.getElementById('age').value.trim(),
            contacts: document.getElementById('contacts').value.trim(),
            skills: skillsInput.value.split(',').filter(s => s.trim() !== ''),
            experience: document.getElementById('experience').value.trim(),
            portfolio: document.getElementById('portfolio').value.trim(),
            about: document.getElementById('about').value.trim(),
            expectations: document.getElementById('expectations').value.trim(),
            timestamp: new Date().toLocaleString('ru-RU')
        };
    }

    function validateForm(data) {
        if (!data.name) return 'Укажите ваше имя';
        if (!data.age) return 'Укажите ваш возраст';
        if (!data.contacts) return 'Укажите контакты';
        if (data.skills.length === 0) return 'Выберите хотя бы один навык';
        return null;
    }

    async function sendToTelegram(data) {
        const BOT_TOKEN = '7548127757:AAFM9rEApUB4LVoGshUW0jBLNYiuIPGAO8E';
        const CHAT_ID = '819243999';
        const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

        const message = `
<b>🚀 Новая анкета Coders Team</b>
<code>------------------------------</code>
<b>👤 Имя:</b> ${escapeHtml(data.name)}
<b>🔢 Возраст:</b> ${escapeHtml(data.age)}
<b>📱 Контакты:</b> ${escapeHtml(data.contacts)}
<code>------------------------------</code>
<b>💻 Навыки:</b>
${data.skills.map(skill => `• ${escapeHtml(skill)}`).join('\n')}
<code>------------------------------</code>
<b>🛠 Опыт:</b> ${escapeHtml(data.experience || 'Не указан')}
<b>📂 Портфолио:</b> ${data.portfolio ? `<a href="${escapeHtml(data.portfolio)}">${escapeHtml(data.portfolio)}</a>` : 'Не указано'}
<code>------------------------------</code>
<b> О себе:</b>
${escapeHtml(data.about || 'Не указано')}
<code>------------------------------</code>
<b>🎯 Ожидания:</b>
${escapeHtml(data.expectations || 'Не указано')}
<code>------------------------------</code>
<b>⏱️ Дата отправки:</b> ${data.timestamp}
        `.trim();

        try {
            const response = await fetch(TELEGRAM_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    parse_mode: 'HTML',
                    disable_web_page_preview: true
                })
            });

            if (!response.ok) {
                const errorResponse = await response.json();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorResponse.description || 'Unknown error'}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Ошибка при отправке:', error);
            throw error;
        }
    }

    function resetForm() {
        form.reset();
        selectedSkills.clear();
        skillsInput.value = '';
        document.querySelectorAll('.skill-button').forEach(btn => {
            btn.classList.remove('active');
        });
        otherLanguageInputGroup.style.display = 'none';
        otherLanguageInput.value = '';

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function showError(message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        const existingError = form.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        form.prepend(errorElement);
        setTimeout(() => errorElement.remove(), 5000);
    }

    function escapeHtml(text) {
        return text ? text.toString()
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
            : '';
    }

    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';

        try {
            const formData = getFormData();
            const error = validateForm(formData);

            if (error) {
                showError(error);
                return;
            }

            await sendToTelegram(formData);

            window.location.href = 'success.html';

        } catch (error) {
            console.error('Ошибка:', error);
            showError('Ошибка при отправке. Попробуйте ещё раз.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Отправить анкету';
        }
    });
});

const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let gridPoints = [];
const newGridSize = 100;
let animationFrameId = null;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initGridPoints();
}

class GridPoint {
    constructor(baseX, baseY) {
        this.baseX = baseX;
        this.baseY = baseY;
        this.x = baseX;
        this.y = baseY;
        this.originalY = baseY;
        this.offset = Math.random() * Math.PI * 2;
    }

    update(time) {
        const waveFrequency = 0.0005;
        const waveAmplitude = 10;
        this.y = this.originalY + Math.sin(time * waveFrequency + this.offset) * waveAmplitude;
        this.x = this.baseX + Math.sin(time * waveFrequency * 0.5 + this.offset * 0.5) * (waveAmplitude * 0.2);
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(149, 1, 1, 0.7)`;
        ctx.fill();
    }
}

function initGridPoints() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
    gridPoints = [];
    const cols = Math.floor(canvas.width / newGridSize) + 1;
    const rows = Math.floor(canvas.height / newGridSize) + 1;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const x = c * newGridSize;
            const y = r * newGridSize;
            gridPoints.push(new GridPoint(x, y));
        }
    }
}

function connectGridPoints(time) {
    const cols = Math.floor(canvas.width / newGridSize) + 1;
    for (let i = 0; i < gridPoints.length; i++) {
        const p1 = gridPoints[i];
        p1.update(time);

        if ((i + 1) % cols !== 0) {
            const p2 = gridPoints[i + 1];
            drawGridLine(p1, p2);
        }

        if (i + cols < gridPoints.length) {
            const p2 = gridPoints[i + cols];
            drawGridLine(p1, p2);
        }
    }
}

function drawGridLine(p1, p2) {
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.strokeStyle = `rgba(149, 1, 1, 0.15)`;
    ctx.lineWidth = 2;
    ctx.stroke();
}

let startTime = null;
function animateParticles(currentTime) {
    if (!startTime) startTime = currentTime;
    const elapsedTime = currentTime - startTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    connectGridPoints(elapsedTime);

    for (const point of gridPoints) {
        point.draw();
    }

    animationFrameId = requestAnimationFrame(animateParticles);
}

window.addEventListener('resize', resizeCanvas);
