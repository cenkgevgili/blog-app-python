// ============================================
// MINIMALIST BLOG - Vanilla JS SPA
// ============================================

const API_BASE = '/api';

// ============ State Management ============
const state = {
    user: JSON.parse(localStorage.getItem('blog-user')) || null,
    token: localStorage.getItem('blog-token') || null,
    theme: localStorage.getItem('blog-theme') || 'light',
    posts: [],
    currentPost: null
};

const themes = ['light', 'dark', 'rose', 'ocean', 'forest'];
const themeLabels = { light: 'Aydınlık', dark: 'Karanlık', rose: 'Gül', ocean: 'Okyanus', forest: 'Orman' };

// ============ API Helpers ============
async function api(endpoint, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...options.headers };
    if (state.token) headers['Authorization'] = `Bearer ${state.token}`;
    
    const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
    const data = res.status !== 204 ? await res.json() : null;
    
    if (!res.ok) {
        // Handle Pydantic validation errors (422)
        if (data?.detail && Array.isArray(data.detail)) {
            const messages = data.detail.map(err => err.msg || err.message || JSON.stringify(err));
            throw new Error(messages.join(', '));
        }
        throw new Error(data?.detail || 'Bir hata oluştu');
    }
    return data;
}

// ============ Auth Functions ============
function setAuth(token, user) {
    state.token = token;
    state.user = user;
    localStorage.setItem('blog-token', token);
    localStorage.setItem('blog-user', JSON.stringify(user));
}

function logout() {
    state.token = null;
    state.user = null;
    localStorage.removeItem('blog-token');
    localStorage.removeItem('blog-user');
    window.location.hash = '/';
    render();
}

// ============ Theme ============
function applyTheme(theme) {
    themes.forEach(t => document.documentElement.classList.remove(t));
    if (theme !== 'light') document.documentElement.classList.add(theme);
}

function setTheme(theme) {
    state.theme = theme;
    localStorage.setItem('blog-theme', theme);
    applyTheme(theme);
    updateThemeButton();
}

function cycleTheme() {
    const idx = themes.indexOf(state.theme);
    setTheme(themes[(idx + 1) % themes.length]);
}

function updateThemeButton() {
    const btn = document.querySelector('.btn-icon[onclick="cycleTheme()"]');
    if (btn) {
        const themeIcon = ['dark', 'ocean'].includes(state.theme) ? Icons.moon : Icons.sun;
        btn.innerHTML = themeIcon;
        btn.title = themeLabels[state.theme];
    }
}

// ============ Router ============
function navigate(path) {
    window.location.hash = path;
}

function getRoute() {
    return window.location.hash.slice(1) || '/';
}

// ============ Icons ============
const Icons = {
    sun: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>`,
    moon: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`,
    calendar: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
    clock: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
    arrow: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>`,
    arrowDown: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14"/><path d="m19 12-7 7-7-7"/></svg>`,
    arrowLeft: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>`,
    arrowRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>`,
    user: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    edit: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
    logout: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
    mail: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    lock: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    trash: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
    save: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>`,
    shield: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
    eye: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`,
    plus: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
    x: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    close: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    send: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>`,
    info: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`,
    palette: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r="0.5" fill="currentColor"/><circle cx="17.5" cy="10.5" r="0.5" fill="currentColor"/><circle cx="8.5" cy="7.5" r="0.5" fill="currentColor"/><circle cx="6.5" cy="12.5" r="0.5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.555C21.965 6.012 17.461 2 12 2z"/></svg>`,
    check: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>`,
    google: `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>`,
    microsoft: `<svg viewBox="0 0 24 24" width="20" height="20"><path fill="#F25022" d="M1 1h10v10H1z"/><path fill="#00A4EF" d="M1 13h10v10H1z"/><path fill="#7FBA00" d="M13 1h10v10H13z"/><path fill="#FFB900" d="M13 13h10v10H13z"/></svg>`,
    x: `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
    // Rich Text Editor Icons
    bold: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/></svg>`,
    italic: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>`,
    underline: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" y1="20" x2="20" y2="20"/></svg>`,
    strikethrough: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" y1="12" x2="20" y2="12"/></svg>`,
    heading1: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="m17 12 3-2v8"/></svg>`,
    heading2: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1"/></svg>`,
    listBullet: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="4" cy="6" r="1" fill="currentColor"/><circle cx="4" cy="12" r="1" fill="currentColor"/><circle cx="4" cy="18" r="1" fill="currentColor"/></svg>`,
    listOrdered: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>`,
    quote: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v4z"/></svg>`,
    link: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
    image: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/></svg>`,
    code: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
    codeBlock: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 16 4-4-4-4"/><path d="m6 8-4 4 4 4"/><path d="m14.5 4-5 16"/></svg>`,
    alignLeft: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/></svg>`,
    alignCenter: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/></svg>`,
    alignRight: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/></svg>`,
    undo: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>`,
    redo: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>`,
    divider: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/></svg>`,
    clearFormat: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/><path d="m17 17 4 4"/><path d="m17 21 4-4"/></svg>`
};

// ============ Components ============
function Navbar() {
    const route = getRoute();
    
    return `
        <header class="navbar">
            <nav class="nav-container">
                <a href="#/" class="logo">
                    <div class="logo-icon">B</div>
                    <span class="logo-text">Blog</span>
                </a>
                <div class="nav-links">
                    <a href="#/" class="nav-link ${route === '/' ? 'active' : ''}">Ana Sayfa</a>
                    <a href="#/blog" class="nav-link ${route === '/blog' ? 'active' : ''}">Yazılar</a>
                    ${ThemeSwitcher()}
                    ${state.user ? UserMenu() : AuthButtons()}
                </div>
            </nav>
        </header>
    `;
}

function ThemeSwitcher() {
    const currentIcon = ['dark', 'ocean'].includes(state.theme) ? Icons.moon : Icons.sun;
    
    return `
        <div class="theme-switcher">
            <button class="btn-icon" onclick="toggleThemeMenu()" aria-label="Tema değiştir" aria-haspopup="true">
                ${currentIcon}
            </button>
            <div class="theme-dropdown" id="themeDropdown">
                ${themes.map(t => `
                    <button class="theme-option ${state.theme === t ? 'active' : ''}" onclick="selectTheme('${t}')">
                        ${getThemeIcon(t)}
                        <span>${themeLabels[t]}</span>
                        ${state.theme === t ? Icons.check : ''}
                    </button>
                `).join('')}
            </div>
        </div>
    `;
}

function getThemeIcon(theme) {
    switch(theme) {
        case 'light': return Icons.sun;
        case 'dark': return Icons.moon;
        default: return Icons.palette;
    }
}

function toggleThemeMenu() {
    const dropdown = document.getElementById('themeDropdown');
    const isOpen = dropdown.classList.contains('open');
    
    // Close other dropdowns
    document.getElementById('userDropdown')?.style.setProperty('display', 'none');
    
    dropdown.classList.toggle('open', !isOpen);
}

function selectTheme(theme) {
    setTheme(theme);
    document.getElementById('themeDropdown')?.classList.remove('open');
    render();
}

function AuthButtons() {
    return `
        <div class="auth-buttons">
            <a href="#/login" class="btn btn-ghost">Giriş Yap</a>
            <a href="#/register" class="btn btn-primary">Kayıt Ol</a>
        </div>
    `;
}

function UserMenu() {
    const initials = state.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return `
        <div class="user-menu">
            <button class="user-avatar" onclick="toggleUserMenu()">${initials}</button>
            <div class="user-dropdown" id="userDropdown" style="display:none;">
                <div class="user-info">
                    <div class="user-info-name">${state.user.name}</div>
                    <div class="user-info-email">${state.user.email}</div>
                </div>
                <div class="user-dropdown-divider"></div>
                <button class="user-dropdown-item" onclick="navigateTo('/profile')">${Icons.user} Profil</button>
                <button class="user-dropdown-item" onclick="navigateTo('/write')">${Icons.edit} Yazı Yaz</button>
                <div class="user-dropdown-divider"></div>
                <button class="user-dropdown-item danger" onclick="logout()">${Icons.logout} Çıkış Yap</button>
            </div>
        </div>
    `;
}

function navigateTo(path) {
    document.getElementById('userDropdown').style.display = 'none';
    navigate(path);
}

function toggleUserMenu() {
    const dropdown = document.getElementById('userDropdown');
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
}

// ============ OAuth Modal ============
let pendingOAuthProvider = null;

const providerNames = { google: 'Google', microsoft: 'Microsoft', x: 'X (Twitter)' };
const providerEmails = { google: 'user@gmail.com', microsoft: 'user@outlook.com', x: 'user@x.com' };

function OAuthModal() {
    return `
        <div class="modal-overlay" id="oauthModal" style="display: none;">
            <div class="modal-content">
                <div class="modal-icon">${Icons.info}</div>
                <h3>Demo Modu</h3>
                <p>Bu bir demo uygulamasıdır. Gerçek <span id="providerName">Google</span> OAuth entegrasyonu için backend sunucusu gereklidir.</p>
                <p class="modal-note">Demo hesabı ile devam ederseniz, <strong id="providerEmail">user@gmail.com</strong> olarak giriş yapacaksınız.</p>
                <div class="modal-actions">
                    <button class="btn-cancel" onclick="closeOAuthModal()">İptal</button>
                    <button class="btn-confirm" onclick="confirmOAuth()">Demo ile Devam Et</button>
                </div>
            </div>
        </div>
    `;
}

// ============ Delete Modal ============
let pendingDeleteSlug = null;

function DeleteModal() {
    return `
        <div class="modal-overlay" id="deleteModal" style="display: none;">
            <div class="modal-content">
                <div class="modal-icon modal-icon-danger">${Icons.trash}</div>
                <h3>Yazıyı Sil</h3>
                <p>Bu yazıyı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.</p>
                <div class="modal-actions">
                    <button class="btn-cancel" onclick="closeDeleteModal()">İptal</button>
                    <button class="btn-confirm btn-confirm-danger" onclick="confirmDelete()">Sil</button>
                </div>
            </div>
        </div>
    `;
}

function showDeleteModal(slug) {
    pendingDeleteSlug = slug;
    const modal = document.getElementById('deleteModal');
    if (modal) modal.style.display = 'flex';
}

function closeDeleteModal() {
    const modal = document.getElementById('deleteModal');
    if (modal) modal.style.display = 'none';
    pendingDeleteSlug = null;
}

async function confirmDelete() {
    if (!pendingDeleteSlug) return;
    
    try {
        await api(`/posts/${pendingDeleteSlug}`, { method: 'DELETE' });
        closeDeleteModal();
        state.currentPost = null;
        await loadPosts();
        navigate('/blog');
    } catch (err) {
        alert('Silme hatası: ' + err.message);
        closeDeleteModal();
    }
}

function editPost(slug) {
    state.editingSlug = slug;
    navigate('/write');
}

function showOAuthModal(provider) {
    pendingOAuthProvider = provider;
    const modal = document.getElementById('oauthModal');
    const providerNameEl = document.getElementById('providerName');
    const providerEmailEl = document.getElementById('providerEmail');
    
    if (modal && providerNameEl && providerEmailEl) {
        providerNameEl.textContent = providerNames[provider];
        providerEmailEl.textContent = providerEmails[provider];
        modal.style.display = 'flex';
    }
}

function closeOAuthModal() {
    const modal = document.getElementById('oauthModal');
    if (modal) modal.style.display = 'none';
    pendingOAuthProvider = null;
}

async function confirmOAuth() {
    if (!pendingOAuthProvider) return;
    
    const mockUsers = {
        google: { name: 'Google Kullanıcı', email: 'user@gmail.com' },
        microsoft: { name: 'Microsoft Kullanıcı', email: 'user@outlook.com' },
        x: { name: 'X Kullanıcı', email: 'user@x.com' }
    };
    
    const mockUser = mockUsers[pendingOAuthProvider];
    
    try {
        // Call backend to create/find OAuth user and get real JWT token
        const data = await api('/auth/oauth-demo', {
            method: 'POST',
            body: JSON.stringify({
                provider: pendingOAuthProvider,
                email: mockUser.email,
                name: mockUser.name
            })
        });
        
        setAuth(data.access_token, data.user);
        closeOAuthModal();
        navigate('/');
    } catch (err) {
        console.error('OAuth demo login failed:', err);
        closeOAuthModal();
        alert('Giriş başarısız: ' + err.message);
    }
}

function OAuthButtons() {
    return `
        <div class="oauth-buttons">
            <button class="oauth-btn" onclick="showOAuthModal('google')">
                ${Icons.google}
                Google ile devam et
            </button>
            <button class="oauth-btn" onclick="showOAuthModal('microsoft')">
                ${Icons.microsoft}
                Microsoft ile devam et
            </button>
            <button class="oauth-btn" onclick="showOAuthModal('x')">
                ${Icons.x}
                X ile devam et
            </button>
        </div>
    `;
}

function PostCard(post, index = 0) {
    const date = new Date(post.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    return `
        <a href="#/post/${post.slug}" class="card animate-fade-in delay-${index % 4 + 1}">
            <div class="card-content">
                <div class="tags">${post.tags.map(t => `<span class="tag">${t.name}</span>`).join('')}</div>
                <h3 class="card-title">${post.title}</h3>
                <p class="card-excerpt">${post.excerpt || ''}</p>
                <div class="card-meta">
                    <div class="meta-info">
                        <span class="meta-item">${Icons.calendar} ${date}</span>
                        <span class="meta-item">${Icons.clock} ${post.read_time}</span>
                    </div>
                    <span class="arrow-icon">${Icons.arrow}</span>
                </div>
            </div>
            <div class="card-hover-gradient"></div>
        </a>
    `;
}


// ============ Pages ============
function HomePage() {
    const featured = state.posts.find(p => p.featured);
    const others = state.posts.filter(p => !p.featured);
    
    return `
        ${Navbar()}
        <main>
            <section class="hero">
                <div class="hero-bg"></div>
                <div class="floating-shape shape-1"></div>
                <div class="floating-shape shape-2"></div>
                <div class="hero-content">
                    <span class="hero-badge animate-fade-in">Minimalist Blog</span>
                    <h1 class="hero-title animate-fade-in delay-1">
                        Düşünceler, <span class="gradient-text">Kod</span> ve Tasarım
                    </h1>
                    <p class="hero-description animate-fade-in delay-2">
                        Frontend geliştirme, UI/UX tasarım ve modern web teknolojileri üzerine derinlemesine yazılar.
                    </p>
                    <div class="scroll-indicator animate-fade-in delay-3">${Icons.arrowDown}</div>
                </div>
            </section>
            
            ${featured ? `
            <section class="section">
                <div class="container">
                    <span class="section-label animate-fade-in">Öne Çıkan</span>
                    ${PostCard(featured, 0)}
                </div>
            </section>
            ` : ''}
            
            <section class="section">
                <div class="container">
                    <span class="section-label muted animate-fade-in">Tüm Yazılar</span>
                    <div class="posts-grid">
                        ${others.map((p, i) => PostCard(p, i)).join('')}
                    </div>
                </div>
            </section>
        </main>
        <footer class="footer"><div class="container"><p>Minimalist tasarım ile oluşturuldu. © 2026</p></div></footer>
    `;
}

function BlogPage() {
    return `
        ${Navbar()}
        <main style="padding-top: 6rem;">
            <section class="section">
                <div class="container">
                    <div class="animate-fade-in" style="margin-bottom: 3rem;">
                        <h1 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; letter-spacing: -0.03em; margin-bottom: 1rem;">Tüm Yazılar</h1>
                        <p style="font-size: 1.125rem; color: var(--text-muted);">Frontend, tasarım ve teknoloji üzerine düşünceler</p>
                    </div>
                    <div class="posts-grid">
                        ${state.posts.map((p, i) => PostCard(p, i)).join('')}
                    </div>
                </div>
            </section>
        </main>
        <footer class="footer"><div class="container"><p>Minimalist tasarım ile oluşturuldu. © 2026</p></div></footer>
    `;
}

function PostPage(slug) {
    const post = state.currentPost;
    if (!post) return `${Navbar()}<main style="padding-top:8rem;text-align:center;"><p>Yükleniyor...</p></main>`;
    
    const date = new Date(post.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });
    const isAuthor = state.user && state.user.id === post.author.id;
    
    // Check if content is HTML or markdown
    const isHtml = post.content.startsWith('<') || post.content.includes('</');
    const content = isHtml ? post.content : post.content
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
    
    return `
        ${Navbar()}
        ${DeleteModal()}
        <main style="padding-top: 6rem;">
            <article class="section">
                <div class="container" style="max-width: 720px;">
                    <div class="post-header-actions">
                        <a href="#/blog" class="btn btn-ghost">${Icons.arrowLeft} Geri</a>
                        ${isAuthor ? `
                            <div class="post-actions">
                                <button class="btn btn-ghost" onclick="editPost('${post.slug}')">${Icons.edit} Düzenle</button>
                                <button class="btn btn-ghost btn-danger" onclick="showDeleteModal('${post.slug}')">${Icons.trash} Sil</button>
                            </div>
                        ` : ''}
                    </div>
                    <div class="tags" style="margin-bottom: 1rem;">${post.tags.map(t => `<span class="tag">${t.name}</span>`).join('')}</div>
                    <h1 style="font-size: clamp(2rem, 5vw, 3rem); font-weight: 700; letter-spacing: -0.03em; margin-bottom: 1rem;">${post.title}</h1>
                    <div class="meta-info" style="margin-bottom: 3rem;">
                        <span class="meta-item">${Icons.calendar} ${date}</span>
                        <span class="meta-item">${Icons.clock} ${post.read_time}</span>
                        <span class="meta-item">${Icons.user} ${post.author.name}</span>
                    </div>
                    <div class="post-content" style="font-size: 1.0625rem; line-height: 1.8; color: var(--text);">
                        ${isHtml ? content : `<p>${content}</p>`}
                    </div>
                </div>
            </article>
        </main>
        <footer class="footer"><div class="container"><p>Minimalist tasarım ile oluşturuldu. © 2026</p></div></footer>
    `;
}

function LoginPage() {
    return `
        ${Navbar()}
        <main class="auth-page">
            <div class="auth-bg"></div>
            <div class="floating-shape shape-1"></div>
            ${OAuthModal()}
            <div class="auth-card animate-fade-in">
                <div class="auth-header">
                    <a href="#/" class="auth-logo"><div class="logo-icon logo-icon-lg">B</div></a>
                    <h1>Tekrar Hoş Geldin</h1>
                    <p>Hesabına giriş yap ve yazmaya devam et</p>
                </div>
                ${OAuthButtons()}
                <div class="auth-divider"><span>veya email ile</span></div>
                <form class="auth-form" onsubmit="handleLogin(event)">
                    <div id="login-error" class="error-message" style="display:none;"></div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <div class="input-wrapper">
                            <span class="input-icon">${Icons.mail}</span>
                            <input type="email" id="email" placeholder="ornek@email.com" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="password">Şifre</label>
                        <div class="input-wrapper">
                            <span class="input-icon">${Icons.lock}</span>
                            <input type="password" id="password" placeholder="••••••••" required>
                        </div>
                    </div>
                    <button type="submit" class="submit-btn">Giriş Yap ${Icons.arrowRight}</button>
                </form>
                <p class="auth-footer">Hesabın yok mu? <a href="#/register">Kayıt ol</a></p>
            </div>
        </main>
    `;
}

function RegisterPage() {
    return `
        ${Navbar()}
        <main class="auth-page">
            <div class="auth-bg"></div>
            <div class="floating-shape shape-1"></div>
            ${OAuthModal()}
            <div class="auth-card animate-fade-in">
                <div class="auth-header">
                    <a href="#/" class="auth-logo"><div class="logo-icon logo-icon-lg">B</div></a>
                    <h1>Hesap Oluştur</h1>
                    <p>Hemen kayıt ol ve yazmaya başla</p>
                </div>
                ${OAuthButtons()}
                <div class="auth-divider"><span>veya email ile</span></div>
                <form class="auth-form" onsubmit="handleRegister(event)">
                    <div id="register-error" class="error-message" style="display:none;"></div>
                    <div class="form-group">
                        <label for="name">Ad Soyad</label>
                        <div class="input-wrapper">
                            <span class="input-icon">${Icons.user}</span>
                            <input type="text" id="name" placeholder="John Doe" required minlength="2">
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="email">Email</label>
                        <div class="input-wrapper">
                            <span class="input-icon">${Icons.mail}</span>
                            <input type="email" id="email" placeholder="ornek@email.com" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="password">Şifre</label>
                        <div class="input-wrapper">
                            <span class="input-icon">${Icons.lock}</span>
                            <input type="password" id="password" placeholder="••••••••" required minlength="6">
                        </div>
                    </div>
                    <button type="submit" class="submit-btn">Kayıt Ol ${Icons.arrowRight}</button>
                </form>
                <p class="auth-footer">Zaten hesabın var mı? <a href="#/login">Giriş yap</a></p>
            </div>
        </main>
    `;
}

function WritePage() {
    if (!state.user) { navigate('/login'); return ''; }
    
    const isPreview = state.writePreview || false;
    const writeTags = state.writeTags || [];
    const isEditing = !!state.editingSlug;
    const editingPost = isEditing ? state.editingPost : null;
    
    return `
        ${Navbar()}
        <main class="write-page">
            <div class="write-container">
                <div class="write-header">
                    <a href="${isEditing ? `#/post/${state.editingSlug}` : '#/'}" class="back-link" onclick="cancelEdit()">${Icons.arrowLeft} ${isEditing ? 'İptal' : 'Geri'}</a>
                    <div class="write-actions">
                        <button class="btn btn-ghost" onclick="toggleWritePreview()">
                            ${isPreview ? Icons.edit : Icons.eye}
                            ${isPreview ? 'Düzenle' : 'Önizle'}
                        </button>
                        <button class="btn btn-primary" onclick="${isEditing ? 'handleUpdatePost(event)' : 'handleCreatePost(event)'}">
                            ${isEditing ? Icons.save : Icons.send} ${isEditing ? 'Kaydet' : 'Yayınla'}
                        </button>
                    </div>
                </div>
                
                <div id="write-error" class="error-message" style="display:none;"></div>
                
                ${isPreview ? `
                    <div class="write-preview animate-fade-in">
                        <div class="preview-tags">${writeTags.map(t => `<span class="tag">${t}</span>`).join('')}</div>
                        <h1 class="preview-title">${document.getElementById('title')?.value || 'Başlık'}</h1>
                        <p class="preview-excerpt">${document.getElementById('excerpt')?.value || ''}</p>
                        <div class="preview-meta">
                            <span class="meta-item">${Icons.user} ${state.user.name}</span>
                            <span class="meta-item">${Icons.calendar} ${new Date().toLocaleDateString('tr-TR')}</span>
                        </div>
                        <div class="preview-content">${document.getElementById('content')?.innerHTML || ''}</div>
                    </div>
                ` : `
                    <div class="write-form animate-fade-in">
                        <input type="text" id="title" class="write-title-input" placeholder="Başlık" value="${editingPost?.title || ''}" required>
                        <input type="text" id="excerpt" class="write-excerpt-input" placeholder="Kısa özet (opsiyonel)" value="${editingPost?.excerpt || ''}">
                        
                        <div class="tags-section">
                            <label>Etiketler</label>
                            <div class="tags-list" id="tagsList">
                                ${writeTags.map(t => `
                                    <span class="tag-item">
                                        ${t}
                                        <button onclick="removeWriteTag('${t}')">${Icons.close}</button>
                                    </span>
                                `).join('')}
                            </div>
                            <div class="tag-input-wrapper">
                                <input type="text" id="tagInput" placeholder="Etiket ekle" onkeydown="handleTagKeydown(event)">
                                <button class="btn-icon-sm" onclick="addWriteTag()">${Icons.plus}</button>
                            </div>
                            <span class="tag-hint">${writeTags.length}/5 etiket</span>
                        </div>
                        
                        <div class="content-section">
                            <label>İçerik</label>
                            ${RichTextEditor()}
                            <span class="content-hint" id="wordCount">0 kelime · ~1 dk okuma</span>
                        </div>
                    </div>
                `}
            </div>
        </main>
    `;
}

function ProfilePage() {
    if (!state.user) { navigate('/login'); return ''; }
    
    const initials = state.user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const joinDate = state.user.createdAt ? new Date(state.user.createdAt).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Bilinmiyor';
    const providerLabels = { email: 'E-posta', google: 'Google', microsoft: 'Microsoft', x: 'X (Twitter)' };
    
    return `
        ${Navbar()}
        <main class="profile-page">
            <div class="profile-container animate-fade-in">
                <a href="#/" class="back-link">${Icons.arrowLeft} Ana Sayfaya Dön</a>
                
                <div class="profile-card">
                    <div class="profile-header">
                        <div class="profile-avatar">${initials}</div>
                        <div class="profile-info">
                            <h1>${state.user.name}</h1>
                            <p>${state.user.email}</p>
                        </div>
                    </div>
                </div>
                
                <div class="profile-card">
                    <h2>Profil Bilgileri</h2>
                    <div class="profile-form">
                        <div class="form-group">
                            <label for="profileName">Ad Soyad</label>
                            <div class="input-wrapper">
                                <span class="input-icon">${Icons.user}</span>
                                <input type="text" id="profileName" value="${state.user.name}">
                            </div>
                        </div>
                        <div class="form-group">
                            <label>E-posta</label>
                            <div class="input-wrapper">
                                <span class="input-icon">${Icons.mail}</span>
                                <input type="email" value="${state.user.email}" disabled>
                            </div>
                            <span class="form-hint">E-posta adresi değiştirilemez</span>
                        </div>
                        <button class="btn btn-primary" onclick="handleUpdateProfile()" style="width:100%;">
                            ${Icons.save} Değişiklikleri Kaydet
                        </button>
                    </div>
                </div>
                
                <div class="profile-card">
                    <h2>Hesap Bilgileri</h2>
                    <div class="account-info">
                        <div class="account-row">
                            <span class="account-label">${Icons.shield} Giriş Yöntemi</span>
                            <span class="account-value">${providerLabels[state.user.provider] || 'E-posta'}</span>
                        </div>
                        <div class="account-row">
                            <span class="account-label">${Icons.calendar} Katılım Tarihi</span>
                            <span class="account-value">${joinDate}</span>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    `;
}

// ============ Write Page Helpers ============
state.writeTags = [];
state.writePreview = false;

// ============ Rich Text Editor ============
function RichTextEditor() {
    return `
        <div class="rich-editor">
            <div class="editor-toolbar">
                <div class="toolbar-group">
                    <button type="button" class="toolbar-btn" onclick="editorCmd('undo')" title="Geri Al (Ctrl+Z)">${Icons.undo}</button>
                    <button type="button" class="toolbar-btn" onclick="editorCmd('redo')" title="İleri Al (Ctrl+Y)">${Icons.redo}</button>
                </div>
                <div class="toolbar-divider"></div>
                <div class="toolbar-group">
                    <button type="button" class="toolbar-btn" onclick="editorCmd('formatBlock', 'H1')" title="Başlık 1">${Icons.heading1}</button>
                    <button type="button" class="toolbar-btn" onclick="editorCmd('formatBlock', 'H2')" title="Başlık 2">${Icons.heading2}</button>
                </div>
                <div class="toolbar-divider"></div>
                <div class="toolbar-group">
                    <button type="button" class="toolbar-btn" onclick="editorCmd('bold')" title="Kalın (Ctrl+B)">${Icons.bold}</button>
                    <button type="button" class="toolbar-btn" onclick="editorCmd('italic')" title="İtalik (Ctrl+I)">${Icons.italic}</button>
                    <button type="button" class="toolbar-btn" onclick="editorCmd('underline')" title="Altı Çizili (Ctrl+U)">${Icons.underline}</button>
                    <button type="button" class="toolbar-btn" onclick="editorCmd('strikeThrough')" title="Üstü Çizili">${Icons.strikethrough}</button>
                </div>
                <div class="toolbar-divider"></div>
                <div class="toolbar-group">
                    <button type="button" class="toolbar-btn" onclick="editorCmd('justifyLeft')" title="Sola Hizala">${Icons.alignLeft}</button>
                    <button type="button" class="toolbar-btn" onclick="editorCmd('justifyCenter')" title="Ortala">${Icons.alignCenter}</button>
                    <button type="button" class="toolbar-btn" onclick="editorCmd('justifyRight')" title="Sağa Hizala">${Icons.alignRight}</button>
                </div>
                <div class="toolbar-divider"></div>
                <div class="toolbar-group">
                    <button type="button" class="toolbar-btn" onclick="editorCmd('insertUnorderedList')" title="Madde İşaretli Liste">${Icons.listBullet}</button>
                    <button type="button" class="toolbar-btn" onclick="editorCmd('insertOrderedList')" title="Numaralı Liste">${Icons.listOrdered}</button>
                    <button type="button" class="toolbar-btn" onclick="editorCmd('formatBlock', 'BLOCKQUOTE')" title="Alıntı">${Icons.quote}</button>
                </div>
                <div class="toolbar-divider"></div>
                <div class="toolbar-group">
                    <button type="button" class="toolbar-btn" onclick="insertLink()" title="Bağlantı Ekle">${Icons.link}</button>
                    <button type="button" class="toolbar-btn" onclick="insertImage()" title="Resim Ekle">${Icons.image}</button>
                    <button type="button" class="toolbar-btn" onclick="insertCode()" title="Kod">${Icons.code}</button>
                    <button type="button" class="toolbar-btn" onclick="editorCmd('insertHorizontalRule')" title="Yatay Çizgi">${Icons.divider}</button>
                </div>
                <div class="toolbar-divider"></div>
                <div class="toolbar-group">
                    <button type="button" class="toolbar-btn" onclick="editorCmd('removeFormat')" title="Formatı Temizle">${Icons.clearFormat}</button>
                </div>
            </div>
            <div 
                id="content" 
                class="editor-content" 
                contenteditable="true" 
                data-placeholder="Yazınızı buraya yazın..."
                oninput="updateEditorWordCount()"
            ></div>
        </div>
    `;
}

function editorCmd(command, value = null) {
    document.execCommand(command, false, value);
    document.getElementById('content')?.focus();
}

function insertLink() {
    const url = prompt('Bağlantı URL\'si girin:', 'https://');
    if (url) {
        editorCmd('createLink', url);
    }
}

function insertImage() {
    const url = prompt('Resim URL\'si girin:', 'https://');
    if (url) {
        editorCmd('insertImage', url);
    }
}

function insertCode() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const code = document.createElement('code');
        code.appendChild(range.extractContents());
        range.insertNode(code);
    }
}

function updateEditorWordCount() {
    const editor = document.getElementById('content');
    const text = editor?.innerText || '';
    const words = text.split(/\s+/).filter(Boolean).length;
    const readTime = Math.max(1, Math.ceil(words / 200));
    const el = document.getElementById('wordCount');
    if (el) el.textContent = `${words} kelime · ~${readTime} dk okuma`;
}

function getEditorContent() {
    const editor = document.getElementById('content');
    return editor?.innerHTML || '';
}

function getEditorText() {
    const editor = document.getElementById('content');
    return editor?.innerText || '';
}

function toggleWritePreview() {
    state.writePreview = !state.writePreview;
    render();
}

function addWriteTag() {
    const input = document.getElementById('tagInput');
    const tag = input?.value.trim();
    if (tag && !state.writeTags.includes(tag) && state.writeTags.length < 5) {
        state.writeTags.push(tag);
        input.value = '';
        render();
    }
}

function removeWriteTag(tag) {
    state.writeTags = state.writeTags.filter(t => t !== tag);
    render();
}

function handleTagKeydown(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        addWriteTag();
    }
}

function updateWordCount() {
    const content = document.getElementById('content')?.value || '';
    const words = content.split(/\s+/).filter(Boolean).length;
    const readTime = Math.max(1, Math.ceil(words / 200));
    const el = document.getElementById('wordCount');
    if (el) el.textContent = `${words} kelime · ~${readTime} dk okuma`;
}

function formatContent(content) {
    return content
        .replace(/^### (.*$)/gim, '<h3>$1</h3>')
        .replace(/^## (.*$)/gim, '<h2>$1</h2>')
        .replace(/^# (.*$)/gim, '<h1>$1</h1>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');
}

function handleUpdateProfile() {
    const name = document.getElementById('profileName')?.value.trim();
    if (name && name.length >= 2) {
        state.user.name = name;
        localStorage.setItem('blog-user', JSON.stringify(state.user));
        render();
        alert('Profil güncellendi!');
    }
}

// ============ Event Handlers ============
async function handleLogin(e) {
    e.preventDefault();
    const errorEl = document.getElementById('login-error');
    try {
        const data = await api('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            })
        });
        setAuth(data.access_token, data.user);
        navigate('/');
    } catch (err) {
        errorEl.textContent = err.message;
        errorEl.style.display = 'block';
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const errorEl = document.getElementById('register-error');
    try {
        const data = await api('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                password: document.getElementById('password').value
            })
        });
        setAuth(data.access_token, data.user);
        navigate('/');
    } catch (err) {
        errorEl.textContent = err.message;
        errorEl.style.display = 'block';
    }
}

async function handleCreatePost(e) {
    if (e) e.preventDefault();
    const errorEl = document.getElementById('write-error');
    const title = document.getElementById('title')?.value;
    const contentEl = document.getElementById('content');
    const content = contentEl?.innerHTML || contentEl?.value || '';
    
    if (!title || !content || content === '<br>') {
        if (errorEl) {
            errorEl.textContent = 'Başlık ve içerik gereklidir';
            errorEl.style.display = 'block';
        }
        return;
    }
    
    try {
        await api('/posts', {
            method: 'POST',
            body: JSON.stringify({
                title,
                content,
                tags: state.writeTags
            })
        });
        clearWriteState();
        await loadPosts();
        navigate('/blog');
    } catch (err) {
        if (errorEl) {
            errorEl.textContent = err.message;
            errorEl.style.display = 'block';
        }
    }
}

async function handleUpdatePost(e) {
    if (e) e.preventDefault();
    const errorEl = document.getElementById('write-error');
    const title = document.getElementById('title')?.value;
    const contentEl = document.getElementById('content');
    const content = contentEl?.innerHTML || contentEl?.value || '';
    const excerpt = document.getElementById('excerpt')?.value || '';
    
    if (!title || !content || content === '<br>') {
        if (errorEl) {
            errorEl.textContent = 'Başlık ve içerik gereklidir';
            errorEl.style.display = 'block';
        }
        return;
    }
    
    try {
        await api(`/posts/${state.editingSlug}`, {
            method: 'PUT',
            body: JSON.stringify({
                title,
                content,
                excerpt,
                tags: state.writeTags
            })
        });
        const slug = state.editingSlug;
        clearWriteState();
        await loadPosts();
        navigate(`/post/${slug}`);
    } catch (err) {
        if (errorEl) {
            errorEl.textContent = err.message;
            errorEl.style.display = 'block';
        }
    }
}

function clearWriteState() {
    state.writeTags = [];
    state.writePreview = false;
    state.editingSlug = null;
    state.editingPost = null;
}

function cancelEdit() {
    clearWriteState();
}

// ============ Data Loading ============
async function loadPosts() {
    try {
        state.posts = await api('/posts');
    } catch (err) {
        console.error('Posts yüklenemedi:', err);
        state.posts = [];
    }
}

async function loadPost(slug) {
    try {
        state.currentPost = await api(`/posts/${slug}`);
    } catch (err) {
        console.error('Post yüklenemedi:', err);
        state.currentPost = null;
    }
}

// ============ Router & Render ============
async function render() {
    const route = getRoute();
    const app = document.getElementById('app');
    
    // Load data if needed
    if (state.posts.length === 0 && ['/', '/blog'].includes(route)) {
        await loadPosts();
    }
    
    // Route matching
    if (route === '/') {
        app.innerHTML = HomePage();
    } else if (route === '/blog') {
        app.innerHTML = BlogPage();
    } else if (route.startsWith('/post/')) {
        const slug = route.split('/post/')[1];
        await loadPost(slug);
        app.innerHTML = PostPage(slug);
    } else if (route === '/login') {
        app.innerHTML = LoginPage();
    } else if (route === '/register') {
        app.innerHTML = RegisterPage();
    } else if (route === '/write') {
        // Load post data if editing
        if (state.editingSlug && !state.editingPost) {
            await loadPost(state.editingSlug);
            state.editingPost = state.currentPost;
            state.writeTags = state.editingPost?.tags?.map(t => t.name) || [];
        }
        app.innerHTML = WritePage();
        // Set editor content if editing
        setTimeout(() => {
            const contentEl = document.getElementById('content');
            if (contentEl) {
                if (state.editingPost) {
                    contentEl.innerHTML = state.editingPost.content;
                }
                contentEl.addEventListener('input', updateEditorWordCount);
                updateEditorWordCount();
            }
        }, 0);
    } else if (route === '/profile') {
        app.innerHTML = ProfilePage();
    } else {
        app.innerHTML = HomePage();
    }
}

// ============ Init ============
window.addEventListener('hashchange', render);
window.addEventListener('click', (e) => {
    // Close user dropdown
    if (!e.target.closest('.user-menu')) {
        const dropdown = document.getElementById('userDropdown');
        if (dropdown) dropdown.style.display = 'none';
    }
    // Close theme dropdown
    if (!e.target.closest('.theme-switcher')) {
        const themeDropdown = document.getElementById('themeDropdown');
        if (themeDropdown) themeDropdown.classList.remove('open');
    }
    // Close OAuth modal when clicking overlay
    if (e.target.classList.contains('modal-overlay')) {
        closeOAuthModal();
        closeDeleteModal();
    }
});

// Apply saved theme immediately
applyTheme(state.theme);

// Initial render
render();

// ============ Expose Functions to Global Scope ============
// Required because inline onclick handlers need global access
window.cycleTheme = cycleTheme;
window.toggleThemeMenu = toggleThemeMenu;
window.selectTheme = selectTheme;
window.toggleUserMenu = toggleUserMenu;
window.logout = logout;
window.navigate = navigate;
window.navigateTo = navigateTo;
window.showOAuthModal = showOAuthModal;
window.closeOAuthModal = closeOAuthModal;
window.confirmOAuth = confirmOAuth;
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleCreatePost = handleCreatePost;
window.handleUpdatePost = handleUpdatePost;
window.handleUpdateProfile = handleUpdateProfile;
window.toggleWritePreview = toggleWritePreview;
window.addWriteTag = addWriteTag;
window.removeWriteTag = removeWriteTag;
window.handleTagKeydown = handleTagKeydown;
// Rich Text Editor
window.editorCmd = editorCmd;
window.insertLink = insertLink;
window.insertImage = insertImage;
window.insertCode = insertCode;
window.updateEditorWordCount = updateEditorWordCount;
// Post Edit/Delete
window.editPost = editPost;
window.showDeleteModal = showDeleteModal;
window.closeDeleteModal = closeDeleteModal;
window.confirmDelete = confirmDelete;
window.cancelEdit = cancelEdit;
