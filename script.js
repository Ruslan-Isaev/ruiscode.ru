const LANGS = ['ru', 'en'];
const DEFAULT_LANG = 'ru';
let currentLang = DEFAULT_LANG;
let messages = {};
let content = {};

function getInitialLanguage() {
  const stored = localStorage.getItem('ruis-language');
  if (LANGS.includes(stored)) return stored;
  const browser = (navigator.language || 'ru').slice(0, 2).toLowerCase();
  return LANGS.includes(browser) ? browser : DEFAULT_LANG;
}

function getPath(object, path) {
  return path.split('.').reduce((value, key) => value?.[key], object);
}

function applyMessages() {
  document.documentElement.lang = currentLang;
  document.querySelectorAll('[data-i18n]').forEach((element) => {
    const value = getPath(messages, element.dataset.i18n);
    if (typeof value === 'string') element.textContent = value;
  });
  const button = document.getElementById('lang-switch');
  button.innerHTML = `${currentLang === 'ru' ? 'EN' : 'RU'} <span>↗</span>`;
  button.setAttribute('aria-label', messages.language.switchLabel);
  document.title = messages.meta.title;
  document.querySelector('meta[name="description"]').content = messages.meta.description;
  renderContent();
}

function renderContent() {
  const { facts, stack, projects, hardware, links } = content;
  document.getElementById('facts').innerHTML = facts.map((item) => `
    <div class="fact"><span class="fact-value">${item.value}</span><span class="fact-label">${item.label}</span></div>`).join('');
  document.getElementById('stack-grid').innerHTML = stack.map((item) => `
    <div class="stack-item"><span class="stack-icon">${item.icon}</span><span><span class="stack-name">${item.name}</span><span class="stack-type">${item.type}</span></span></div>`).join('');
  document.getElementById('projects-grid').innerHTML = projects.map((project, index) => `
    <article class="project-card"><div><div class="project-top"><span class="project-number">0${index + 1} / PROJECT</span><a class="project-link" href="${project.url}" target="_blank" rel="noreferrer" aria-label="${messages.projects.open} ${project.name}">↗</a></div><h3>${project.name}</h3><p>${project.description}</p></div><div class="project-tags">${project.tags.map((tag) => `<span>${tag}</span>`).join('')}</div></article>`).join('');
  document.getElementById('hardware-grid').innerHTML = hardware.map((item) => `
    <article class="hardware-card"><h3>${item.label}</h3><p>${item.value}</p></article>`).join('');
  document.getElementById('social-links').innerHTML = links.map((link) => `
    <a href="${link.url}" ${link.external ? 'target="_blank" rel="noreferrer"' : ''}>${link.label} ↗</a>`).join('');
  document.getElementById('hero-contact').href = content.links.find((link) => link.id === 'email')?.url || 'mailto:inbox@ruiscode.ru';
  document.getElementById('contact-email').href = document.getElementById('hero-contact').href;
}

async function setLanguage(language) {
  currentLang = language;
  localStorage.setItem('ruis-language', currentLang);
  const response = await fetch(`content/${currentLang}.json`);
  if (!response.ok) throw new Error(`Language file returned ${response.status}`);
  const data = await response.json();
  // Translation strings and editable page content live in the same language file.
  messages = data.messages;
  content = data.content;
  applyMessages();
}

document.addEventListener('DOMContentLoaded', async () => {
  document.getElementById('year').textContent = new Date().getFullYear();
  document.getElementById('lang-switch').addEventListener('click', () => {
    setLanguage(currentLang === 'ru' ? 'en' : 'ru');
  });
  try {
    await setLanguage(getInitialLanguage());
  } catch (error) {
    console.error('Unable to load site language file:', error);
    document.getElementById('projects-grid').innerHTML = '<p class="empty">Content could not be loaded. Open the site through a local web server.</p>';
  }
});
