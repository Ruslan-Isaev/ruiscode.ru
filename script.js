// 1. ЛОКАЛИЗАЦИЯ И ПЕРЕВОДЫ
const translations = {
    ru: {
        "hero-desc": "Python Developer / Linux enthusiast / Open Source lover",
        "about-title": "Обо мне",
        "about-text": "Привет! Я Python-разработчик, специализируюсь на создании высокопроизводительных серверных приложений, автоматизации инфраструктуры и Telegram-ботов. Люблю Open Source и ОС Linux.",
        "weather-title": "Погода в Москве",
        "loading": "Загрузка...",
        "tech-title": "Технологический стек",
        "hardware-title": "Железо и Девайсы",
        "projects-title": "Проекты",
        "donate-title": "Поддержать проект",
        "card-desc": "Перевод по номеру карты",
        "links-title": "Контакты и ссылки",
        "ref-text": "Надежный хостинг для ваших проектов:",
        "privacy-link": "Политика конфиденциальности",
        "view-project": "Открыть проект"
    },
    en: {
        "hero-desc": "Python Developer / Linux enthusiast / Open Source lover",
        "about-title": "About Me",
        "about-text": "Hello! I am a Python developer specializing in building high-performance backend solutions, automating Linux infrastructures, and building Telegram bots. Open Source lover.",
        "weather-title": "Weather in Moscow",
        "loading": "Loading...",
        "tech-title": "Tech Stack",
        "hardware-title": "Hardware & Devices",
        "projects-title": "Projects",
        "donate-title": "Support the Project",
        "card-desc": "Transfer via Card number (only ru-cards)",
        "links-title": "Contacts & Links",
        "ref-text": "Reliable hosting for your projects:",
        "privacy-link": "Privacy Policy",
        "view-project": "View Project"
    }
};

// 2. ДАННЫЕ ПРОЕКТОВ
const projectsData = [
    {
        title: "NeoS3Files",
        desc_ru: "Высокоуровневая асинхронная Python-библиотека для работы с S3-совместимыми хранилищами.",
        desc_en: "A high-level async Python library for working with S3-compatible storage.",
        tech: ["Python", "S3"],
        link: "https://github.com/NeosartOrg/NeoS3Files"
    }
];

let currentLang = 'ru';

function initLanguage() {
    const savedLang = localStorage.getItem('lang');
    if (savedLang) {
        currentLang = savedLang;
    } else {
        const browserLang = navigator.language || navigator.userLanguage;
        const ruLanguages = ['ru', 'be', 'uk'];
        const baseLang = browserLang.substring(0, 2).toLowerCase();
        currentLang = ruLanguages.includes(baseLang) ? 'ru' : 'en';
    }
    updateLanguageDOM();
}

function toggleLanguage() {
    currentLang = currentLang === 'ru' ? 'en' : 'ru';
    localStorage.setItem('lang', currentLang);
    updateLanguageDOM();
    renderProjects();
}

function updateLanguageDOM() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });
    document.getElementById('lang-toggle').textContent = currentLang.toUpperCase();
    document.documentElement.lang = currentLang;
}

function renderProjects() {
    const container = document.getElementById('projects-container');
    if(!container) return;
    container.innerHTML = '';
    
    projectsData.forEach(proj => {
        const desc = currentLang === 'ru' ? proj.desc_ru : proj.desc_en;
        const tagsHtml = proj.tech.map(t => `<span class="tag">${t}</span>`).join('');
        
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <div>
                <h3>${proj.title}</h3>
                <p>${desc}</p>
                <div class="tech-tags">${tagsHtml}</div>
            </div>
            <a href="${proj.link}" target="_blank" class="btn btn-outline" style="margin-top:15px; text-align:center; justify-content:center;">
                <i class="fab fa-github"></i> ${translations[currentLang]['view-project']}
            </a>
        `;
        container.appendChild(card);
    });
}

// 3. API ПОГОДЫ
async function fetchWeather() {
    const loadingEl = document.getElementById('weather-loading');
    const contentEl = document.getElementById('weather-content');
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=55.7512&longitude=37.6184&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m';
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        
        const current = data.current;
        document.getElementById('weather-temp').textContent = `${Math.round(current.temperature_2m)}°C`;
        document.getElementById('weather-wind').textContent = `${current.wind_speed_10m} m/s`;
        document.getElementById('weather-humidity').textContent = `${current.relative_humidity_2m}%`;
        
        const code = current.weather_code;
        const weatherMap = {
            0: {ru: 'Ясно', en: 'Clear sky', icon: 'fa-sun'},
            1: {ru: 'Преимущественно ясно', en: 'Mainly clear', icon: 'fa-cloud-sun'},
            2: {ru: 'Переменная облачность', en: 'Partly cloudy', icon: 'fa-cloud-sun'},
            3: {ru: 'Пасмурно', en: 'Overcast', icon: 'fa-cloud'},
            45: {ru: 'Туман', en: 'Fog', icon: 'fa-smog'},
            61: {ru: 'Небольшой дождь', en: 'Slight rain', icon: 'fa-cloud-showers-heavy'},
            71: {ru: 'Снегопад', en: 'Snow fall', icon: 'fa-snowflake'}
        };
        
        const info = weatherMap[code] || {ru: 'Переменчиво', en: 'Variable', icon: 'fa-cloud-sun'};
        document.getElementById('weather-desc').textContent = currentLang === 'ru' ? info.ru : info.en;
        document.getElementById('weather-icon').className = `fas ${info.icon}`;
        
        if (loadingEl) loadingEl.classList.add('hidden');
        if (contentEl) contentEl.classList.remove('hidden');
    } catch (err) {
        if(loadingEl) loadingEl.textContent = 'Weather error';
        console.error('Weather error:', err);
    }
}

function copyText(id) {
    const input = document.getElementById(id);
    input.select();
    input.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(input.value);
    
    const btn = input.nextElementSibling;
    const origIcon = btn.innerHTML;
    btn.innerHTML = '<i class="fas fa-check"></i>';
    setTimeout(() => btn.innerHTML = origIcon, 2000);
}

document.addEventListener('DOMContentLoaded', () => {
    initLanguage();
    renderProjects();
    fetchWeather();
    
    document.getElementById('lang-toggle').addEventListener('click', toggleLanguage);
});
