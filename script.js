console.log('🌅 Horizon Script Loading... at 10:42 PM IST, September 27, 2025');

let currentCategory = 'Home';
let isDarkMode = false;
let isSidebarOpen = false;
let isSidebarContentVisible = true;

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM Loaded - Initializing...');
    initializeApp();
    setupEventListeners();
    showCategory('Home');
    console.log('🚀 Horizon Fully Initialized!');
});

function initializeApp() {
    loadPreferences();
    updateActiveNavigation();
    console.log('📱 App Initialized Successfully');
}

function setupEventListeners() {
    console.log('🔗 Setting up event listeners...');
    document.getElementById('mobileMenuBtn').addEventListener('click', toggleSidebar);
    document.querySelector('.sidebar-close-btn').addEventListener('click', toggleSidebar);
    document.getElementById('sidebarToggleBtn').addEventListener('click', toggleSidebarContent);
    document.querySelectorAll('.slide').forEach(slide => {
        if (slide.dataset.toggle) {
            slide.addEventListener('click', (e) => {
                if (slide.dataset.toggle === 'study') toggleStudy(e);
                if (slide.dataset.toggle === 'workshop') toggleWorkshop(e);
            });
        } else {
            slide.addEventListener('click', () => showCategory(slide.dataset.category));
        }
    });
    document.querySelectorAll('.sub-slide').forEach(slide => {
        slide.addEventListener('click', () => showCategory(slide.dataset.category));
    });
    document.querySelectorAll('.blue-section span, .latest-news-section span').forEach(tab => {
        tab.addEventListener('click', () => showCategory(tab.dataset.category));
    });
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('settingsBtn').addEventListener('click', openSettings);
    document.querySelectorAll('.close-btn').forEach(btn => btn.addEventListener('click', closeModals));
    document.querySelector('.settings-section button').addEventListener('click', handleLogin);
    document.getElementById('themeSelect').addEventListener('change', (e) => setTheme(e.target.value));
    document.querySelector('.translate-btn').addEventListener('change', (e) => translateInterface(e.target.value));
    document.getElementById('comment-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const comment = e.target.querySelector('textarea').value.trim();
        const username = localStorage.getItem('username') || 'Guest';
        if (comment) {
            const commentsList = document.getElementById('comments-list');
            const commentEl = document.createElement('div');
            commentEl.className = 'comment-item';
            commentEl.innerHTML = `<strong>${username}:</strong> <span>${comment}</span> <span class="comment-time">${new Date().toLocaleTimeString()}</span>`;
            commentsList.insertBefore(commentEl, commentsList.firstChild);
            e.target.reset();
            console.log(`💬 Comment added by ${username}: ${comment}`);
        }
    });
    document.getElementById('newsletter-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input').value.trim();
        if (email) {
            console.log(`📧 Subscribed: ${email}`);
            alert('Thank you for subscribing to Horizon News!');
            e.target.reset();
        }
    });
    document.getElementById('searchBar').addEventListener('input', searchPosts);
    document.querySelector('.load-more-btn').addEventListener('click', loadMorePosts);
    window.addEventListener('scroll', () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            loadMorePosts();
        }
        document.getElementById('backToTop').style.display = (window.scrollY > 300) ? 'block' : 'none';
    });
    document.getElementById('backToTop').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModals();
    });
    console.log('✅ All event listeners attached successfully!');
}

function toggleSidebar() {
    console.log('☰ Sidebar toggle clicked');
    const sidebar = document.getElementById('sidebar');
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const mainContent = document.getElementById('mainContent');

    isSidebarOpen = !isSidebarOpen;
    sidebar.classList.toggle('open', isSidebarOpen);
    mobileBtn.classList.toggle('active', isSidebarOpen);
    mainContent.classList.toggle('shifted', isSidebarOpen);
    console.log(`📱 Sidebar ${isSidebarOpen ? 'opened' : 'closed'}`);
}

function toggleSidebarContent() {
    console.log('☰ Sidebar content toggle clicked');
    const sidebarNav = document.getElementById('sidebarNav');
    isSidebarContentVisible = !isSidebarContentVisible;
    sidebarNav.classList.toggle('collapsed', !isSidebarContentVisible);
    console.log(`📋 Sidebar content ${isSidebarContentVisible ? 'visible' : 'hidden'}`);
}

function showCategory(category) {
    console.log(`🌐 Loading category: ${category}`);
    if (window.innerWidth < 768) toggleSidebar();
    currentCategory = category;
    document.getElementById('page-title').textContent = `${category} - Latest Updates`;
    updateActiveNavigation(category);
    loadCategoryContent(category);
    closeModals();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log(`✅ ${category} loaded successfully`);
}

function updateActiveNavigation(category) {
    document.querySelectorAll('.slide, .sub-slide, .blue-section span, .latest-news-section span').forEach(el => el.classList.remove('active'));
    const activeSlide = document.querySelector(`[data-category="${category}"]`);
    if (activeSlide) activeSlide.classList.add('active');
    console.log(`🎯 Active nav updated: ${category}`);
}

async function loadCategoryContent(category) {
    const container = document.getElementById('recent-posts');
    container.innerHTML = '<div class="loading">Loading...</div>';
    setTimeout(async () => {
        const posts = await fetchPosts(category);
        container.innerHTML = '';
        posts.forEach(post => container.appendChild(createPostCard(post)));
        document.getElementById('load-more').classList.remove('hidden');
        console.log(`📄 Loaded ${posts.length} posts for ${category}`);
    }, 800);
}

function createPostCard(post) {
    const card = document.createElement('div');
    card.className = 'post-card';
    card.innerHTML = `
        <h3>${post.title}</h3>
        <p>${post.description}</p>
        <div class="post-meta">
            <span class="category-tag">${post.category}</span>
            <span class="date">${post.date}</span>
        </div>
        <div class="post-actions">
            <button class="like-btn">❤️ ${Math.floor(Math.random() * 100)}</button>
            <button class="comment-btn">💬 Comment</button>
        </div>
    `;
    card.querySelector('.like-btn').addEventListener('click', (e) => {
        const likes = parseInt(e.target.textContent.match(/\d+/)[0]) + 1;
        e.target.textContent = `❤️ ${likes}`;
        e.target.style.background = '#ff5252';
        setTimeout(() => { e.target.style.background = ''; }, 200);
    });
    card.querySelector('.comment-btn').addEventListener('click', () => openComments(post.title));
    return card;
}

function toggleStudy(e) {
    e.stopPropagation();
    console.log('📚 Study menu toggled');
    const studyGroup = document.getElementById('studyGroup');
    const expandIcon = e.currentTarget.querySelector('.expand-icon');
    studyGroup.classList.toggle('hidden');
    expandIcon.classList.toggle('rotated');
    const workshopGroup = document.getElementById('workshopGroup');
    if (workshopGroup && !workshopGroup.classList.contains('hidden')) {
        const workshopIcon = document.querySelector('[data-toggle="workshop"] .expand-icon');
        workshopIcon.classList.remove('rotated');
        workshopGroup.classList.add('hidden');
    }
}

function toggleWorkshop(e) {
    e.stopPropagation();
    console.log('🔧 Workshop menu toggled');
    const workshopGroup = document.getElementById('workshopGroup');
    const expandIcon = e.currentTarget.querySelector('.expand-icon');
    workshopGroup.classList.toggle('hidden');
    expandIcon.classList.toggle('rotated');
    const studyGroup = document.getElementById('studyGroup');
    if (studyGroup && !studyGroup.classList.contains('hidden')) {
        const studyIcon = document.querySelector('[data-toggle="study"] .expand-icon');
        studyIcon.classList.remove('rotated');
        studyGroup.classList.add('hidden');
    }
}

function toggleTheme() {
    console.log('🌙 Theme toggle clicked');
    isDarkMode = !isDarkMode;
    setTheme(isDarkMode ? 'dark' : 'light');
}

function setTheme(theme) {
    isDarkMode = theme === 'dark';
    document.body.classList.toggle('dark-theme', isDarkMode);
    document.getElementById('themeToggle').textContent = isDarkMode ? '☀️ Light' : '🌙 Dark';
    document.getElementById('themeSelect').value = theme;
    localStorage.setItem('theme', theme);
    console.log(`🎨 Theme changed to: ${theme}`);
}

function openSettings() {
    console.log('⚙️ Settings opened');
    document.getElementById('settingsModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function openComments(title) {
    console.log(`💬 Opening comments for: ${title}`);
    document.getElementById('comment-title').textContent = `${title} - Comments`;
    document.getElementById('commentsModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeModals() {
    console.log('🔚 Closing modals');
    document.querySelectorAll('.comments-modal, .settings-modal').forEach(modal => modal.classList.remove('show'));
    document.body.style.overflow = 'auto';
}

function handleLogin() {
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    if (username && password) {
        localStorage.setItem('username', username);
        console.log(`👤 Login successful: ${username}`);
        alert(`Welcome back, ${username}!`);
        document.getElementById('loginBtn').textContent = `Hi ${username}`;
        closeModals();
    } else {
        console.log('❌ Login failed');
        alert('Please enter username and password');
    }
}

function loadMorePosts() {
    console.log('📄 Loading more posts...');
    const btn = document.querySelector('.load-more-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Loading...';
    btn.disabled = true;
    setTimeout(async () => {
        const container = document.getElementById('recent-posts');
        const newPosts = await fetchPosts(currentCategory, 3);
        newPosts.forEach(post => container.appendChild(createPostCard(post)));
        btn.textContent = originalText;
        btn.disabled = false;
        console.log(`➕ Added ${newPosts.length} more posts`);
    }, 1500);
}

function searchPosts() {
    console.log('🔍 Searching...');
    const query = document.getElementById('searchBar').value.toLowerCase().trim();
    const posts = document.querySelectorAll('.post-card');
    posts.forEach(post => {
        const text = post.textContent.toLowerCase();
        post.style.display = text.includes(query) ? 'block' : 'none';
    });
}

function translateInterface(lang) {
    console.log(`🌐 Language changed to: ${lang}`);
    const translations = {
        en: { 'Home': 'Home', 'News': 'News', 'Study': 'Study', 'Workshop': 'Workshop', '10thBoardHindi': '10th Board Hindi', '10thBoardEnglish': '10th Board English', '12thBoardHindi': '12th Board Hindi', '12thBoardEnglish': '12th Board English', 'CompetitiveHindi': 'Competitive Hindi', 'CompetitiveEnglish': 'Competitive English', 'Cafe': 'Cafe', 'WebsiteBuilder': 'Website Builder', 'Editor': 'Editor', 'Designer': 'Designer', 'ContentCreator': 'Content Creator', 'Affiliate': 'Affiliate', 'Dropshipping': 'Dropshipping', 'Promotion': 'Promotion', 'Tech': 'Tech', 'Bollywood': 'Bollywood', 'Sports': 'Sports', 'Stocks': 'Stocks', 'Entertainment': 'Entertainment', 'Extra': 'Extra', 'Contact': 'Contact', 'Trending': 'Trending', 'Videos': 'Videos', 'Politics': 'Politics', 'Health': 'Health', 'Search news...': 'Search news...', 'Latest News': 'Latest News', 'Load More': 'Load More', 'LatestNews': 'Latest News', 'BreakingNews': 'Breaking News', 'TopStories': 'Top Stories', 'WorldNews': 'World News', 'MoreNews': 'More News...' },
        hi: { 'Home': 'होम', 'News': 'समाचार', 'Study': 'अध्ययन', 'Workshop': 'कार्यशाला', '10thBoardHindi': '10वीं बोर्ड हिंदी', '10thBoardEnglish': '10वीं बोर्ड अंग्रेजी', '12thBoardHindi': '12वीं बोर्ड हिंदी', '12thBoardEnglish': '12वीं बोर्ड अंग्रेजी', 'CompetitiveHindi': 'प्रतियोगी हिंदी', 'CompetitiveEnglish': 'प्रतियोगी अंग्रेजी', 'Cafe': 'कैफे', 'WebsiteBuilder': 'वेबसाइट बिल्डर', 'Editor': 'संपादक', 'Designer': 'डिज़ाइनर', 'ContentCreator': 'कंटेंट क्रिएटर', 'Affiliate': 'सहबद्ध', 'Dropshipping': 'ड्रॉपशिपिंग', 'Promotion': 'प्रचार', 'Tech': 'तकनीक', 'Bollywood': 'बॉलीवुड', 'Sports': 'खेल', 'Stocks': 'शेयर', 'Entertainment': 'मनोरंजन', 'Extra': 'अतिरिक्त', 'Contact': 'संपर्क', 'Trending': 'ट्रेंडिंग', 'Videos': 'वीडियो', 'Politics': 'राजनीति', 'Health': 'स्वास्थ्य', 'Search news...': 'समाचार खोजें...', 'Latest News': 'नवीनतम समाचार', 'Load More': 'और लोड करें', 'LatestNews': 'नवीनतम समाचार', 'BreakingNews': 'ताजा खबर', 'TopStories': 'शीर्ष कहानियाँ', 'WorldNews': 'विश्व समाचार', 'MoreNews': 'अधिक समाचार...' }
    };
    const currentLang = translations[lang] || translations.en;
    document.querySelectorAll('.nav-text').forEach(el => {
        const key = Object.keys(translations.en).find(k => translations.en[k] === el.textContent);
        if (key && currentLang[key]) el.textContent = currentLang[key];
    });
    document.querySelectorAll('.blue-section span, .latest-news-section span').forEach(el => {
        const key = Object.keys(translations.en).find(k => translations.en[k] === el.textContent);
        if (key && currentLang[key]) el.textContent = currentLang[key];
    });
    document.getElementById('searchBar').placeholder = currentLang['Search news...'];
    document.querySelector('.post-section h2').textContent = currentLang['Latest News'];
    document.querySelector('.load-more-btn').textContent = currentLang['Load More'];
    localStorage.setItem('language', lang);
}

function fetchPosts(category, limit = 5) {
    const mockPosts = [
        { title: 'Breaking News', description: 'Something big happened today!', category: category, date: '2025-09-27' },
        { title: 'Tech Update', description: 'Latest tech innovation revealed!', category: category, date: '2025-09-26' },
        { title: 'Sports Event', description: 'Exciting match highlights!', category: category, date: '2025-09-25' }
    ];
    return Promise.resolve(mockPosts.slice(0, limit));
}

function loadPreferences() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    const savedLang = localStorage.getItem('language') || 'en';
    document.querySelector('.translate-btn').value = savedLang;
    translateInterface(savedLang);
}

window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    alert('कुछ गलत हो गया। पेज रिफ्रेश करें।');
});

window.addEventListener('online', () => console.log('🌐 Online'));
window.addEventListener('offline', () => {
    console.log('📴 Offline');
    alert('इंटरनेट कनेक्शन खो गया।');
});
