console.log('🌅 Horizon Script Loading... at', new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));

let currentCategory = 'Home';
let isDarkMode = false;
let isSidebarOpen = false;
let isSidebarContentVisible = true;
let recentPosts = [];

document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DOM Loaded - Initializing...');
    initializeApp();
    setupEventListeners();
    loadLiveTicker();
    loadVideos();
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
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleSidebar);
    } else {
        console.error('Mobile menu button not found');
    }

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
        slide.addEventListener('click', (e) => {
            e.stopPropagation();
            showCategory(slide.dataset.category);
        });
    });

    document.querySelectorAll('.blue-section span, .latest-news-section span').forEach(tab => {
        tab.addEventListener('click', () => showCategory(tab.dataset.category));
    });

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) settingsBtn.addEventListener('click', openSettings);

    document.querySelectorAll('.close-btn').forEach(btn => btn.addEventListener('click', closeModals));

    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) loginBtn.addEventListener('click', handleLogin);

    const registerBtn = document.getElementById('registerBtn');
    if (registerBtn) registerBtn.addEventListener('click', handleRegister);

    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) themeSelect.addEventListener('change', (e) => setTheme(e.target.value));

    const translateBtn = document.querySelector('.translate-btn');
    if (translateBtn) translateBtn.addEventListener('change', (e) => translateInterface(e.target.value));

    const commentForm = document.getElementById('comment-form');
    if (commentForm) commentForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const comment = e.target.querySelector('textarea').value.trim();
        const username = localStorage.getItem('username') || 'Guest';
        if (comment) {
            const result = await submitComment(currentCategory, comment);
            if (result?.success) {
                const commentsList = document.getElementById('comments-list');
                const commentEl = document.createElement('div');
                commentEl.className = 'comment-item';
                commentEl.innerHTML = `<strong>${username}:</strong> <span>${comment}</span> <span class="comment-time">${new Date().toLocaleString()}</span>`;
                commentsList.insertBefore(commentEl, commentsList.firstChild);
                e.target.reset();
                console.log(`💬 Comment added by ${username}: ${comment}`);
            }
        }
    });

    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) newsletterForm.addEventListener('submit', async (e) => {
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
        if (backToTop) backToTop.style.display = window.scrollY > 300 ? 'block' : 'none';
    });

    const backToTop = document.getElementById('backToTop');
    if (backToTop) backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModals();
    });

    // Lazy load images
    document.querySelectorAll('.lazy').forEach(img => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
        observer.observe(img);
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
        mainContent.classList.toggle('shifted', isSidebarOpen && window.innerWidth >= 768);
        console.log(`📱 Sidebar ${isSidebarOpen ? 'opened' : 'closed'}`);
    } else {
        console.error('Sidebar or related elements not found');
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

function toggleStudy(e) {
    e.stopPropagation();
    console.log('📚 Study menu toggled');
    const studyGroup = document.getElementById('studyGroup');
    const expandIcon = e.currentTarget.querySelector('.expand-icon');
    if (studyGroup && expandIcon) {
        studyGroup.classList.toggle('open');
        expandIcon.classList.toggle('rotated');
        const workshopGroup = document.getElementById('workshopGroup');
        if (workshopGroup && workshopGroup.classList.contains('open')) {
            workshopGroup.classList.remove('open');
            document.querySelector('[data-toggle="workshop"] .expand-icon').classList.remove('rotated');
        }
    }
}

function toggleWorkshop(e) {
    e.stopPropagation();
    console.log('🔧 Workshop menu toggled');
    const workshopGroup = document.getElementById('workshopGroup');
    const expandIcon = e.currentTarget.querySelector('.expand-icon');
    if (workshopGroup && expandIcon) {
        workshopGroup.classList.toggle('open');
        expandIcon.classList.toggle('rotated');
        const studyGroup = document.getElementById('studyGroup');
        if (studyGroup && studyGroup.classList.contains('open')) {
            studyGroup.classList.remove('open');
            document.querySelector('[data-toggle="study"] .expand-icon').classList.remove('rotated');
        }
    }
}

async function showCategory(category) {
    console.log(`🌐 Loading category: ${category}`);
    if (window.innerWidth < 768) toggleSidebar();
    currentCategory = category;
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) pageTitle.textContent = `${category} - Latest Updates`;
    updateActiveNavigation(category);
    await loadCategoryContent(category);
    await loadRecentPosts();
    closeModals();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    console.log(`✅ ${category} loaded successfully`);
}

function updateActiveNavigation(category) {
    document.querySelectorAll('.slide, .sub-slide, .blue-section span, .latest-news-section span').forEach(el => {
        el.classList.remove('active');
    });
    document.querySelectorAll(`[data-category="${category}"]`).forEach(el => {
        el.classList.add('active');
    });
    console.log(`🎯 Active nav updated: ${category}`);
}

async function loadCategoryContent(category) {
    const container = document.getElementById('category-posts');
    if (container) {
        container.innerHTML = '<div class="loading">Loading...</div>';
        try {
            const posts = await fetchPosts(category);
            container.innerHTML = '';
            posts.forEach(post => {
                const card = createPostCard(post);
                if (card) container.appendChild(card);
            });
            recentPosts = posts;
            document.getElementById('load-more').classList.remove('hidden');
            console.log(`📄 Loaded ${posts.length} posts for ${category}`);
        } catch (err) {
            container.innerHTML = '<div class="error">Failed to load content. Please try again.</div>';
            console.error('Load content error:', err);
        }
    }
}

async function loadRecentPosts() {
    const container = document.getElementById('recent-posts');
    if (container) {
        container.innerHTML = '<div class="loading">Loading...</div>';
        try {
            const posts = await fetchPosts('general', 3);
            container.innerHTML = '';
            posts.forEach(post => {
                const card = createPostCard(post, true);
                if (card) container.appendChild(card);
            });
            console.log(`📄 Loaded ${posts.length} recent posts`);
        } catch (err) {
            container.innerHTML = '<div class="error">Failed to load recent posts.</div>';
            console.error('Load recent posts error:', err);
        }
    }
}

async function loadLiveTicker() {
    const ticker = document.getElementById('liveTicker');
    if (ticker) {
        try {
            const posts = await fetchPosts('general', 5);
            ticker.innerHTML = posts.map(post => post.title).join(' | ');
        } catch (err) {
            ticker.innerHTML = 'Unable to load live updates.';
            console.error('Live ticker error:', err);
        }
    }
}

async function loadVideos() {
    const videoGrid = document.getElementById('video-grid');
    if (videoGrid) {
        videoGrid.innerHTML = '<div class="loading">Loading videos...</div>';
        try {
            const response = await fetch('https://www.googleapis.com/youtube/v3/search?key=YOUR_YOUTUBE_API_KEY&channelId=YOUR_CHANNEL_ID&part=snippet&maxResults=4');
            if (!response.ok) throw new Error('Network error');
            const data = await response.json();
            videoGrid.innerHTML = '';
            data.items.forEach(video => {
                const videoCard = document.createElement('div');
                videoCard.className = 'video-card';
                videoCard.innerHTML = `<iframe src="https://www.youtube.com/embed/${video.id.videoId}" frameborder="0" allowfullscreen></iframe>`;
                videoGrid.appendChild(videoCard);
            });
            console.log(`📹 Loaded ${data.items.length} videos`);
        } catch (err) {
            videoGrid.innerHTML = '<div class="error">Failed to load videos.</div>';
            console.error('Load videos error:', err);
        }
    }
}

function createPostCard(post, isRecent = false) {
    const card = document.createElement('div');
    card.className = `post-card ${isRecent ? 'recent-post' : ''}`;
    card.innerHTML = `
        <h3>${post.title}</h3>
        ${post.image ? `<img src="/images/placeholder.jpg" data-src="${post.image}" alt="${post.title}" class="post-image lazy">` : ''}
        <p>${post.description}</p>
        <div class="post-meta">
            <span class="category-tag">${post.category}</span>
            <span class="date">${post.date}</span>
        </div>
        <div class="post-actions">
            <button class="like-btn">❤️ ${Math.floor(Math.random() * 100)}</button>
            <button class="comment-btn">💬 Comment</button>
            <button class="share-btn">🔗 Share</button>
        </div>
    `;
    const likeBtn = card.querySelector('.like-btn');
    const commentBtn = card.querySelector('.comment-btn');
    const shareBtn = card.querySelector('.share-btn');
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
    if (shareBtn) {
        shareBtn.addEventListener('click', () => sharePost(post));
    }
    return card;
}

function sharePost(post) {
    if (navigator.share) {
        navigator.share({
            title: post.title,
            text: post.description,
            url: window.location.href
        }).then(() => console.log('Post shared successfully'))
          .catch(err => console.error('Share error:', err));
    } else {
        alert(`Share this post: ${post.title}\n${window.location.href}`);
    }
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    setTheme(isDarkMode ? 'dark' : 'light');
}

function setTheme(theme) {
    isDarkMode = theme === 'dark';
    document.body.classList.toggle('dark-theme', isDarkMode);
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) themeToggle.textContent = isDarkMode ? '☀️ Light' : '🌙 Dark';
    const themeSelect = document.getElementById('themeSelect');
    if (themeSelect) themeSelect.value = theme;
    localStorage.setItem('theme', theme);
    console.log(`🎨 Theme changed to: ${theme}`);
}

function openSettings() {
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) {
        settingsModal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function openComments(title) {
    const commentsModal = document.getElementById('commentsModal');
    const commentTitle = document.getElementById('comment-title');
    if (commentsModal && commentTitle) {
        commentTitle.textContent = `${title} - Comments`;
        commentsModal.classList.add('show');
        loadComments(title);
    }
}

async function loadComments(postId) {
    const commentsList = document.getElementById('comments-list');
    if (commentsList) {
        commentsList.innerHTML = '<div class="loading">Loading comments...</div>';
        try {
            const response = await fetch(`/api/comments/${postId}`);
            if (!response.ok) throw new Error('Network error');
            const comments = await response.json();
            commentsList.innerHTML = '';
            comments.forEach(comment => {
                const commentEl = document.createElement('div');
                commentEl.className = 'comment-item';
                commentEl.innerHTML = `<strong>${comment.username}:</strong> <span>${comment.comment}</span> <span class="comment-time">${new Date(comment.date).toLocaleString()}</span>`;
                commentsList.appendChild(commentEl);
            });
        } catch (err) {
            commentsList.innerHTML = '<div class="error">Failed to load comments.</div>';
            console.error('Load comments error:', err);
        }
    }
}

function closeModals() {
    document.querySelectorAll('.comments-modal, .settings-modal').forEach(modal => modal.classList.remove('show'));
    document.body.style.overflow = 'auto';
}

async function handleLogin() {
    const usernameInput = document.getElementById('loginUsername');
    const passwordInput = document.getElementById('loginPassword');
    const loginBtn = document.getElementById('loginBtn');
    if (usernameInput && passwordInput && loginBtn) {
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        if (username && password) {
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                if (!response.ok) throw new Error('Login failed');
                const data = await response.json();
                localStorage.setItem('username', data.username);
                localStorage.setItem('token', data.token);
                console.log(`👤 Login successful: ${username}`);
                alert(`Welcome back, ${username}!`);
                loginBtn.textContent = `Hi ${username}`;
                closeModals();
            } catch (error) {
                alert('Invalid credentials');
                console.error('Login error:', error);
            }
        } else {
            alert('Please enter username and password');
        }
    }
}

async function handleRegister() {
    const usernameInput = document.getElementById('loginUsername');
    const passwordInput = document.getElementById('loginPassword');
    if (usernameInput && passwordInput) {
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        if (username && password) {
            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                if (!response.ok) throw new Error('Registration failed');
                alert('Registration successful! Please login.');
                console.log(`👤 Registered: ${username}`);
            } catch (error) {
                alert('Registration failed');
                console.error('Register error:', error);
            }
        } else {
            alert('Please enter username and password');
        }
    }
}

function loadMorePosts() {
    const btn = document.querySelector('.load-more-btn');
    if (btn) {
        const originalText = btn.textContent;
        btn.textContent = 'Loading...';
        btn.disabled = true;
        setTimeout(async () => {
            const container = document.getElementById('category-posts');
            if (container) {
                const newPosts = await fetchPosts(currentCategory, 3);
                newPosts.forEach(post => {
                    const card = createPostCard(post);
                    if (card) container.appendChild(card);
                });
                recentPosts = [...recentPosts, ...newPosts];
                btn.textContent = originalText;
                btn.disabled = false;
                console.log(`➕ Added ${newPosts.length} more posts`);
            }
        }, 1500);
    }
}

function searchPosts() {
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
    const translations = {
        en: {
            'Home': 'Home',
            'News': 'News',
            'Study': 'Study',
            'Workshop': 'Workshop',
            '10thBoardHindi': '10th Board Hindi',
            '10thBoardEnglish': '10th Board English',
            '12thBoardHindi': '12th Board Hindi',
            '12thBoardEnglish': '12th Board English',
            'CompetitiveHindi': 'Competitive Hindi',
            'CompetitiveEnglish': 'Competitive English',
            'Cafe': 'Cafe',
            'WebsiteBuilder': 'Website Builder',
            'Editor': 'Editor',
            'Designer': 'Designer',
            'ContentCreator': 'Content Creator',
            'Affiliate': 'Affiliate',
            'Dropshipping': 'Dropshipping',
            'Promotion': 'Promotion',
            'Tech': 'Tech',
            'Bollywood': 'Bollywood',
            'Sports': 'Sports',
            'Stocks': 'Stocks',
            'Entertainment': 'Entertainment',
            'Extra': 'Extra',
            'Contact': 'Contact',
            'Trending': 'Trending',
            'Videos': 'Videos',
            'Politics': 'Politics',
            'Health': 'Health',
            'Search news...': 'Search news...',
            'Latest News': 'Latest News',
            'Load More': 'Load More',
            'LatestNews': 'Latest News',
            'BreakingNews': 'Breaking News',
            'TopStories': 'Top Stories',
            'WorldNews': 'World News',
            'MoreNews': 'More News...'
        },
        hi: {
            'Home': 'होम',
            'News': 'समाचार',
            'Study': 'अध्ययन',
            'Workshop': 'कार्यशाला',
            '10thBoardHindi': '10वीं बोर्ड हिंदी',
            '10thBoardEnglish': '10वीं बोर्ड अंग्रेजी',
            '12thBoardHindi': '12वीं बोर्ड हिंदी',
            '12thBoardEnglish': '12वीं बोर्ड अंग्रेजी',
            'CompetitiveHindi': 'प्रतियोगी हिंदी',
            'CompetitiveEnglish': 'प्रतियोगी अंग्रेजी',
            'Cafe': 'कैफे',
            'WebsiteBuilder': 'वेबसाइट बिल्डर',
            'Editor': 'संपादक',
            'Designer': 'डिज़ाइनर',
            'ContentCreator': 'कंटेंट क्रिएटर',
            'Affiliate': 'सहबद्ध',
            'Dropshipping': 'ड्रॉपशिपिंग',
            'Promotion': 'प्रचार',
            'Tech': 'तकनीक',
            'Bollywood': 'बॉलीवुड',
            'Sports': 'खेल',
            'Stocks': 'शेयर',
            'Entertainment': 'मनोरंजन',
            'Extra': 'अतिरिक्त',
            'Contact': 'संपर्क',
            'Trending': 'ट्रेंडिंग',
            'Videos': 'वीडियो',
            'Politics': 'राजनीति',
            'Health': 'स्वास्थ्य',
            'Search news...': 'समाचार खोजें...',
            'Latest News': 'नवीनतम समाचार',
            'Load More': 'और लोड करें',
            'LatestNews': 'नवीनतम समाचार',
            'BreakingNews': 'ताजा खबर',
            'TopStories': 'शीर्ष कहानियाँ',
            'WorldNews': 'विश्व समाचार',
            'MoreNews': 'अधिक समाचार...'
        }
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
    const searchBar = document.getElementById('searchBar');
    if (searchBar) searchBar.placeholder = currentLang['Search news...'];
    const pageTitle = document.getElementById('page-title');
    if (pageTitle) pageTitle.textContent = currentLang[currentCategory] || currentCategory;
    const loadMoreBtn = document.querySelector('.load-more-btn');
    if (loadMoreBtn) loadMoreBtn.textContent = currentLang['Load More'];
    localStorage.setItem('language', lang);
}

async function fetchPosts(category, limit = 5) {
    try {
        const response = await fetch(`https://newsapi.org/v2/top-headlines?category=${category.toLowerCase()}&apiKey=YOUR_NEWSAPI_KEY&pageSize=${limit}`);
        if (!response.ok) throw new Error('Network error');
        const data = await response.json();
        return data.articles.map(article => ({
            title: article.title || 'Untitled',
            description: article.description || 'No description available.',
            image: article.urlToImage || '/images/fallback.jpg',
            category: category,
            date: new Date(article.publishedAt).toLocaleDateString()
        }));
    } catch (error) {
        console.error('Fetch Posts Error:', error);
        return [
            { title: 'Breaking News', description: 'Something big happened!', category: category, date: '2025-10-04', image: '/images/fallback.jpg' },
            { title: 'Tech Update', description: 'New tech released!', category: category, date: '2025-10-03', image: '/images/fallback.jpg' }
        ].slice(0, limit);
    }
}

async function submitComment(postId, comment) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/comments', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ postId, comment, username: localStorage.getItem('username') || 'Guest' })
        });
        if (!response.ok) throw new Error('Comment submission failed');
        return { success: true, ...(await response.json()) };
    } catch (error) {
        console.error('Submit Comment Error:', error);
        return null;
    }
}

function loadPreferences() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    const savedLang = localStorage.getItem('language') || 'en';
    const translateBtn = document.querySelector('.translate-btn');
    if (translateBtn) translateBtn.value = savedLang;
    translateInterface(savedLang);
    const username = localStorage.getItem('username');
    if (username) {
        const loginBtn = document.getElementById('loginBtn');
        if (loginBtn) loginBtn.textContent = `Hi ${username}`;
    }
}

window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    alert('Something went wrong. Please refresh the page.');
    e.preventDefault();
});

window.addEventListener('online', () => console.log('🌐 Online'));
window.addEventListener('offline', () => {
    console.log('📴 Offline');
    alert('Internet connection lost.');
});
