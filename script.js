console.log('🌅 Horizon Script Loading... at 11:01 PM IST, September 27, 2025');

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
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', toggleSidebar);

    const sidebarToggleBtn = document.getElementById('sidebarToggleBtn');
    if (sidebarToggleBtn) sidebarToggleBtn.addEventListener('click', toggleSidebarContent);

    document.querySelectorAll('.slide').forEach(slide => {
        if (slide.dataset.toggle) {
            slide.addEventListener('click', (e) => {
                e.stopPropagation();
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

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) settingsBtn.addEventListener('click', openSettings);

    document.querySelectorAll('.close-btn').forEach(btn => btn.addEventListener('click', closeModals));

    const loginBtn = document.querySelector('.settings-section button');
    if (loginBtn) loginBtn.addEventListener('click', handleLogin);

    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) themeSelect.addEventListener('change', (e) => setTheme(e.target.value));

    const translateBtn = document.querySelector('.translate-btn');
    if (translateBtn) translateBtn.addEventListener('change', (e) => translateInterface(e.target.value));

    const commentForm = document.getElementById('comment-form');
    if (commentForm) commentForm.addEventListener('submit', (e) => {
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

    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = e.target.querySelector('input').value.trim();
        if (email) {
            console.log(`📧 Subscribed: ${email}`);
            alert('Thank you for subscribing to Horizon News!');
            e.target.reset();
        }
    });

    const searchBar = document.getElementById('searchBar');
    if (searchBar) searchBar.addEventListener('input', searchPosts);

    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) loadMoreBtn.addEventListener('click', loadMorePosts);

    window.addEventListener('scroll', () => {
        const backToTop = document.getElementById('backToTop');
        if (backToTop) backToTop.style.display = (window.scrollY > 300) ? 'block' : 'none';
        if (loadMoreBtn && window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
            loadMorePosts();
        }
    });

    const backToTop = document.getElementById('backToTop');
    if (backToTop) backToTop.addEventListener('click', () => {
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

    if (sidebar && mobileBtn && mainContent) {
        isSidebarOpen = !isSidebarOpen;
        sidebar.classList.toggle('open', isSidebarOpen);
        mobileBtn.classList.toggle('active', isSidebarOpen);
        mainContent.classList.toggle('shifted', isSidebarOpen);
        console.log(`📱 Sidebar ${isSidebarOpen ? 'opened' : 'closed'}`);
    }
}

function toggleSidebarContent() {
    console.log('☰ Sidebar content toggle clicked');
    const sidebarNav = document.getElementById('sidebarNav');
    if (sidebarNav) {
        isSidebarContentVisible = !isSidebarContentVisible;
        sidebarNav.classList.toggle('collapsed', !isSidebarContentVisible);
        console.log(`📋 Sidebar content ${isSidebarContentVisible ? 'visible' : 'hidden'}`);
    }
}

function showCategory(category) {
    console.log(`🌐 Loading category: ${category}`);
    if (window.innerWidth < 768) toggleSidebar();
    currentCategory = category;
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) pageTitle.textContent = `${category} - Latest Updates`;
    updateActiveNavigation(category);
    loadCategoryContent(category).catch(err => console.error('Error loading category:', err));
    closeModals();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log(`✅ ${category} loaded successfully`);
}

function updateActiveNavigation(category) {
    const allSlides = document.querySelectorAll('.slide, .sub-slide, .blue-section span, .latest-news-section span');
    if (allSlides) {
        allSlides.forEach(el => el.classList.remove('active'));
        const activeSlide = document.querySelector(`[data-category="${category}"]`);
        if (activeSlide) activeSlide.classList.add('active');
        console.log(`🎯 Active nav updated: ${category}`);
    }
}

async function loadCategoryContent(category) {
    const container = document.getElementById('recent-posts');
    if (container) {
        container.innerHTML = '<div class="loading">Loading...</div>';
        try {
            const posts = await fetchPosts(category);
            container.innerHTML = '';
            posts.forEach(post => {
                const card = createPostCard(post);
                if (card) container.appendChild(card);
            });
            const loadMore = document.getElementById('load-more');
            if (loadMore) loadMore.classList.remove('hidden');
            console.log(`📄 Loaded ${posts.length} posts for ${category}`);
        } catch (err) {
            container.innerHTML = '<div class="error">Failed to load content. Please try again.</div>';
            console.error('Load content error:', err);
        }
    }
}

function createPostCard(post) {
    const card = document.createElement('div');
    if (card) {
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
        const likeBtn = card.querySelector('.like-btn');
        const commentBtn = card.querySelector('.comment-btn');
        if (likeBtn) {
            likeBtn.addEventListener('click', (e) => {
                const likes = parseInt(e.target.textContent.match(/\d+/)[0]) + 1;
                e.target.textContent = `❤️ ${likes}`;
                e.target.style.background = '#ff5252';
                setTimeout(() => { e.target.style.background = ''; }, 200);
            });
        }
        if (commentBtn) {
            commentBtn.addEventListener('click', () => openComments(post.title));
        }
        return card;
    }
    return null;
}

function toggleStudy(e) {
    e.stopPropagation();
    console.log('📚 Study menu toggled');
    const studyGroup = document.getElementById('studyGroup');
    const expandIcon = e.currentTarget.querySelector('.expand-icon');
    if (studyGroup && expandIcon) {
        studyGroup.classList.toggle('hidden');
        expandIcon.classList.toggle('rotated');
    }
    const workshopGroup = document.getElementById('workshopGroup');
    if (workshopGroup && !workshopGroup.classList.contains('hidden')) {
        const workshopIcon = document.querySelector('[data-toggle="workshop"] .expand-icon');
        if (workshopIcon) {
            workshopIcon.classList.remove('rotated');
            workshopGroup.classList.add('hidden');
        }
    }
}

function toggleWorkshop(e) {
    e.stopPropagation();
    console.log('🔧 Workshop menu toggled');
    const workshopGroup = document.getElementById('workshopGroup');
    const expandIcon = e.currentTarget.querySelector('.expand-icon');
    if (workshopGroup && expandIcon) {
        workshopGroup.classList.toggle('hidden');
        expandIcon.classList.toggle('rotated');
    }
    const studyGroup = document.getElementById('studyGroup');
    if (studyGroup && !studyGroup.classList.contains('hidden')) {
        const studyIcon = document.querySelector('[data-toggle="study"] .expand-icon');
        if (studyIcon) {
            studyIcon.classList.remove('rotated');
            studyGroup.classList.add('hidden');
        }
    }
}

function toggleTheme() {
    console.log('🌙 Theme toggle clicked');
    isDarkMode = !isDarkMode;
    setTheme(isDarkMode ? 'dark' : 'light');
}

function setTheme(theme) {
    isDarkMode = theme === 'dark';
    const body = document.body;
    if (body) body.classList.toggle('dark-theme', isDarkMode);
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.textContent = isDarkMode ? '☀️ Light' : '🌙 Dark';
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) themeSelect.value = theme;
    localStorage.setItem('theme', theme);
    console.log(`🎨 Theme changed to: ${theme}`);
}

function openSettings() {
    console.log('⚙️ Settings opened');
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) {
        settingsModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function openComments(title) {
    console.log(`💬 Opening comments for: ${title}`);
    const commentsModal = document.getElementById('commentsModal');
    const commentTitle = document.getElementById('comment-title');
    if (commentsModal && commentTitle) {
        commentTitle.textContent = `${title} - Comments`;
        commentsModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeModals() {
    console.log('🔚 Closing modals');
    const modals = document.querySelectorAll('.comments-modal, .settings-modal');
    if (modals) {
        modals.forEach(modal => modal.classList.remove('show'));
        document.body.style.overflow = 'auto';
    }
}

function handleLogin() {
    const usernameInput = document.getElementById('loginUsername');
    const passwordInput = document.getElementById('loginPassword');
    const loginBtn = document.getElementById('loginBtn');
    if (usernameInput && passwordInput && loginBtn) {
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        if (username && password) {
            localStorage.setItem('username', username);
            console.log(`👤 Login successful: ${username}`);
            alert(`Welcome back, ${username}!`);
            loginBtn.textContent = `Hi ${username}`;
            closeModals();
        } else {
            console.log('❌ Login failed');
            alert('Please enter username and password');
        }
    }
}

function loadMorePosts() {
    console.log('📄 Loading more posts...');
    const btn = document.querySelector('.load-more-btn');
    if (btn) {
        const originalText = btn.textContent;
        btn.textContent = 'Loading...';
        btn.disabled = true;
        setTimeout(async () => {
            const container = document.getElementById('recent-posts');
            if (container) {
                const newPosts = await fetchPosts(currentCategory, 3);
                newPosts.forEach(post => {
                    const card = createPostCard(post);
                    if (card) container.appendChild(card);
                });
                btn.textContent = originalText;
                btn.disabled = false;
                console.log(`➕ Added ${newPosts.length} more posts`);
            }
        }, 1500);
    }
}

function searchPosts() {
    console.log('🔍 Searching...');
    const searchBar = document.getElementById('searchBar');
    const posts = document.querySelectorAll('.post-card');
    if (searchBar && posts) {
        const query = searchBar.value.toLowerCase().trim();
        posts.forEach(post => {
            const text = post.textContent.toLowerCase();
            post.style.display = text.includes(query) ? 'block' : 'none';
        });
    }
}

function translateInterface(lang) {
    console.log(`🌐 Language changed to: ${lang}`);
    const translations = {
        en: { 'Home': 'Home', 'News': 'News', 'Study': 'Study', 'Workshop': 'Workshop', '10thBoardHindi': '10th Board Hindi', '10thBoardEnglish': '10th Board English', '12thBoardHindi': '12th Board Hindi', '12thBoardEnglish': '12th Board English', 'CompetitiveHindi': 'Competitive Hindi', 'CompetitiveEnglish': 'Competitive English', 'Cafe': 'Cafe', 'WebsiteBuilder': 'Website Builder', 'Editor': 'Editor', 'Designer': 'Designer', 'ContentCreator': 'Content Creator', 'Affiliate': 'Affiliate', 'Dropshipping': 'Dropshipping', 'Promotion': 'Promotion', 'Tech': 'Tech', 'Bollywood': 'Bollywood', 'Sports': 'Sports', 'Stocks': 'Stocks', 'Entertainment': 'Entertainment', 'Extra': 'Extra', 'Contact': 'Contact', 'Trending': 'Trending', 'Videos': 'Videos', 'Politics': 'Politics', 'Health': 'Health', 'Search news...': 'Search news...', 'Latest News': 'Latest News', 'Load More': 'Load More', 'LatestNews': 'Latest News', 'BreakingNews': 'Breaking News', 'TopStories': 'Top Stories', 'WorldNews': 'World News', 'MoreNews': 'More News...' },
        hi: { 'Home': 'होम', 'News': 'समाचार', 'Study': 'अध्ययन', 'Workshop': 'कार्यशाला', '10thBoardHindi': '10वीं बोर्ड हिंदी', '10thBoardEnglish': '10वीं बोर्ड अंग्रेजी', '12thBoardHindi': '12वीं बोर्ड हिंदी', '12thBoardEnglish': '12वीं बोर्ड अंग्रेजी', 'CompetitiveHindi': 'प्रतियोगी हिंदी', 'CompetitiveEnglish': 'प्रतियोगी अंग्रेजी', 'Cafe': 'कैफे', 'WebsiteBuilder': 'वेबसाइट बिल्डर', 'Editor': 'संपादक', 'Designer': 'डिज़ाइनर', 'ContentCreator': 'कंटेंट क्रिएटर', 'Affiliate': 'सहबद्ध', 'Dropshipping': 'ड्रॉपशिपिंग', 'Promotion': 'प्रचार', 'Tech': 'तकनीक', 'Bollywood': 'बॉलीवुड', 'Sports': 'खेल', 'Stocks': 'शेयर', 'Entertainment': 'मनोरंजन', 'Extra': 'अतिरिक्त', 'Contact': 'संपर्क', 'Trending': 'ट्रेंडिंग', 'Videos': 'वीडियो', 'Politics': 'राजनीति', 'Health': 'स्वास्थ्य', 'Search news...': 'समाचार खोजें...', 'Latest News': 'नवीनतम समाचार', 'Load More': 'और लोड करें', 'LatestNews': 'नवीनतम समाचार', 'BreakingNews': 'ताजा खबर', 'TopStories': 'शीर्ष कहानियाँ', 'WorldNews': 'विश्व समाचार', 'MoreNews': 'अधिक समाचार...' }
    };
    const currentLang = translations[lang] || translations.en;
    const navTexts = document.querySelectorAll('.nav-text');
    if (navTexts) {
        navTexts.forEach(el => {
            const key = Object.keys(translations.en).find(k => translations.en[k] === el.textContent);
            if (key && currentLang[key]) el.textContent = currentLang[key];
        });
    }
    const tabs = document.querySelectorAll('.blue-section span, .latest-news-section span');
    if (tabs) {
        tabs.forEach(el => {
            const key = Object.keys(translations.en).find(k => translations.en[k] === el.textContent);
            if (key && currentLang[key]) el.textContent = currentLang[key];
        });
    }
    const searchBar = document.getElementById('searchBar');
    if (searchBar) searchBar.placeholder = currentLang['Search news...'];
    const pageTitle = document.querySelector('.post-section h2');
    if (pageTitle) pageTitle.textContent = currentLang['Latest News'];
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) loadMoreBtn.textContent = currentLang['Load More'];
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
    const translateBtn = document.querySelector('.translate-btn');
    if (translateBtn) translateBtn.value = savedLang;
    translateInterface(savedLang);
}

window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    alert('कुछ गलत हो गया। पेज रिफ्रेश करें।');
    e.preventDefault(); // Prevent default alert spam
});

window.addEventListener('online', () => console.log('🌐 Online'));
window.addEventListener('offline', () => {
    console.log('📴 Offline');
    alert('इंटरनेट कनेक्शन खो गया।');
});
async function fetchPosts(category, limit = 5) {
    try {
        const SHEET_ID = 'YOUR_SHEET_ID';1LbgUornSZqxoLvRrTr2GWtpxueBB2dP_zVeQLs0AfPI
    try {
        const SHEET_ID = 'YOUR_SHEET_ID';1LbgUornSZqxoLvRrTr2GWtpxueBB2dP_zVeQLs0AfPI
        const SHEET_NAME = 'Sheet1'; Horizon Posts
        const csvUrl =https://docs.google.com/spreadsheets/d/1LbgUornSZqxoLvRrTr2GWtpxueBB2dP_zVeQLs0AfPI/edit?gid=0#gid=0`;
        const response = await fetch(csvUrl);https://docs.google.com/spreadsheets/d/1LbgUornSZqxoLvRrTr2GWtpxueBB2dP_zVeQLs0AfPI/edit?gid=0#gid=0
        if (!response.ok) throw new Error('Sheet data not loaded');
        const csvText = await response.text();
        const rows = csvText.split('\n').map(row => row.split(','));
        const headers = rows[0]; // पहली पंक्ति हेडर
        const posts = rows.slice(1).map(row => {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index];
            });
            return obj;
        }).filter(post => post.Category === category || category === 'Home').slice(0, limit);
        return posts.map(post => ({
            title: post.Title || 'ind vs pak Asiacup 2025',
            description: post.Description || 'lettest update',
            image: post['Image URL'] || 'https://ibb.co/1GCFd32w',
            category: post.Category || 'News',
            date: post.Date || new Date().toLocaleDateString()
        }));
    } catch (error) {
        console.error('Fetch posts error:', error);
        // Mock data fallback
        return [
            { title: 'Breaking News', description: 'Something big happened!', category: category, date: '2025-09-27', image: 'https://ibb.co/1GCFd32w' },
            { title: 'Tech Update', description: 'New tech released!', category: category, date: '2025-09-26', image: 'https://ibb.co/1GCFd32w' }
        ].slice(0, limit);
    }
} Sheets URL से ID डालें (https:1LbgUornSZqxoLvRrTr2GWtpxueBB2dP_zVeQLs0AfPI
        const SHEET_NAME = 'Horizon Posts'; // आपका शीट का नाम (डिफॉल्ट Sheet1)
        const csvUrl = `https://docs.google.com/spreadsheets/d/1LbgUornSZqxoLvRrTr2GWtpxueBB2dP_zVeQLs0AfPI/edit?gid=0#gid=0;
        const response = await fetch(csvUrl);
        if (!response.ok) throw new Error('Sheet data not loaded');
        const csvText = await response.text();
        const rows = csvText.split('\n').map(row => row.split(','));
        const headers = rows[0]; // पहली पंक्ति हेडर
        const posts = rows.slice(1).map(row => {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index];
            });
            return obj;
        }).filter(post => post.Category === category || category === 'Home').slice(0, limit);
        return posts.map(post => ({
            title: post.Title || 'ind vs pak Asiacup 2025',
            description: post.Description || 'lettest update',
            image: post['Image URL'] || 'https://ibb.co/1GCFd32w',
            category: post.Category || 'News',
            date: post.Date || new Date().toLocaleDateString()
        }));
    } catch (error) {
        console.error('Fetch posts error:', error);
        // Mock data fallback
        return [
            { title: 'Breaking News', description: 'Something big happened!', category: category, date: '2025-09-27', image: 'https://ibb.co/1GCFd32w' },
            { title: 'Tech Update', description: 'New tech released!', category: category, date: '2025-09-26', image: 'https://ibb.co/1GCFd32w' }
        ].slice(0, limit);
    }
}
function createPostCard(post) {
    const card = document.createElement('div');
    card.className = 'post-card';
    card.innerHTML = `
        <h3>${post.title}</h3>
        ${post.image ? `<img src="${post.image}" alt="${post.title}" class="post-image">` : ''}
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
    // Like और Comment बटन लॉजिक (पिछला कोड वैसा ही रखें)
    return card;
}
